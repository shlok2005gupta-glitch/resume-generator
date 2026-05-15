export interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  linkedin: string
  github: string
  city: string
}

export interface Education {
  university: string
  degree: string
  branch: string
  cgpa: string
  graduationYear: string
}

export interface Experience {
  company: string
  role: string
  duration: string
  description: string
}

export interface Project {
  name: string
  techStack: string
  description: string
}

export interface Skills {
  languages: string
  frameworks: string
  tools: string
  databases: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  education: Education[]
  experience: Experience[]
  projects: Project[]
  skills: Skills
  achievements: string[]
}
