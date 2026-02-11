/**
 * @fileoverview Individual article detail page component
 * @author Portfolio Website
 * @created 2024
 * @requires framer-motion
 * @requires react-router-dom
 * @requires ../components/MarkdownContent
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import articles from '../data/content/articles.json';
import { isPreviewMode } from '../services/contentful';
import { loadArticleContent } from '../services/articleService';
import MarkdownContent from '../components/MarkdownContent';

/**
 * @component ArticleDetailPage
 * @description Displays a single article with full content and metadata
 * Features responsive layout, markdown rendering, and preview mode support
 * Redirects to articles listing if article not found
 * @returns {JSX.Element|null} Article detail page or null if article not found
 */
const ArticleDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [preview] = useState(isPreviewMode());
  const [articleData, setArticleData] = useState({
    content: '',
    metadata: {},
    frontmatter: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Find the article matching the URL slug
  const article = articles.items?.find(a => a.slug === slug);

  // Fetch article content
  useEffect(() => {
    const fetchContent = async () => {
      if (!article?.contentPath) {
        setError('Article content path not found');
        setLoading(false);
        return;
      }

      try {
        // Load the article content with the updated service
        const result = await loadArticleContent(article.contentPath);

        // Process content to remove the first heading if it matches the article title
        let processedContent = result.content;

        // Remove the first heading from the markdown content to avoid duplication
        // More robust regex that handles various markdown formats
        if (processedContent) {
          // This regex matches headings at the beginning of the content
          // It looks for 1-6 hash symbols followed by title text and matches until the end of line
          // The `^` ensures it only matches at the beginning of the string
          const firstHeadingRegex = /^\s*#{1,6}\s*[^\n]+(\n|$)/; // Allow zero or more spaces after #
          const contentBeforeReplace = processedContent;
          processedContent = processedContent.replace(firstHeadingRegex, '');

          // Trim any leading empty lines after removing the heading
          processedContent = processedContent.replace(/^\s+/, '');
        }

        setArticleData({
          content: processedContent,
          metadata: article,
          frontmatter: result.frontmatter
        });

        setError(null);
      } catch (err) {
        console.error('Error loading article content:', err);
        setError('Failed to load article content');
      } finally {
        setLoading(false);
      }
    };

    if (article) {
      fetchContent();
    }
  }, [article]);

  // Redirect to articles page if article not found
  if (!article) {
    navigate('/articles');
    return null;
  }

  return (
    <motion.div
      className="pt-6 pb-12 px-4 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <Link
          to="/articles"
          className="themed-button inline-flex items-center gap-2 mb-8
                     hover:text-edex-glow transition-all duration-300"
        >
          <span className="text-lg">←</span>
          <span>Back to Articles</span>
        </Link>

        {/* Main Article Card */}
        <article className="bg-black/60 p-8 rounded-lg themed-card border-2 border-edex-dark/50">
          {/* Article Cover Image */}
          {article.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          {/* Article Header Section */}
          <header className="mb-6">
            {/* Article Metadata */}
            <div className="flex items-center gap-4 text-sm text-edex-light mb-4">
              <span>{article.category}</span>
              <span>•</span>
              <span>{article.date}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
            {/* Article Title - Only shown in the header, not in content */}
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-edex-light">{article.title}</h1>
            {/* Author Information */}
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm text-edex-light">By {article.author}</span>
            </div>
          </header>

          {/* Article Content - Rely on JS preprocessing to remove duplicate title */}
          <div className="prose prose-invert prose-edex max-w-none 
                        border-t border-edex/20 pt-4 mt-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="cyber-spinner">Loading...</div>
              </div>
            ) : error ? (
              <div className="text-red-500 py-6">
                {error}
              </div>
            ) : (
              <MarkdownContent content={articleData.content} />
            )}
          </div>

          {/* Article Footer with Tags */}
          <footer className="mt-8 pt-8 border-t border-edex-dark/30">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-edex-dark/30 text-edex rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </footer>
        </article>
      </div>

    </motion.div>
  );
};

export default ArticleDetailPage; 