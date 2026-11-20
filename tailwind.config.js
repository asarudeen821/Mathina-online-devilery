/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: {
          DEFAULT: '#e5e7eb', // dark-200
        },
        // Primary Colors - Fresh Green (freshness, trust)
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a', // Fresh Green - Main Primary Color
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Secondary - Warm Red (meat, appetite)
        accent: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // Warm Red - Main Accent Color
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Soft Yellow (energy, food vibe)
        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15', // Soft Yellow - Main Yellow
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // Dark Gray (text, professionalism)
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937', // Dark Gray - Main Dark Color
          900: '#111827',
        },
        // Background Colors
        background: {
          light: '#f9fafb', // Light Gray
          DEFAULT: '#ffffff', // White
        },
        // Brand Colors
        chicken: {
          light: '#f5deb3',
          DEFAULT: '#d2691e',
          dark: '#8b4513',
        },
        fresh: {
          light: '#d1fae5',
          DEFAULT: '#10b981',
          dark: '#047857',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
