import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import './styles/animations.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

// Apply saved theme immediately to avoid flash
const saved = localStorage.getItem('pybe_theme') || 'dark';
document.documentElement.setAttribute('data-theme', saved);

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
