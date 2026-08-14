export interface TraditionTheme {
  icon: string;
  label: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
}

const traditionThemes: Record<string, TraditionTheme> = {
  'Panchatantra': {
    icon: '🐾',
    label: 'Panchatantra',
    accentText: 'text-green-700 dark:text-green-400',
    accentBg: 'bg-green-50 dark:bg-green-950/30',
    accentBorder: 'border-green-200 dark:border-green-800',
  },
  'Ancient Indian Village': {
    icon: '🏘️',
    label: 'Village Tales',
    accentText: 'text-amber-700 dark:text-amber-400',
    accentBg: 'bg-amber-50 dark:bg-amber-950/30',
    accentBorder: 'border-amber-200 dark:border-amber-800',
  },
  'Royal Court (Akbar-Birbal)': {
    icon: '👑',
    label: 'Akbar-Birbal',
    accentText: 'text-red-700 dark:text-red-400',
    accentBg: 'bg-red-50 dark:bg-red-950/30',
    accentBorder: 'border-red-200 dark:border-red-800',
  },
  'Temple Traditions': {
    icon: '🪷',
    label: 'Temple Traditions',
    accentText: 'text-orange-700 dark:text-orange-400',
    accentBg: 'bg-orange-50 dark:bg-orange-950/30',
    accentBorder: 'border-orange-200 dark:border-orange-800',
  },
  'Merchant Caravan': {
    icon: '🐫',
    label: 'Merchant Caravan',
    accentText: 'text-yellow-700 dark:text-yellow-400',
    accentBg: 'bg-yellow-50 dark:bg-yellow-950/30',
    accentBorder: 'border-yellow-200 dark:border-yellow-800',
  },
  'Jataka Tales': {
    icon: '🪷',
    label: 'Jataka Tales',
    accentText: 'text-blue-700 dark:text-blue-400',
    accentBg: 'bg-blue-50 dark:bg-blue-950/30',
    accentBorder: 'border-blue-200 dark:border-blue-800',
  },
  'Gurukul': {
    icon: '🌳',
    label: 'Gurukul',
    accentText: 'text-emerald-700 dark:text-emerald-400',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    accentBorder: 'border-emerald-200 dark:border-emerald-800',
  },
  'Vikram-Betal': {
    icon: '⚔️',
    label: 'Vikram-Betal',
    accentText: 'text-purple-700 dark:text-purple-400',
    accentBg: 'bg-purple-50 dark:bg-purple-950/30',
    accentBorder: 'border-purple-200 dark:border-purple-800',
  },
  'Tenali Rama': {
    icon: '🎭',
    label: 'Tenali Rama',
    accentText: 'text-orange-600 dark:text-orange-300',
    accentBg: 'bg-orange-50 dark:bg-orange-950/30',
    accentBorder: 'border-orange-200 dark:border-orange-800',
  },
};

const fallbackTheme: TraditionTheme = {
  icon: '📜',
  label: 'Story',
  accentText: 'text-royal-crimson dark:text-royal-gold',
  accentBg: 'bg-royal-crimson/5 dark:bg-royal-gold/5',
  accentBorder: 'border-royal-crimson/20 dark:border-royal-gold/20',
};

export const getTraditionTheme = (tradition: string): TraditionTheme =>
  traditionThemes[tradition] ?? fallbackTheme;
