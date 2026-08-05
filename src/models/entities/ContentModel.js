/**
 * @fileoverview Content model for managing portfolio content data and validation
 * @author Portfolio Website
 * @created 2025
 * @layer Model
 * @responsibilities Data validation, content transformation, business rules
 */

/**
 * @class ContentModel
 * @description Handles all content-related business logic and data validation
 * Provides a clean interface for content operations across the application
 */
export class ContentModel {
  constructor() {
    this.contentCache = new Map();
    this.validationRules = this._initializeValidationRules();
  }

  /**
   * @method validateContent
   * @description Validates content structure and required fields
   * @param {Object} content - Content object to validate
   * @param {string} contentType - Type of content (home, about, projects, etc.)
   * @returns {Object} Validation result with isValid flag and errors array
   */
  validateContent(content, contentType) {
    const rules = this.validationRules[contentType];
    if (!rules) {
      return { isValid: false, errors: [`Unknown content type: ${contentType}`] };
    }

    const errors = [];

    // Check required fields
    for (const field of rules.required) {
      if (!content || !content[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate field types
    for (const [field, expectedType] of Object.entries(rules.types)) {
      if (content && content[field] && typeof content[field] !== expectedType) {
        errors.push(`Invalid type for ${field}: expected ${expectedType}, got ${typeof content[field]}`);
      }
    }

    // Custom validation rules
    if (rules.custom) {
      const customErrors = rules.custom(content);
      errors.push(...customErrors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * @method transformContentForDisplay
   * @description Transforms raw content data for UI display
   * @param {Object} content - Raw content data
   * @param {string} contentType - Type of content
   * @returns {Object} Transformed content optimized for display
   */
  transformContentForDisplay(content, contentType) {
    if (!content) return null;

    const transformers = {
      home: this._transformHomeContent,
      about: this._transformAboutContent,
      projects: this._transformProjectsContent,
      articles: this._transformArticlesContent,
      contact: this._transformContactContent
    };

    const transformer = transformers[contentType];
    return transformer ? transformer.call(this, content) : content;
  }

  /**
   * @method cacheContent
   * @description Caches content with expiration and versioning
   * @param {string} key - Cache key
   * @param {Object} content - Content to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  cacheContent(key, content, ttl = 300000) { // 5 minutes default
    const cacheEntry = {
      content,
      timestamp: Date.now(),
      ttl,
      version: this._generateContentHash(content)
    };
    this.contentCache.set(key, cacheEntry);
  }

  /**
   * @method getCachedContent
   * @description Retrieves cached content if valid
   * @param {string} key - Cache key
   * @returns {Object|null} Cached content or null if expired/missing
   */
  getCachedContent(key) {
    const entry = this.contentCache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.contentCache.delete(key);
      return null;
    }

    return entry.content;
  }

  /**
   * @method searchContent
   * @description Searches content based on query and filters
   * @param {Array} contentArray - Array of content items to search
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters to apply
   * @returns {Array} Filtered and sorted content array
   */
  searchContent(contentArray, query = '', filters = {}) {
    if (!Array.isArray(contentArray)) return [];

    let results = [...contentArray];

    // Apply text search
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ');
      results = results.filter(item => {
        const searchableText = this._extractSearchableText(item).toLowerCase();
        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        results = results.filter(item => {
          return this._matchesFilter(item, key, value);
        });
      }
    });

    return results;
  }

  // Private methods for internal operations

  /**
   * @method _initializeValidationRules
   * @private
   * @description Initializes validation rules for different content types
   * @returns {Object} Validation rules object
   */
  _initializeValidationRules() {
    return {
      home: {
        required: ['title', 'hero'],
        types: {
          title: 'string',
          hero: 'object'
        },
        custom: (content) => {
          const errors = [];
          if (content.hero && !content.hero.greeting) {
            errors.push('Hero section missing greeting');
          }
          return errors;
        }
      },
      about: {
        required: ['professionalOverview'],
        types: {
          professionalOverview: 'object'
        }
      },
      projects: {
        // NOTE: the data pipeline (src/data/index.js) flattens the raw
        // `categories` structure into `items` before this runs, so the rule
        // targets the transformed shape.
        required: ['title', 'items'],
        types: {
          title: 'string',
          items: 'object'
        }
      },
      articles: {
        required: ['title', 'items'],
        types: {
          title: 'string',
          items: 'object'
        }
      },
      contact: {
        required: ['title'],
        types: {
          title: 'string'
        }
      }
    };
  }

  /**
   * @method _transformHomeContent
   * @private
   * @description Transforms home page content for display
   */
  _transformHomeContent(content) {
    return {
      ...content,
      hero: {
        ...content.hero,
        // Add any home-specific transformations
        greetingWords: content.hero?.greeting?.split('!') || []
      }
    };
  }

  /**
   * @method _transformAboutContent
   * @private
   * @description Transforms about page content for display
   */
  _transformAboutContent(content) {
    return {
      ...content,
      // Add computed properties for about page
      sectionsCount: Object.keys(content).length - 1 // Exclude title
    };
  }

  /**
   * @method _transformProjectsContent
   * @private
   * @description Transforms projects content for display
   */
  _transformProjectsContent(content) {
    const transformed = { ...content };

    // Add computed properties for projects.
    // The data pipeline (src/data/index.js) flattens categories into items,
    // so target the flattened shape; keep the categories path as a fallback.
    if (Array.isArray(transformed.items)) {
      transformed.totalProjects = transformed.items.length;
    } else if (transformed.categories) {
      transformed.totalProjects = transformed.categories.reduce((total, category) => {
        return total + (category.projects?.length || 0);
      }, 0);
    }

    return transformed;
  }

  /**
   * @method _transformArticlesContent
   * @private
   * @description Transforms articles content for display
   */
  _transformArticlesContent(content) {
    const transformed = { ...content };
    
    if (transformed.items) {
      // Sort articles by date (newest first)
      transformed.items = [...transformed.items].sort((a, b) => {
        return new Date(b.date || 0) - new Date(a.date || 0);
      });
    }

    return transformed;
  }

  /**
   * @method _transformContactContent
   * @private
   * @description Transforms contact content for display
   */
  _transformContactContent(content) {
    return {
      ...content,
      // Add any contact-specific transformations
    };
  }

  /**
   * @method _extractSearchableText
   * @private
   * @description Extracts searchable text from content item
   */
  _extractSearchableText(item) {
    const searchableFields = ['title', 'description', 'excerpt', 'tags', 'tech'];
    return searchableFields
      .map(field => {
        const value = item[field];
        if (Array.isArray(value)) return value.join(' ');
        if (typeof value === 'string') return value;
        return '';
      })
      .join(' ');
  }

  /**
   * @method _matchesFilter
   * @private
   * @description Checks if item matches a specific filter
   */
  _matchesFilter(item, filterKey, filterValue) {
    const itemValue = item[filterKey];
    
    if (Array.isArray(itemValue)) {
      return itemValue.includes(filterValue);
    }
    
    return itemValue === filterValue;
  }

  /**
   * @method _generateContentHash
   * @private
   * @description Generates a simple hash for content versioning
   */
  _generateContentHash(content) {
    const jsonString = JSON.stringify(content);
    let hash = 0;
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }
}

// Export singleton instance
export const contentModel = new ContentModel();
export default contentModel;
