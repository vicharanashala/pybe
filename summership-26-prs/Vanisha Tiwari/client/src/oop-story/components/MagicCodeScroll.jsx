import React from 'react';
import { Scroll, Sparkles, AlertTriangle } from 'lucide-react';
import '../styles/petCareUI.css';

export default function MagicCodeScroll({ codeSnippet }) {
  if (!codeSnippet) return null;

  const { title, code, explanation, danger } = codeSnippet;

  return (
    <div className="magic-scroll-container">
      <div className="magic-scroll-header">
        <div className="magic-scroll-title">
          {danger ? (
            <span style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={20} /> {title}
            </span>
          ) : (
            <>
              <Scroll size={20} color="#D97706" /> {title} <Sparkles size={16} color="#FBBF24" />
            </>
          )}
        </div>
      </div>

      <div className="code-box-styled">
        <pre>
          <code>{code}</code>
        </pre>
      </div>

      {explanation && (
        <div className="magic-scroll-explanation">
          <span>💡</span> {explanation}
        </div>
      )}
    </div>
  );
}
