/**
 * @fileoverview Error Boundary component for graceful error handling
 * @author Portfolio Website
 * @created 2024
 */

import React from 'react';

/**
 * @class ErrorBoundary
 * @extends React.Component
 * @description Class component that catches JavaScript errors anywhere in its child component tree
 * Provides a fallback UI when an error occurs instead of crashing the whole app
 * @see https://reactjs.org/docs/error-boundaries.html
 */
class ErrorBoundary extends React.Component {
  /**
   * @constructor
   * @param {Object} props - Component props
   * @description Initializes the error boundary with initial state
   */
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,  // Tracks if an error has occurred
      error: null       // Stores the error object
    };
  }

  /**
   * @static
   * @method getDerivedStateFromError
   * @param {Error} error - The error that was thrown
   * @returns {Object} New state object with error information
   * @description React lifecycle method called when an error occurs
   * Updates state to trigger fallback UI rendering
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * @method componentDidCatch
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Component stack trace information
   * @description Lifecycle method for error logging
   * Called after an error has been thrown by a descendant component
   */
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  /**
   * @method render
   * @returns {JSX.Element} Either the error UI or the children components
   * @description Renders either the error UI when an error occurs,
   * or the normal children components when no error is present
   */
  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return (
        <div className="min-h-screen flex items-center justify-center bg-matrix-black/90">
          <div className="text-matrix p-8 border-2 border-matrix rounded-lg max-w-2xl">
            <h2 className="text-2xl mb-4">Something went wrong</h2>
            <p className="text-matrix-light mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            {/* Reload button to attempt recovery */}
            <button
              onClick={() => window.location.reload()}
              className="matrix-button"
              aria-label="Reload page"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    // When no error occurs, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 