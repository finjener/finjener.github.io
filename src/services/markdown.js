/**
 * @fileoverview Enhanced markdown processing service
 */

/**
 * Loads markdown content from a URL
 * @param {string} contentPath - URL to the markdown file
 * @returns {Promise<string>} Markdown content
 */
export const loadMarkdownContent = async (contentPath) => {
  try {
    const response = await fetch(contentPath);
    
    if (!response.ok) {
      throw new Error(`Failed to load markdown content: ${response.statusText}`);
    }
    
    return await response.text();
  } catch (error) {
    throw error;
  }
};

/**
 * Extract frontmatter from markdown content
 * Simple implementation - for full parsing consider using libraries like "gray-matter"
 * @param {string} content - Raw markdown content with optional frontmatter
 * @returns {Object} Object with { frontmatter, content }
 */
export const extractFrontmatter = (content) => {
  if (!content) return { frontmatter: {}, content: '' };
  
  // Check if content has frontmatter (starts with ---)
  if (!content.startsWith('---')) {
    return { frontmatter: {}, content };
  }
  
  try {
    // Find the closing frontmatter delimiter
    const endDelimiterIndex = content.indexOf('---', 3);
    if (endDelimiterIndex === -1) {
      return { frontmatter: {}, content };
    }
    
    // Extract frontmatter and parse it
    const frontmatterRaw = content.substring(3, endDelimiterIndex).trim();
    const frontmatter = {};
    
    // Parse the frontmatter into key-value pairs
    frontmatterRaw.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        const value = valueParts.join(':').trim();
        // Remove quotes if they exist
        frontmatter[key.trim()] = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      }
    });
    
    // Extract content after frontmatter
    const markdownContent = content.substring(endDelimiterIndex + 3).trim();

    // Remove duplicate title header if frontmatter has a title
    let cleanedContent = markdownContent;
    if (frontmatter.title) {
      const lines = markdownContent.split('\n');
      if (lines[0] && lines[0].trim().startsWith('#')) {
        const headerText = lines[0].replace(/^#+/, '').trim();
        if (headerText === frontmatter.title.trim()) {
          lines.shift();
          cleanedContent = lines.join('\n').trim();
        }
      }
    }

    return { frontmatter, content: cleanedContent };
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return { frontmatter: {}, content };
  }
}; 