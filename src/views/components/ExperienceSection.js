/**
 * @fileoverview Experience section — document-style resume layout
 * @layer View
 * Uses theme2 CSS variables directly. Section header is centered.
 */

import React from 'react';
import { motion } from 'framer-motion';

const ExperienceSection = ({ data, delay = 0 }) => {
  if (!data || !data.experiences) return null;

  return (
    <motion.section
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      {/* Section Header — centered, faded to match system */}
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

      {/* Experience Entries */}
      <div>
        {data.experiences.map((experience, index) => (
          <ExperienceItem key={index} experience={experience} />
        ))}
      </div>
    </motion.section>
  );
};

const ExperienceItem = ({ experience }) => {
  const cleanPeriod = experience.period
    ? experience.period.replace(/\d{2}\./g, '').trim()
    : '';

  const descriptionLines = Array.isArray(experience.description)
    ? experience.description
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(line => line.length > 0)
    : typeof experience.description === 'string'
      ? experience.description.split('\n').map(l => l.replace(/^-\s*/, '').trim()).filter(l => l)
      : [];

  return (
    <div className="mb-6">
      {/* Row 1: Company + Date */}
      <div className="flex justify-between items-baseline">
        <h3
          style={{
            color: 'var(--t2-muted)',
            fontWeight: 700,
          }}
        >
          {experience.company}
        </h3>
        <span
          className="whitespace-nowrap ml-4"
          style={{
            color: 'var(--t2-muted)',
            fontSize: 'var(--t2-text-sm)',
          }}
        >
          {cleanPeriod}
        </span>
      </div>

      {/* Row 2: Role + Location */}
      <div className="flex justify-between items-baseline">
        <span style={{ color: 'var(--t2-muted)', fontSize: 'var(--t2-text-sm)' }}>
          {experience.title || experience.position}
        </span>
        {experience.location && experience.location.trim() && (
          <span
            className="whitespace-nowrap ml-4"
            style={{ color: 'var(--t2-muted)', fontSize: 'var(--t2-text-sm)' }}
          >
            {experience.location}
          </span>
        )}
      </div>

      {/* Description bullets */}
      {descriptionLines.length > 0 && (
        <ul className="mt-1">
          {descriptionLines.map((line, i) => (
            <li
              key={i}
              className="flex items-start"
              style={{
                color: 'var(--t2-muted)',
                fontSize: 'var(--t2-text-sm)',
                lineHeight: 1.5,
              }}
            >
              <span style={{ marginRight: '0.5rem', flexShrink: 0 }}>·</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExperienceSection;
