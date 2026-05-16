'use strict'
// Runs as a child process — uses Node.js native require() so it gets
// React 18.3.1 from node_modules, NOT Next.js's bundled React 19 canary.
// This avoids the $$typeof symbol mismatch (react.transitional.element vs
// react.element) that causes error #31 inside @react-pdf/reconciler.

const React = require('react')
const {
  renderToBuffer,
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
} = require('@react-pdf/renderer')

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

const h = (type, props, ...children) => {
  const flat = children.flat().filter(c => c !== null && c !== undefined && c !== false)
  return React.createElement(type, props, ...flat)
}

const parseBullets = (text) =>
  text.split(/\n|•/).map(s => s.trim()).filter(Boolean)

function buildPDF(data) {
  const { personalInfo: p, summary, education, experience, projects, skills, achievements } = data
  const hasExperience = experience.some(e => e.company.trim())
  const hasAchievements = achievements.some(a => a.trim())

  return h(Document, { title: `${p.fullName} — Resume`, author: p.fullName },
    h(Page, { size: 'A4', style: styles.page },

      // Header
      h(View, { style: styles.headerWrap },
        h(Text, { style: styles.name }, p.fullName),
        h(View, { style: styles.contactRow },
          ...[
            p.email ? h(Text, { style: styles.contactText }, p.email) : null,
            p.phone ? h(Text, { style: styles.contactSep }, '|') : null,
            p.phone ? h(Text, { style: styles.contactText }, p.phone) : null,
            p.city  ? h(Text, { style: styles.contactSep }, '|') : null,
            p.city  ? h(Text, { style: styles.contactText }, p.city) : null,
            p.linkedin ? h(Text, { style: styles.contactSep }, '|') : null,
            p.linkedin ? h(Link, { src: p.linkedin, style: styles.contactLink }, 'LinkedIn') : null,
            p.github ? h(Text, { style: styles.contactSep }, '|') : null,
            p.github ? h(Link, { src: p.github, style: styles.contactLink }, 'GitHub') : null,
          ].filter(Boolean)
        )
      ),
      h(View, { style: styles.divider }),

      // Summary
      summary.trim() ? h(View, { style: styles.section },
        h(Text, { style: styles.sectionTitle }, 'PROFESSIONAL SUMMARY'),
        h(Text, { style: styles.summaryText }, summary.trim()),
        h(View, { style: styles.divider })
      ) : null,

      // Education
      education.length > 0 ? h(View, { style: styles.section },
        h(Text, { style: styles.sectionTitle }, 'EDUCATION'),
        ...education.map((edu, i) =>
          h(View, { key: String(i), style: styles.eduRow },
            h(View, { style: styles.eduLeft },
              h(Text, { style: styles.eduUniversity }, edu.university),
              h(Text, { style: styles.eduMeta },
                edu.degree +
                (edu.branch ? ` in ${edu.branch}` : '') +
                (edu.cgpa ? `  •  CGPA: ${edu.cgpa}` : '')
              )
            ),
            h(Text, { style: styles.eduRight }, edu.graduationYear)
          )
        ),
        h(View, { style: styles.divider })
      ) : null,

      // Experience
      hasExperience ? h(View, { style: styles.section },
        h(Text, { style: styles.sectionTitle }, 'EXPERIENCE'),
        ...experience.filter(e => e.company.trim()).map((exp, i) =>
          h(View, { key: String(i), style: styles.entryWrap },
            h(View, { style: styles.entryHeader },
              h(View, null,
                h(Text, { style: styles.entryTitle }, exp.company),
                h(Text, { style: styles.entrySubtitle }, exp.role)
              ),
              h(Text, { style: styles.entryRight }, exp.duration)
            ),
            ...(exp.description
              ? parseBullets(exp.description).map((line, j) =>
                  h(View, { key: String(j), style: styles.bulletRow },
                    h(Text, { style: styles.bulletDot }, '•'),
                    h(Text, { style: styles.bulletText }, line)
                  )
                )
              : [])
          )
        ),
        h(View, { style: styles.divider })
      ) : null,

      // Projects
      projects.filter(pr => pr.name.trim()).length > 0 ? h(View, { style: styles.section },
        h(Text, { style: styles.sectionTitle }, 'PROJECTS'),
        ...projects.filter(pr => pr.name.trim()).map((proj, i) =>
          h(View, { key: String(i), style: styles.entryWrap },
            h(View, { style: styles.entryHeader },
              h(Text, { style: styles.entryTitle }, proj.name),
              proj.techStack ? h(Text, { style: styles.entryRight }, proj.techStack) : null,
            ),
            ...(proj.description
              ? parseBullets(proj.description).map((line, j) =>
                  h(View, { key: String(j), style: styles.bulletRow },
                    h(Text, { style: styles.bulletDot }, '•'),
                    h(Text, { style: styles.bulletText }, line)
                  )
                )
              : [])
          )
        ),
        h(View, { style: styles.divider })
      ) : null,

      // Skills
      (skills.languages || skills.frameworks || skills.tools || skills.databases) ?
        h(View, { style: styles.section },
          h(Text, { style: styles.sectionTitle }, 'TECHNICAL SKILLS'),
          h(View, { style: styles.skillsGrid },
            ...[
              skills.languages ? h(View, { style: styles.skillRow },
                h(Text, { style: styles.skillCat }, 'Languages:'),
                h(Text, { style: styles.skillVal }, skills.languages)
              ) : null,
              skills.frameworks ? h(View, { style: styles.skillRow },
                h(Text, { style: styles.skillCat }, 'Frameworks:'),
                h(Text, { style: styles.skillVal }, skills.frameworks)
              ) : null,
              skills.tools ? h(View, { style: styles.skillRow },
                h(Text, { style: styles.skillCat }, 'Tools:'),
                h(Text, { style: styles.skillVal }, skills.tools)
              ) : null,
              skills.databases ? h(View, { style: styles.skillRow },
                h(Text, { style: styles.skillCat }, 'Databases:'),
                h(Text, { style: styles.skillVal }, skills.databases)
              ) : null,
            ].filter(Boolean)
          ),
          h(View, { style: styles.divider })
        ) : null,

      // Achievements
      hasAchievements ? h(View, { style: styles.section },
        h(Text, { style: styles.sectionTitle }, 'ACHIEVEMENTS'),
        ...achievements.filter(a => a.trim()).map((ach, i) =>
          h(View, { key: String(i), style: styles.bulletRow },
            h(Text, { style: styles.bulletDot }, '•'),
            h(Text, { style: styles.bulletText }, ach)
          )
        )
      ) : null,

    )
  )
}

process.on('message', async (data) => {
  try {
    const element = buildPDF(data)
    const buffer = await renderToBuffer(element)
    process.send({ ok: true, buffer: Buffer.from(buffer).toString('base64') })
  } catch (err) {
    process.send({ ok: false, error: err.message || String(err) })
  }
})
