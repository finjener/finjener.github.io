/**
 * @fileoverview Refactored Article model for managing article data and operations
 * @author Portfolio Website
 * @created 2025
 * @layer Model
 * @responsibilities Core article validation, caching, and coordination with services
 */

import { articleSearchService } from '../services/ArticleSearchService.js';
import { articleContentProcessor } from '../services/ArticleContentProcessor.js';

/**
 * @class ArticleModel
 * @description Core article model that coordinates with specialized services
 * Provides a clean interface for article operations while delegating complex tasks to services
 */
export class ArticleModel {
  constructor() {
    this.contentCache = new Map();
    this.searchService = articleSearchService;
    this.contentProcessor = articleContentProcessor;
    this.requiredFields = ['title', 'slug', 'category', 'date'];
  }

  /**
   * @method validateArticle
   * @description Validates article data structure and content requirements
   * @param {Object} article - Article object to validate
   * @returns {Object} Validation result with isValid flag and errors array
   */
  validateArticle(article) {
    const errors = [];

    // Check required fields
    this.requiredFields.forEach(field => {
      if (!article || !article[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    });

    // Validate slug format
    if (article.slug && !this._isValidSlug(article.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    }

    // Validate date format
    if (article.date && !this._isValidDate(article.date)) {
      errors.push('Date must be in valid ISO format (YYYY-MM-DD)');
    }

    // Validate category
    if (article.category && typeof article.category !== 'string') {
      errors.push('Category must be a string');
    }

    // Validate tags
    if (article.tags && !Array.isArray(article.tags)) {
      errors.push('Tags must be an array');
    }

    // Validate read time
    if (article.readTime && !this._isValidReadTime(article.readTime)) {
      errors.push('Read time must be in format "X min read"');
    }

    // Validate content path
    if (article.contentPath && !this._isValidContentPath(article.contentPath)) {
      errors.push('Content path must be a valid file path with supported extension');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * @method processArticleContent
   * @description Process article content using the content processor service
   * @param {string} content - Raw article content
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Processed article with content and metadata
   */
  processArticleContent(content, metadata = {}) {
    return this.contentProcessor.processArticleContent(content, metadata);
  }

  /**
   * @method searchArticles
   * @description Search articles using the search service
   * @param {Array} articles - Array of articles to search
   * @param {string} query - Search query string
   * @param {Object} filters - Filter options
   * @returns {Array} Filtered and sorted articles
   */
  searchArticles(articles, query = '', filters = {}) {
    return this.searchService.searchArticles(articles, query, filters);
  }

  /**
   * @method sortArticles
   * @description Sort articles using the search service
   * @param {Array} articles - Array of articles to sort
   * @param {string} sortBy - Sort criteria (date, title, readTime, category)
   * @param {string} order - Sort order (asc, desc)
   * @returns {Array} Sorted articles
   */
  sortArticles(articles, sortBy = 'date', order = 'desc') {
    return this.searchService.sortArticles(articles, sortBy, order);
  }

  /**
   * @method getArticleStatistics
   * @description Get article statistics using the search service
   * @param {Array} articles - Array of articles to analyze
   * @returns {Object} Statistics object with various metrics
   */
  getArticleStatistics(articles) {
    return this.searchService.getArticleStatistics(articles);
  }

  /**
   * @method transformContent
   * @description Transform article content for different formats
   * @param {Object} article - Article to transform
   * @param {string} format - Target format
   * @returns {string} Transformed content
   */
  transformContent(article, format = 'html') {
    return this.contentProcessor.transformContent(article, format);
  }

  /**
   * @method cacheArticle
   * @description Cache article data for performance
   * @param {string} key - Cache key
   * @param {Object} article - Article to cache
   */
  cacheArticle(key, article) {
    this.contentCache.set(key, {
      data: article,
      timestamp: Date.now()
    });
  }

  /**
   * @method getCachedArticle
   * @description Retrieve cached article data
   * @param {string} key - Cache key
   * @param {number} maxAge - Maximum cache age in milliseconds (default: 5 minutes)
   * @returns {Object|null} Cached article or null if not found/expired
   */
  getCachedArticle(key, maxAge = 300000) {
    const cached = this.contentCache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > maxAge;
    if (isExpired) {
      this.contentCache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * @method clearCache
   * @description Clear article cache
   */
  clearCache() {
    this.contentCache.clear();
  }

  /**
   * @method validateAndProcessArticle
   * @description Validate and process article in one operation
   * @param {Object} rawArticle - Raw article data
   * @param {string} content - Article content
   * @returns {Object} Validation and processing result
   */
  validateAndProcessArticle(rawArticle, content = '') {
    // First validate the article structure
    const validation = this.validateArticle(rawArticle);
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors,
        article: null
      };
    }

    try {
      // Process content if provided
      let processedContent = null;
      if (content) {
        processedContent = this.processArticleContent(content, rawArticle);
      }

      // Combine article data with processed content
      const processedArticle = {
        ...rawArticle,
        ...processedContent
      };

      return {
        success: true,
        errors: [],
        article: processedArticle
      };
    } catch (error) {
      return {
        success: false,
        errors: [`Content processing failed: ${error.message}`],
        article: null
      };
    }
  }

  /**
   * @method getSearchSuggestions
   * @description Get search suggestions for articles
   * @param {Array} articles - Articles to analyze
   * @param {number} limit - Maximum suggestions
   * @returns {Array} Search suggestions
   */
  getSearchSuggestions(articles, limit = 10) {
    return this.searchService.getSuggestedSearchTerms(articles, limit);
  }

  // Private validation methods
  _isValidSlug(slug) {
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugPattern.test(slug);
  }

  _isValidDate(date) {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  }

  _isValidReadTime(readTime) {
    const readTimePattern = /^\d+\s+(min|minute|minutes)\s+read$/i;
    return readTimePattern.test(readTime);
  }

  _isValidContentPath(contentPath) {
    const extension = contentPath.split('.').pop()?.toLowerCase();
    return this.contentProcessor.supportedFormats.includes(extension);
  }
}

// Export singleton instance
export const articleModel = new ArticleModel();
export default articleModel;