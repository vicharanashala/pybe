/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        metro: {
          blue: '#1e3a8a',
          cyan: '#0284c7',
          yellow: '#f59e0b',
          red: '#dc2626',
        },
        hyderabad: {
          sunlight: '#fff8f0',
          terracotta: '#9a3412',
          amber: '#d97706',
          sand: '#fef3c7',
          brick: '#7c2d12',
          dark: '#1c1917',
          card: '#272422'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
        mono: ['Fira Code', 'monospace']
      },
      boxShadow: {
        'warm': '0 20px 25px -5px rgba(217, 119, 6, 0.15), 0 8px 10px -6px rgba(154, 52, 18, 0.1)',
        'cinematic': '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
}
