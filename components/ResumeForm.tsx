'use client'

import React, { useState } from 'react'
import type { ResumeData, Education, Experience, Project } from '@/types/resume'

// ── Initial State ─────────────────────────────────────────

const blankEdu = (): Education => ({
  university: '', degree: '', branch: '', cgpa: '', graduationYear: '',
})

const blankExp = (): Experience => ({
  company: '', role: '', duration: '', description: '',
})

const blankProject = (): Project => ({
  name: '', techStack: '', description: '',
})

const initialData: ResumeData = {
  personalInfo: { fullName: '', email: '', phone: '', linkedin: '', github: '', city: '' },
  summary: '',
  education: [blankEdu()],
  experience: [blankExp()],
  projects: [blankProject(), blankProject()],
  skills: { languages: '', frameworks: '', tools: '', databases: '' },
  achievements: [''],
}

// ── Sub-components ────────────────────────────────────────

function SectionHeader({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <span className="text-lg">{icon}</span>
      <div>
        <h2 className="text-sm font-semibold text-slate-200 tracking-wide">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder = '', type = 'text', required = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="field-label">
        {label}{required && <span className="text-blue-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
}

function TextAreaField({
  label, value, onChange, placeholder = '', rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   placeholder:text-slate-500 transition-all duration-150 w-full resize-none"
      />
    </div>
  )
}

function SkillTagInput({
  label, value, onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const tags = value.split(',').map((s) => s.trim()).filter(Boolean)

  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Python, TypeScript, Go"
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map((tag, i) => (
            <span key={i} className="tag">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="btn-danger ml-auto">
      Remove
    </button>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ── Main Component ────────────────────────────────────────

export default function ResumeForm() {
  const [data, setData] = useState<ResumeData>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // ── Field updaters ──────────────────────────────────────

  const setPersonal = (field: keyof ResumeData['personalInfo']) => (v: string) =>
    setData((d) => ({ ...d, personalInfo: { ...d.personalInfo, [field]: v } }))

  const setSkill = (field: keyof ResumeData['skills']) => (v: string) =>
    setData((d) => ({ ...d, skills: { ...d.skills, [field]: v } }))

  const setEdu = (i: number, field: keyof Education) => (v: string) =>
    setData((d) => {
      const education = [...d.education]
      education[i] = { ...education[i], [field]: v }
      return { ...d, education }
    })

  const addEdu = () => setData((d) => ({ ...d, education: [...d.education, blankEdu()] }))
  const removeEdu = (i: number) =>
    setData((d) => ({ ...d, education: d.education.filter((_, idx) => idx !== i) }))

  const setExp = (i: number, field: keyof Experience) => (v: string) =>
    setData((d) => {
      const experience = [...d.experience]
      experience[i] = { ...experience[i], [field]: v }
      return { ...d, experience }
    })

  const addExp = () => setData((d) => ({ ...d, experience: [...d.experience, blankExp()] }))
  const removeExp = (i: number) =>
    setData((d) => ({ ...d, experience: d.experience.filter((_, idx) => idx !== i) }))

  const setProj = (i: number, field: keyof Project) => (v: string) =>
    setData((d) => {
      const projects = [...d.projects]
      projects[i] = { ...projects[i], [field]: v }
      return { ...d, projects }
    })

  const addProj = () => setData((d) => ({ ...d, projects: [...d.projects, blankProject()] }))
  const removeProj = (i: number) =>
    setData((d) => ({ ...d, projects: d.projects.filter((_, idx) => idx !== i) }))

  const setAchievement = (i: number) => (v: string) =>
    setData((d) => {
      const achievements = [...d.achievements]
      achievements[i] = v
      return { ...d, achievements }
    })

  const addAchievement = () => setData((d) => ({ ...d, achievements: [...d.achievements, ''] }))
  const removeAchievement = (i: number) =>
    setData((d) => ({ ...d, achievements: d.achievements.filter((_, idx) => idx !== i) }))

  // ── Submit ──────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || `Server error ${res.status}`)
      }

      const contentType = res.headers.get('content-type') ?? ''
      const fallbackName = `${data.personalInfo.fullName.replace(/[^a-zA-Z0-9]/g, '_') || 'resume'}_resume.pdf`

      if (contentType.includes('application/json')) {
        // Production path: Vercel Blob returned a CDN URL
        const { url, filename } = await res.json()
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = filename ?? fallbackName
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
      } else {
        // Local dev fallback: API streamed the PDF binary directly
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = fallbackName
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
        URL.revokeObjectURL(url)
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ── Render ──────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* ── Personal Info ── */}
      <div className="section-card">
        <SectionHeader icon="👤" title="Personal Information" subtitle="Your name and contact details" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" value={data.personalInfo.fullName}
            onChange={setPersonal('fullName')} placeholder="Jane Doe" required />
          <Field label="Email" value={data.personalInfo.email}
            onChange={setPersonal('email')} placeholder="jane@example.com" type="email" />
          <Field label="Phone" value={data.personalInfo.phone}
            onChange={setPersonal('phone')} placeholder="+91 98765 43210" />
          <Field label="City" value={data.personalInfo.city}
            onChange={setPersonal('city')} placeholder="Bangalore, India" />
          <Field label="LinkedIn URL" value={data.personalInfo.linkedin}
            onChange={setPersonal('linkedin')} placeholder="https://linkedin.com/in/janedoe" />
          <Field label="GitHub URL" value={data.personalInfo.github}
            onChange={setPersonal('github')} placeholder="https://github.com/janedoe" />
        </div>
      </div>

      {/* ── Summary ── */}
      <div className="section-card">
        <SectionHeader icon="📝" title="Professional Summary" subtitle="2–3 sentences about you" />
        <TextAreaField
          label="Summary"
          value={data.summary}
          onChange={(v) => setData((d) => ({ ...d, summary: v }))}
          placeholder="Results-driven software engineer with 2+ years of experience building scalable web applications..."
          rows={4}
        />
      </div>

      {/* ── Education ── */}
      <div className="section-card">
        <SectionHeader icon="🎓" title="Education" />
        <div className="space-y-5">
          {data.education.map((edu, i) => (
            <div key={i}>
              {i > 0 && <div className="border-t border-slate-800 my-4" />}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 font-medium">Entry {i + 1}</span>
                {data.education.length > 1 && <RemoveButton onClick={() => removeEdu(i)} />}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <Field label="University / Institution" value={edu.university}
                    onChange={setEdu(i, 'university')} placeholder="IIT Bombay" />
                </div>
                <Field label="Degree" value={edu.degree}
                  onChange={setEdu(i, 'degree')} placeholder="B.Tech" />
                <Field label="Branch / Major" value={edu.branch}
                  onChange={setEdu(i, 'branch')} placeholder="Computer Science" />
                <Field label="CGPA / Percentage" value={edu.cgpa}
                  onChange={setEdu(i, 'cgpa')} placeholder="9.2 / 10" />
                <Field label="Graduation Year" value={edu.graduationYear}
                  onChange={setEdu(i, 'graduationYear')} placeholder="2025" />
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addEdu} className="btn-ghost mt-4">
          <span>＋</span> Add Education
        </button>
      </div>

      {/* ── Experience ── */}
      <div className="section-card">
        <SectionHeader icon="💼" title="Work Experience" subtitle="Internships, jobs — leave blank if none" />
        <div className="space-y-5">
          {data.experience.map((exp, i) => (
            <div key={i}>
              {i > 0 && <div className="border-t border-slate-800 my-4" />}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 font-medium">Entry {i + 1}</span>
                {data.experience.length > 1 && <RemoveButton onClick={() => removeExp(i)} />}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Company" value={exp.company}
                  onChange={setExp(i, 'company')} placeholder="Google" />
                <Field label="Role / Title" value={exp.role}
                  onChange={setExp(i, 'role')} placeholder="Software Engineer Intern" />
                <div className="sm:col-span-2">
                  <Field label="Duration" value={exp.duration}
                    onChange={setExp(i, 'duration')} placeholder="May 2024 – Aug 2024" />
                </div>
                <div className="sm:col-span-2">
                  <TextAreaField
                    label="Description (one bullet per line)"
                    value={exp.description}
                    onChange={setExp(i, 'description')}
                    placeholder={'Built REST APIs reducing latency by 40%\nImplemented CI/CD pipeline using GitHub Actions'}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addExp} className="btn-ghost mt-4">
          <span>＋</span> Add Experience
        </button>
      </div>

      {/* ── Projects ── */}
      <div className="section-card">
        <SectionHeader icon="🚀" title="Projects" subtitle="Minimum 2 required" />
        <div className="space-y-5">
          {data.projects.map((proj, i) => (
            <div key={i}>
              {i > 0 && <div className="border-t border-slate-800 my-4" />}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 font-medium">Project {i + 1}</span>
                {data.projects.length > 2 && <RemoveButton onClick={() => removeProj(i)} />}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Project Name" value={proj.name}
                  onChange={setProj(i, 'name')} placeholder="ResumeGen" />
                <Field label="Tech Stack" value={proj.techStack}
                  onChange={setProj(i, 'techStack')} placeholder="Next.js, TypeScript, Vercel" />
                <div className="sm:col-span-2">
                  <TextAreaField
                    label="Description (one bullet per line)"
                    value={proj.description}
                    onChange={setProj(i, 'description')}
                    placeholder={'Designed and built a PDF resume generator using @react-pdf/renderer\nDeployed on Vercel with zero-config CI/CD'}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addProj} className="btn-ghost mt-4">
          <span>＋</span> Add Project
        </button>
      </div>

      {/* ── Skills ── */}
      <div className="section-card">
        <SectionHeader icon="🛠️" title="Technical Skills" subtitle="Comma-separated values per category" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SkillTagInput label="Languages" value={data.skills.languages}
            onChange={setSkill('languages')} />
          <SkillTagInput label="Frameworks & Libraries" value={data.skills.frameworks}
            onChange={setSkill('frameworks')} />
          <SkillTagInput label="Tools & Platforms" value={data.skills.tools}
            onChange={setSkill('tools')} />
          <SkillTagInput label="Databases" value={data.skills.databases}
            onChange={setSkill('databases')} />
        </div>
      </div>

      {/* ── Achievements ── */}
      <div className="section-card">
        <SectionHeader icon="🏆" title="Achievements" subtitle="Awards, competitions, notable mentions" />
        <div className="space-y-3">
          {data.achievements.map((ach, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={ach}
                  onChange={(e) => setAchievement(i)(e.target.value)}
                  placeholder={`Achievement ${i + 1} — e.g. Runner-up at HackMIT 2024`}
                />
              </div>
              {data.achievements.length > 1 && (
                <button type="button" onClick={() => removeAchievement(i)}
                  className="btn-danger mt-2 whitespace-nowrap">
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addAchievement} className="btn-ghost mt-3">
          <span>＋</span> Add Achievement
        </button>
      </div>

      {/* ── Error / Success ── */}
      {error && (
        <div className="bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-lg flex gap-2 items-start">
          <span className="mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-950 border border-green-800 text-green-300 text-sm px-4 py-3 rounded-lg flex gap-2 items-start">
          <span className="mt-0.5">✓</span>
          <span>Resume downloaded successfully!</span>
        </div>
      )}

      {/* ── Submit ── */}
      <div className="flex justify-end pt-2 pb-8">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed
                     text-white font-semibold rounded-xl px-8 py-3.5 text-sm transition-all duration-150
                     flex items-center gap-2.5 shadow-lg shadow-blue-900/40 hover:shadow-blue-700/40"
        >
          {loading ? (
            <>
              <Spinner />
              Generating PDF...
            </>
          ) : (
            <>
              <span>↓</span>
              Generate &amp; Download Resume
            </>
          )}
        </button>
      </div>

    </form>
  )
}
