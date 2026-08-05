/**
 * @fileoverview Language Context for managing internationalization and translations
 * @author Portfolio Website
 * @created 2025
 * @requires React
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Preload the default language's translations so the first render has strings.
// Without this, translations start empty and any t() call before the async
// load resolves logs "Translation not found" and briefly renders the raw key.
import enCommon from '../translations/en/common.json';
import enPages from '../translations/en/pages.json';
import enContent from '../translations/en/content.json';

/**
 * @constant SUPPORTED_LANGUAGES
 * @description Array of supported languages with their metadata
 */
export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
    region: 'US'
  }
  // Russian is temporarily hidden until its translations are complete.
  // The ru/*.json files only contain placeholder template content.
];

/**
 * @constant DEFAULT_LANGUAGE
 * @description Default language code
 */
const DEFAULT_LANGUAGE = 'en';

// Merged default-language translations, used as the initial state.
const DEFAULT_TRANSLATIONS = { ...enCommon, ...enPages, ...enContent };

/**
 * @constant LANGUAGE_STORAGE_KEY
 * @description Key for storing language preference in localStorage
 */
const LANGUAGE_STORAGE_KEY = 'portfolio_language';

/**
 * @context LanguageContext
 * @description Context for managing language state and translations
 */
const LanguageContext = createContext();

/**
 * @hook useLanguage
 * @description Custom hook to access language context
 * @returns {Object} Language context value
 * @throws {Error} If used outside LanguageProvider
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

/**
 * @function detectBrowserLanguage
 * @description Detects user's browser language preference
 * @returns {string} Language code
 */
const detectBrowserLanguage = () => {
  // Check navigator languages
  const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage];
  
  for (const lang of browserLanguages) {
    // Extract language code (e.g., 'en-US' -> 'en')
    const langCode = lang.split('-')[0].toLowerCase();
    
    // Check if we support this language
    if (SUPPORTED_LANGUAGES.some(supportedLang => supportedLang.code === langCode)) {
      return langCode;
    }
  }
  
  return DEFAULT_LANGUAGE;
};

/**
 * @component LanguageProvider
 * @description Provider component for language context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Language provider wrapper
 */
export const LanguageProvider = ({ children }) => {
  // Initialize language state
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Try to get saved language from localStorage
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
      return savedLanguage;
    }
    
    // Fall back to browser detection
    return detectBrowserLanguage();
  });

  const [translations, setTranslations] = useState(DEFAULT_TRANSLATIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * @function loadTranslations
   * @description Loads translation files for the specified language
   * @param {string} languageCode - Language code to load
   */
  const loadTranslations = async (languageCode) => {
    try {
      setLoading(true);
      setError(null);

      // Import all translation files for the language
      const translationModules = await Promise.all([
        import(`../translations/${languageCode}/common.json`),
        import(`../translations/${languageCode}/pages.json`),
        import(`../translations/${languageCode}/content.json`)
      ]);

      // Merge all translation modules
      const mergedTranslations = translationModules.reduce((acc, module) => {
        return { ...acc, ...module.default };
      }, {});

      setTranslations(mergedTranslations);
    } catch (err) {
      console.warn(`Failed to load translations for ${languageCode}, falling back to English:`, err);
      setError(err);
      
      // Fall back to English if available
      if (languageCode !== DEFAULT_LANGUAGE) {
        try {
          const fallbackModules = await Promise.all([
            import(`../translations/${DEFAULT_LANGUAGE}/common.json`),
            import(`../translations/${DEFAULT_LANGUAGE}/pages.json`),
            import(`../translations/${DEFAULT_LANGUAGE}/content.json`)
          ]);

          const fallbackTranslations = fallbackModules.reduce((acc, module) => {
            return { ...acc, ...module.default };
          }, {});

          setTranslations(fallbackTranslations);
        } catch (fallbackErr) {
          console.error('Failed to load fallback translations:', fallbackErr);
          setTranslations(DEFAULT_TRANSLATIONS);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function changeLanguage
   * @description Changes the current language and loads its translations
   * @param {string} languageCode - New language code
   */
  const changeLanguage = async (languageCode) => {
    if (!SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode)) {
      console.warn(`Unsupported language: ${languageCode}`);
      return;
    }

    setCurrentLanguage(languageCode);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    
    // Update document lang attribute for accessibility
    document.documentElement.lang = languageCode;
    
    // Update document direction if needed
    const languageInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
    if (languageInfo) {
      document.documentElement.dir = languageInfo.direction;
    }

    await loadTranslations(languageCode);
  };

  /**
   * @function translate
   * @description Translates a key to the current language
   * @param {string} key - Translation key (supports dot notation)
   * @param {Object} variables - Variables to interpolate in the translation
   * @returns {string} Translated text or the key if translation not found
   */
  const translate = (key, variables = {}) => {
    // Handle dot notation (e.g., 'common.buttons.save')
    const keys = key.split('.');
    let translation = translations;

    for (const k of keys) {
      if (translation && typeof translation === 'object' && k in translation) {
        translation = translation[k];
      } else {
        // Translation not found, return the key as fallback
        console.warn(`Translation not found for key: ${key}`);
        return key;
      }
    }

    // If translation is not a string, return the key
    if (typeof translation !== 'string') {
      console.warn(`Translation for key "${key}" is not a string:`, translation);
      return key;
    }

    // Interpolate variables
    let result = translation;
    Object.entries(variables).forEach(([variable, value]) => {
      result = result.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    });

    return result;
  };

  /**
   * @function getCurrentLanguageInfo
   * @description Gets detailed information about the current language
   * @returns {Object} Current language information
   */
  const getCurrentLanguageInfo = () => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  };

  /**
   * @function formatDate
   * @description Formats a date according to the current language's locale
   * @param {Date|string} date - Date to format
   * @param {Object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date
   */
  const formatDate = (date, options = {}) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    const languageInfo = getCurrentLanguageInfo();
    const locale = `${languageInfo.code}-${languageInfo.region}`;
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(dateObj);
  };

  /**
   * @function formatNumber
   * @description Formats a number according to the current language's locale
   * @param {number} number - Number to format
   * @param {Object} options - Intl.NumberFormat options
   * @returns {string} Formatted number
   */
  const formatNumber = (number, options = {}) => {
    const languageInfo = getCurrentLanguageInfo();
    const locale = `${languageInfo.code}-${languageInfo.region}`;
    
    return new Intl.NumberFormat(locale, options).format(number);
  };

  // Load translations on mount and language change
  useEffect(() => {
    loadTranslations(currentLanguage);
  }, [currentLanguage]);

  // Set initial document attributes
  useEffect(() => {
    const languageInfo = getCurrentLanguageInfo();
    document.documentElement.lang = languageInfo.code;
    document.documentElement.dir = languageInfo.direction;
  }, [currentLanguage]);

  const contextValue = {
    currentLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
    translations,
    loading,
    error,
    changeLanguage,
    translate,
    t: translate, // Short alias for translate
    getCurrentLanguageInfo,
    formatDate,
    formatNumber,
    isRTL: getCurrentLanguageInfo().direction === 'rtl'
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;