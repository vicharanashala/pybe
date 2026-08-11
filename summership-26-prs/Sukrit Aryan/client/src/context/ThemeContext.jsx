import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pybe_theme') || 'dark';
  });

  const [dashboardTheme, setDashboardThemeState] = useState(() => {
    return localStorage.getItem('pybe_dashboard_theme') || 'default';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pybe_theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }

  function setDashboardTheme(newTheme) {
    setDashboardThemeState(newTheme);
    localStorage.setItem('pybe_dashboard_theme', newTheme);
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      isDark: theme === 'dark',
      dashboardTheme,
      setDashboardTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

