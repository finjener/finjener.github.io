/**
 * @fileoverview Language Selector component with Tron theme and mobile support
 * @author Portfolio Website
 * @created 2025
 * @requires React, framer-motion, LanguageContext
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * @component LanguageSelector
 * @description Interactive language selector with dropdown menu and Tron-themed styling
 * Features mobile-friendly design with touch support and accessibility features
 * @returns {JSX.Element} Language selector dropdown component
 */
const LanguageSelector = ({ className = '', variant = 'default' }) => {
  const { currentLanguage, supportedLanguages, changeLanguage, t, getCurrentLanguageInfo, loading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  /**
   * @function handleLanguageChange
   * @description Handles language selection and dropdown closure
   * @param {string} languageCode - Selected language code
   */
  const handleLanguageChange = async (languageCode) => {
    if (languageCode !== currentLanguage) {
      await changeLanguage(languageCode);
    }
    setIsOpen(false);
  };

  /**
   * @function handleKeyDown
   * @description Handles keyboard navigation in dropdown
   * @param {KeyboardEvent} event - Keyboard event
   * @param {string} languageCode - Language code for Enter key
   */
  const handleKeyDown = (event, languageCode) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageChange(languageCode);
    }
  };

  const currentLangInfo = getCurrentLanguageInfo();

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -5,
      transition: {
        duration: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 }
  };

  // Variant-specific styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          button: 'px-2 py-1 text-sm',
          dropdown: 'min-w-[120px]',
          item: 'px-3 py-2 text-sm'
        };
      case 'mobile':
        return {
          button: 'px-4 py-3 text-base',
          dropdown: 'min-w-[180px]',
          item: 'px-4 py-3 text-base'
        };
      default:
        return {
          button: 'px-3 py-2 text-sm',
          dropdown: 'min-w-[160px]',
          item: 'px-4 py-2 text-sm'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Language selector button */}
      <motion.button
        ref={buttonRef}
        className={`
          relative flex items-center space-x-2 ${styles.button}
          bg-edex-dark/30 border border-edex-dark 
          text-edex-light rounded-md 
          hover:bg-edex-dark/50 hover:border-edex 
          hover:text-edex-glow transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-edex/50
          touch-target group overflow-hidden
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !loading && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !loading) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        disabled={loading}
        aria-label={t('language.select')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        whileTap={{ scale: 0.98 }}
      >
        {/* Button background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-edex/10 to-edex-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Language flag and code */}
        <span className="relative flex items-center space-x-2">
          <span className="text-lg" role="img" aria-label={currentLangInfo.name}>
            {currentLangInfo.flag}
          </span>
          <span className="font-medium uppercase tracking-wide">
            {currentLangInfo.code}
          </span>
        </span>

        {/* Dropdown arrow */}
        <motion.svg
          className="w-4 h-4 text-current"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>

        {/* Data stream effect */}
        <div className="absolute inset-0 overflow-hidden rounded-md">
          <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 data-stream" />
        </div>
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`
              absolute right-0 mt-2 ${styles.dropdown} 
              bg-edex-black/95 backdrop-blur-md 
              border border-edex-dark rounded-lg 
              shadow-lg shadow-edex-dark/20 
              overflow-hidden z-50
            `}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="listbox"
            aria-label={t('language.supported')}
          >
            {/* Dropdown header */}
            <div className="px-4 py-2 border-b border-edex-dark/30 bg-edex-dark/20">
              <p className="text-xs text-edex-light/70 font-theme-retro uppercase tracking-wider">
                {t('language.select')}
              </p>
            </div>

            {/* Language options */}
            <div className="py-1 max-h-64 overflow-y-auto">
              {supportedLanguages.map((lang, index) => (
                <motion.button
                  key={lang.code}
                  className={`
                    w-full text-left ${styles.item} 
                    flex items-center space-x-3 
                    transition-colors duration-150 
                    focus:outline-none focus:bg-edex-dark/30
                    ${currentLanguage === lang.code 
                      ? 'bg-edex-dark/40 text-edex-glow border-l-2 border-edex' 
                      : 'text-edex-light hover:bg-edex-dark/20 hover:text-edex-glow'
                    }
                  `}
                  onClick={() => handleLanguageChange(lang.code)}
                  onKeyDown={(e) => handleKeyDown(e, lang.code)}
                  role="option"
                  aria-selected={currentLanguage === lang.code}
                  tabIndex={0}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Language flag */}
                  <span className="text-lg flex-shrink-0" role="img" aria-label={lang.name}>
                    {lang.flag}
                  </span>
                  
                  {/* Language names */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {lang.nativeName}
                    </div>
                    {lang.nativeName !== lang.name && (
                      <div className="text-xs text-edex-light/60 truncate">
                        {lang.name}
                      </div>
                    )}
                  </div>

                  {/* Current language indicator */}
                  {currentLanguage === lang.code && (
                    <motion.div
                      className="w-2 h-2 bg-edex-glow rounded-full animate-pulse"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Dropdown footer */}
            <div className="px-4 py-2 border-t border-edex-dark/30 bg-edex-dark/10">
              <p className="text-xs text-edex-light/50 font-theme-retro text-center">
                {supportedLanguages.length} {t('language.supported').toLowerCase()}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-edex-black/50 backdrop-blur-sm rounded-md flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-edex-dark border-t-edex animate-spin rounded-full" />
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;