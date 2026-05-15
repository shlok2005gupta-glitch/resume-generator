import ResumeForm from '@/components/ResumeForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-950 border border-blue-800 text-blue-300 text-xs font-medium px-3 py-1 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Free · No signup · Instant PDF
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
            Resume Generator
          </h1>
          <p className="text-slate-400 text-base max-w-md mx-auto">
            Fill out the form below and download a clean, ATS-friendly PDF resume in seconds.
          </p>
        </div>

        {/* Architecture note — subtle */}
        <div className="mb-8 flex items-center justify-center gap-2 text-xs text-slate-600 font-mono">
          <span>Browser</span>
          <span>→</span>
          <span>Next.js API Route</span>
          <span>→</span>
          <span>@react-pdf/renderer</span>
          <span>→</span>
          <span>PDF Download</span>
        </div>

        <ResumeForm />
      </div>
    </main>
  )
}
