/**
 * @fileoverview Projects showcase page with categorized project cards
 * @author Portfolio Website
 * @created 2024
 * @requires framer-motion
 * @requires prop-types
 * @requires ../components/MarkdownContent
 */

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getContent } from '../data/index';
import { isPreviewMode } from '../services/contentful';
import ErrorBoundary from '../components/ErrorBoundary';
import PropTypes from 'prop-types';
import MarkdownContent from '../components/MarkdownContent';

/**
 * @constant containerVariants
 * @description Animation variants for the main container
 * Implements staggered animation for child elements
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

/**
 * @constant itemVariants
 * @description Animation variants for individual project cards
 * Implements slide and fade animation
 */
const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1
  }
};

/**
 * @component ProjectCard
 * @description Minimalist project card - list-style layout
 * 
 * @param {Object} props
 * @param {Object} props.project - Project data object
 * @returns {JSX.Element} Minimal project list item
 */
const ProjectCard = ({ project }) => {
  return (
    <motion.div
      className="py-6 border-b border-edex-dark/20 last:border-b-0"
      variants={itemVariants}
    >
      {/* Title with # prefix */}
      <h3 className="text-xl font-semibold text-edex-light mb-1">
        <span className="text-edex-muted mr-1">#</span>
        {project.title}
      </h3>

      {/* Status */}
      <p className="text-sm text-edex-light/50 mb-2">
        {project.status} · {project.year}
      </p>

      {/* Description - first line only for cleaner look */}
      <p className="text-edex-light/80 mb-3 line-clamp-2">
        {typeof project.description === 'string'
          ? project.description.split('\n')[0]
          : project.description}
      </p>

      {/* Action links */}
      <div className="flex gap-4">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-edex-light/50 underline decoration-edex-light/30 hover:text-edex-light/70 transition-colors"
          >
            GitHub →
          </a>
        )}
        {project.link && (
          <a
            href={`/#${project.link}`}
            className="text-sm text-edex-light/50 underline decoration-edex-light/30 hover:text-edex-light/70 transition-colors"
          >
            Read more →
          </a>
        )}
      </div>
    </motion.div>
  );
};

/**
 * @constant ProjectCard.propTypes
 * @description PropTypes definition for ProjectCard component
 */
ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tech: PropTypes.arrayOf(PropTypes.string).isRequired,
    image: PropTypes.string,
    link: PropTypes.string.isRequired,
    highlights: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    role: PropTypes.string,
    teamSize: PropTypes.string,
    impact: PropTypes.string,
    github: PropTypes.string
  }).isRequired
};

/**
 * @component Projects
 * @description Main projects page component displaying categorized project cards
 * Features content preview mode and error boundary
 * @returns {JSX.Element} Projects page with categorized project cards
 */
const Projects = () => {
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

  // Content not ready state UI
  if (!content || !content.projects) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="cyber-spinner">Loading content...</div>
      </div>
    );
  }

  const projects = content.projects.items || [];

  return (
    <ErrorBoundary>
      <motion.div
        className="min-h-screen py-12 px-4 bg-matrix-black/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Page Title */}
        <h1 className="section-title text-center mb-16">
          <span className="inline-block overflow-hidden whitespace-nowrap animate-matrix-type">
            {content.projects.title}
            <span className="animate-blink ml-2">_</span>
          </span>
        </h1>

        {/* Projects Description */}
        {content.projects.description && (
          <div className="max-w-3xl mx-auto text-center mb-12">
            <MarkdownContent content={content.projects.description} />
          </div>
        )}

        {/* Projects List */}
        <motion.div
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </motion.div>

        {/* No Projects Message */}
        {projects.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-matrix-light">No projects available at the moment.</p>
          </div>
        )}
      </motion.div>

    </ErrorBoundary>
  );
};

export default Projects;