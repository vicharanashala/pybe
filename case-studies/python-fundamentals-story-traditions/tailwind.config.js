/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: {
          light: '#FCFBF7',
          card: '#F6F3EB',
          border: '#E6DFD3',
          dark: '#13141C',
          darkCard: '#1C1D29',
          darkBorder: '#2C2D3F',
        },
        royal: {
          crimson: '#8C1A2E',
          crimsonHover: '#6E1424',
          gold: '#D4AF37',
          goldHover: '#B8962E',
          indigo: '#1A2F50',
          indigoHover: '#13223B',
        },
      },
      fontFamily: {
        serif: ['Marcellus', 'Playfair Display', 'serif'],
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
