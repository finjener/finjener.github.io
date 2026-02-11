/**
 * @fileoverview Content controller for coordinating content loading and management
 * @author Portfolio Website
 * @created 2025
 * @layer Controller
 * @responsibilities Content loading coordination, caching management, error handling
 */

import { contentModel } from '../../models/entities/ContentModel.js';
import { getContent } from '../../data/index.js';
import { isPreviewMode } from '../../services/contentful.js';

/**
 * @class ContentController
 * @description Coordinates content loading from multiple sources and manages caching
 * Provides a unified interface for content operations across the application
 */
export class ContentController {
  constructor() {
    this.loadingStates = new Map();
    this.errorStates = new Map();
    this.contentSubscribers = new Map();
    this.retryAttempts = new Map();
    this.maxRetryAttempts = 3;
  }

  /**
   * @method loadContent
   * @description Loads content from appropriate source with caching and error handling
   * @param {boolean} usePreview - Whether to use preview mode (Contentful)
   * @param {boolean} forceRefresh - Whether to bypass cache
   * @returns {Promise<Object>} Content data object
   */
  async loadContent(usePreview = false, forceRefresh = false) {
    const cacheKey = `content_${usePreview ? 'preview' : 'production'}`;
    
    // Check cache first unless force refresh is requested
    if (!forceRefresh) {
      const cachedContent = contentModel.getCachedContent(cacheKey);
      if (cachedContent) {
        return cachedContent;
      }
    }

    // Set loading state
    this._setLoadingState(cacheKey, true);
    this._clearError(cacheKey);

    try {
      let content;
      
      if (usePreview) {
        // Try to load from Contentful
        try {
          content = await this._loadFromContentful();
        } catch (contentfulError) {
          console.warn('Contentful loading failed, falling back to local content:', contentfulError.message);
          content = await this._loadFromLocal();
        }
      } else {
        // Load from local files
        content = await this._loadFromLocal();
      }

      // Validate and transform content
      const validatedContent = this._validateAndTransformContent(content);
      
      // Cache the content
      contentModel.cacheContent(cacheKey, validatedContent);
      
      // Reset retry attempts on success
      this.retryAttempts.delete(cacheKey);
      
      // Notify subscribers
      this._notifySubscribers(cacheKey, validatedContent);
      
      return validatedContent;

    } catch (error) {
      const retryCount = this.retryAttempts.get(cacheKey) || 0;
      
      if (retryCount < this.maxRetryAttempts) {
        // Increment retry count and try again
        this.retryAttempts.set(cacheKey, retryCount + 1);
        console.warn(`Content loading failed, retrying (${retryCount + 1}/${this.maxRetryAttempts}):`, error.message);
        
        // Wait before retrying (exponential backoff)
        await this._delay(Math.pow(2, retryCount) * 1000);
        return this.loadContent(usePreview, forceRefresh);
      }
      
      // Max retries reached, set error state
      this._setError(cacheKey, error);
      
      // Try to fall back to cached content if available
      const staleContent = contentModel.getCachedContent(cacheKey);
      if (staleContent) {
        console.warn('Using stale cached content due to loading failure');
        return staleContent;
      }
      
      throw error;
    } finally {
      this._setLoadingState(cacheKey, false);
    }
  }

  /**
   * @method getContentSection
   * @description Gets a specific section of content with validation
   * @param {string} sectionName - Name of the content section
   * @param {boolean} usePreview - Whether to use preview mode
   * @returns {Promise<Object>} Section content data
   */
  async getContentSection(sectionName, usePreview = false) {
    const content = await this.loadContent(usePreview);
    
    if (!content || !content[sectionName]) {
      throw new Error(`Content section '${sectionName}' not found`);
    }

    // Validate section content
    const validation = contentModel.validateContent(content[sectionName], sectionName);
    if (!validation.isValid) {
      console.warn(`Content section '${sectionName}' validation failed:`, validation.errors);
    }

    // Transform for display
    return contentModel.transformContentForDisplay(content[sectionName], sectionName);
  }

  /**
   * @method searchContent
   * @description Searches across all content with advanced filtering
   * @param {string} query - Search query
   * @param {Object} options - Search options (sections, filters, etc.)
   * @returns {Promise<Object>} Search results organized by section
   */
  async searchContent(query, options = {}) {
    const {
      sections = ['projects', 'articles', 'experience'],
      filters = {},
      maxResults = 50
    } = options;

    const content = await this.loadContent(options.usePreview);
    const results = {};

    for (const sectionName of sections) {
      const sectionContent = content[sectionName];
      if (!sectionContent) continue;

      let searchableItems = [];

      // Extract searchable items from different content structures
      if (sectionName === 'projects' && sectionContent.categories) {
        searchableItems = sectionContent.categories.flatMap(cat => cat.projects || []);
      } else if (sectionName === 'articles' && sectionContent.items) {
        searchableItems = sectionContent.items;
      } else if (sectionName === 'experience' && sectionContent.experiences) {
        searchableItems = sectionContent.experiences;
      } else if (Array.isArray(sectionContent)) {
        searchableItems = sectionContent;
      }

      // Perform search using ContentModel
      const sectionResults = contentModel.searchContent(searchableItems, query, filters);
      
      if (sectionResults.length > 0) {
        results[sectionName] = sectionResults.slice(0, maxResults);
      }
    }

    return results;
  }

