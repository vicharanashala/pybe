/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#090909',
        voidRaised: '#121014',
        blood: '#E50914',
        bloodDim: '#8f0710',
        volt: '#00C2FF',
        rift: '#7A00FF',
        fog: '#5c5c66',
      },
      fontFamily: {
        display: ['"Bebas Neue"', '"Oswald"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        blood: '0 0 24px rgba(229, 9, 20, 0.55)',
        volt: '0 0 24px rgba(0, 194, 255, 0.55)',
        rift: '0 0 24px rgba(122, 0, 255, 0.55)',
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 22%, 24%, 55%': { opacity: '0.4' },
        },
        drift: {
          '0%': { transform: 'translateX(-10%) translateY(0)' },
          '50%': { transform: 'translateX(5%) translateY(-4%)' },
          '100%': { transform: 'translateX(-10%) translateY(0)' },
        },
        rise: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0' },
          '10%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-120vh) scale(1.4)', opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        flicker: 'flicker 6s linear infinite',
        drift: 'drift 22s ease-in-out infinite',
        rise: 'rise linear infinite',
        scanline: 'scanline 8s linear infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
