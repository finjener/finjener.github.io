/**
 * Theme2 Navbar Component - Minimalist
 * Clean, simple navigation with theme toggle
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { theme2Config } from '../config';

/**
 * Sun icon for light mode
 */
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

/**
 * Moon icon for dark mode
 */
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

/**
 * Menu icon (hamburger)
 */
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

/**
 * Close icon (X)
 */
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

/**
 * Navigation links configuration
 */
const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/articles', label: 'Articles' },
    // { path: '/contact', label: 'Contact' },
];

/**
 * Navbar Component
 * Minimalist navigation bar with:
 * - Logo/name on left
 * - Nav links (hidden on mobile)
 * - Theme toggle
 * - Mobile menu button
 */
const Navbar = () => {
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage first, then use config defaultTheme
        const stored = localStorage.getItem('theme2-theme');
        if (stored) {
            return stored === 'dark';
        }
        // Use theme config default (not system preference)
        return theme2Config.defaultTheme === 'dark';
    });

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme2-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Toggle theme
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <header className={`t2-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className="t2-header-inner">
                    {/* Logo */}
                    <Link to="/" className="t2-logo">
                        finjener
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="t2-nav">
                        <ul className="t2-nav-links">
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`t2-nav-link ${location.pathname === link.path ? 'active' : ''
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Theme Toggle */}
                        <button
                            className="t2-theme-toggle"
                            onClick={toggleTheme}
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDarkMode ? <SunIcon /> : <MoonIcon />}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            className="t2-menu-button"
                            onClick={toggleMobileMenu}
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    </nav>
                </div>
            </header>

            {/* Mobile Navigation */}
            <nav className={`t2-mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                <ul className="t2-mobile-nav-links">
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`t2-mobile-nav-link ${location.pathname === link.path ? 'active' : ''
                                    }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
};

export default Navbar;
