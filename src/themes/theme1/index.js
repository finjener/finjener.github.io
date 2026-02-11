/**
 * Theme1 Entry Point - EDEX/Tron
 * Exports all theme1-specific components and configuration
 */

// Import theme-specific CSS
import './theme1.css';

// Export configuration
export { default as config } from './config';
export { theme1Config } from './config';

// Export theme-specific components
export { default as MatrixBackground } from './components/MatrixBackground';
export { default as Navbar } from './components/Navbar';
export { default as BackgroundMusic } from './components/BackgroundMusic';

// Theme metadata
export const themeMeta = {
    id: 'theme1',
    name: 'EDEX Tron',
    description: 'Cyberpunk/Matrix inspired dark theme with cyan accents',
    hasEffects: true,
};
