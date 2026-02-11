/**
 * @fileoverview Article content processing service
 * @author Portfolio Website
 * @created 2025
 * @layer Model/Service
 * @responsibilities Content processing, metadata extraction, validation, frontmatter parsing
 */

/**
 * @class ArticleContentProcessor
 * @description Handles article content processing, validation, and metadata extraction
 * Provides methods for processing markdown content and extracting article metadata
 */
export class ArticleContentProcessor {
  constructor() {
    this.supportedFormats = ['markdown', 'md'];
    this.metadataFields = ['title', 'date', 'category', 'tags', 'readTime', 'excerpt', 'author'];
    this.defaultReadingSpeed = 200; // words per minute
    this.contentCache = new Map();
  }

  /**
   * Process article content and extract metadata
   * @param {string} content - Raw article content (markdown)
   * @param {Object} metadata - Additional metadata
   * @returns {Object} Processed article with content and metadata
   */
  processArticleContent(content, metadata = {}) {
    if (!content || typeof content !== 'string') {
      throw new Error('Content must be a non-empty string');
    }

    // Extract frontmatter if present
    const { frontmatter, body } = this._extractFrontmatter(content);
    
    // Merge metadata sources (frontmatter takes precedence)
    const combinedMetadata = { ...metadata, ...frontmatter };

    // Calculate read time if not provided
    if (!combinedMetadata.readTime) {
      combinedMetadata.readTime = this._calculateReadTime(body);
    }

    // Extract excerpt if not provided
    if (!combinedMetadata.excerpt) {
      combinedMetadata.excerpt = this._extractExcerpt(body);
    }

    // Generate table of contents
    const tableOfContents = this._generateTableOfContents(body);

    // Extract and process images
    const images = this._extractImages(body);

    // Process code blocks
    const codeBlocks = this._extractCodeBlocks(body);

    return {
      content: body,
      metadata: combinedMetadata,
      tableOfContents,
      images,
      codeBlocks,
      wordCount: this._countWords(body),
      characterCount: body.length,
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Validate article content and structure
   * @param {Object} article - Article object to validate
   * @returns {Object} Validation result with isValid flag and errors array
   */
  validateArticleContent(article) {
    const errors = [];
    const warnings = [];

    if (!article) {
      errors.push('Article object is required');
      return { isValid: false, errors, warnings };
    }

    // Validate content
    if (!article.content || typeof article.content !== 'string') {
      errors.push('Article content must be a non-empty string');
    } else {
      // Check content length
      if (article.content.length < 100) {
        warnings.push('Article content is very short (less than 100 characters)');
      }
      
      if (article.content.length > 50000) {
        warnings.push('Article content is very long (over 50,000 characters)');
      }
    }

    // Validate metadata
    if (article.metadata) {
      const metadataValidation = this._validateMetadata(article.metadata);
      errors.push(...metadataValidation.errors);
      warnings.push(...metadataValidation.warnings);
    } else {
      warnings.push('Article metadata is missing');
    }

    // Validate structure
    if (article.tableOfContents && article.tableOfContents.length === 0) {
      warnings.push('Article has no headings for table of contents');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      hasWarnings: warnings.length > 0
    };
  }

  /**
   * Transform article content for different output formats
   * @param {Object} article - Article to transform
   * @param {string} format - Target format (html, plain, excerpt)
   * @returns {string} Transformed content
   */
  transformContent(article, format = 'html') {
    if (!article || !article.content) {
      throw new Error('Article with content is required');
    }

    switch (format) {
      case 'plain':
        return this._stripMarkdown(article.content);
      
      case 'excerpt':
        return this._generateExcerpt(article.content);
      
      case 'html':
        return this._convertToHtml(article.content);
      
      case 'toc':
        return this._generateTocHtml(article.tableOfContents || []);
      
      default:
        return article.content;
    }
  }

  /**
   * Extract frontmatter from markdown content
   * @param {string} content - Markdown content with potential frontmatter
   * @returns {Object} Object with frontmatter and body
   * @private
   */
  _extractFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return { frontmatter: {}, body: content };
    }

    const frontmatterYaml = match[1];
    const body = match[2];

    try {
      // Simple YAML parser for basic frontmatter
      const frontmatter = this._parseSimpleYaml(frontmatterYaml);
      return { frontmatter, body };
    } catch (error) {
      console.warn('Failed to parse frontmatter:', error);
      return { frontmatter: {}, body: content };
    }
  }

  /**
   * Simple YAML parser for frontmatter
   * @param {string} yaml - YAML string
   * @returns {Object} Parsed object
   * @private
   */
  _parseSimpleYaml(yaml) {
    const result = {};
    const lines = yaml.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) return;

