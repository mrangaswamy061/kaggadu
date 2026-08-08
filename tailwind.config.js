/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f5',
          100: '#e1efea',
          200: '#c5e1d7',
          300: '#9bcbba',
          400: '#6cae97',
          500: '#48917b',
          600: '#357563',
          700: '#2d6a4f', // Kaggadu Accent Green
          800: '#1b4332', // Deep Forest
          900: '#143d2b', // Dark Forest Primary
          950: '#0b2318',
        },
        earth: {
          50: '#faf9f5',
          100: '#f4f1ea',
          200: '#e7e2d4',
          300: '#d5caaf',
          400: '#c0ad87',
          500: '#b0966a',
          600: '#a3845b',
          700: '#87694b',
          800: '#6f5741',
          900: '#5c4837',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
        'card-glow': '0 0 20px rgba(45, 106, 79, 0.15)',
        'bottom-nav': '0 -4px 20px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
