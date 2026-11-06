import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, HelpCircle } from 'lucide-react';

export const InteractiveCodeBlock = () => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const tokenExplanations = {
    curly: {
      title: '{ } Curly Brackets',
      desc: 'The Chest! In Python, curly brackets create a Dictionary (Hashmap) to hold all your keys and values.'
    },
    key: {
      title: '"star" The Key (Sticker)',
      desc: 'The Key! Always unique. Like a label on a drawer, this is what you use to look up a treasure.'
    },
    colon: {
      title: ': The Colon Separator',
      desc: 'The Binding Link! In Python dictionaries, a colon separates each Key from its corresponding Value.'
    },
    value: {
      title: '"Golden Coin" The Value (Treasure)',
      desc: 'The Value! The actual treasure stored inside the drawer. Retrieved instantly when the key is supplied.'
    }
  };

  const handleHover = (type) => {
    setActiveTooltip(tokenExplanations[type]);
  };

  const handleLeave = () => {
    setActiveTooltip(null);
  };

  return (
    <div className="interactive-code-block-wrapper" style={{ margin: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={14} color="var(--secondary)" /> Hover over highlighted words to see their magical secret!
        </span>
      </div>

      <div 
        style={{
          background: 'rgba(5, 5, 15, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          fontFamily: "'Fira Code', monospace",
          fontSize: '1.05rem',
          lineHeight: '1.8',
          color: '#E0E0E0',
          position: 'relative'
        }}
      >
        <div style={{ color: '#6A737D', marginBottom: '6px' }}># The Wizard's Python Spellbook</div>
        <div>
          <span style={{ color: '#FF7B72' }}>wizard_chest</span> = <span 
            onMouseEnter={() => handleHover('curly')}
            onMouseLeave={handleLeave}
            style={{ color: 'var(--secondary)', cursor: 'pointer', borderBottom: '2px dotted var(--secondary)', padding: '0 2px' }}
          >
            {'{'}
          </span>
        </div>

        <div style={{ paddingLeft: '24px' }}>
          <span 
            onMouseEnter={() => handleHover('key')}
            onMouseLeave={handleLeave}
            style={{ color: '#79C0FF', cursor: 'pointer', borderBottom: '2px dotted #79C0FF', padding: '0 2px' }}
          >
            "star"
          </span>
          <span 
            onMouseEnter={() => handleHover('colon')}
            onMouseLeave={handleLeave}
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', borderBottom: '2px dotted var(--primary)', margin: '0 4px' }}
          >
            :
          </span>
          <span 
            onMouseEnter={() => handleHover('value')}
            onMouseLeave={handleLeave}
            style={{ color: '#7EE787', cursor: 'pointer', borderBottom: '2px dotted #7EE787', padding: '0 2px' }}
          >
            "Golden Coin"
          </span>,
        </div>

        <div style={{ paddingLeft: '24px' }}>
          <span style={{ color: '#79C0FF' }}>"heart"</span>
          <span style={{ color: 'var(--primary)', margin: '0 4px' }}>:</span>
          <span style={{ color: '#7EE787' }}>"Ruby"</span>,
        </div>

        <div style={{ paddingLeft: '24px' }}>
          <span style={{ color: '#79C0FF' }}>"skull"</span>
          <span style={{ color: 'var(--primary)', margin: '0 4px' }}>:</span>
          <span style={{ color: '#7EE787' }}>"Cursed Ring"</span>
        </div>

        <div>
          <span 
            onMouseEnter={() => handleHover('curly')}
            onMouseLeave={handleLeave}
            style={{ color: 'var(--secondary)', cursor: 'pointer', borderBottom: '2px dotted var(--secondary)', padding: '0 2px' }}
          >
            {'}'}
          </span>
        </div>
      </div>

      {/* Dynamic Hover Tooltip Display */}
      <div style={{ minHeight: '60px', marginTop: '10px' }}>
        <AnimatePresence>
          {activeTooltip ? (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: 'rgba(0, 240, 255, 0.12)',
                border: '1px solid var(--secondary)',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '0.9rem',
                color: '#fff'
              }}
            >
              <strong style={{ color: 'var(--secondary)' }}>{activeTooltip.title}:</strong> {activeTooltip.desc}
            </motion.div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '10px 0' }}>
              💡 Hover over any curly bracket, quote, colon, or treasure to see its role in the spell!
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
