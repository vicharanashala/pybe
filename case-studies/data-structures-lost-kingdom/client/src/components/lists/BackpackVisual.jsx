import React from 'react';
import ItemCard from './ItemCard.jsx';

/**
 * BackpackVisual — the animated backpack containing item cards.
 *
 * Props:
 *   items        — array of { id, icon, label }
 *   showIndexes  — show [0], [1], … badges on each card
 *   highlightId  — item id to highlight
 *   removingId   — item id currently being removed (plays exit animation)
 *   addingId     — item id currently being added (plays entry animation)
 *   selectedId   — item id that is selected/active
 *   onItemClick  — optional (itemId) => void
 *   chapterColor
 *   chapterGlow
 */
export default function BackpackVisual({
  items = [],
  showIndexes = false,
  highlightId,
  removingId,
  addingId,
  selectedId,
  onItemClick,
  chapterColor = '#39d353',
  chapterGlow  = 'rgba(57,211,83,0.3)',
}) {
  function getVariant(item) {
    if (item.id === removingId)   return 'removing';
    if (item.id === addingId)     return 'adding';
    if (item.id === highlightId)  return 'highlighted';
    if (item.id === selectedId)   return 'selected';
    return 'default';
  }

  return (
    <div className="backpack-visual" style={{ '--chapter-glow': chapterGlow }}>
      {/* Backpack graphic */}
      <div className="backpack-emoji-wrap">
        <span className="backpack-emoji" role="img" aria-label="magical backpack">🎒</span>
        <div className="backpack-glow" style={{ background: chapterGlow }} aria-hidden="true" />
      </div>

      {/* Item cards row */}
      <div className="backpack-items">
        {items.length === 0 ? (
          <div className="backpack-empty">
            <span>Empty backpack</span>
          </div>
        ) : (
          items.map((item, i) => (
            <ItemCard
              key={item.id}
              item={item}
              index={i}
              showIndex={showIndexes}
              variant={getVariant(item)}
              chapterColor={chapterColor}
              onClick={onItemClick ? () => onItemClick(item.id) : undefined}
            />
          ))
        )}
      </div>

      {/* Item count badge */}
      <div className="backpack-count" style={{ color: chapterColor }}>
        {items.length} item{items.length !== 1 ? 's' : ''} in backpack
      </div>
    </div>
  );
}
