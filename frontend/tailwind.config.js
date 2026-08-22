/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zinc: {
          950: '#09090b',
        },
        accent: {
          DEFAULT: '#3b82f6', // modern blue
          glow: '#60a5fa',
        },
        lazyBg: '#0E0014',
        lazyText: '#EBD9FF',
        lazyAccent: '#9494FF',
        lazyDeep: '#66008D',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
