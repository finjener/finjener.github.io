/**
 * @fileoverview Contact page with dynamic form and social links
 * @author Portfolio Website
 * @created 2024
 * @requires framer-motion
 * @requires ../services/contentful
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getContent } from '../data/index';
import { isPreviewMode } from '../services/contentful';

/**
 * @component Contact
 * @description Contact page component with dynamic form fields and social media links
 * Features animated transitions and preview mode support
 * @returns {JSX.Element} Contact page with form and social links
 */
const Contact = () => {
  // State Management
  const [content, setContent] = useState(null);        // Content data
  const [loading, setLoading] = useState(true);        // Loading state
  const [error, setError] = useState(null);            // Error state
  const [preview] = useState(isPreviewMode()); // Preview mode

  /**
   * @effect Content Loading
   * @description Fetches content data when component mounts or preview mode changes
   */
  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await getContent(preview);
        setContent(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [preview]);

  // Loading state UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="cyber-spinner">Loading...</div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="error-text">Error loading content: {error.message}</div>
      </div>
    );
  }

  // Extract contact section from content
  const { contact } = content || {};

  // Content not ready state UI
  if (!content || !contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="cyber-spinner">Loading content...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="py-12 max-w-2xl mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Header */}
      <h1 className="section-title text-center mb-4">{contact.title}</h1>
      <p className="text-center text-matrix-light mb-8">{contact.description}</p>

      {/* Add Mailto Button */}
      <div className="text-center mb-12">
        <a
          href={`mailto:${content.resumeContact?.email || 'fallback@example.com'}`}
          className="themed-button inline-block px-8 py-3"
          aria-label="Contact Me via Email"
        >
          Contact Me
        </a>
      </div>

      {/* Social Links Section */}
      <div className="mt-12 text-center">
        <h2 className="text-xl mb-4 animate-glow">{contact.socialLinks.title}</h2>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {contact.socialLinks.platforms.map((platform, index) => (
            <a
              key={index}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="themed-button px-3 sm:px-4 md:px-6 py-2 sm:py-3 
                         text-xs sm:text-sm md:text-base
                         min-w-[80px] sm:min-w-[100px] md:min-w-[120px]
                         text-center inline-flex items-center justify-center
                         whitespace-nowrap overflow-hidden"
              aria-label={`Visit ${platform.name}`}
            >
              <span className="truncate">{platform.name}</span>
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Contact; 