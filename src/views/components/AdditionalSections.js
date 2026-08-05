/**
 * @fileoverview Additional sections — flat, compact layout
 * @layer View
 * Uses theme2 CSS variables directly. Section headers are centered.
 */

import React from 'react';
import { motion } from 'framer-motion';

const AdditionalSections = ({
  hobbies,
  certifications,
  publications,
  languages,
  awards,
  volunteering,
  delay = 0
}) => (
  <>
    {certifications && <CertificationsSection data={certifications} delay={delay} />}
    {publications && <PublicationsSection data={publications} delay={delay + 0.1} />}
    {languages && <LanguagesSection data={languages} delay={delay + 0.2} />}
    {awards && <AwardsSection data={awards} delay={delay + 0.3} />}
      {volunteering && <VolunteeringSection data={volunteering} delay={delay + 0.4} />}
      {hobbies && <HobbiesSection data={hobbies} delay={delay + 0.5} />}
  </>
);

/** Reusable section header — centered, no underline, no fontFamily override */
const SectionHeader = ({ children }) => (
  <h2
    className="mb-4"
    style={{
      color: 'var(--t2-muted)',
      fontSize: 'var(--t2-text-xl)',
      fontWeight: 600,
      textAlign: 'center',
    }}
  >
    {children}
  </h2>
);

