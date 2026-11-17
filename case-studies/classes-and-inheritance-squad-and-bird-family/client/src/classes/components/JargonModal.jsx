import React from "react";

export default function JargonModal({ jargonKey, content, onClose }) {
  if (!jargonKey || !content) return null;

  return (
    <div className="custom-popup-overlay" onClick={onClose}>
      <div className="custom-popup-content expanded-popup" onClick={(e) => e.stopPropagation()}>
        <button className="custom-popup-close" onClick={onClose}>
          &times;
        </button>

        <header className="popup-header">
          <h3>{content.title}</h3>
          <span className="popup-subtitle">{content.subtitle}</span>
        </header>

        <div className="popup-body">
          <p className="popup-summary">{content.summary}</p>
          
          <div className="popup-details">
            <h4>Key Concepts</h4>
            <ul>
              {content.details.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          {content.example && (
            <div className="popup-code-block">
              <h4>Code Example</h4>
              <pre><code>{content.example}</code></pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}