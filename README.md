# Resume Generator

A cloud-based resume generator where CS students fill out a form and download a clean, ATS-friendly PDF resume — instantly, no signup required.

Built with **Next.js 14 App Router**, **Tailwind CSS**, and **@react-pdf/renderer** for proper server-side PDF generation.

---

## Local Setup

```bash
git clone <your-repo-url>
cd resume-generator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/resume-generator)

> **Note:** Replace `YOUR_USERNAME` with your GitHub username after pushing the repo.

No environment variables required. Zero-config deployment.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   User fills form  →  clicks "Generate & Download"  │
│                                                     │
└───────────────────────────┬─────────────────────────┘
                            │  fetch POST /api/generate
                            ▼
┌─────────────────────────────────────────────────────┐
│           Frontend  (Vercel CDN)                    │
│           Next.js 14 App Router                     │
│           React Client Component (ResumeForm.tsx)   │
│                                                     │
│  • Collects form state                              │
│  • Sends JSON payload to API                        │
│  • Receives PDF blob → auto-triggers download       │
└───────────────────────────┬─────────────────────────┘
                            │  JSON body → ResumeData
                            ▼
┌─────────────────────────────────────────────────────┐
│           Serverless API Route                      │
│           /app/api/generate/route.ts                │
│           (Node.js runtime on Vercel)               │
│                                                     │
│  • Validates request                                │
│  • Calls renderToBuffer() with React element        │
│  • Returns PDF buffer with proper headers           │
└───────────────────────────┬─────────────────────────┘
                            │  React element tree
                            ▼
┌─────────────────────────────────────────────────────┐
│           PDF Engine                                │
│           @react-pdf/renderer v3                    │
│           ResumePDF.tsx                             │
│                                                     │
│  • Renders Document/Page/View/Text primitives       │
│  • Applies StyleSheet (A4, 30pt margins)            │
│  • Outputs binary PDF buffer                        │
└─────────────────────────────────────────────────────┘
                            │
                            ▼
                    📄 resume.pdf  →  User's browser
```

---

## Team Role Breakdown

| Role | Responsibility | Key Files |
|------|---------------|-----------|
| **Frontend** | Form UI, state management, UX, download trigger | `components/ResumeForm.tsx`, `app/page.tsx`, `app/globals.css` |
| **Serverless Logic** | API route, request validation, error handling | `app/api/generate/route.ts` |
| **PDF Engine** | PDF layout & styling using react-pdf primitives | `components/ResumePDF.tsx`, `types/resume.ts` |
| **Cloud Deployment** | Vercel config, Next.js settings, build pipeline | `next.config.js`, `vercel.json` (auto-generated) |

Each role maps to a distinct layer in the architecture above — ideal for a 4-person team presentation.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| PDF Generation | @react-pdf/renderer v3 |
| Deployment | Vercel (free tier) |

---

## Project Structure

```
resume-generator/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout + metadata
│   ├── globals.css           # Tailwind base + component classes
│   └── api/
│       └── generate/
│           └── route.ts      # POST handler → returns PDF
├── components/
│   ├── ResumeForm.tsx        # Client component — full form UI
│   └── ResumePDF.tsx         # PDF template (react-pdf only)
├── types/
│   └── resume.ts             # ResumeData TypeScript interfaces
├── next.config.js            # serverComponentsExternalPackages
├── tailwind.config.ts
└── tsconfig.json
```
