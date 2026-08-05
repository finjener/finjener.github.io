import React from 'react';
import { Document, Page, Text, View, Link, Font, Image } from '@react-pdf/renderer';
import { styles } from './pdfStyles.js';
const githubIcon = require('../assets/github-icon.png');
const locationIcon = require('../assets/icon-location.png');
const phoneIcon = require('../assets/icon-phone.png');
const mailIcon = require('../assets/icon-mail.png');
const linkIcon = require('../assets/icon-link.png');
const globeIcon = require('../assets/icon-globe.png');

// Helper function to clean markdown content
const cleanMarkdown = (text) => {
  if (!text) return '';

  // Convert array to string if necessary
  const content = Array.isArray(text) ? text.join('\n') : text;

  // First, normalize the text
  let result = content.normalize('NFKD');

  // Apply replacements
  result = result
    .replace(/#{1,6}\s?/g, '')         // Remove headings
    .replace(/\*\*/g, '')              // Remove bold
    .replace(/\*/g, '')                // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Remove links but keep text
    .replace(/`/g, '')                 // Remove code ticks
    .replace(/\n\s*\n/g, '\n')         // Remove multiple newlines
    .replace(/^-\s/gm, '')             // Remove list markers
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove invisible chars
    .trim();

  return result;
};

// Create bullet points from cleaned markdown
const createBulletPoints = (text) => {
  if (!text) return [];
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

// Separator component - smaller
const Sep = () => <Text style={{ marginHorizontal: 3 }}>•</Text>;

// Resume Document component
const ResumeDocument = ({ content }) => {
  if (!content) return null;

  const { resumeContact, experience, education, projects, skills, leadership } = content;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerName}>{resumeContact?.name || "Ferhat Sencer"}</Text>

          <View style={styles.headerContactConfig}>
            {/* Location */}
            {resumeContact?.address && (
              <View style={styles.contactItem}>
                <Image src={locationIcon} style={{ width: 9, height: 9, marginRight: 2 }} />
                <Text>{resumeContact.address}</Text>
              </View>
            )}

            {/* Website */}
            {resumeContact?.website && (
              <View style={styles.contactItem}>
                <Image src={linkIcon} style={{ width: 9, height: 9, marginRight: 2 }} />
                <Link src={`https://${resumeContact.website}`} style={styles.link}>
                  {resumeContact.website}
                </Link>
              </View>
            )}

            {/* Phone */}
            {resumeContact?.phone && (
              <View style={styles.contactItem}>
                <Image src={phoneIcon} style={{ width: 9, height: 9, marginRight: 2 }} />
                <Text>{resumeContact.phone}</Text>
              </View>
            )}

            {/* Email */}
            {resumeContact?.email && (
              <View style={styles.contactItem}>
                <Image src={mailIcon} style={{ width: 9, height: 9, marginRight: 2 }} />
                <Link src={`mailto:${resumeContact.email}`} style={styles.link}>
                  {resumeContact.email}
                </Link>
              </View>
            )}

            {/* Languages */}
            {resumeContact?.languages && (
              <View style={styles.contactItem}>
                <Image src={globeIcon} style={{ width: 9, height: 9, marginRight: 2 }} />
                <Text>{resumeContact.languages}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Horizontal Line below Header */}


        {/* Experience Section */}
        {experience?.experiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.experiences.map((exp, index) => (
              <View key={index} style={{ marginBottom: 4 }}>
                {/* Header Row: Company • Role • Period ... Location */}
                <View style={styles.itemRow}>
                  <View style={styles.leftColumn}>
                    <Text style={styles.companyName}>{exp.company}</Text>
                    <Sep />
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Sep />
                    <Text style={styles.date}>{exp.period}</Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <Text style={styles.location}>{exp.location}</Text>
                  </View>
                </View>

                {/* Bullets */}
                {createBulletPoints(cleanMarkdown(exp.description)).map((point, i) => (
                  <View key={i} style={styles.bulletPoint}>
                    <Text style={styles.bulletChar}>•</Text>
                    <Text style={styles.bulletContent}>{point}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {education?.education?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 4 }}>
                {/* School • Date */}
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 2 }}>
                  <Text style={styles.companyName}>{edu.school}</Text>
                  <Sep />
                  <Text style={styles.date}>{edu.period}</Text>

                  {/* Note (e.g. dropped out reason) - moved inline */}
                  {edu.note && (
                    <Text style={[styles.faded, { fontSize: 9 }]}>  {edu.note}</Text>
                  )}
                </View>

                {/* Degree as bullet */}
                < View style={styles.bulletPoint} >
                  <Text style={styles.bulletChar}>•</Text>
                  <Text style={styles.bulletContent}>{edu.degree}</Text>
                </View>

                {/* Optional: Location or extra info as bullet */}
                {edu.location && (
                  <View style={styles.bulletPoint}>
                    <Text style={styles.bulletChar}>•</Text>
                    <Text style={styles.bulletContent}>{edu.location}</Text>
                  </View>
                )}

                {/* Graduation Thesis/Project - Special Section */}
                {edu.thesisProjects && (
                  <View style={{ marginTop: 2, marginLeft: 8 }}>
                    <Text style={{ fontFamily: 'Times-Bold', fontSize: 10, marginBottom: 1 }}>Graduation Thesis/Project:</Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      {edu.thesisProjects.map((thesis, tIndex) => (
                        <View key={tIndex} style={{ marginRight: 16, marginBottom: 1 }}>
                          {/* Label (Thesis or Project) */}
                          <Text style={{ fontFamily: 'Times-Bold', fontSize: 10 }}>{thesis.label}:</Text>

                          {/* Content Line: Name (no "see article section") */}
                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Text style={[styles.regular, styles.faded]}>{thesis.name} </Text>

                            {/* Special case for VitalSync GitHub Link */}
                            {/* Check if this is the VitalSync project (normalized check) */}
                            {(thesis.name.toLowerCase().includes('vitalsync') || thesis.github) && thesis.github ? (
                              <Link src={thesis.github} style={{ textDecoration: 'none', flexDirection: 'row', alignItems: 'center', marginLeft: 3, marginRight: 3 }}>
                                <Image src={githubIcon} style={{ width: 10, height: 10 }} />
                              </Link>
                            ) : null}

                            {/* Removed "see article section" text */}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )
        }

        {/* Projects Section - Compact Single Line */}
        {
          projects && (Array.isArray(projects) || Array.isArray(projects.categories) || Array.isArray(projects.items)) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Open Source Projects</Text>
              {(() => {
                let flatProjects = [];
                if (Array.isArray(projects)) flatProjects = projects;
                else if (Array.isArray(projects.items)) flatProjects = projects.items;
                else if (projects.categories) {
                  projects.categories.forEach(c => {
                    if (c.projects) flatProjects.push(...c.projects);
                  });
                }

                return flatProjects
                  .filter(proj => {
                    // Filter out VitalSync
                    const title = proj.title || proj.name || '';
                    return !title.toLowerCase().includes('vitalsync');
                  })
                  .map((proj, index) => {
                    // Extract description: Look for first non-header, non-empty line
                    let desc = '';
                    if (Array.isArray(proj.description)) {
                      const lines = proj.description.filter(line =>
                        line.trim().length > 0 && !line.trim().startsWith('#')
                      );
                      // The first valid line is usually the summary
                      if (lines.length > 0) desc = lines[0];
                    } else if (typeof proj.description === 'string') {
                      desc = cleanMarkdown(proj.description).split('\n')[0];
                    }

                    // Clean up trailing colons or extra spaces
                    desc = desc.trim().replace(/:$/, '');

                    // Use impact if description is empty (fallback)
                    if (!desc && proj.impact) desc = proj.impact;

                    // Fix Article Link Generation: Handle paths with or without leading slash
                    let articleLink = null;
                    if (proj.link) {
                      if (proj.link.startsWith('http')) {
                        articleLink = proj.link;
                      } else {
                        // Ensure no double slash or missing slash
                        const cleanPath = proj.link.startsWith('/') ? proj.link.substring(1) : proj.link;
                        articleLink = `https://finjener.github.io/#/${cleanPath}`;
                      }
                    }

                    // Github link usually comes full, but ensure https if missing
                    const githubLink = proj.github ? (proj.github.startsWith('http') ? proj.github : `https://${proj.github}`) : null;

                    // Determine Display Title
                    let displayTitle = proj.title || proj.name;
                    if (githubLink) {
                      try {
                        const urlObj = new URL(githubLink.startsWith('http') ? githubLink : `https://${githubLink}`);
                        const pathParts = urlObj.pathname.split('/').filter(p => p);
                        // Format: repo_name
                        if (pathParts.length >= 2) {
                          displayTitle = pathParts[1]; // repo name
                        } else if (pathParts.length === 1) {
                          displayTitle = pathParts[0];
                        }
                      } catch (e) { }
                    }

                    return (
                      <View key={index} style={{ marginBottom: 2, flexDirection: 'row', alignItems: 'center' }}>
                        {/* Title (GitHub Link) */}
                        {githubLink ? (
                          <Link src={githubLink} style={{ textDecoration: 'none', flexDirection: 'row', alignItems: 'center' }}>
                            <Image src={githubIcon} style={{ width: 10, height: 10, marginRight: 4 }} />
                            <Text style={[styles.projectTitle, { color: '#000000' }]}>{displayTitle}</Text>
                          </Link>
                        ) : (
                          <Text style={styles.projectTitle}>{displayTitle}</Text>
                        )}

                        <Sep />

                        {/* Description and Article Link */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
                          <Text style={[styles.regular, styles.faded]}>{desc}</Text>

                          {/* Removed "see article section" text */}
                        </View>
                      </View>
                    );
                  });
              })()}
            </View>
          )
        }

        {/* Side Projects Section (from Hobbies) */}
        {
          (() => {
            if (!content.hobbies || !content.hobbies.categories) return null;

            // Find the category containing "Projects I am working on"
            const sideProjectsCategory = content.hobbies.categories.find(cat =>
              cat.description && cat.description.some(line =>
                line.toLowerCase().includes('projects i am working on')
              )
            );

            if (!sideProjectsCategory || !sideProjectsCategory.description) return null;

            // Extract the projects list
            // Look for lines starting with "- " after the header
            const sideProjects = [];
            let capturing = false;

            for (const line of sideProjectsCategory.description) {
              if (line.toLowerCase().includes('projects i am working on')) {
                capturing = true;
                continue;
              }
              // Stop if we hit another header or empty line that breaks the list
              if (capturing && line.startsWith('#')) {
                capturing = false;
                break;
              }

              if (capturing && line.trim().startsWith('-')) {
                sideProjects.push(line.replace(/^- /, '').trim());
              }
            }

            if (sideProjects.length === 0) return null;

            return (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Side Projects</Text>
                {sideProjects.map((project, index) => (
                  <View key={index} style={styles.bulletPoint}>
                    <Text style={styles.bulletChar}>•</Text>
                    <Text style={styles.bulletContent}>{project}</Text>
                  </View>
                ))}
              </View>
            );
          })()
        }

        {/* Skills Section */}
        {
          skills && skills.categories && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages and Technologies</Text>
              {skills.categories.map((cat, index) => (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 1, marginLeft: 8 }}>
                  <Text style={styles.skillCategory}>{cat.name}: </Text>
                  <Text style={[styles.skillList, styles.faded]}> {Array.isArray(cat.skills) ? cat.skills.join(', ') : cat.skills}</Text>
                </View>
              ))}
            </View>
          )
        }

        {/* Articles Section (Moved Here) */}
        {
          content.articles && content.articles.items && content.articles.items.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Articles</Text>
              {content.articles.items.map((article, index) => (
                <View key={index} style={{ marginBottom: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Article Title as Link */}
                    <Link src={`https://finjener.github.io/#/${article.contentPath ? article.contentPath.replace('.md', '') : ''}`} style={styles.link}>
                      <Text style={[styles.bold, { fontSize: 10 }]}>{article.title}</Text>
                    </Link>
                  </View>
                  {/* Optional Excerpt */}
                  {article.excerpt && (
                    <Text style={[styles.regular, styles.faded, { fontSize: 10, marginTop: 1 }]}>{article.excerpt}</Text>
                  )}
                </View>
              ))}
            </View>
          )
        }

        {/* Leadership / Extracurricular */}
        {
          leadership && leadership.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Volunteer Work</Text>
              {leadership.map((item, index) => (
                <View key={index} style={{ marginBottom: 1 }}>
                  <View style={styles.itemRow}>
                    <View style={styles.leftColumn}>
                      <Text style={styles.companyName}>{item.organization}</Text>
                      <Sep />
                      <Text style={styles.jobTitle}>{item.role}</Text>
                    </View>
                    <View style={styles.rightColumn}>
                      <Text style={styles.date}>{item.period}</Text>
                    </View>
                  </View>
                  {/* Simplify Leadership descriptions or hide them to save space? Keeping brief */}
                </View>
              ))}
            </View>
          )
        }

      </Page >
    </Document >
  );
};

export const generateResumePDF = (content) => {
  return <ResumeDocument content={content} />;
};

export { ResumeDocument };
export default generateResumePDF;