  /**
   * @method refreshContent
   * @description Refreshes content and notifies subscribers
   * @param {boolean} usePreview - Whether to use preview mode
   * @returns {Promise<Object>} Refreshed content data
   */
  async refreshContent(usePreview = false) {
    return this.loadContent(usePreview, true);
  }

  /**
   * @method subscribeToContent
   * @description Subscribes to content updates
   * @param {string} subscriberId - Unique subscriber ID
   * @param {Function} callback - Callback function for content updates
   * @param {Object} options - Subscription options
   */
  subscribeToContent(subscriberId, callback, options = {}) {
    if (!this.contentSubscribers.has(subscriberId)) {
      this.contentSubscribers.set(subscriberId, []);
    }
    
    this.contentSubscribers.get(subscriberId).push({
      callback,
      options
    });
  }

  /**
   * @method unsubscribeFromContent
   * @description Unsubscribes from content updates
   * @param {string} subscriberId - Unique subscriber ID
   */
  unsubscribeFromContent(subscriberId) {
    this.contentSubscribers.delete(subscriberId);
  }

  /**
   * @method getLoadingState
   * @description Gets current loading state for content
   * @param {boolean} usePreview - Whether checking preview mode
   * @returns {boolean} Loading state
   */
  getLoadingState(usePreview = false) {
    const cacheKey = `content_${usePreview ? 'preview' : 'production'}`;
    return this.loadingStates.get(cacheKey) || false;
  }

  /**
   * @method getErrorState
   * @description Gets current error state for content
   * @param {boolean} usePreview - Whether checking preview mode
   * @returns {Error|null} Error state
   */
  getErrorState(usePreview = false) {
    const cacheKey = `content_${usePreview ? 'preview' : 'production'}`;
    return this.errorStates.get(cacheKey) || null;
  }

  // Private methods for internal operations

  /**
   * @method _loadFromContentful
   * @private
   * @description Loads content from Contentful CMS
   */
  async _loadFromContentful() {
    const content = await getContentfulContent();
    if (!content) {
      throw new Error('No content received from Contentful');
    }
    return content;
  }

  /**
   * @method _loadFromLocal
   * @private
   * @description Loads content from local JSON files
   */
  async _loadFromLocal() {
    const content = getContent();
    if (!content) {
      throw new Error('No local content available');
    }
    return content;
  }

  /**
   * @method _validateAndTransformContent
   * @private
   * @description Validates and transforms all content sections
   */
  _validateAndTransformContent(content) {
    const validatedContent = {};
    const contentSections = Object.keys(content);

    for (const sectionName of contentSections) {
      const sectionContent = content[sectionName];
      
      // Validate section
      const validation = contentModel.validateContent(sectionContent, sectionName);
      if (!validation.isValid) {
        console.warn(`Content validation failed for ${sectionName}:`, validation.errors);
      }

      // Transform for display
      validatedContent[sectionName] = contentModel.transformContentForDisplay(
        sectionContent, 
        sectionName
      );
    }

    return validatedContent;
  }

  /**
   * @method _setLoadingState
   * @private
   * @description Sets loading state for cache key
   */
  _setLoadingState(cacheKey, isLoading) {
    this.loadingStates.set(cacheKey, isLoading);
  }

  /**
   * @method _setError
   * @private
   * @description Sets error state for cache key
   */
  _setError(cacheKey, error) {
    this.errorStates.set(cacheKey, error);
  }

  /**
   * @method _clearError
   * @private
   * @description Clears error state for cache key
   */
  _clearError(cacheKey) {
    this.errorStates.delete(cacheKey);
  }

  /**
   * @method _notifySubscribers
   * @private
   * @description Notifies all subscribers of content updates
   */
  _notifySubscribers(cacheKey, content) {
    for (const [subscriberId, subscriptions] of this.contentSubscribers.entries()) {
      for (const subscription of subscriptions) {
        try {
          subscription.callback(content, cacheKey);
        } catch (error) {
          console.error(`Error notifying subscriber ${subscriberId}:`, error);
        }
      }
    }
  }

  /**
   * @method _delay
   * @private
   * @description Creates a delay for retry logic
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const contentController = new ContentController();
export default contentController;
