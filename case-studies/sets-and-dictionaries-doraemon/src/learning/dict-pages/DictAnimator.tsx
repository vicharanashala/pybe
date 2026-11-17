import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Terminal, ArrowRight } from 'lucide-react';

interface KeyValueEntry {
  key: string;
  value: string;
  icon: string;
}

const SAMPLE_DICT: KeyValueEntry[] = [
  { key: 'Door', value: 'Dial destination & turn knob', icon: '🚪' },
  { key: 'Copter', value: 'Attach to head & spin rotor', icon: '🚁' },
  { key: 'Light', value: 'Press yellow button', icon: '🔦' },
  { key: 'Bread', value: 'Press on textbook & eat', icon: '🍞' }
];

export const DictAnimator: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string | null>('Light');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handleLookup = (keyName: string) => {
    setActiveKey(keyName);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const activeEntry = SAMPLE_DICT.find(d => d.key === activeKey) || SAMPLE_DICT[0];

  return (
    <GlassCard style={{ padding: '24px', background: '#091124', border: '1.5px solid rgba(0, 140, 255, 0.3)', color: 'white' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={16} style={{ color: '#38bdf8' }} />
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.5px', fontFamily: 'var(--font-mono)' }}>
            INTERACTIVE DICTIONARY LOOKUP ANIMATOR
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>dict[key] → O(1) Instant</span>
      </div>

      {/* Interactive Key Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {SAMPLE_DICT.map((item) => {
          const isSelected = activeKey === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleLookup(item.key)}
              style={{
                padding: '8px 14px', borderRadius: '8px',
                background: isSelected ? '#008cff' : 'rgba(255, 255, 255, 0.06)',
                border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isSelected ? 'white' : '#cbd5e1',
                fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{item.icon}</span>
              <span>"{item.key}"</span>
            </button>
          );
        })}
      </div>

      {/* Code syntax line */}
      <div style={{
        padding: '12px 16px', borderRadius: '10px',
        background: '#050c1a', border: '1px solid rgba(255, 255, 255, 0.08)',
        fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#f1f5f9',
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'
      }}>
        <span style={{ color: '#ec4899' }}>pocket</span>
        <span>[</span>
        <span style={{ color: '#38bdf8' }}>"{activeEntry.key}"</span>
        <span>]</span>
        <ArrowRight size={14} style={{ color: '#94a3b8' }} />
        <span style={{ color: '#34d399' }}>"{activeEntry.value}"</span>
      </div>

      {/* Visual Animation Drawer Box */}
      <div style={{
        padding: '20px', borderRadius: '14px',
        background: 'rgba(0, 140, 255, 0.05)',
        border: '1.5px dashed rgba(0, 140, 255, 0.3)',
        display: 'flex', alignItems: 'center', gap: '16px',
        transition: 'transform 0.2s ease'
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #008cff, #0060ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', flexShrink: 0,
          transform: isAnimating ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          {activeEntry.icon}
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
            KEY: "{activeEntry.key}"
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'white', lineHeight: 1.4 }}>
            VALUE: <span style={{ color: '#34d399' }}>"{activeEntry.value}"</span>
          </div>
        </div>
      </div>

    </GlassCard>
  );
};

export default DictAnimator;
