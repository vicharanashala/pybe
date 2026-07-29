import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme, type ThemeMode } from '../state/ThemeContext.tsx';

/**
 * Compact theme toggle with three modes: light / dark / system.
 * Click cycles light → dark → system → light.
 */
export function ThemeToggle() {
  const { mode, resolved, toggle } = useTheme();
  const Icon = mode === 'dark' ? Moon : mode === 'light' ? Sun : Monitor;
  const label: Record<ThemeMode, string> = {
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  };

  return (
    <button
      type="button"
      data-testid="pybe-theme-toggle"
      data-mode={mode}
      data-resolved={resolved}
      onClick={toggle}
      aria-label={`Theme: ${label[mode]} (click to cycle)`}
      title={`Theme: ${label[mode]} (click to cycle)`}
      className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700 shadow-sm transition-all hover:border-amber-300 hover:text-amber-800 active:scale-95 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:border-amber-500"
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label[mode]}</span>
    </button>
  );
}