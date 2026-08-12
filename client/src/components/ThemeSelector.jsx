import React from 'react';

const THEMES = [
  'School', 'Hospital', 'Sports', 'Shopping', 'Travel', 'Space',
  'Banking', 'Gaming', 'Environment', 'Cooking', 'Business', 'Office'
];

/**
 * Feature 1 helper: a grid of theme choices for the AI Scenario Generator.
 */
function ThemeSelector({ value, onChange }) {
  return (
    <div className="theme-selector">
      {THEMES.map((theme) => (
        <button
          type="button"
          key={theme}
          className={value === theme ? 'theme-chip active' : 'theme-chip'}
          onClick={() => onChange(theme)}
        >
          {theme}
        </button>
      ))}
    </div>
  );
}

export default ThemeSelector;
