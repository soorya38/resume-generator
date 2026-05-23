import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { ResumeState } from '../types';

// Compact A4 resume margins: 72 pt = 1 inch.
const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 34,
    paddingRight: 34,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.25,
    color: '#1e293b', // slate-800
  },
  headerContainer: {
    marginBottom: 7,
    textAlign: 'center',
  },
  name: {
    fontSize: 17,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a', // slate-900
    marginBottom: 3,
    lineHeight: 1.15,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#475569', // slate-600
    marginBottom: 6,
    lineHeight: 1.15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    fontSize: 8,
    color: '#475569',
  },
  contactItem: {
    fontSize: 8,
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
    marginTop: 7,
  },
  sectionTitle: {
    fontSize: 9.8,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    paddingBottom: 1.5,
    marginBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modernAccentBand: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 8,
  },
  modernHeaderContainer: {
    textAlign: 'left',
    marginLeft: 8,
  },
  modernSectionTitle: {
    borderLeftWidth: 3,
    paddingLeft: 6,
  },
  classicHeaderDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    marginTop: 4,
  },
  executiveSectionRule: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginTop: -2,
    marginBottom: 3,
  },
  summaryText: {
    fontSize: 8.6,
    lineHeight: 1.25,
    textAlign: 'justify',
  },
  experienceItem: {
    marginBottom: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 1,
  },
  itemTitle: {
    fontSize: 8.8,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  itemSubtitle: {
    fontSize: 8.7,
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
  },
  itemMeta: {
    fontSize: 8,
    fontFamily: 'Helvetica-Oblique',
    color: '#64748b',
  },
  rightMeta: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#475569',
    textAlign: 'right',
  },
  bulletList: {
    marginTop: 1,
    paddingLeft: 8,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 1.6,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: 8,
    fontSize: 8.7,
    color: '#475569',
  },
  bulletContent: {
    flex: 1,
    fontSize: 8.4,
    lineHeight: 1.22,
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
    marginBottom: 3,
  },
  skillGroupName: {
    fontSize: 8.3,
    fontFamily: 'Helvetica-Bold',
    color: '#334155',
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  skillGroupContent: {
    fontSize: 8.3,
    color: '#1e293b',
    lineHeight: 1.22,
  },
  projectItem: {
    marginBottom: 4,
  },
  certItem: {
    marginBottom: 3,
  },
  certText: {
    fontSize: 8.4,
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

const normalizeLink = (url?: string) => {
  const trimmed = url?.trim() ?? '';
  if (!trimmed) return '';
  return /^[a-z][a-z\d+\-.]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const stripProtocol = (url: string) => url.replace(/^https?:\/\/(www\.)?/i, '');

export const ResumePDF: React.FC<ResumePDFProps> = ({ data }) => {
  const { header, summary, experience, education, skills, certifications, projects } = data;
  const template = data.meta.template;
  const accentColor = data.meta.accentColor || '#475569';
  const isClassic = template === 'classic';
  const isModern = template === 'modern';
  const isExecutive = template === 'executive';

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

  const pageStyle = [
    styles.page,
    ...(isClassic ? [{ fontFamily: 'Times-Roman' }] : []),
  ];

  const nameStyle = [
    styles.name,
    { textAlign: (isModern ? 'left' : 'center') as 'left' | 'center' },
    ...(isClassic ? [{ fontFamily: 'Times-Bold' }] : []),
    ...(isExecutive ? [{ color: accentColor, letterSpacing: 1 }] : []),
  ];

  const sectionTitleStyle = [
    styles.sectionTitle,
    ...(isClassic ? [{ color: '#1e293b', fontFamily: 'Times-Bold' }] : []),
    ...(isModern ? [styles.modernSectionTitle, { borderLeftColor: accentColor }] : []),
    ...(isExecutive ? [{ color: accentColor, letterSpacing: 0.8 }] : []),
  ];

  const titleStyle = [
    styles.title,
    { textAlign: (isModern ? 'left' : 'center') as 'left' | 'center' },
    ...(isClassic ? [{ fontFamily: 'Times-Bold' }] : []),
  ];

  const itemTitleStyle = [
    styles.itemTitle,
    ...(isClassic ? [{ fontFamily: 'Times-Bold' }] : []),
  ];

  const itemSubtitleStyle = [
    styles.itemSubtitle,
    ...(isClassic ? [{ fontFamily: 'Times-Bold' }] : []),
  ];

  const itemMetaStyle = [
    styles.itemMeta,
    ...(isClassic ? [{ fontFamily: 'Times-Italic' }] : []),
  ];

  const rightMetaStyle = [
    styles.rightMeta,
    ...(isClassic ? [{ fontFamily: 'Times-Roman' }] : []),
  ];

  const bulletPointStyle = [
    styles.bulletPoint,
    ...(isClassic ? [{ fontFamily: 'Times-Roman' }] : []),
  ];

  const skillGroupNameStyle = [
    styles.skillGroupName,
    ...(isClassic ? [{ fontFamily: 'Times-Bold' }] : []),
  ];

  const certTitleStyle = [
    styles.certTitle,
    ...(isClassic ? [{ fontFamily: 'Times-Bold' }] : []),
  ];

  const renderSectionTitle = (title: string) => (
    <View>
      <Text style={sectionTitleStyle}>{title}</Text>
      {isExecutive ? <View style={styles.executiveSectionRule} /> : null}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {isModern ? <View style={[styles.modernAccentBand, { backgroundColor: accentColor }]} /> : null}

        {/* HEADER SECTION */}
        {hasHeader && (
          <View style={isModern ? [styles.headerContainer, styles.modernHeaderContainer] : styles.headerContainer}>
            {header.name ? <Text style={nameStyle}>{header.name}</Text> : null}
            {header.title ? <Text style={titleStyle}>{header.title}</Text> : null}
            <View style={isModern ? [styles.contactRow, { justifyContent: 'flex-start' }] : styles.contactRow}>
              {header.email ? <Text style={styles.contactItem}>{header.email}</Text> : null}
              {header.email && header.phone ? <Text style={styles.contactSeparator}>|</Text> : null}
              {header.phone ? <Text style={styles.contactItem}>{header.phone}</Text> : null}
              {(header.email || header.phone) && header.location ? <Text style={styles.contactSeparator}>|</Text> : null}
              {header.location ? <Text style={styles.contactItem}>{header.location}</Text> : null}
            </View>
            <View style={isModern ? [styles.contactRow, { justifyContent: 'flex-start', marginTop: 2 }] : [styles.contactRow, { marginTop: 2 }]}>
              {header.linkedin ? (
                <Text style={styles.contactItem}>
                  <Link style={styles.link} src={normalizeLink(header.linkedin)}>LinkedIn</Link>
                </Text>
              ) : null}
              {header.linkedin && header.portfolio ? <Text style={styles.contactSeparator}>|</Text> : null}
              {header.portfolio ? (
                <Text style={styles.contactItem}>
                  <Link style={styles.link} src={normalizeLink(header.portfolio)}>Portfolio/GitHub</Link>
                </Text>
              ) : null}
            </View>
            {isClassic ? <View style={styles.classicHeaderDivider} /> : null}
          </View>
        )}

        {/* SUMMARY SECTION */}
        {hasSummary && (
          <View style={styles.section}>
            {renderSectionTitle('Professional Summary')}
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        )}

        {/* WORK EXPERIENCE */}
        {hasExperience && (
          <View style={styles.section}>
            {renderSectionTitle('Experience')}
            {experience.map((exp) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={itemTitleStyle}>
                      {exp.title}
                      {exp.company ? ` - ${exp.company}` : ''}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={rightMetaStyle}>
                      {exp.start} – {exp.current ? 'Present' : exp.end}
                    </Text>
                  </View>
                </View>
                {exp.location ? (
                  <View style={[styles.rowBetween, { marginTop: -1 }]}>
                    <Text style={itemMetaStyle}>{exp.location}</Text>
                  </View>
                ) : null}
                {exp.bullets && exp.bullets.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.bullets.filter(b => b.trim() !== '').map((bullet, idx) => (
                      <View key={idx} style={styles.bulletItem}>
                        <Text style={bulletPointStyle}>•</Text>
                        <Text style={styles.bulletContent}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* PROJECTS SECTION */}
        {hasProjects && (
          <View style={styles.section}>
            {renderSectionTitle('Projects')}
            {projects.map((proj) => (
              <View key={proj.id} style={styles.projectItem}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={itemTitleStyle}>{proj.name}</Text>
                    {proj.tech ? (
                      <Text style={itemMetaStyle}>{proj.tech}</Text>
                    ) : null}
                  </View>
                  {proj.url ? (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={rightMetaStyle}>
                        <Link style={styles.link} src={normalizeLink(proj.url)}>{stripProtocol(proj.url)}</Link>
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
            {renderSectionTitle('Skills')}
            <View style={styles.skillsContainer}>
              {/* Left Column */}
              <View style={styles.skillsColumn}>
                {leftColumnSkills.length > 0 && (
                  <View style={styles.skillGroup}>
                    <Text style={skillGroupNameStyle}>Technical Skills</Text>
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
                    <Text style={skillGroupNameStyle}>
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
            {renderSectionTitle('Certifications')}
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.certItem}>
                <View style={styles.rowBetween}>
                  <Text style={styles.certText}>
                    <Text style={certTitleStyle}>{cert.name}</Text>
                    {cert.org ? ` – ${cert.org}` : ''}
                  </Text>
                  <Text style={rightMetaStyle}>{cert.year}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION SECTION */}
        {hasEducation && (
          <View style={styles.section}>
            {renderSectionTitle('Education')}
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 4 }}>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={itemTitleStyle}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                    </Text>
                    <Text style={itemSubtitleStyle}>{edu.institution}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={rightMetaStyle}>{edu.year}</Text>
                    {edu.gpa ? <Text style={itemMetaStyle}>GPA: {edu.gpa}</Text> : null}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
