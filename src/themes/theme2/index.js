/**
 * Theme2 Entry Point - Minimalist
 * Exports all theme2-specific components and configuration
 * 
 * "Simplicity is genius"
 */

// Import theme-specific CSS
import './theme2.css';

// Export configuration
export { default as config, theme2Config } from './config';

// Export theme-specific components
export { default as Navbar } from './components/Navbar';
export { default as Footer } from './components/Footer';

// No-op components (this theme focuses on simplicity)
export const MatrixBackground = () => null;
export const BackgroundMusic = () => null;

// Theme metadata
export const themeMeta = {
    id: 'theme2',
    name: 'Minimalist',
    description: 'Clean, minimal portfolio theme - simplicity is genius',
    hasEffects: false,
    supportsDarkMode: true,
};
