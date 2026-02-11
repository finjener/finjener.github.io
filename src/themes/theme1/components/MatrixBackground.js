/**
 * @fileoverview Enhanced Matrix-style animated background component using p5.js
 * @author Portfolio Website
 * @created 2024
 * @updated 2025
 * @requires p5
 */

// Import React hooks and p5.js library
import React, { useEffect, useRef, useState, useCallback } from 'react';
import p5 from 'p5';

/**
 * @component MatrixBackground
 * @description Creates an animated background with falling matrix-style characters
 * using p5.js for canvas manipulation and animation. Enhanced with mobile responsiveness
 * and Tron-themed visual effects.
 * @returns {JSX.Element} A full-screen canvas container for the matrix animation
 */
const MatrixBackground = () => {
  // Reference to the container div for p5 instance
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    /**
     * @function sketch
     * @description Main p5.js sketch function that defines the animation
     * @param {p5} p - The p5.js instance
     */
    const sketch = (p) => {
      // Enhanced configuration variables for the matrix effect
      let chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'; // Mix of binary and katakana
      let streams = [];  // Array to hold all character streams
      let fontSize = isMobile ? 12 : 16; // Responsive font size
      let maxStreams = isMobile ? 30 : 80; // Fewer streams on mobile for performance
      let frameCount = 0;
      let glitchFrames = [];

      // Read theme colors from CSS variables
      const getThemeColor = (varName) => {
        const style = getComputedStyle(document.documentElement);
        return style.getPropertyValue(varName).trim();
      };

      // Parse hex color to RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : { r: 51, g: 209, b: 255 }; // Default to theme primary
      };

      // Theme colors (read from CSS variables)
      const themeColors = {
        primary: hexToRgb(getThemeColor('--theme-primary')),
        cyan: hexToRgb(getThemeColor('--theme-cyan')),
        electric: hexToRgb(getThemeColor('--theme-electric')),
        neon: hexToRgb(getThemeColor('--theme-neon')),
        orange: hexToRgb(getThemeColor('--theme-orange'))
      };

      /**
       * @class Stream
       * @description Represents a single vertical stream of characters in the matrix
       * Enhanced with color variations and glitch effects
       */
      class Stream {
        /**
         * @constructor
         * @param {number} x - X coordinate of the stream
         * @param {number} y - Starting Y coordinate of the stream
         */
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.chars = [];
          this.speed = random(1, isMobile ? 4 : 8);  // Slower on mobile
          this.length = random(5, isMobile ? 15 : 25); // Shorter on mobile
          this.opacity = 255;
          this.isGlitching = false;
          this.glitchTimer = 0;
          this.colorVariant = random(0, 1);
          this.charType = random(0, 1) > 0.7 ? 'katakana' : 'binary'; // 30% katakana, 70% binary
        }

        /**
         * @method generateChars
         * @description Generates random characters for the stream with type preference
         */
        generateChars() {
          for (let i = 0; i < this.length; i++) {
            if (this.charType === 'binary') {
              this.chars[i] = random(0, 1) > 0.5 ? '0' : '1';
            } else {
              // Use katakana characters (starting from index 2)
              const katakanaChars = chars.substring(2);
              this.chars[i] = katakanaChars.charAt(Math.floor(random(0, katakanaChars.length)));
            }
          }
        }

        /**
         * @method render
         * @description Renders the stream with enhanced Tron-themed effects
         */
        render() {
          // Enhanced color system with theme colors from CSS variables
          let r, g, b;
          if (this.colorVariant < 0.1) {
            // Cyan highlight (10%)
            r = themeColors.cyan.r; g = themeColors.cyan.g; b = themeColors.cyan.b;
          } else if (this.colorVariant < 0.2) {
            // Electric blue highlight (10%)
            r = themeColors.electric.r; g = themeColors.electric.g; b = themeColors.electric.b;
          } else if (this.colorVariant < 0.25) {
            // Neon green accent (5%)
            r = themeColors.neon.r; g = themeColors.neon.g; b = themeColors.neon.b;
          } else {
            // Standard primary theme color (75%)
            r = themeColors.primary.r; g = themeColors.primary.g; b = themeColors.primary.b;
          }

          // Handle glitch effects
          if (this.glitchTimer > 0) {
            this.glitchTimer--;
            r = themeColors.orange.r; g = random(100, 255); b = themeColors.orange.b; // Theme orange glitch
            this.isGlitching = true;
          } else {
            this.isGlitching = false;
            // Random chance to start glitching
            if (random(0, 1) < 0.001) {
              this.glitchTimer = random(5, 15);
            }
          }

          // Draw each character in the stream with fade effect
          for (let i = 0; i < this.length; i++) {
            let char = this.chars[i];
            let alpha = this.opacity * (1 - (i / this.length) * 0.8); // Fade effect

            // Head character is brighter
            if (i === 0) {
              alpha = 255;
              p.fill(255, 255, 255, alpha); // White head
            } else {
              p.fill(r, g, b, alpha);
            }

            // Add glow effect for head character
            if (i === 0 && !isMobile) {
              p.drawingContext.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
              p.drawingContext.shadowBlur = 10;
            } else {
              p.drawingContext.shadowBlur = 0;
            }

            // Glitch distortion
            let xOffset = this.isGlitching ? random(-2, 2) : 0;
            let yPos = this.y + i * fontSize;

            p.text(char, this.x + xOffset, yPos);
          }

          // Update stream position
          this.y += this.speed;

          // Reset stream position when it goes off screen
          if (this.y > p.height + this.length * fontSize) {
            this.y = -this.length * fontSize;
            this.generateChars();
            // Occasionally change character type
            if (random(0, 1) < 0.1) {
              this.charType = random(0, 1) > 0.7 ? 'katakana' : 'binary';
            }
          }

          // Occasionally regenerate some characters for dynamic effect
          if (frameCount % 30 === 0 && random(0, 1) < 0.1) {
            let randomIndex = Math.floor(random(1, this.length));
            if (this.charType === 'binary') {
              this.chars[randomIndex] = random(0, 1) > 0.5 ? '0' : '1';
            } else {
              const katakanaChars = chars.substring(2);
              this.chars[randomIndex] = katakanaChars.charAt(Math.floor(random(0, katakanaChars.length)));
            }
          }
        }
      }

      /**
       * @function setup
       * @description p5.js setup function - initializes the canvas and streams
       */
      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style('z-index', '-1');

        p.textSize(fontSize);
        p.textFont('monospace');
        p.noStroke();

        // Create optimized number of streams
        const streamSpacing = fontSize + 2;
        const numStreams = Math.min(maxStreams, Math.floor(p.width / streamSpacing));

        for (let i = 0; i < numStreams; i++) {
          const x = i * streamSpacing + streamSpacing / 2;
          const stream = new Stream(x, random(-1000, 0));
          stream.generateChars();
          streams.push(stream);
        }
      };

      /**
       * @function draw
       * @description p5.js draw function - handles animation frame updates
       */
      p.draw = () => {
        // Enhanced background with subtle gradient
        if (isMobile) {
          // Simpler background for mobile performance
          p.background(10, 15, 20, 40);
        } else {
          // Rich background for desktop
          p.background(10, 15, 20, 30);

          // Add subtle scanning line effect
          if (frameCount % 120 === 0) {
            let scanY = random(0, p.height);
            p.stroke(themeColors.primary.r, themeColors.primary.g, themeColors.primary.b, 50);
            p.strokeWeight(1);
            p.line(0, scanY, p.width, scanY);
            p.noStroke();
          }
        }

        // Update and render all streams
        streams.forEach(stream => stream.render());

        frameCount++;

        // Performance monitoring - reduce frame rate on mobile if needed
        if (isMobile && frameCount % 2 === 0) {
          // Skip every other frame on mobile for better performance
          return;
        }
      };

      /**
       * @function windowResized
       * @description Handles window resize events with stream recalculation
       */
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);

        // Recalculate streams for new width
        streams = [];
        const streamSpacing = fontSize + 2;
        const numStreams = Math.min(maxStreams, Math.floor(p.width / streamSpacing));

        for (let i = 0; i < numStreams; i++) {
          const x = i * streamSpacing + streamSpacing / 2;
          const stream = new Stream(x, random(-1000, 0));
          stream.generateChars();
          streams.push(stream);
        }
      };

      /**
       * @function random
       * @description Utility function for generating random numbers
       * @param {number} min - Minimum value
       * @param {number} max - Maximum value
       * @returns {number} Random number between min and max
       */
      const random = (min, max) => p.random(min, max);
    };

    // Create new p5 instance and attach it to the container
    const p5Instance = new p5(sketch, containerRef.current);

    // Cleanup function to remove p5 instance when component unmounts
    return () => {
      p5Instance.remove();
    };
  }, [isMobile]); // Recreate when mobile state changes

  // Render full-screen container for the matrix background
  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full -z-10 gpu-accelerated"
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
    />
  );
};

export default MatrixBackground; 