import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { ResumeState } from '../types';

// Margins: 0.5 inch = 36 pt (72 pt = 1 inch)
const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 36,
    paddingRight: 36,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
    color: '#1e293b', // slate-800
  },
  headerContainer: {
    marginBottom: 10,
    textAlign: 'center',
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a', // slate-900
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#475569', // slate-600
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    fontSize: 9,
    color: '#475569',
  },
  contactItem: {
    fontSize: 9,
    color: '#475569',
  },
  contactSeparator: {
    color: '#cbd5e1', // slate-300
  },
  link: {
    color: '#475569',
    textDecoration: 'none',
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    paddingBottom: 2,
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 9.5,
    lineHeight: 1.35,
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  itemSubtitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
  },
  itemMeta: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Oblique',
    color: '#64748b',
  },
  rightMeta: {
    fontSize: 8.5,
    fontFamily: 'Helvetica',
    color: '#475569',
    textAlign: 'right',
  },
  bulletList: {
    marginTop: 2,
    paddingLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2.5,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 8,
    fontSize: 9.5,
    color: '#475569',
  },
  bulletContent: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.3,
  },
  skillsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  skillsColumn: {
    flex: 1,
  },
  skillGroup: {
    marginBottom: 4,
  },
  skillGroupName: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#334155',
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  skillGroupContent: {
    fontSize: 9,
    color: '#1e293b',
    lineHeight: 1.3,
  },
  projectItem: {
    marginBottom: 6,
  },
  certItem: {
    marginBottom: 3,
  },
  certText: {
    fontSize: 9,
    color: '#1e293b',
  },
  certTitle: {
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  }
});

interface ResumePDFProps {
  data: ResumeState;
}

export const ResumePDF: React.FC<ResumePDFProps> = ({ data }) => {
  const { header, summary, experience, education, skills, certifications, projects } = data;

  const hasHeader = header.name || header.title || header.email || header.phone || header.location;
  const hasSummary = summary.trim().length > 0;
  const hasExperience = experience.length > 0;
  const hasEducation = education.length > 0;
  const hasSkills = skills.length > 0;
  const hasCertifications = certifications.length > 0;
  const hasProjects = projects.length > 0;

  // Split skills into two columns for ATS-safe structure
  const techSkills = skills.filter(s => s.group === 'technical');
  const softSkills = skills.filter(s => s.group === 'soft');
  const toolsSkills = skills.filter(s => s.group === 'tools');

  const leftColumnSkills = [...techSkills];
  const rightColumnSkills = [...toolsSkills, ...softSkills];

  const formatSkillsString = (skillArray: typeof skills) => {
    return skillArray.map(s => s.name).join(', ');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER SECTION */}
        {hasHeader && (
          <View style={styles.headerContainer}>
            {header.name ? <Text style={styles.name}>{header.name}</Text> : null}
            {header.title ? <Text style={styles.title}>{header.title}</Text> : null}
            <View style={styles.contactRow}>
              {header.email ? <Text style={styles.contactItem}>{header.email}</Text> : null}
              {header.email && header.phone ? <Text style={styles.contactSeparator}>|</Text> : null}
              {header.phone ? <Text style={styles.contactItem}>{header.phone}</Text> : null}
              {(header.email || header.phone) && header.location ? <Text style={styles.contactSeparator}>|</Text> : null}
              {header.location ? <Text style={styles.contactItem}>{header.location}</Text> : null}
            </View>
            <View style={[styles.contactRow, { marginTop: 2 }]}>
              {header.linkedin ? (
                <Text style={styles.contactItem}>
                  <Link style={styles.link} src={header.linkedin}>LinkedIn</Link>
                </Text>
              ) : null}
              {header.linkedin && header.portfolio ? <Text style={styles.contactSeparator}>|</Text> : null}
              {header.portfolio ? (
                <Text style={styles.contactItem}>
                  <Link style={styles.link} src={header.portfolio}>Portfolio/GitHub</Link>
                </Text>
              ) : null}
            </View>
          </View>
        )}

        {/* SUMMARY SECTION */}
        {hasSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* WORK EXPERIENCE */}
        {hasExperience && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={styles.itemTitle}>
                      {exp.title}
                      {exp.company ? ` - ${exp.company}` : ''}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.rightMeta}>
                      {exp.start} – {exp.current ? 'Present' : exp.end}
                    </Text>
                  </View>
                </View>
                {exp.location ? (
                  <View style={[styles.rowBetween, { marginTop: -1 }]}>
                    <Text style={styles.itemMeta}>{exp.location}</Text>
                  </View>
                ) : null}
                {exp.bullets && exp.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.bullets.filter(b => b.trim() !== '').map((bullet, idx) => (
                      <View key={idx} style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletContent}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION SECTION */}
        {hasEducation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 4 }}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={styles.itemTitle}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </Text>
                    <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.rightMeta}>{edu.year}</Text>
                    {edu.gpa ? <Text style={styles.itemMeta}>GPA: {edu.gpa}</Text> : null}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS SECTION */}
        {hasProjects && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={styles.projectItem}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={styles.itemTitle}>
                      {proj.name}
                      {proj.tech ? ` (${proj.tech})` : ''}
                    </Text>
                  </View>
                  {proj.url ? (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.rightMeta}>
                        <Link style={styles.link} src={proj.url}>{proj.url.replace(/^https?:\/\/(www\.)?/, '')}</Link>
                      </Text>
                    </View>
                  ) : null}
                </View>
                {proj.description ? (
                  <Text style={[styles.bulletContent, { marginTop: 1 }]}>{proj.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* SKILLS SECTION (Two-Column Layout) */}
        {hasSkills && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {/* Left Column */}
              <View style={styles.skillsColumn}>
                {leftColumnSkills.length > 0 && (
                  <View style={styles.skillGroup}>
                    <Text style={styles.skillGroupName}>Technical Skills</Text>
                    <Text style={styles.skillGroupContent}>
                      {formatSkillsString(leftColumnSkills)}
                    </Text>
                  </View>
                )}
              </View>
              {/* Right Column */}
              <View style={styles.skillsColumn}>
                {rightColumnSkills.length > 0 && (
                  <View style={styles.skillGroup}>
                    <Text style={styles.skillGroupName}>
                      {toolsSkills.length > 0 && softSkills.length > 0
                        ? 'Tools & Soft Skills'
                        : toolsSkills.length > 0
                        ? 'Tools & Platforms'
                        : 'Soft Skills'}
                    </Text>
                    <Text style={styles.skillGroupContent}>
                      {formatSkillsString(rightColumnSkills)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* CERTIFICATIONS SECTION */}
        {hasCertifications && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.certItem}>
                <View style={styles.rowBetween}>
                  <Text style={styles.certText}>
                    <Text style={styles.certTitle}>{cert.name}</Text>
                    {cert.org ? ` – ${cert.org}` : ''}
                  </Text>
                  <Text style={styles.rightMeta}>{cert.year}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