/** Certifications/Events — bullet prefix, issuer name is the link */
const CertificationsSection = ({ data, delay }) => {
  if (!data?.certifications?.length) return null;

  return (
    <motion.section
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <SectionHeader>{data.title || 'Events & Certifications'}</SectionHeader>
      <div className="space-y-1.5">
        {data.certifications.map((cert, index) => (
          <div key={index} className="flex items-baseline">
            <span style={{ marginRight: '0.5rem', flexShrink: 0, color: 'var(--t2-muted)' }}>·</span>
            <span>
              <span style={{ color: 'var(--t2-muted)', fontWeight: 600 }}>
                {cert.name}
              </span>
              <span style={{ color: 'var(--t2-muted)', fontSize: 'var(--t2-text-sm)' }}>
                ,{' '}
                {cert.link ? (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--t2-muted)',
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                      textDecorationColor: 'var(--t2-border)',
                    }}
                  >
                    {cert.issuer}
                  </a>
                ) : (
                  cert.issuer
                )}
              </span>
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

/** Publications — bullet prefix, title is the link, meta in faded text */
const PublicationsSection = ({ data, delay }) => {
  if (!data?.publications?.length) return null;

  return (
    <motion.section
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <SectionHeader>{data.title || 'Publications'}</SectionHeader>
      <div className="space-y-1.5">
        {data.publications.map((pub, index) => (
          <div key={index} className="flex items-baseline">
            <span style={{ marginRight: '0.5rem', flexShrink: 0, color: 'var(--t2-muted)' }}>·</span>
            <span>
              {pub.link ? (
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--t2-muted)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    textDecorationColor: 'var(--t2-border)',
                  }}
                >
                  {pub.title}
                </a>
              ) : (
                <span style={{ color: 'var(--t2-muted)', fontWeight: 600 }}>
                  {pub.title}
                </span>
              )}
              <span style={{ color: 'var(--t2-muted)', fontSize: 'var(--t2-text-sm)' }}>
                {' '}
                {[pub.type, pub.platform, pub.date].filter(Boolean).join(' · ')}
              </span>
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

/** Awards — bullet prefix, award name bold, issuer + date faded */
const AwardsSection = ({ data, delay }) => {
  if (!data?.awards?.length) return null;

  return (
    <motion.section
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <SectionHeader>{data.title || 'Awards & Recognition'}</SectionHeader>
      <div className="space-y-1.5">
        {data.awards.map((award, index) => (
          <div key={index} className="flex items-baseline">
            <span style={{ marginRight: '0.5rem', flexShrink: 0, color: 'var(--t2-muted)' }}>·</span>
            <span>
              {award.link ? (
                <a
                  href={award.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--t2-muted)',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    textDecorationColor: 'var(--t2-border)',
                  }}
                >
                  {award.title}
                </a>
              ) : (
                <span style={{ color: 'var(--t2-muted)', fontWeight: 600 }}>
                  {award.title}
                </span>
              )}
              <span style={{ color: 'var(--t2-muted)', fontSize: 'var(--t2-text-sm)' }}>
                {award.issuer && `, ${award.issuer}`}
                {award.date && ` (${award.date})`}
              </span>
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

/** Languages — inline */
const LanguagesSection = ({ data, delay }) => {
  if (!data?.languages?.length) return null;

  return (
    <motion.section
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <SectionHeader>{data.title || 'Languages'}</SectionHeader>
      <p style={{ color: 'var(--t2-muted)', fontSize: 'var(--t2-text-sm)' }}>
        {data.languages.map((lang, i) => {
          const info = lang.certificates?.length
            ? ` (${lang.certificates[0].score})`
            : lang.level ? ` (${lang.level})` : '';
          return (
            <span key={i}>
              {lang.name}{info}
              {i < data.languages.length - 1 && (
                <span style={{ margin: '0 0.5rem', opacity: 0.4 }}>·</span>
              )}
            </span>
          );
        })}
      </p>
    </motion.section>
  );
};

/** Volunteering — bullet prefix format: · Role, Description */
const VolunteeringSection = ({ data, delay }) => {
  if (!data?.activities?.length) return null;

  return (
    <motion.section
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <SectionHeader>{data.title || 'Volunteering'}</SectionHeader>
      <div className="space-y-2">
        {data.activities.map((vol, index) => {
          const desc = Array.isArray(vol.description)
            ? vol.description.map(l => l.trim()).filter(l => l.length > 0).join(' ')
            : vol.description || '';

          return (
            <div key={index} className="flex items-baseline">
              <span style={{ marginRight: '0.5rem', flexShrink: 0, color: 'var(--t2-muted)' }}>·</span>
              <span>
                <span style={{ color: 'var(--t2-muted)', fontWeight: 600 }}>
                  {vol.role}
                </span>
                {desc && (
                  <span style={{ color: 'var(--t2-muted)', fontSize: 'var(--t2-text-sm)' }}>
                    , {desc}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

/** Hobbies — grouped from markdown */
const HobbiesSection = ({ data, delay }) => {
  if (!data?.categories?.length) return null;

  return (
    <motion.section
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      {data.categories.map((category, catIndex) => {
        const items = [];
        let currentHeader = null;

        if (Array.isArray(category.description)) {
          category.description.forEach(line => {
            const trimmed = line.trim();
            if (trimmed === '' || trimmed === '>' || trimmed === '> ') return;
            if (trimmed.startsWith('##')) {
              currentHeader = trimmed.replace(/^#+\s*/, '').trim();
            } else if (trimmed.startsWith('-')) {
              const cleaned = trimmed.replace(/^-\s*/, '').trim();
              if (cleaned) {
                items.push({ header: currentHeader, text: cleaned });
                currentHeader = null;
              }
            }
          });
        }

        if (items.length === 0) return null;

        // Group items by header
        const groups = [];
        let currentGroup = null;
        items.forEach(item => {
          if (item.header) {
            currentGroup = { header: item.header, items: [item.text] };
            groups.push(currentGroup);
          } else if (currentGroup) {
            currentGroup.items.push(item.text);
          } else {
            currentGroup = { header: null, items: [item.text] };
            groups.push(currentGroup);
          }
        });

        return groups.map((group, gIndex) => (
          <div key={`${catIndex}-${gIndex}`} className="mb-6">
            {group.header && <SectionHeader>{group.header}</SectionHeader>}
            <ul className="space-y-0.5">
              {group.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start"
                  style={{ color: 'var(--t2-muted)', fontSize: 'var(--t2-text-sm)', lineHeight: 1.5 }}
                >
                  <span style={{ marginRight: '0.5rem', flexShrink: 0 }}>·</span>
                  <span>
                    {item.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={index}>{part.slice(2, -2)}</strong>;
                      }
                      return <span key={index}>{part}</span>;
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ));
      })}
    </motion.section>
  );
};

export default AdditionalSections;
