/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'pybe-amber': '#f59e0b',
        'pybe-emerald': '#10b981',
        'pybe-sky': '#0ea5e9',
        'pybe-lavender': '#a78bfa',
      },
    },
  },
  plugins: [],
};