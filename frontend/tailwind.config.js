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
        brand: {
          50: 'rgb(var(--color-brand-50) / <alpha-value>)',
          100: 'rgb(var(--color-brand-100) / <alpha-value>)',
          200: 'rgb(var(--color-brand-200) / <alpha-value>)',
          300: 'rgb(var(--color-brand-300) / <alpha-value>)',
          400: 'rgb(var(--color-brand-400) / <alpha-value>)',
          500: 'rgb(var(--color-brand-500) / <alpha-value>)', // theme accent
          600: 'rgb(var(--color-brand-600) / <alpha-value>)',
          700: 'rgb(var(--color-brand-700) / <alpha-value>)',
          800: 'rgb(var(--color-brand-800) / <alpha-value>)',
          900: 'rgb(var(--color-brand-900) / <alpha-value>)',
        },
        secondary: '#7a5cff', // PyBe Violet
        accentYellow: '#ffc93c',
        success: '#33b28c',
        background: '#eef4ff',
        // ── ink: light-console palette used by the embedded Python
        // practice/visualizer widget (ported from the PyTutor component).
        // 950 stays dark on purpose — it's used only as *text* on bright
        // accent buttons (bg-cyan-500 text-ink-950), never as a background.
        ink: {
          950: '#0b1220',
          900: '#ffffff',
          850: '#f8fafc',
          800: '#f1f5f9',
          700: '#e7ecf3',
          600: '#dbe2ee',
          500: '#c7d0e0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 0 1px rgba(45,212,238,0.45), 0 0 22px -4px rgba(45,212,238,0.45)',
        'glow-cyan-sm': '0 0 0 1px rgba(45,212,238,0.35), 0 0 10px -2px rgba(45,212,238,0.4)',
        'glow-violet': '0 0 0 1px rgba(167,139,250,0.45), 0 0 18px -4px rgba(167,139,250,0.4)',
      },
    },
  },
  plugins: [],
}
