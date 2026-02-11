/**
 * @fileoverview Redesigned About page view — clean, document-style resume layout
 * @layer View
 * Uses theme2 CSS variables directly via inline styles.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PDFDownloadLink } from '@react-pdf/renderer';

import { contentController } from '../../controllers/index.js';
import EducationSection from '../components/EducationSection.js';
import SkillsSection from '../components/SkillsSection.js';
import ExperienceSection from '../components/ExperienceSection.js';
import AdditionalSections from '../components/AdditionalSections.js';
import ProfessionalOverview from '../components/ProfessionalOverview.js';
import { generateResumePDF } from '../../services/pdfGenerator.js';
import { isPreviewMode } from '../../services/contentful.js';

const AboutView = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preview] = useState(isPreviewMode());

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await contentController.loadContent(preview);
        setContent(data);
      } catch (err) {
        console.error('About page content loading failed:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadPageContent();
  }, [preview]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--t2-muted)' }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--t2-muted)' }}>Error loading content: {error.message}</p>
      </div>
    );
  }

  if (!content) return null;

  const {
    overview,
    education,
    experience,
    skills,
    hobbies,
    certifications,
    publications,
    languages,
    awards,
    volunteering
  } = content;

  return (
    <motion.div
      className="min-h-screen py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ maxWidth: 'var(--t2-content-max-width)', margin: '0 auto', fontFamily: 'var(--t2-font-mono)' }}>
        {/* Page Title */}
        <h1
          className="text-center mb-1"
          style={{
            color: 'var(--t2-muted)',
            fontSize: 'var(--t2-text-2xl)',
            fontWeight: 700,
          }}
        >
          About Me
        </h1>

        {/* Download Resume — simple underlined link */}
        <div className="text-center mb-8">
          <PDFDownloadLink
            document={generateResumePDF(content)}
            fileName="resume.pdf"
            style={{
              color: 'var(--t2-muted)',
              fontSize: 'var(--t2-text-sm)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            {({ loading: pdfLoading }) => (pdfLoading ? 'Generating...' : 'Download Resume')}
          </PDFDownloadLink>
        </div>

        {/* Professional Overview */}
        {overview && <ProfessionalOverview data={overview} delay={0.1} />}

        {/* Sections — compact spacing */}
        <div className="space-y-8">
          {experience && <ExperienceSection data={experience} delay={0.2} />}
          {education && <EducationSection data={education} delay={0.3} />}
          {skills && <SkillsSection data={skills} delay={0.4} />}
          <AdditionalSections
            hobbies={hobbies}
            certifications={certifications}
            publications={publications}
            languages={languages}
            awards={awards}
            volunteering={volunteering}
            delay={0.5}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AboutView;