      const key = trimmed.substring(0, colonIndex).trim();
      let value = trimmed.substring(colonIndex + 1).trim();

      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Handle arrays (simple format: [item1, item2])
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim());
      }

      // Handle booleans
      if (value === 'true') value = true;
      if (value === 'false') value = false;

      // Handle numbers
      if (/^\d+$/.test(value)) value = parseInt(value);
      if (/^\d+\.\d+$/.test(value)) value = parseFloat(value);

      result[key] = value;
    });

    return result;
  }

  /**
   * Calculate estimated read time
   * @param {string} content - Article content
   * @returns {string} Formatted read time
   * @private
   */
  _calculateReadTime(content) {
    const wordCount = this._countWords(content);
    const minutes = Math.ceil(wordCount / this.defaultReadingSpeed);
    return `${minutes} min read`;
  }

  /**
   * Count words in content
   * @param {string} content - Content to count
   * @returns {number} Word count
   * @private
   */
  _countWords(content) {
    return content
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }

  /**
   * Extract excerpt from content
   * @param {string} content - Article content
   * @param {number} maxLength - Maximum excerpt length
   * @returns {string} Article excerpt
   * @private
   */
  _extractExcerpt(content, maxLength = 160) {
    // Remove markdown formatting
    const plainText = this._stripMarkdown(content);
    
    // Get first paragraph or sentence
    const firstParagraph = plainText.split('\n\n')[0];
    
    if (firstParagraph.length <= maxLength) {
      return firstParagraph;
    }

    // Truncate at word boundary
    const truncated = firstParagraph.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    return lastSpace > 0 
      ? truncated.substring(0, lastSpace) + '...'
      : truncated + '...';
  }

  /**
   * Generate table of contents from content
   * @param {string} content - Article content
   * @returns {Array} Table of contents entries
   * @private
   */
  _generateTableOfContents(content) {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const toc = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const slug = this._generateSlug(title);

      toc.push({
        level,
        title,
        slug,
        anchor: `#${slug}`
      });
    }

    return toc;
  }

  /**
   * Generate URL-friendly slug from text
   * @param {string} text - Text to slugify
   * @returns {string} URL slug
   * @private
   */
  _generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  /**
   * Extract images from content
   * @param {string} content - Article content
   * @returns {Array} Array of image objects
   * @private
   */
  _extractImages(content) {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const images = [];
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      images.push({
        alt: match[1] || '',
        src: match[2],
        title: match[1] || ''
      });
    }

    return images;
  }

  /**
   * Extract code blocks from content
   * @param {string} content - Article content
   * @returns {Array} Array of code block objects
   * @private
   */
  _extractCodeBlocks(content) {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const codeBlocks = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      codeBlocks.push({
        language: match[1] || 'text',
        code: match[2].trim()
      });
    }

    return codeBlocks;
  }

  /**
   * Strip markdown formatting from content
   * @param {string} content - Markdown content
   * @returns {string} Plain text
   * @private
   */
  _stripMarkdown(content) {
    return content
      .replace(/^#{1,6}\s+/gm, '') // Remove headings
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images, keep alt text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/^\s*>\s+/gm, '') // Remove blockquotes
      .replace(/\n{3,}/g, '\n\n') // Normalize whitespace
      .trim();
  }

  /**
   * Convert markdown to basic HTML
   * @param {string} content - Markdown content
   * @returns {string} HTML content
   * @private
   */
  _convertToHtml(content) {
    // Basic markdown to HTML conversion
    return content
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')
      .replace(/<p><\/p>/g, '');
  }

  /**
   * Generate HTML for table of contents
   * @param {Array} toc - Table of contents entries
   * @returns {string} HTML string
   * @private
   */
  _generateTocHtml(toc) {
    if (!toc || toc.length === 0) return '';

    const tocItems = toc
      .map(item => `<li class="toc-level-${item.level}"><a href="${item.anchor}">${item.title}</a></li>`)
      .join('\n');

    return `<ul class="table-of-contents">\n${tocItems}\n</ul>`;
  }

  /**
   * Generate excerpt with custom options
   * @param {string} content - Content to excerpt
   * @param {Object} options - Excerpt options
   * @returns {string} Generated excerpt
   * @private
   */
  _generateExcerpt(content, options = {}) {
    const {
      maxLength = 160,
      stripMarkdown = true,
      preserveFormatting = false
    } = options;

    let processedContent = content;

    if (stripMarkdown) {
      processedContent = this._stripMarkdown(content);
    }

    return this._extractExcerpt(processedContent, maxLength);
  }

  /**
   * Validate metadata structure and content
   * @param {Object} metadata - Metadata to validate
   * @returns {Object} Validation result
   * @private
   */
  _validateMetadata(metadata) {
    const errors = [];
    const warnings = [];

    // Required fields
    const requiredFields = ['title', 'date', 'category'];
    requiredFields.forEach(field => {
      if (!metadata[field]) {
        errors.push(`Missing required metadata field: ${field}`);
      }
    });

    // Date validation
    if (metadata.date && !this._isValidDate(metadata.date)) {
      errors.push('Invalid date format in metadata');
    }

    // Tags validation
    if (metadata.tags && !Array.isArray(metadata.tags)) {
      errors.push('Tags must be an array');
    }

    // Read time validation
    if (metadata.readTime && !this._isValidReadTime(metadata.readTime)) {
      warnings.push('Invalid read time format');
    }

    return { errors, warnings };
  }

  /**
   * Validate date format
   * @param {string} date - Date string
   * @returns {boolean} True if valid
   * @private
   */
  _isValidDate(date) {
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  }

  /**
   * Validate read time format
   * @param {string} readTime - Read time string
   * @returns {boolean} True if valid
   * @private
   */
  _isValidReadTime(readTime) {
    const readTimePattern = /^\d+\s+(min|minute|minutes)\s+read$/i;
    return readTimePattern.test(readTime);
  }
}

// Export singleton instance
export const articleContentProcessor = new ArticleContentProcessor();
export default articleContentProcessor;