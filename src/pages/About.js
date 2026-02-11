/**
 * @fileoverview About page component using MVC architecture
 * @author Portfolio Website
 * @created 2024
 * @updated 2025
 * @layer Page
 * @responsibilities Routing and basic page setup
 * @architecture MVC - Delegates to AboutView for presentation
 */

import React from 'react';
import { AboutView } from '../views/index.js';

/**
 * @component About
 * @description About page route component - delegates to AboutView
 * @returns {JSX.Element} About page using MVC pattern
 */
const About = () => {
  return <AboutView />;
};

export default About; 