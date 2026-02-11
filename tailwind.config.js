module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',    // Extra small devices
        'sm': '640px',    // Small devices (default)
        'md': '768px',    // Medium devices (default)
        'lg': '1024px',   // Large devices (default)
        'xl': '1280px',   // Extra large devices (default)
        '2xl': '1536px',  // 2X large devices (default)
        '3xl': '1920px',  // 3X large devices (custom)
      },
      colors: {
        edex: {
          light: 'rgb(var(--theme-light-rgb) / <alpha-value>)',
          DEFAULT: 'rgb(var(--theme-primary-rgb) / <alpha-value>)',
          dark: 'rgb(var(--theme-dark-rgb) / <alpha-value>)',
          black: 'rgb(var(--theme-black-rgb) / <alpha-value>)',
          glow: 'rgb(var(--theme-glow-rgb) / <alpha-value>)',
          dim: 'rgb(var(--theme-dim-rgb) / <alpha-value>)',
          // Enhanced colors for better Tron theme
          cyan: 'rgb(var(--theme-cyan-rgb) / <alpha-value>)',
          electric: 'rgb(var(--theme-electric-rgb) / <alpha-value>)',
          neon: 'rgb(var(--theme-neon-rgb) / <alpha-value>)',
          orange: 'rgb(var(--theme-orange-rgb) / <alpha-value>)',
          purple: 'rgb(var(--theme-purple-rgb) / <alpha-value>)',
          grid: 'var(--theme-grid)',
          scan: 'var(--theme-scan)',
        }
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'matrix': ['monospace', 'Press Start 2P', 'cursive'],
        'vt323': ['VT323', 'monospace'],
        'silkscreen': ['Silkscreen', 'cursive'],
        'pixelify': ['"Pixelify Sans"', 'cursive'],
        'theme-retro': ['VT323', 'monospace'],
        'theme-pixel': ['VT323', 'monospace'],
        'theme-modern': ['"Pixelify Sans"', 'system-ui', 'sans-serif'],
        'theme-clean': ['Silkscreen', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'flow': 'matrix 20s linear infinite',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
        'blink': 'blink 1s step-end infinite',
        'scan': 'scan 2s linear infinite',
        'flicker': 'flicker 0.5s step-end infinite',
        'pixel-bounce': 'pixel-bounce 0.5s steps(4) infinite',
        'glitch': 'glitch 0.5s steps(2) infinite',
        'pixel-spin': 'pixel-spin 2s steps(8) infinite',
        'noise': 'noise 0.2s steps(4) infinite',
        'pixel-wave': 'pixel-wave 2s steps(8) infinite',
        'pixel-shake': 'pixel-shake 0.5s steps(2) infinite',
        'pixel-slide': 'pixel-slide 1s steps(6) infinite',
        'pixel-blink': 'pixel-blink 1s steps(2) infinite',
        'pixel-float': 'pixel-float 3s ease-in-out infinite',
        'pixel-glitch-text': 'pixel-glitch-text 3s steps(3) infinite',
        'scanline': 'scanline 1s linear infinite',
        'pixel-rotate': 'pixel-rotate 4s steps(4) infinite',
        'themed-pulse': 'glow 1.5s ease-in-out infinite alternate, pixel-float 3s ease-in-out infinite',
        'glitch-shake': 'glitch 0.5s steps(2) infinite, pixel-shake 0.5s steps(2) infinite',
        'cyber-spin': 'pixel-spin 2s steps(8) infinite, glow 1.5s ease-in-out infinite',
        'mega-glitch': 'pixel-glitch-text 3s steps(3) infinite, flicker 0.5s step-end infinite, pixel-shake 0.5s steps(2) infinite',
        'matrix-surge': 'pixel-wave 2s steps(8) infinite, glow 1.5s ease-in-out infinite, pixel-float 3s ease-in-out infinite',
        'data-corruption': 'glitch 0.5s steps(2) infinite, noise 0.2s steps(4) infinite, pixel-shake 0.5s steps(2) infinite',
        'power-surge': 'glow 0.5s ease-in-out infinite alternate, pixel-spin 1s steps(8) infinite',
        'system-error': 'pixel-shake 0.2s steps(2) infinite, flicker 0.3s step-end infinite',
        'themed-reveal': 'reveal 0.8s ease-in-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'themed-pulse-border': 'pulseBorder 2s ease-in-out infinite',
        'themed-flicker-in': 'flickerIn 2.5s ease-out forwards',
        'themed-type': 'typing 3.5s steps(30, end), blink 1s step-end infinite',
        'skill-pop': 'skillPop 0.4s ease-out forwards',
        // Enhanced mobile-friendly animations
        'mobile-glow': 'mobileGlow 2s ease-in-out infinite alternate',
        'circuit-flow': 'circuitFlow 4s linear infinite',
        'data-stream': 'dataStream 3s linear infinite',
        'tron-grid': 'tronGrid 5s ease-in-out infinite',
        'hologram': 'hologram 2s ease-in-out infinite',
      },
      keyframes: {
        matrix: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glow: {
          '0%': { textShadow: '0 0 5px #33D1FF, 0 0 10px #33D1FF' },
          '100%': { textShadow: '0 0 10px #33D1FF, 0 0 20px #33D1FF' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scan: {
          '0%': { backgroundPosition: '0 -100vh' },
          '100%': { backgroundPosition: '0 100vh' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '25%': { opacity: '0.8' },
          '50%': { opacity: '1' },
          '75%': { opacity: '0.9' },
        },
        'pixel-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '25%': { transform: 'translate(-2px, 2px)' },
          '50%': { transform: 'translate(2px, -2px)' },
          '75%': { transform: 'translate(-2px, -2px)' },
        },
        'pixel-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'noise': {
          '0%, 100%': { opacity: '1' },
          '25%': { opacity: '0.75' },
          '50%': { opacity: '0.5' },
          '75%': { opacity: '0.25' },
        },
        'pixel-wave': {
          '0%, 100%': { transform: 'skewX(0deg)' },
          '25%': { transform: 'skewX(3deg)' },
          '75%': { transform: 'skewX(-3deg)' },
        },
        'pixel-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        'pixel-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pixel-blink': {
          '0%, 49%, 100%': { opacity: '1' },
          '50%, 99%': { opacity: '0' },
        },
        'pixel-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pixel-glitch-text': {
          '0%, 100%': {
            clipPath: 'inset(0 0 0 0)',
            transform: 'translate(0)',
          },
          '10%, 30%': {
            clipPath: 'inset(0 -10px 0 0)',
            transform: 'translate(-2px, 2px)',
          },
          '50%, 70%': {
            clipPath: 'inset(0 0 0 -10px)',
            transform: 'translate(2px, -2px)',
          },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'pixel-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(90deg)' },
          '50%': { transform: 'rotate(180deg)' },
          '75%': { transform: 'rotate(270deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        reveal: {
          '0%': {
            transform: 'translateX(-100%)',
            borderRightColor: '#33D1FF',
          },
          '100%': {
            transform: 'translateX(0)',
            borderRightColor: 'transparent',
          }
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          }
        },
        pulseBorder: {
          '0%, 100%': { borderColor: '#1A6B82' },
          '50%': { borderColor: '#33D1FF' },
        },
        flickerIn: {
          '0%, 10%, 15%, 20%': { opacity: '0' },
          '5%, 12%, 17%, 25%, 100%': { opacity: '1' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        skillPop: {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0',
          },
          '50%': { transform: 'scale(1.1)' },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          }
        },
        // Enhanced mobile-friendly animations
        mobileGlow: {
          '0%': {
            boxShadow: '0 0 5px #33D1FF, inset 0 0 5px #33D1FF',
            borderColor: '#33D1FF'
          },
          '100%': {
            boxShadow: '0 0 20px #66E0FF, inset 0 0 10px #66E0FF',
            borderColor: '#66E0FF'
          },
        },
        circuitFlow: {
          '0%': {
            backgroundPosition: '0% 0%',
            opacity: '0.3'
          },
          '50%': {
            backgroundPosition: '100% 100%',
            opacity: '0.7'
          },
          '100%': {
            backgroundPosition: '0% 0%',
            opacity: '0.3'
          },
        },
        dataStream: {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(100%) skewX(-15deg)' },
        },
        tronGrid: {
          '0%, 100%': {
            backgroundSize: '20px 20px',
            opacity: '0.1'
          },
          '50%': {
            backgroundSize: '40px 40px',
            opacity: '0.3'
          },
        },
        hologram: {
          '0%, 100%': {
            opacity: '0.8',
            filter: 'hue-rotate(0deg)'
          },
          '25%': {
            opacity: '0.9',
            filter: 'hue-rotate(90deg)'
          },
          '50%': {
            opacity: '0.7',
            filter: 'hue-rotate(180deg)'
          },
          '75%': {
            opacity: '0.9',
            filter: 'hue-rotate(270deg)'
          },
        },
      },
      backgroundImage: {
        'scan-effect': 'linear-gradient(180deg, rgba(51, 209, 255, 0.1) 0%, transparent 10%, transparent 90%, rgba(51, 209, 255, 0.1) 100%)',
        'tron-grid': `
          linear-gradient(rgba(51, 209, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(51, 209, 255, 0.1) 1px, transparent 1px)
        `,
        'circuit-pattern': `
          radial-gradient(circle at 25% 25%, rgba(51, 209, 255, 0.1) 2px, transparent 2px),
          radial-gradient(circle at 75% 75%, rgba(102, 224, 255, 0.1) 1px, transparent 1px)
        `,
        'data-stream': 'linear-gradient(90deg, transparent 0%, rgba(51, 209, 255, 0.1) 50%, transparent 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
} 