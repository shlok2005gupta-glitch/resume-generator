import React from 'react'
import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
} from '@react-pdf/renderer'
import type { ResumeData } from '@/types/resume'

const C = {
  navy: '#1a3a5c',
  navyLight: '#2a5f9e',
  text: '#1a1a1a',
  muted: '#4a4a4a',
  light: '#888888',
  divider: '#cbd5e1',
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 30,
    paddingRight: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: C.text,
    backgroundColor: '#ffffff',
  },
  headerWrap: { alignItems: 'center', marginBottom: 8 },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 22,
    color: C.navy,
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  contactText: { fontSize: 9, color: C.muted },
  contactLink: { fontSize: 9, color: C.navyLight, textDecoration: 'none' },
  contactSep: { fontSize: 9, color: C.light, marginLeft: 5, marginRight: 5 },
  divider: { borderBottomWidth: 1.5, borderBottomColor: C.navy, marginTop: 7, marginBottom: 7 },
  section: { marginBottom: 6 },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: C.navy,
    letterSpacing: 1.8,
    marginBottom: 6,
  },
  summaryText: { fontSize: 9.5, color: C.muted, lineHeight: 1.55 },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  eduLeft: { flex: 1 },
  eduUniversity: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: C.text },
  eduMeta: { fontSize: 9, color: C.muted, marginTop: 1 },
  eduRight: { fontSize: 9, color: C.muted, textAlign: 'right' },
  entryWrap: { marginBottom: 7 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  entryTitle: { fontFamily: 'Helvetica-Bold', fontSize: 10, color: C.text },
  entrySubtitle: { fontSize: 9, color: C.muted, fontFamily: 'Helvetica-Oblique', marginTop: 1 },
  entryRight: { fontSize: 9, color: C.muted, textAlign: 'right' },
  bulletRow: { flexDirection: 'row', marginTop: 2, paddingLeft: 6 },
  bulletDot: { fontSize: 9, color: C.navyLight, marginRight: 5, marginTop: 0.5 },
  bulletText: { flex: 1, fontSize: 9, color: C.muted, lineHeight: 1.45 },
  skillsGrid: { flexDirection: 'column' },
  skillRow: { flexDirection: 'row', marginBottom: 3 },
  skillCat: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: C.navy, width: 75, flexShrink: 0 },
  skillVal: { flex: 1, fontSize: 9, color: C.muted, lineHeight: 1.4 },
})

const parseBullets = (text: string) =>
  text.split(/\n|•/).map((s) => s.trim()).filter(Boolean)

interface Props { data: ResumeData }

export const ResumePDF = ({ data }: Props) => {
  const { personalInfo: p, summary, education, experience, projects, skills, achievements } = data
  const hasExperience = experience.some((e) => e.company.trim())
  const hasAchievements = achievements.some((a) => a.trim())

  return (
    <Document title={`${p.fullName} — Resume`} author={p.fullName}>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.headerWrap}>
          <Text style={styles.name}>{p.fullName}</Text>
          <View style={styles.contactRow}>
            {p.email ? <Text style={styles.contactText}>{p.email}</Text> : null}
            {p.phone ? <Text style={styles.contactSep}>|</Text> : null}
            {p.phone ? <Text style={styles.contactText}>{p.phone}</Text> : null}
            {p.city ? <Text style={styles.contactSep}>|</Text> : null}
            {p.city ? <Text style={styles.contactText}>{p.city}</Text> : null}
            {p.linkedin ? <Text style={styles.contactSep}>|</Text> : null}
            {p.linkedin ? <Link src={p.linkedin} style={styles.contactLink}>LinkedIn</Link> : null}
            {p.github ? <Text style={styles.contactSep}>|</Text> : null}
            {p.github ? <Link src={p.github} style={styles.contactLink}>GitHub</Link> : null}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Summary */}
        {summary.trim() ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summaryText}>{summary.trim()}</Text>
            <View style={styles.divider} />
          </View>
        ) : null}

        {/* Education */}
        {education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {education.map((edu, i) => (
              <View key={i} style={styles.eduRow}>
                <View style={styles.eduLeft}>
                  <Text style={styles.eduUniversity}>{edu.university}</Text>
                  <Text style={styles.eduMeta}>
                    {edu.degree}{edu.branch ? ` in ${edu.branch}` : ''}{edu.cgpa ? `  •  CGPA: ${edu.cgpa}` : ''}
                  </Text>
                </View>
                <Text style={styles.eduRight}>{edu.graduationYear}</Text>
              </View>
            ))}
            <View style={styles.divider} />
          </View>
        ) : null}

        {/* Experience */}
        {hasExperience ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EXPERIENCE</Text>
            {experience.filter((e) => e.company.trim()).map((exp, i) => (
              <View key={i} style={styles.entryWrap}>
                <View style={styles.entryHeader}>
                  <View>
                    <Text style={styles.entryTitle}>{exp.company}</Text>
                    <Text style={styles.entrySubtitle}>{exp.role}</Text>
                  </View>
                  <Text style={styles.entryRight}>{exp.duration}</Text>
                </View>
                {exp.description ? parseBullets(exp.description).map((line, j) => (
                  <View key={j} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                )) : null}
              </View>
            ))}
            <View style={styles.divider} />
          </View>
        ) : null}

        {/* Projects */}
        {projects.filter((pr) => pr.name.trim()).length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {projects.filter((pr) => pr.name.trim()).map((proj, i) => (
              <View key={i} style={styles.entryWrap}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{proj.name}</Text>
                  {proj.techStack ? <Text style={styles.entryRight}>{proj.techStack}</Text> : null}
                </View>
                {proj.description ? parseBullets(proj.description).map((line, j) => (
                  <View key={j} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                )) : null}
              </View>
            ))}
            <View style={styles.divider} />
          </View>
        ) : null}

        {/* Skills */}
        {(skills.languages || skills.frameworks || skills.tools || skills.databases) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
            <View style={styles.skillsGrid}>
              {skills.languages ? (
                <View style={styles.skillRow}>
                  <Text style={styles.skillCat}>Languages:</Text>
                  <Text style={styles.skillVal}>{skills.languages}</Text>
                </View>
              ) : null}
              {skills.frameworks ? (
                <View style={styles.skillRow}>
                  <Text style={styles.skillCat}>Frameworks:</Text>
                  <Text style={styles.skillVal}>{skills.frameworks}</Text>
                </View>
              ) : null}
              {skills.tools ? (
                <View style={styles.skillRow}>
                  <Text style={styles.skillCat}>Tools:</Text>
                  <Text style={styles.skillVal}>{skills.tools}</Text>
                </View>
              ) : null}
              {skills.databases ? (
                <View style={styles.skillRow}>
                  <Text style={styles.skillCat}>Databases:</Text>
                  <Text style={styles.skillVal}>{skills.databases}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.divider} />
          </View>
        ) : null}

        {/* Achievements */}
        {hasAchievements ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
            {achievements.filter((a) => a.trim()).map((ach, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{ach}</Text>
              </View>
            ))}
          </View>
        ) : null}

      </Page>
    </Document>
  )
}

export default ResumePDF
