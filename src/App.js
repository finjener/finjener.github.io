/**
 * @fileoverview Enhanced main application component with theme support
 * @author Website
 * @created 2024
 * @updated 2025
 */

// Import React and routing dependencies
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Import theme components from central theme loader
import { MatrixBackground, Navbar, Footer, BackgroundMusic, hasEffects } from './themes';

// Import page components
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import ArticleListingPage from './pages/ArticleListingPage';
import ArticleDetailPage from './pages/ArticleDetailPage';

// Import shared components
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';

// Import internationalization context
import { LanguageProvider } from './contexts/LanguageContext';

/**
 * @component App
 * @description Root component with theme-aware components and i18n support
 * @returns {JSX.Element} The complete application structure
 */
function App() {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <BackgroundMusic />

        {/* Main container */}
        <div className="min-h-screen relative overflow-hidden">
          {/* Matrix background (only renders for theme1) */}
          <MatrixBackground />

          {/* Scan line effect - only for themes with effects */}
          {hasEffects() && (
            <div className="absolute inset-0 bg-scan-effect animate-scan opacity-20 pointer-events-none" />
          )}

          {/* Theme-specific Navbar */}
          <Navbar />

          {/* Error boundary for graceful error handling */}
          <ErrorBoundary>
            <div className="container mx-auto px-responsive pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/articles" element={<ArticleListingPage />} />
                <Route path="/articles/:slug" element={<ArticleDetailPage />} />
              </Routes>
              {Footer && <Footer />}
            </div>
          </ErrorBoundary>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;