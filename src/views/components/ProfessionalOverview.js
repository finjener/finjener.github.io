/**
 * @fileoverview Professional overview — single sentence intro
 * @layer View
 * Uses theme2 CSS variables directly.
 */

import React from 'react';
import { motion } from 'framer-motion';

const ProfessionalOverview = ({ data, delay = 0 }) => {
  if (!data || !data.professionalOverview) return null;

  const { professionalOverview } = data;

  const lines = Array.isArray(professionalOverview.description)
    ? professionalOverview.description.map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('#'))
    : [];

  const introLines = lines.filter(l => !l.startsWith('-'));
  const listItems = lines
    .filter(l => l.startsWith('-'))
    .map(l => l.replace(/^-\s*/, '').trim());

  // Combine into one sentence with commas
  const introText = introLines.join(' ').replace(/:\s*$/, '');
  const combined = listItems.length > 0
    ? `${introText}, ${listItems.map(s => s.charAt(0).toLowerCase() + s.slice(1)).join(', ')}.`
    : introText;

  return (
    <motion.div
      className="mb-10"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
    >
      <p style={{ color: 'var(--t2-muted)', fontSize: 'var(--t2-text-sm)' }}>
        {combined}
      </p>
    </motion.div>
  );
};

export default ProfessionalOverview;
