/**
 * @fileoverview Skills section — compact inline tags layout
 * @layer View
 * Uses theme2 CSS variables directly. Section header is centered.
 */

import React from 'react';
import { motion } from 'framer-motion';

const SkillsSection = ({ data, delay = 0 }) => {
  if (!data || !data.categories) return null;

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

      <div className="space-y-3">
        {data.categories.map((category, index) => (
          <div key={index}>
            <h3
              className="mb-1.5"
              style={{
                color: 'var(--t2-muted)',
                fontSize: 'var(--t2-text-sm)',
                fontWeight: 600,
              }}
            >
              {category.name}
            </h3>

            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill, i) => (
                <span
                  key={i}
                  className="rounded px-2.5 py-1 transition-colors"
                  style={{
                    color: 'var(--t2-muted)',
                    fontSize: 'var(--t2-text-xs)',
                    border: '1px solid var(--t2-border)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default SkillsSection;
