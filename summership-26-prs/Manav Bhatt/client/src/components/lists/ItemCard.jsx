import React from 'react';

/**
 * ItemCard — a single item inside the magical backpack.
 *
 * Props:
 *   item        — { id, icon, label }
 *   index       — numeric position (shown as badge when showIndex=true)
 *   showIndex   — whether to show the [0], [1], … badge
 *   variant     — 'default' | 'adding' | 'removing' | 'highlighted' | 'selected' | 'dimmed'
 *   onClick     — optional click handler
 *   chapterColor — accent colour string
 */
export default function ItemCard({
  item,
  index,
  showIndex = false,
  variant = 'default',
  onClick,
  chapterColor = '#39d353',
}) {
  const variantStyles = {
    default:     {},
    adding:      { animation: 'itemSlideIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both' },
    removing:    { animation: 'itemSlideOut 0.4s ease-in forwards' },
    highlighted: { boxShadow: `0 0 0 2px ${chapterColor}, 0 0 18px ${chapterColor}55`, background: `rgba(57,211,83,0.12)` },
    selected:    { boxShadow: `0 0 0 2.5px ${chapterColor}`, background: `rgba(57,211,83,0.18)`, transform: 'scale(1.06)' },
    dimmed:      { opacity: 0.4 },
  };

  return (
    <div
      className={`item-card item-card--${variant}`}
      style={{
        '--card-accent': chapterColor,
        ...variantStyles[variant],
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      aria-label={item.label}
    >
      {showIndex && (
        <span className="item-card__index" style={{ color: chapterColor }}>
          [{index}]
        </span>
      )}
      <span className="item-card__icon" role="img" aria-hidden="true">
        {item.icon}
      </span>
      <span className="item-card__label">{item.label}</span>
    </div>
  );
}
