/**
 * @fileoverview Service for handling article content loading
 */

import { extractFrontmatter } from './markdown';

/**
 * Loads article content from markdown file using dynamic import
 * @param {string} contentPath - Path relative to src/data/content/ (e.g., 'articles/my-article.md')
 * @returns {Promise<{content: string, frontmatter: Object}>} Article content and frontmatter
 */
export const loadArticleContent = async (contentPath) => {
  try {
    // Dynamically import the raw markdown content
    // The `../data/content/` path is relative to this service file
    // The /* webpackChunkName: "article-[request]" */ comment is optional but helps with bundle analysis
    const module = await import(
      /* webpackChunkName: "article-[request]" */
      /* webpackMode: "lazy-once" */
      `!!raw-loader!../data/content/${contentPath}`
    );

    // raw-loader makes the default export the raw content string
    const rawContent = module.default;

    // Extract frontmatter if present
    const { frontmatter, content } = extractFrontmatter(rawContent);

    return {
      content: content || rawContent,
      frontmatter
    };
  } catch (error) {
    console.error(`Error loading article content for path: ${contentPath}`, error);
    // Consider re-throwing a more specific error or returning a specific error state
    throw new Error(`Failed to load article content: ${contentPath}`);
  }
}; 