// themeStyles.js
//
// Full-UI theming. Every learner picks one of 5 real-world genres at
// onboarding (sports / daily-life / philosophy / food / environmental), and this
// file is what makes that choice repaint the ENTIRE app — not just the
// discovery-learning cards. `applyThemePalette` overwrites the app's
// --color-brand-* CSS variables (defined in index.css) at runtime, and
// because every primary button (.btn-primary), every card accent, every
// input focus ring, and most nav/badge highlights are built from the
// `brand` Tailwind color (which now just reads those variables — see
// tailwind.config.js), changing the variables changes the whole UI's
// accent color instantly, everywhere, with no per-component work needed.
//
// No emoji anywhere in this app — every theme uses a real lucide-react
// icon component instead (`theme.icon`, rendered as <theme.icon size={..}/>).
//
// THEME_META below also carries small per-component extras (label, soft
// background/border helper classes) used by cards that want a themed tint
// without being a `bg-brand-*` element.

import { Trophy, Sun, Brain, UtensilsCrossed, Leaf } from 'lucide-react';

const PALETTES = {
  sports: { // orange
    50: '255 247 237', 100: '255 237 213', 200: '254 215 170', 300: '253 186 116',
    400: '251 146 60', 500: '249 115 22', 600: '234 88 12', 700: '194 65 12',
    800: '154 52 18', 900: '124 45 18',
  },
  'daily-life': { // sky blue
    50: '240 249 255', 100: '224 242 254', 200: '186 230 253', 300: '125 211 252',
    400: '56 189 248', 500: '14 165 233', 600: '2 132 199', 700: '3 105 161',
    800: '7 89 133', 900: '12 74 110',
  },
  philosophy: { // indigo
    50: '238 242 255', 100: '224 231 255', 200: '199 210 254', 300: '165 180 252',
    400: '129 140 248', 500: '99 102 241', 600: '79 70 229', 700: '67 56 202',
    800: '55 48 163', 900: '49 46 129',
  },
  food: { // rose
    50: '255 241 242', 100: '255 228 230', 200: '254 205 211', 300: '253 164 175',
    400: '251 113 133', 500: '244 63 94', 600: '225 29 72', 700: '190 18 60',
    800: '159 18 57', 900: '136 19 55',
  },
  environmental: { // green
    50: '240 253 244', 100: '220 252 231', 200: '187 247 208', 300: '134 239 172',
    400: '74 222 128', 500: '34 197 94', 600: '22 163 74', 700: '21 128 61',
    800: '22 101 52', 900: '20 83 45',
  },
};

// The original PyBe Blue — shown before a theme is known (logged out, home,
// login/register, onboarding) and matches the default values baked into
// index.css, so there's no flash-of-wrong-color for those pages.
const DEFAULT_PALETTE = {
  50: '238 244 255', 100: '221 230 255', 200: '188 205 255', 300: '147 172 255',
  400: '107 135 251', 500: '61 90 241', 600: '47 70 209', 700: '37 54 168',
  800: '28 33 64', 900: '20 24 51',
};

const DEFAULT_THEME = 'daily-life';

export const THEME_META = {
  sports: {
    label: 'Sports',
    icon: Trophy,
    border: 'border-orange-200 dark:border-orange-900',
    bg: 'bg-orange-50/30 dark:bg-orange-900/10',
    iconBg: 'bg-orange-100 dark:bg-orange-900/40',
    accentText: 'text-orange-600 dark:text-orange-400',
    dot: 'bg-orange-500',
    cardBorder: 'border-orange-100 dark:border-orange-900',
    gradient: 'from-orange-500 to-red-500',
    ring: 'ring-orange-500/30',
    glow: 'shadow-orange-500/20',
  },
  'daily-life': {
    label: 'Day-to-Day Life',
    icon: Sun,
    border: 'border-sky-200 dark:border-sky-900',
    bg: 'bg-sky-50/30 dark:bg-sky-900/10',
    iconBg: 'bg-sky-100 dark:bg-sky-900/40',
    accentText: 'text-sky-600 dark:text-sky-400',
    dot: 'bg-sky-500',
    cardBorder: 'border-sky-100 dark:border-sky-900',
    gradient: 'from-sky-400 to-blue-500',
    ring: 'ring-sky-500/30',
    glow: 'shadow-sky-500/20',
  },
  philosophy: {
    label: 'Philosophy',
    icon: Brain,
    border: 'border-indigo-200 dark:border-indigo-900',
    bg: 'bg-indigo-50/30 dark:bg-indigo-900/10',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/40',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    dot: 'bg-indigo-500',
    cardBorder: 'border-indigo-100 dark:border-indigo-900',
    gradient: 'from-indigo-500 to-violet-500',
    ring: 'ring-indigo-500/30',
    glow: 'shadow-indigo-500/20',
  },
  food: {
    label: 'Food',
    icon: UtensilsCrossed,
    border: 'border-rose-200 dark:border-rose-900',
    bg: 'bg-rose-50/30 dark:bg-rose-900/10',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
    accentText: 'text-rose-600 dark:text-rose-400',
    dot: 'bg-rose-500',
    cardBorder: 'border-rose-100 dark:border-rose-900',
    gradient: 'from-rose-500 to-amber-400',
    ring: 'ring-rose-500/30',
    glow: 'shadow-rose-500/20',
  },
  environmental: {
    label: 'Environmental',
    icon: Leaf,
    border: 'border-green-200 dark:border-green-900',
    bg: 'bg-green-50/30 dark:bg-green-900/10',
    iconBg: 'bg-green-100 dark:bg-green-900/40',
    accentText: 'text-green-600 dark:text-green-400',
    dot: 'bg-green-500',
    cardBorder: 'border-green-100 dark:border-green-900',
    gradient: 'from-green-500 to-emerald-500',
    ring: 'ring-green-500/30',
    glow: 'shadow-green-500/20',
  },
};

export function getThemeMeta(theme) {
  return THEME_META[theme] || THEME_META[DEFAULT_THEME];
}

// Overwrites the app-wide --color-brand-* CSS variables so every element
// styled with brand-50..900 (btn-primary, card, input focus, nav
// highlights, badges, etc.) instantly re-colors to match `theme`.
export function applyThemePalette(theme) {
  if (typeof document === 'undefined') return; // SSR guard, not used but safe
  const palette = PALETTES[theme] || DEFAULT_PALETTE;
  const root = document.documentElement;
  for (const shade of Object.keys(palette)) {
    root.style.setProperty(`--color-brand-${shade}`, palette[shade]);
  }
  root.setAttribute('data-theme', PALETTES[theme] ? theme : DEFAULT_THEME);
}

export function resetThemePalette() {
  applyThemePalette(null);
}
