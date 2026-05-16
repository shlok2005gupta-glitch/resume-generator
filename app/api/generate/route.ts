import { NextResponse } from 'next/server'
import { Worker } from 'worker_threads'
import fs from 'fs'
import path from 'path'
import type { ResumeData } from '@/types/resume'

export const dynamic = 'force-dynamic'

// PDF generation runs inside a worker_threads Worker (eval mode).
// The worker's require() uses Node.js native module resolution, so it gets
// React 18.3.1 from node_modules — not Next.js's bundled React 19 canary.
// This avoids the $$typeof mismatch (react.transitional.element vs
// react.element) that caused error #31 inside @react-pdf/reconciler.
// Using eval mode means Turbopack never tries to bundle the worker file.
function renderPDF(data: ResumeData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const workerCode = fs.readFileSync(
      path.join(process.cwd(), 'scripts', 'pdf-worker.cjs'),
      'utf8'
    )
    const worker = new Worker(workerCode, { eval: true, workerData: data })
    let settled = false

    worker.once('message', (msg: any) => {
      settled = true
      if (msg.ok) resolve(Buffer.from(msg.buffer, 'base64'))
      else reject(new Error(msg.error))
    })
    worker.on('error', (err) => { if (!settled) { settled = true; reject(err) } })
    worker.on('exit', (code) => {
      if (!settled && code !== 0) { settled = true; reject(new Error(`PDF worker exited with code ${code}`)) }
    })
  })
}

// ── Rate limiter (lazy-initialised so local dev without credentials is fine) ──

let limiter: import('@upstash/ratelimit').Ratelimit | null = null

function getRateLimiter() {
  if (limiter) return limiter
  // Vercel × Upstash integration injects KV_REST_API_URL / KV_REST_API_TOKEN
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null

  const { Redis } = require('@upstash/redis')
  const { Ratelimit } = require('@upstash/ratelimit')

  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(20, '1 h'),
    analytics: true,
    prefix: 'resume-gen',
  })
  return limiter
}

// ─────────────────────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const data: ResumeData = await request.json()

    if (!data.personalInfo?.fullName) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 })
    }

    // ── Rate limiting ────────────────────────────────────────────────────────
    const rl = getRateLimiter()
    if (rl) {
      const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        'anonymous'

      const { success, limit, remaining, reset } = await rl.limit(ip)

      if (!success) {
        const retryAfterSec = Math.ceil((reset - Date.now()) / 1000)
        return NextResponse.json(
          {
            error: `Rate limit reached — max ${limit} resumes/hour. Try again in ${Math.ceil(retryAfterSec / 60)} min.`,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': String(limit),
              'X-RateLimit-Remaining': String(remaining),
              'Retry-After': String(retryAfterSec),
            },
          }
        )
      }
    }

    // ── PDF generation ───────────────────────────────────────────────────────
    const buffer = await renderPDF(data)

    const safeName = data.personalInfo.fullName.replace(/[^a-zA-Z0-9]/g, '_')
    const filename = `${safeName}_resume.pdf`

    // ── Blob storage ─────────────────────────────────────────────────────────
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob')
      const blob = await put(`resumes/${Date.now()}_${filename}`, buffer, {
        access: 'public',
        contentType: 'application/pdf',
        addRandomSuffix: false,
      })

      return NextResponse.json({ url: blob.url, filename })
    }

    // ── Local fallback: stream PDF directly ──────────────────────────────────
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    })
  } catch (error) {
    console.error('[PDF Generation Error]', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Failed to generate PDF: ${message}` }, { status: 500 })
  }
}
