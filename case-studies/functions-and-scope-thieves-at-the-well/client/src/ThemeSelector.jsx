import React, { useState, useEffect } from 'react';
import { Brain, ArrowRight, Gauge, AlertTriangle, Monitor } from 'lucide-react';
import './styles.css';

export default function ThemeSelector({ onSelect }) {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    fetch(`${API_URL}/scenarios`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch themes');
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Invalid data format');
        const uniqueThemes = [...new Set(data.map(s => s.theme))].filter(Boolean);
        const dynamicThemes = uniqueThemes.map(themeName => {
          const lower = themeName.toLowerCase();
          let iconName = 'Monitor';
          let color = 'blue';
          let desc = 'Learn fundamental Python concepts through everyday scenarios.';
          
          if (lower.includes('motor')) { 
            iconName = 'Gauge'; 
            color = 'red'; 
            desc = 'Master Python by analyzing race data, tire degradation, and lap times.'; 
          }
          else if (lower.includes('bio')) { 
            iconName = 'Brain'; 
            color = 'green'; 
            desc = 'Apply Python to medical data, ECG signals, and biological systems.'; 
          }
           
          return {
            id: themeName,
            title: themeName,
            description: desc,
            iconName,
            color
          };
        });
        setThemes(dynamicThemes);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function renderIcon(name) {
    if (name === 'Gauge') return <Gauge size={48} className="text-[#C85A32]" />;
    if (name === 'Brain') return <Brain size={48} className="text-teal-600" />;
    return <Monitor size={48} className="text-amber-600" />;
  }

  return (
    <div className="theme-selector-wrapper bg-[#FFFDF9]">
      <div className="theme-selector-container">
        <header className="theme-header">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg mx-auto mb-6">
            <Brain size={40} className="text-white" />
          </div>
          <h1 className="text-slate-900 font-black">Welcome to PyBe</h1>
          <p className="text-slate-600 font-medium">Choose your learning trajectory. Every theme teaches the same core Python concepts, but tailored to your interests.</p>
        </header>

        {loading && <div className="text-center text-amber-600 font-extrabold py-8 animate-pulse">Loading Trajectories...</div>}
        
        {error && (
          <div className="text-center text-rose-600 p-6 bg-rose-50 rounded-2xl border border-rose-200">
            <AlertTriangle size={32} className="mx-auto mb-2 text-rose-500" />
            <p className="font-bold">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="theme-grid">
            {themes.map((theme) => (
              <div 
                key={theme.id} 
                className={`theme-card theme-${theme.color}`}
                onClick={() => onSelect(theme.id)}
              >
                <div className="theme-card-icon">
                  {renderIcon(theme.iconName)}
                </div>
                <div className="theme-card-content">
                  <h2 className="text-slate-900 font-black">{theme.title}</h2>
                  <p className="text-slate-600">{theme.description}</p>
                </div>
                <div className="theme-card-action text-[#C85A32]">
                  <span>Start Learning</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
