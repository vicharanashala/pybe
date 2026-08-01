import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('pybe-theme') || 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('pybe-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      {theme === 'light' ? 'Night mode' : 'Day mode'}
    </button>
  );
}
