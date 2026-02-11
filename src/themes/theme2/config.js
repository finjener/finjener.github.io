/**
 * Theme5 Configuration - Minimalist
 * Clean, minimal portfolio theme - simplicity is genius
 */

export const theme2Config = {
    id: 'theme2',
    name: 'Minimalist',
    type: 'light', // Default typescription: 'Clean, minimal portfolio theme - simplicity is genius',
    disableEffects: true,
    supportsDarkMode: true,
    defaultTheme: 'light', // Default to dark mode

    colors: {
        // Light mode
        background: '#fafafa',       // zinc-50
        foreground: '#18181b',       // zinc-900
        muted: '#71717a',            // zinc-500
        mutedForeground: '#52525b',  // zinc-600
        border: '#e4e4e7',           // zinc-200
        accent: '#3b82f6',           // blue-500
        accentForeground: '#ffffff',

        // Dark mode
        darkBackground: '#09090b',   // zinc-950
        darkForeground: '#fafafa',   // zinc-50
        darkMuted: '#a1a1aa',        // zinc-400
        darkMutedForeground: '#a1a1aa', // zinc-400
        darkBorder: '#27272a',       // zinc-800
        darkAccent: '#60a5fa',       // blue-400
        darkAccentForeground: '#18181b',
    },

    fonts: {
        sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    },

    spacing: {
        page: '1.5rem',
        section: '4rem',
        contentMaxWidth: '720px',
        headerHeight: '4rem',
    },

    // RGB values for opacity utilities
    colorsRgb: {
        background: '250 250 250',
        foreground: '24 24 27',
        accent: '59 130 246',
        darkBackground: '9 9 11',
        darkForeground: '250 250 250',
        darkAccent: '96 165 250',
    },

    animations: {
        duration: '200ms',
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
};

export default theme2Config;
