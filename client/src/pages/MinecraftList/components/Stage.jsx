import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';

export default function Stage({ items, speed = 1, highlight = null, codeLine = "inventory = []", metaPills = [] }) {
  const trackRef = useRef(null);
  const prevRectsRef = useRef(new Map());
  const [renderItems, setRenderItems] = useState(items);
  const [leavingIds, setLeavingIds] = useState([]);
  const [enteringIds, setEnteringIds] = useState([]);

  // Sync incoming items with our internal render list to allow leave animations
  useEffect(() => {
    const currentIds = items.map(i => i.id);
    const prevIds = renderItems.map(i => i.id);
    
    // Find who is leaving
    const leaving = renderItems.filter(i => !currentIds.includes(i.id));
    if (leaving.length > 0) {
      setLeavingIds(leaving.map(i => i.id));
      // Remove them after animation
      const timer = setTimeout(() => {
        setRenderItems(items);
        setLeavingIds([]);
      }, 380 / speed);
      return () => clearTimeout(timer);
    } else {
      // Find who is entering
      const entering = items.filter(i => !prevIds.includes(i.id));
      if (entering.length > 0) {
        setEnteringIds(entering.map(i => i.id));
        const timer = setTimeout(() => {
          setEnteringIds([]);
        }, 460 / speed);
        setRenderItems(items);
        return () => clearTimeout(timer);
      } else {
        // Just order changes (sort/reverse) or updates
        setRenderItems(items);
      }
    }
  }, [items, renderItems, speed]);

  // FLIP Animation
  useLayoutEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    
    // Last step of FLIP: apply transforms
    const currentRects = new Map();
    const cells = track.querySelectorAll('.cell');
    
    cells.forEach(cell => {
      const id = Number(cell.dataset.id);
      currentRects.set(id, cell.getBoundingClientRect());
    });

    cells.forEach(cell => {
      const id = Number(cell.dataset.id);
      const first = prevRectsRef.current.get(id);
      const isEntering = enteringIds.includes(id);
      
      if (first && !isEntering) {
        const last = currentRects.get(id);
        const dx = first.left - last.left;
        
        if (dx !== 0) {
          // Invert
          cell.style.transition = 'none';
          cell.style.transform = `translateX(${dx}px)`;
          
          // Play
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              cell.style.transition = `transform ${0.5 / speed}s cubic-bezier(.2,.8,.2,1)`;
              cell.style.transform = 'translateX(0)';
            });
          });
        } else {
           cell.style.transition = '';
           cell.style.transform = '';
        }
      }
    });

    // Save current rects for the next render
    prevRectsRef.current = currentRects;
  }, [renderItems, enteringIds, speed]);

  return (
    <div className="stage">
      <div className="stage-header">
        <div className="code-line mono">{codeLine}</div>
        <div className="meta-pills">
          {metaPills.map((pill, i) => (
            <span key={i} className="pill" style={pill.style}>{pill.text}</span>
          ))}
        </div>
      </div>
      
      <div className="track-wrap">
        <div className="track" ref={trackRef}>
          <div className="rail"></div>
          
          {renderItems.length === 0 && (
            <div className="empty-state">
              <div className="big">📦</div>
              <div>Inventory is empty</div>
            </div>
          )}

          {renderItems.map((item, idx) => {
            const isEntering = enteringIds.includes(item.id);
            const isLeaving = leavingIds.includes(item.id);
            
            let classNames = ['cell'];
            if (isEntering) classNames.push('enter');
            if (isLeaving) classNames.push('leave');
            
            if (highlight) {
              if (highlight.ids?.includes(item.id)) {
                classNames.push(`hl-${highlight.type}`);
              }
              if (highlight.bounceIds?.includes(item.id)) {
                classNames.push('bounce');
              }
            }

            return (
              <div 
                key={item.id} 
                data-id={item.id} 
                className={classNames.join(' ')}
                style={{ animationDuration: isEntering ? `${0.2 / speed}s` : '' }}
              >
                <div className="box">
                  <div className="idx">{idx}</div>
                  <div className="box-icon">{item.icon || '📦'}</div>
                  <div className="box-label">{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
