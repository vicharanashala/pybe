import { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { applyThemePalette } from '../utils/themeStyles';

/**
 * ThemeSync — the thing that makes theme selection actually repaint the
 * whole app. Mount this once, inside AuthProvider, above the routes.
 *
 * It has no UI of its own: it just watches `user.theme` and calls
 * applyThemePalette() whenever it changes (login, onboarding completion,
 * logout, page reload with a saved user). Because every primary button,
 * card, input focus ring, and most nav/badge highlights are built from the
 * `brand` Tailwind color — which now reads CSS variables instead of fixed
 * hex values — this one effect is enough to re-skin the entire UI.
 */
export default function ThemeSync() {
  const { user } = useAuth();

  useEffect(() => {
    applyThemePalette(user?.theme);
  }, [user?.theme]);

  return null;
}
