/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F0FF',
          100: '#E0E0FF',
          200: '#C0C0FF',
          300: '#A0A0FF',
          400: '#8080FF',
          500: '#6C63FF',
          600: '#5A52E6',
          700: '#4841CC',
          800: '#3630B3',
          900: '#241F99',
        },
        accent: {
          50: '#E8F8F8',
          100: '#D0F0F0',
          200: '#A8E0E0',
          300: '#80D0D0',
          400: '#58C0C0',
          500: '#3ECFCF',
          600: '#32B8B8',
          700: '#26A1A1',
          800: '#1A8A8A',
          900: '#0E7373',
        },
        success: '#4CAF50',
        warning: '#FF9800',
        danger: '#F44336',
        'bg-light': '#F4F6FB',
        'text-primary': '#1A1A2E',
        'text-secondary': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        dyslexic: ['OpenDyslexic', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
