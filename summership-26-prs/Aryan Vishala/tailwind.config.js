/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        soil: {
          50: '#f7f0e4',
          100: '#ecdcc0',
          200: '#d9bb88',
          300: '#c79a55',
          400: '#a9783a',
          500: '#7a5a2a',
          600: '#5b4128',
          700: '#4a3320',
          800: '#332216',
          900: '#1d1208',
        },
        colony: {
          amber: '#fbbf24',
          cream: '#e8d9bf',
          moss: '#3f6b3a',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
