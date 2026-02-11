/**
 * Theme1 Configuration - EDEX/Tron
 * Cyberpunk/Matrix inspired dark theme with cyan accents
 */

export const theme1Config = {
    name: 'EDEX Tron',
    id: 'theme1',
    disableEffects: false,

    colors: {
        primary: '#33D1FF',
        light: '#E6F1FF',
        dark: '#1A6B82',
        black: '#0A0F14',
        glow: '#66E0FF',
        dim: '#112D3A',
        cyan: '#00FFFF',
        electric: '#00D4FF',
        neon: '#39FF14',
        orange: '#FF6600',
        purple: '#8A2BE2',
        grid: 'rgba(51, 209, 255, 0.1)',
        scan: 'rgba(51, 209, 255, 0.3)',
    },

    fonts: {
        primary: "'VT323', monospace",
        heading: "'Press Start 2P', cursive",
        pixel: "'Pixelify Sans', cursive",
        clean: "'Silkscreen', monospace",
    },

    // CSS variable mappings for RGB (Tailwind opacity support)
    colorsRgb: {
        primary: '51 209 255',
        light: '230 241 255',
        dark: '26 107 130',
        black: '10 15 20',
        glow: '102 224 255',
        dim: '17 45 58',
        cyan: '0 255 255',
        electric: '0 212 255',
        neon: '57 255 20',
        orange: '255 102 0',
        purple: '138 43 226',
    },
};

export default theme1Config;
