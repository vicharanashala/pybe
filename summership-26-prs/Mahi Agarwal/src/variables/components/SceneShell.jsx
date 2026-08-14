import React from 'react';

// Thin layout wrapper every scene uses so the "chapter" tag + heading always
// sit the same way, without every scene re-typing the same three lines.
export default function SceneShell({ chapter, title, intro, children, className = '' }) {
  return (
    <div className={`dm-scene ${className}`}>
      {chapter && <span className="dm-chapter-tag">{chapter}</span>}
      {title && <h2>{title}</h2>}
      {intro && <p className="dm-scene-intro">{intro}</p>}
      {children}
    </div>
  );
}
