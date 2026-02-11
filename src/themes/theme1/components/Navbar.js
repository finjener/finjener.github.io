/**
 * @fileoverview Enhanced navigation bar component with responsive design and Tron theme
 * @author Website
 * @created 2024
 * @updated 2025
 * @requires framer-motion
 */

// Import dependencies for routing, state management, and animations
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { useLanguage } from '../../../contexts/LanguageContext';

/**
 * @component Navbar
 * @description Enhanced responsive navigation bar with mobile menu support and Tron-themed styling
 * Features desktop and mobile layouts with smooth animations, active states, and improved accessibility
 * @returns {JSX.Element} Navigation bar with responsive menu
 */
const Navbar = () => {
  // State for mobile menu toggle and active route tracking
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  /**
   * @constant navItems
   * @description Array of navigation items with their routes and display information
   * @type {Array<{name: string, path: string, shortName?: string}>}
   */
  const navItems = [
    { name: t('navigation.home'), path: '/', shortName: t('navigation.home') },
    { name: t('navigation.about'), path: '/about', shortName: t('navigation.about') },
    { name: t('navigation.projects'), path: '/projects', shortName: t('navigation.projects') },
    { name: t('navigation.articles'), path: '/articles', shortName: t('navigation.articles') },
    { name: t('navigation.contact'), path: '/contact', shortName: t('navigation.contact') },
  ];

  /**
   * @function isActiveRoute
   * @description Determines if a route is currently active
   * @param {string} path - The route path to check
   * @returns {boolean} Whether the route is active
   */
  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Main navigation container with enhanced Tron theme styling */}
      <motion.nav
        className={`fixed w-full backdrop-blur-md border-b transition-all duration-300 py-3 z-50 ${scrolled
            ? 'bg-edex-black/90 border-edex-dark shadow-lg shadow-edex-dark/20'
            : 'bg-edex-black/60 border-edex-dark/50'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation bar header with logo and menu */}
          <div className="flex justify-between items-center h-14">
            {/* Enhanced Logo/Brand link with animations */}
            <Link
              to="/"
              className="relative group"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl sm:text-2xl font-bold font-theme-pixel">
                  <span className="text-edex-glow animate-glow">[</span>
                  <span className="text-edex-light">fs_</span>
                  <span className="text-edex-glow animate-glow">]</span>
                </span>
                {/* Animated underline */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-edex to-edex-glow"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation Menu - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base font-medium transition-all duration-200 group ${isActiveRoute(item.path)
                      ? 'text-edex-glow bg-edex-dark/30'
                      : 'text-edex-light hover:text-edex-glow hover:bg-edex-dark/20'
                    }`}
                >
                  <span className="relative z-10">{item.name}</span>

                  {/* Active indicator */}
                  {isActiveRoute(item.path) && (
                    <motion.div
                      className="absolute inset-0 bg-edex-dark/20 border border-edex rounded-md"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-edex-dark/10 to-edex/10" />

                  {/* Data stream effect */}
                  <div className="absolute inset-0 rounded-md overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 data-stream" />
                  </div>
                </Link>
              ))}


            </div>

            {/* Enhanced Mobile Menu Toggle Button */}
            <motion.button
              className="md:hidden relative p-2 text-edex-light hover:text-edex-glow transition-colors duration-200 touch-target"
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
              aria-expanded={isOpen}
            >
              <div className="w-6 h-6 relative">
                <motion.span
                  className="absolute top-0 left-0 w-full h-0.5 bg-current transform origin-center transition-all duration-200"
                  animate={isOpen ? { rotate: 45, y: 11 } : { rotate: 0, y: 0 }}
                />
                <motion.span
                  className="absolute top-2.5 left-0 w-full h-0.5 bg-current transition-all duration-200"
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                />
                <motion.span
                  className="absolute top-5 left-0 w-full h-0.5 bg-current transform origin-center transition-all duration-200"
                  animate={isOpen ? { rotate: -45, y: -11 } : { rotate: 0, y: 0 }}
                />
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-edex-glow/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Enhanced Mobile Navigation Menu - Full screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-edex-black/90 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile menu content */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-edex-black/95 backdrop-blur-md border-l border-edex-dark z-50 md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Mobile menu header */}
              <div className="flex items-center justify-between p-6 border-b border-edex-dark/50">
                <span className="text-lg font-bold text-edex-glow font-theme-pixel">{t('navigation.menu')}</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-edex-light hover:text-edex-glow transition-colors touch-target"
                  aria-label={t('navigation.close')}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile navigation items */}
              <nav className="p-6">
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className={`relative block py-4 px-4 rounded-lg text-lg font-medium transition-all duration-200 group ${isActiveRoute(item.path)
                            ? 'text-edex-glow bg-edex-dark/40 border border-edex/30'
                            : 'text-edex-light hover:text-edex-glow hover:bg-edex-dark/20'
                          }`}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="relative z-10">{item.name}</span>
                          {isActiveRoute(item.path) && (
                            <span className="text-xs text-edex animate-pulse">●</span>
                          )}
                        </div>

                        {/* Enhanced hover effect */}
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 tron-border" />

                        {/* Data stream effect for mobile */}
                        <div className="absolute inset-0 rounded-lg overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 hologram" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>



                {/* Mobile menu footer with additional info */}
                <motion.div
                  className="mt-6 pt-4 border-t border-edex-dark/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center">
                    <p className="text-sm text-edex-light/60 font-theme-retro">
                      {t('navigation.systemStatus')}: <span className="text-edex-glow animate-pulse">{t('navigation.online')}</span>
                    </p>
                    <div className="mt-2 flex justify-center">
                      <div className="w-2 h-2 bg-edex-glow rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 