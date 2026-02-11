/**
 * @fileoverview Education section — compact resume-style layout
 * @layer View
 * Uses theme2 CSS variables directly. Section header is centered.
 */

import React from 'react';
import { motion } from 'framer-motion';

const EducationSection = ({ data, delay = 0 }) => {
  if (!data || !data.education) return null;

  return (
    <motion.section
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <h2
        className="mb-4"
        style={{
          color: 'var(--t2-muted)',
          fontSize: 'var(--t2-text-xl)',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {data.title}
      </h2>

      <div className="space-y-4">
        {data.education.map((edu, index) => (
          <EducationItem key={index} education={edu} />
        ))}
      </div>
    </motion.section>
  );
};

const EducationItem = ({ education }) => {
  const periodParts = education.period ? education.period.split(' ') : [];
  const cleanPeriod = periodParts.length >= 3
    ? `${periodParts[0]} ${periodParts[1]} ${periodParts[2]}`
    : education.period || '';

  // Extract core bullet items from description
  const focusAreas = [];
  if (Array.isArray(education.description)) {
    education.description.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') || trimmed === '' || trimmed.startsWith('http') || trimmed === ' ') return;
      if (trimmed.startsWith('-')) {
        const cleaned = trimmed.replace(/^-\s*/, '').trim();
        if (cleaned.length > 0 && cleaned.length < 80) {
          focusAreas.push(cleaned);
        }
      }
    });
  }

  return (
    <div>
      {/* Row 1: Degree + Period */}
      <div className="flex justify-between items-baseline">
        <h3
          style={{
            color: 'var(--t2-muted)',
            fontWeight: 700,
          }}
        >
          {education.degree}
        </h3>
        <span
          className="whitespace-nowrap ml-4"
          style={{ color: 'var(--t2-muted)', fontSize: 'var(--t2-text-sm)' }}
        >
          {cleanPeriod}
        </span>
      </div>

      {/* Row 2: School */}
      <p style={{ color: 'var(--t2-muted)', fontSize: 'var(--t2-text-sm)' }}>
        {education.school}
      </p>

      {/* Optional Note */}
      {education.note && (
        <div
          style={{
            color: 'var(--t2-muted)',
            fontSize: 'var(--t2-text-xs)',
            marginTop: '0.1rem',
            marginLeft: '2rem'
          }}
        >
          {education.note.includes(' project and thesis') ? (
            <>
              {education.note.split(' project and thesis')[0]}
              <div style={{ textAlign: 'right', marginTop: '0.1rem', paddingRight: '7ch' }}>
                project and thesis
              </div>
            </>
          ) : (
            education.note
          )}
        </div>
      )}

      {/* Focus areas */}
      {focusAreas.length > 0 && (
        <div className="mt-2 ml-4">
          <p
            style={{
              color: 'var(--t2-muted)',
              fontSize: 'var(--t2-text-xs)',
              fontWeight: 600,
              marginBottom: '0.25rem'
            }}
          >
            Program Focus
          </p>
          <ul className="">
            {focusAreas.slice(0, 5).map((area, i) => (
              <li
                key={i}
                className="flex items-start"
                style={{ color: 'var(--t2-muted)', fontSize: 'var(--t2-text-sm)', lineHeight: 1.5 }}
              >
                <span style={{ marginRight: '0.5rem', flexShrink: 0 }}>·</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Thesis & Project Links */}
      {
        education.thesisProjects && education.thesisProjects.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
            {education.thesisProjects.map((tp, i) => (
              <a
                key={i}
                href={tp.link}
                target={tp.link.startsWith('http') && !tp.link.includes('finjener.github.io') ? '_blank' : undefined}
                rel="noopener noreferrer"
                style={{
                  color: 'var(--t2-muted)',
                  fontSize: 'var(--t2-text-sm)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                  textDecorationColor: 'var(--t2-border)',
                }}
              >
                {tp.label}: {tp.name}
              </a>
            ))}
          </div>
        )
      }
    </div >
  );
};

export default EducationSection;
