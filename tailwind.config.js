/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Medical Colors
        primary: {
          DEFAULT: '#0066CC',
          light: '#3399FF',
          dark: '#004C99',
        },
        // Secondary Colors
        secondary: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          dark: '#4F46E5',
        },
        // Semantic Colors
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#DC2626',
        },
        info: {
          DEFAULT: '#06B6D4',
          light: '#CFFAFE',
          dark: '#0891B2',
        },
        // Modern Teal/Aqua Palette
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        aqua: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-medical': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-teal': 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)',
        'gradient-aqua': 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 50%, #67e8f9 100%)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'primary': '0 10px 30px -5px rgba(0, 102, 204, 0.3)',
        'success': '0 10px 30px -5px rgba(16, 185, 129, 0.3)',
        'warning': '0 10px 30px -5px rgba(245, 158, 11, 0.3)',
        'error': '0 10px 30px -5px rgba(239, 68, 68, 0.3)',
        'glow': '0 0 20px rgba(20, 184, 166, 0.5)',
        'glow-lg': '0 0 30px rgba(20, 184, 166, 0.6)',
        'neon': '0 0 10px rgba(34, 211, 238, 0.7), 0 0 20px rgba(34, 211, 238, 0.4)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 102, 204, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 102, 204, 0.6)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}