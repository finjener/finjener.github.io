/**
 * @fileoverview Article search and filtering service
 * @author Portfolio Website
 * @created 2025
 * @layer Model/Service
 * @responsibilities Article searching, filtering, sorting, and statistics
 */

/**
 * @class ArticleSearchService
 * @description Handles all article search, filtering, and sorting operations
 * Provides advanced search capabilities with multiple filter options
 */
export class ArticleSearchService {
  constructor() {
    this.searchWeights = {
      title: 3,
      category: 2,
      tags: 2,
      excerpt: 1.5,
      content: 1
    };
    this.minSearchScore = 0.1;
  }

  /**
   * Search articles with query and filters
   * @param {Array} articles - Articles to search through
   * @param {string} query - Search query string
   * @param {Object} filters - Filter options
   * @returns {Array} Filtered and sorted articles with search scores
   */
  searchArticles(articles, query = '', filters = {}) {
    if (!Array.isArray(articles)) return [];

    let results = [...articles];

    // Apply filters first
    results = this._applyFilters(results, filters);

    // Apply search query if provided
    if (query.trim()) {
      results = this._applySearchQuery(results, query);
    }

    return results;
  }

  /**
   * Sort articles by specified criteria
   * @param {Array} articles - Articles to sort
   * @param {string} sortBy - Sort criteria (date, title, readTime, category)
   * @param {string} order - Sort order (asc, desc)
   * @returns {Array} Sorted articles
   */
  sortArticles(articles, sortBy = 'date', order = 'desc') {
    if (!Array.isArray(articles)) return [];

    const sorted = [...articles];
    const compareFunction = this._getCompareFunction(sortBy, order);
    return sorted.sort(compareFunction);
  }

  /**
   * Get article statistics and analytics
   * @param {Array} articles - Articles to analyze
   * @returns {Object} Statistics object with various metrics
   */
  getArticleStatistics(articles) {
    if (!Array.isArray(articles)) return this._getEmptyStatistics();

    const stats = {
      totalArticles: articles.length,
      categoryDistribution: new Map(),
      tagFrequency: new Map(),
      yearDistribution: new Map(),
      monthDistribution: new Map(),
      averageReadTime: 0,
      totalReadTime: 0,
      publishingTrends: new Map(),
      mostPopularTags: [],
      articlesPerCategory: new Map()
    };

    let totalReadTimeMinutes = 0;

    articles.forEach(article => {
      // Category distribution
      if (article.category) {
        const categoryCount = stats.categoryDistribution.get(article.category) || 0;
        stats.categoryDistribution.set(article.category, categoryCount + 1);
      }

      // Tag frequency
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach(tag => {
          const tagCount = stats.tagFrequency.get(tag) || 0;
          stats.tagFrequency.set(tag, tagCount + 1);
        });
      }

      // Date-based distributions
      if (article.date) {
        const articleDate = new Date(article.date);
        const year = articleDate.getFullYear();
        const month = articleDate.getMonth();

        // Year distribution
        const yearCount = stats.yearDistribution.get(year) || 0;
        stats.yearDistribution.set(year, yearCount + 1);

        // Month distribution (0-11, where 0 is January)
        const monthCount = stats.monthDistribution.get(month) || 0;
        stats.monthDistribution.set(month, monthCount + 1);
      }

      // Read time analysis
      const readTimeMinutes = this._extractReadTimeMinutes(article.readTime);
      if (readTimeMinutes > 0) {
        totalReadTimeMinutes += readTimeMinutes;
      }
    });

    // Calculate averages and derived statistics
    stats.totalReadTime = totalReadTimeMinutes;
    stats.averageReadTime = articles.length > 0 ? totalReadTimeMinutes / articles.length : 0;

    // Convert Maps to sorted arrays for easier consumption
    stats.mostPopularTags = Array.from(stats.tagFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    stats.articlesPerCategory = Array.from(stats.categoryDistribution.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({ category, count }));

    return stats;
  }

  /**
   * Get suggested search terms based on article content
   * @param {Array} articles - Articles to analyze
   * @param {number} limit - Maximum number of suggestions
   * @returns {Array} Array of suggested search terms
   */
  getSuggestedSearchTerms(articles, limit = 10) {
    if (!Array.isArray(articles)) return [];

    const termFrequency = new Map();

    articles.forEach(article => {
      // Extract terms from title
      if (article.title) {
        this._extractTerms(article.title).forEach(term => {
          const count = termFrequency.get(term) || 0;
          termFrequency.set(term, count + 2); // Higher weight for title terms
        });
      }

      // Extract terms from tags
      if (article.tags) {
        article.tags.forEach(tag => {
          const count = termFrequency.get(tag.toLowerCase()) || 0;
          termFrequency.set(tag.toLowerCase(), count + 3); // Highest weight for tags
        });
      }

      // Extract terms from category
      if (article.category) {
        const count = termFrequency.get(article.category.toLowerCase()) || 0;
        termFrequency.set(article.category.toLowerCase(), count + 2);
      }
    });

    return Array.from(termFrequency.entries())
      .filter(([term, count]) => count > 1 && term.length > 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([term]) => term);
  }

