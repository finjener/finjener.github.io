/**
 * Central Theme Loader
 * Dynamically exports the active theme's components and configuration
 * 
 * To switch themes, change ACTIVE_THEME below
 */

// ============================================
// ACTIVE THEME - Change this value to switch
// ============================================
// ============================================
// ACTIVE THEME - Change this value to switch
// ============================================
export const ACTIVE_THEME = 'theme2';

// Import all themes
import * as Theme1 from './theme1';
import * as Theme2 from './theme2';
// import * as Theme3 from './theme3';
// import * as Theme4 from './theme4';
// import * as Theme5 from './theme5';

// Theme registry
const themes = {
    theme1: Theme1,
    theme2: Theme2,
    // theme3: Theme3,
    // theme4: Theme4,
    // theme5: Theme5,
};

// Get active theme module
const activeTheme = themes[ACTIVE_THEME];

// Export active theme components
export const { MatrixBackground, Navbar, Footer, BackgroundMusic, config, themeMeta } = activeTheme;

// Export helper functions
export const getActiveTheme = () => ACTIVE_THEME;
export const getThemeMeta = () => activeTheme.themeMeta;
export const getThemeConfig = () => activeTheme.config;
export const hasEffects = () => activeTheme.themeMeta?.hasEffects ?? false;

// Export all themes for reference
export { themes };
export { Theme1, Theme2 };

export default activeTheme;

