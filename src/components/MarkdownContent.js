/**
 * @fileoverview Markdown content renderer with custom styling and syntax highlighting
 * @author Portfolio Website
 * @created 2024
 * @requires react-markdown
 * @requires remark-gfm
 * @requires rehype-raw
 * @requires rehype-sanitize
 */

// Import core dependencies
import React, { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

// Import markdown plugins and extensions
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

// Custom sanitization schema that allows links
const sanitizeSchema = {
  allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'img', 'code', 'pre', 'ol', 'ul', 'li', 'blockquote', 'em', 'strong', 'del'],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'title'],
    code: ['class'],
    pre: ['class']
  },
  allowedSchemes: ['http', 'https', 'mailto']
};

/**
 * @component MarkdownContent
 * @description Renders markdown content with custom styling and components
 * Includes syntax highlighting, custom HTML elements, and matrix theme styling
 * 
 * @param {Object} props - Component props
 * @param {string|string[]} props.content - The markdown content to render (can be string or array of strings)
 * @param {string} [props.className=''] - Additional CSS classes for the markdown wrapper
 * @returns {JSX.Element|null} Styled markdown content or null if no content provided
 */
const MarkdownContent = memo(({ content, className = '' }) => {
  // Return null if no content is provided
  if (!content) {
    return null;
  }

  // Convert array content to string if necessary
  const markdownContent = Array.isArray(content) ? content.join('\n') : content;

  // Track if we've seen the first H1 heading
  const firstHeadingRef = React.useRef(false);

  return (
    <div className="markdown-wrapper">
      <ReactMarkdown
        className={`markdown-content ${className}`}
        remarkPlugins={[remarkGfm]}        // Enable GitHub Flavored Markdown
        rehypePlugins={[rehypeRaw, rehypeSanitize]}  // Enable HTML parsing and sanitization
        components={{
          /**
           * @component code
           * @description Custom code block renderer - Plain text style (No Highlighting)
           * Renders code in a muted container consistent with theme
           */
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              // Multi-line code block - Plain text
              <div className="code-block-wrapper my-6">
                {match[1] && (
                  <div className="text-xs text-edex-muted uppercase tracking-wider mb-2 font-mono ml-1">
                    {match[1]}
                  </div>
                )}
                <div className="bg-edex-dark/20 rounded-lg border border-edex-dark/30 p-4 overflow-x-auto">
                  <pre {...props} className="m-0">
                    <code className="font-mono text-sm text-edex-light/90 whitespace-pre">
                      {String(children).replace(/\n$/, '')}
                    </code>
                  </pre>
                </div>
              </div>
            ) : (
              // Inline code styling
              <code className="bg-edex-dark/30 px-1.5 py-0.5 rounded font-mono text-sm text-edex-light/90" {...props}>
                {children}
              </code>
            );
          },

          // Custom heading components with matrix theme styling
          h1: ({ children, ...props }) => {
            // If this is the first h1 we encounter, don't render it and mark that we've seen it
            if (!firstHeadingRef.current) {
              firstHeadingRef.current = true;
              return null;
            }

            return (
              <h1 className="text-3xl font-bold mb-6 text-edex-glow border-b border-edex-dark/30 pb-2" {...props}>
                {children}
              </h1>
            );
          },
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mb-4 text-edex mt-8">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-bold mb-3 text-edex-light mt-6">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-bold mb-2 text-edex-light/90 mt-4">
              {children}
            </h4>
          ),

          // Text content components
          p: ({ children }) => (
            <p className="mb-4 text-edex-light leading-relaxed">
              {children}
            </p>
          ),

          // List components
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-edex-light leading-relaxed">
              {children}
            </li>
          ),

          // Enhanced link component with better click handling
          a: ({ href, children }) => {
            // Validate and sanitize href
            let sanitizedHref = href;
            try {
              // Ensure the href is a valid URL or relative path
              if (href && !href.startsWith('/')) {
                new URL(href); // This will throw if invalid
              }
            } catch (e) {
              // console.warn('Invalid URL:', href);
              return <span className="text-red-500">{children}</span>;
            }

            // Handle internal vs external links
            const isInternal = href?.startsWith('/');
            const isMailTo = href?.startsWith('mailto:');
            const isAnchor = href?.startsWith('#');

            return (
              <a
                href={sanitizedHref}
                target={isInternal || isMailTo || isAnchor ? '_self' : '_blank'}
                rel={isInternal || isMailTo || isAnchor ? '' : 'noopener noreferrer'}
                className="text-edex hover:text-edex-glow underline decoration-edex-dark/30 
                         hover:decoration-edex transition-colors cursor-pointer"
                onClick={(e) => {
                  if (!sanitizedHref) {
                    e.preventDefault();
                    return;
                  }
                }}
              >
                {children}
                {!isInternal && !isMailTo && !isAnchor && (
                  <span className="inline-block ml-1" aria-label="external link">
                    ↗
                  </span>
                )}
              </a>
            );
          },

          // Block elements with matrix theme styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-edex-dark pl-4 my-4 italic bg-edex-dark/10 py-2 rounded">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="border-edex-dark/30 my-8" />
          ),

          // Image component with caption support
          img: ({ src, alt, title }) => (
            <div className="my-6">
              <img
                src={src}
                alt={alt}
                title={title}
                className="rounded-lg max-w-full mx-auto shadow-lg shadow-edex-dark/10"
              />
              {title && (
                <p className="text-center text-sm text-edex-light/70 mt-2 italic">
                  {title}
                </p>
              )}
            </div>
          ),

          // Table components with matrix theme styling
          table: ({ children }) => (
            <div className="overflow-x-auto mb-6 rounded-lg border border-edex-dark/30">
              <table className="min-w-full divide-y divide-edex-dark/30">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-edex-dark/10">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-edex-light">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-edex-light border-t border-edex-dark/20">
              {children}
            </td>
          )
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
});

// Export memoized component to prevent unnecessary re-renders
export default MarkdownContent; 