  /**
   * Apply filters to articles array
   * @param {Array} articles - Articles to filter
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered articles
   * @private
   */
  _applyFilters(articles, filters) {
    let results = articles;

    // Category filter
    if (filters.category) {
      results = results.filter(article => article.category === filters.category);
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(article => 
        article.tags && filters.tags.some(tag => article.tags.includes(tag))
      );
    }

    // Date range filters
    if (filters.dateFrom) {
      results = results.filter(article => 
        new Date(article.date) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      results = results.filter(article => 
        new Date(article.date) <= new Date(filters.dateTo)
      );
    }

    // Read time filter
    if (filters.readTimeMax) {
      results = results.filter(article => {
        const readTime = this._extractReadTimeMinutes(article.readTime);
        return readTime <= filters.readTimeMax;
      });
    }

    if (filters.readTimeMin) {
      results = results.filter(article => {
        const readTime = this._extractReadTimeMinutes(article.readTime);
        return readTime >= filters.readTimeMin;
      });
    }

    return results;
  }

  /**
   * Apply search query to articles
   * @param {Array} articles - Articles to search
   * @param {string} query - Search query
   * @returns {Array} Articles with search scores
   * @private
   */
  _applySearchQuery(articles, query) {
    const searchTerms = this._extractTerms(query);
    
    return articles
      .map(article => ({
        ...article,
        searchScore: this._calculateSearchScore(article, searchTerms)
      }))
      .filter(article => article.searchScore > this.minSearchScore)
      .sort((a, b) => b.searchScore - a.searchScore);
  }

  /**
   * Calculate search score for an article
   * @param {Object} article - Article to score
   * @param {Array} searchTerms - Search terms
   * @returns {number} Search score
   * @private
   */
  _calculateSearchScore(article, searchTerms) {
    let score = 0;

    searchTerms.forEach(term => {
      const termLower = term.toLowerCase();

      // Title matching
      if (article.title && article.title.toLowerCase().includes(termLower)) {
        score += this.searchWeights.title;
        // Bonus for exact word match
        if (this._isExactWordMatch(article.title, term)) {
          score += this.searchWeights.title * 0.5;
        }
      }

      // Category matching
      if (article.category && article.category.toLowerCase().includes(termLower)) {
        score += this.searchWeights.category;
      }

      // Tags matching
      if (article.tags) {
        article.tags.forEach(tag => {
          if (tag.toLowerCase().includes(termLower)) {
            score += this.searchWeights.tags;
          }
        });
      }

      // Excerpt matching
      if (article.excerpt && article.excerpt.toLowerCase().includes(termLower)) {
        score += this.searchWeights.excerpt;
      }

      // Content matching (if available)
      if (article.content && article.content.toLowerCase().includes(termLower)) {
        score += this.searchWeights.content;
      }
    });

    // Normalize score by number of search terms
    return searchTerms.length > 0 ? score / searchTerms.length : 0;
  }

  /**
   * Get comparison function for sorting
   * @param {string} sortBy - Sort criteria
   * @param {string} order - Sort order
   * @returns {Function} Comparison function
   * @private
   */
  _getCompareFunction(sortBy, order) {
    const compareFunctions = {
      date: (a, b) => {
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      },
      title: (a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return order === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
      },
      readTime: (a, b) => {
        const timeA = this._extractReadTimeMinutes(a.readTime) || 0;
        const timeB = this._extractReadTimeMinutes(b.readTime) || 0;
        return order === 'asc' ? timeA - timeB : timeB - timeA;
      },
      category: (a, b) => {
        const categoryA = (a.category || '').toLowerCase();
        const categoryB = (b.category || '').toLowerCase();
        return order === 'asc' ? categoryA.localeCompare(categoryB) : categoryB.localeCompare(categoryA);
      },
      searchScore: (a, b) => {
        const scoreA = a.searchScore || 0;
        const scoreB = b.searchScore || 0;
        return order === 'asc' ? scoreA - scoreB : scoreB - scoreA;
      }
    };

    return compareFunctions[sortBy] || compareFunctions.date;
  }

  /**
   * Extract search terms from query string
   * @param {string} query - Query string
   * @returns {Array} Array of search terms
   * @private
   */
  _extractTerms(query) {
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 1)
      .map(term => term.replace(/[^\w]/g, ''))
      .filter(term => term.length > 1);
  }

  /**
   * Check if term matches as a complete word
   * @param {string} text - Text to search in
   * @param {string} term - Term to match
   * @returns {boolean} True if exact word match
   * @private
   */
  _isExactWordMatch(text, term) {
    const regex = new RegExp(`\\b${term.toLowerCase()}\\b`, 'i');
    return regex.test(text);
  }

  /**
   * Extract read time in minutes from read time string
   * @param {string} readTime - Read time string (e.g., "5 min read")
   * @returns {number} Read time in minutes
   * @private
   */
  _extractReadTimeMinutes(readTime) {
    if (!readTime) return 0;
    const match = readTime.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Get empty statistics object
   * @returns {Object} Empty statistics structure
   * @private
   */
  _getEmptyStatistics() {
    return {
      totalArticles: 0,
      categoryDistribution: new Map(),
      tagFrequency: new Map(),
      yearDistribution: new Map(),
      monthDistribution: new Map(),
      averageReadTime: 0,
      totalReadTime: 0,
      publishingTrends: new Map(),
      mostPopularTags: [],
      articlesPerCategory: []
    };
  }
}

// Export singleton instance
export const articleSearchService = new ArticleSearchService();
export default articleSearchService;