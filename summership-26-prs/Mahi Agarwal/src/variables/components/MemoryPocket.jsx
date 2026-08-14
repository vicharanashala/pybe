import React from 'react';

// The visual "named memory box" used everywhere from Scene 4 onward: a
// glowing orb that's empty until a gadget is stored in it, labeled with
// both its friendly pocket name and (once revealed) its Python variable
// name. This is the module's signature shape — every pocket the learner
// meets, in every later scene, looks like this.
export default function MemoryPocket({
  label,
  varName,
  emoji,
  glow = false,
  onDragOver,
  onDrop,
  onClick,
  interactive = false
}) {
  return (
    <div
      className={`dm-pocket ${glow ? 'dm-pocket-glow' : ''}`}
      onDragOver={interactive ? (e) => { e.preventDefault(); onDragOver?.(e); } : undefined}
      onDrop={interactive ? onDrop : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={`dm-pocket-orb ${emoji ? 'filled' : ''}`}>
        {emoji || '✨'}
      </div>
      <span className="dm-pocket-label">{label}</span>
      {varName ? <span className="dm-pocket-varname">{varName}</span> : <span className="dm-pocket-empty">empty</span>}
    </div>
  );
}
