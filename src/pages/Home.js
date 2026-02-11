/**
 * @fileoverview Enhanced Home page component with improved mobile responsiveness and Tron theming
 * @author  Website
 * @created 2025
 * @updated 2025
 * @requires framer-motion
 * @requires react-router-dom
 */

import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getContent } from '../data/index';
import { isPreviewMode } from '../services/contentful';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * @component Home
 * @description Enhanced main landing page component featuring an animated hero section,
 * call-to-action buttons, and highlighted content sections with improved mobile responsiveness
 * and enhanced Tron theming. Supports Contentful preview mode for content management.
 * @returns {JSX.Element} Home page with animated content sections
 */
const Home = () => {
  // State management for content and UI states
  const [content, setContent] = useState(null);      // Stores page content
  const [loading, setLoading] = useState(true);      // Loading state
  const [error, setError] = useState(null);          // Error state
  const [preview] = useState(isPreviewMode()); // Preview mode state
  const { t } = useLanguage(); // Translation function

  /**
   * @effect Content Loading
   * @description Fetches content data when component mounts or preview mode changes
   * Updates content state and handles loading/error states
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

  /**
   * @constant containerVariants
   * @description Enhanced animation variants for the main container
   * Handles staggered animation of child elements with improved timing
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  /**
   * @constant itemVariants
   * @description Enhanced animation variants for individual content items
   * Defines entry animation with fade and slide up effect with improved easing
   */
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  /**
   * @constant highlightVariants
   * @description Animation variants for highlight cards with enhanced effects
   */
  const highlightVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20
      }
    }
  };

  // Enhanced loading state UI with Tron theme
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="cyber-spinner mx-auto"></div>
          <div className="text-edex-light font-theme-retro animate-pulse">
            {t('loading.initializing')}
          </div>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-edex rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-edex rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-edex rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state UI with Tron theme
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4 tron-border p-8 rounded-lg">
          <div className="text-6xl text-red-500 mb-4">⚠</div>
          <div className="error-text">{t('errors.systemError')}</div>
          <div className="text-edex-light font-theme-retro">
            {error.message || t('errors.loadingContent')}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="themed-button mt-4"
          >
            {t('buttons.restartSystem')}
          </button>
        </div>
      </div>
    );
  }

  // Extract home content from data
  const { home } = content || {};

  // Content not ready state UI with enhanced styling
  if (!content || !home) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="cyber-spinner mx-auto"></div>
          <div className="text-edex-light font-theme-retro animate-pulse">
            {t('loading.content')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center text-center px-responsive py-responsive"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Hero Section - Animated Title */}
      <motion.div
        className="relative mb-8 sm:mb-12"
        variants={itemVariants}
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-edex-glow/5 blur-3xl rounded-full scale-150 animate-pulse"></div>

        <motion.h1
          className="relative text-responsive-2xl font-bold animate-themed-pulse font-theme-pixel leading-tight"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <span className="text-edex-light/80 block sm:inline">
            {home.hero.greeting}
          </span>

          {/* Animated cursor */}
          <motion.span
            className="text-edex-glow ml-2"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            |
          </motion.span>
        </motion.h1>

        {/* Scanning line effect */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-edex-glow animate-scanline opacity-30"></div>
        </div>
      </motion.div>

      {/* Enhanced Hero Section - Tagline */}
      {home.hero.tagline && (
        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-2xl"
          variants={itemVariants}
        >
          {home.hero.tagline}
        </motion.p>
      )}

      {/* Enhanced Call-to-Action Buttons */}
      <motion.div
        className="flex flex-col xs:flex-row gap-4 sm:gap-6 mb-16 sm:mb-20"
        variants={itemVariants}
      >
        <Link
          to={home.hero.cta.primary.link}
          className="themed-button"
        >
          <span>{home.hero.cta.primary.text || t('buttons.viewWork')}</span>
        </Link>


      </motion.div>

      {/* Enhanced Highlights Grid Section */}
      <motion.div
        className="w-full max-w-7xl mx-auto"
        variants={itemVariants}
      >
        {/* Enhanced Highlights Title */}
        <motion.h2
          className="text-responsive-xl font-bold text-edex mb-8 sm:mb-12 font-theme-pixel relative"
          variants={itemVariants}
        >
          <span className="relative">
            {home.highlights.title || t('home.highlights.title')}

            {/* Underline effect */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-edex-glow to-transparent"></div>
          </span>
        </motion.h2>

        {/* Enhanced Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {home.highlights.items.map((highlight, index) => (
            <motion.div
              key={index}
              className="relative group"
              variants={highlightVariants}
              whileHover={{
                y: -10,
                transition: { duration: 0.3 }
              }}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              <div className="themed-card h-full relative overflow-hidden">
                {/* Background grid pattern */}
                <div className="absolute inset-0 bg-tron-grid bg-repeat opacity-10 animate-tron-grid"></div>

                {/* Circuit pattern overlay */}
                <div className="absolute inset-0 bg-circuit-pattern bg-repeat opacity-20"></div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-medium mb-3 text-edex-light/90">
                    {highlight.title}
                  </h3>
                  <p className="text-edex-light">
                    {highlight.description}
                  </p>
                </div>

                {/* Enhanced hover effects */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {/* Scanning effect */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-edex-glow animate-scanline"></div>

                  {/* Corner accents */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-edex-glow"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-edex-glow"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-edex-glow"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-edex-glow"></div>
                </div>

                {/* Data stream effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 data-stream"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home; 