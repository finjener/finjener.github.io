/**
 * @fileoverview Articles listing page with grid layout
 * @author Portfolio Website
 * @created 2024
 * @requires framer-motion
 * @requires react-router-dom
 */

import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getContent } from '../data/index';
import { isPreviewMode } from '../services/contentful';
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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

/**
 * @component ArticleCard
 * @description Minimalist article list item
 * 
 * @param {Object} props
 * @param {Object} props.article - Article data object
 * @returns {JSX.Element} Minimal article list item
 */
const ArticleCard = memo(({ article }) => (
  <motion.div
    className="py-6 border-b border-edex-dark/20 last:border-b-0"
    variants={itemVariants}
  >
    {/* Title with # prefix */}
    <Link to={`/articles/${article.slug}`} className="block group">
      <h3 className="text-xl font-semibold text-edex-light mb-1 group-hover:text-edex transition-colors">
        <span className="text-edex-muted mr-1">#</span>
        {article.title}
      </h3>
    </Link>

    {/* Meta: read time */}
    <p className="text-sm text-edex-light/50 mb-2">
      {article.readTime}
    </p>

    {/* Excerpt */}
    <p className="text-edex-light/80 mb-3 line-clamp-2">
      {article.excerpt}
    </p>

    {/* Read more link */}
    <Link
      to={`/articles/${article.slug}`}
      className="text-sm text-edex-light/50 underline decoration-edex-light/30 hover:text-edex-light/70 transition-colors"
    >
      Read more →
    </Link>
  </motion.div>
));

/**
 * @component ArticleListingPage
 * @description Main articles listing page component
 * Features grid layout and preview mode support
 * @returns {JSX.Element} Articles listing page with grid layout
 */
const ArticleListingPage = () => {
  // State management
  const [content, setContent] = useState(null);           // Content data
  const [loading, setLoading] = useState(true);          // Loading state
  const [error, setError] = useState(null);              // Error state
  const [preview] = useState(isPreviewMode());           // Preview mode

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
  if (loading || !content?.articles?.items) {
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

  // Get articles from content
  const articles = content.articles || { items: [] };

  return (
    <motion.div
      className="min-h-screen py-12 px-4 bg-edex-black/20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <h1 className="section-title text-center mb-16">
          <span className="inline-block overflow-hidden whitespace-nowrap animate-themed-type">
            {articles.title}
            <span className="animate-blink ml-2">_</span>
          </span>
        </h1>

        {/* Articles Description */}
        {articles.description && (
          <motion.div
            className="max-w-3xl mx-auto text-center mb-12"
            variants={itemVariants}
          >
            <MarkdownContent content={articles.description} />
          </motion.div>
        )}

        {/* Articles List */}
        <motion.div
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {articles.items.map((article) => (
            <ArticleCard key={article.id || article.slug} article={article} />
          ))}
        </motion.div>

        {/* No Articles Message */}
        {articles.items.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-edex-light">No articles available.</p>
          </div>
        )}
      </div>

    </motion.div>
  );
};

export default ArticleListingPage; 