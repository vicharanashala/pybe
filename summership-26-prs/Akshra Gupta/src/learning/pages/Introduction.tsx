import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Sparkles, HelpCircle, CheckCircle } from 'lucide-react';

interface IntroductionProps {
  title?: string;
  subtitle?: string;
  objectives?: string[];
}

export const Introduction: React.FC<IntroductionProps> = () => {
  // Piles of items in Nobita's room (lots of duplicates!)
  const [items, setItems] = useState<string[]>([
    '📚 Space Comic', 
    '🧸 Toy Robot', 
    '📚 Space Comic', 
    '🍎 Apple Snack', 
    '🧸 Toy Robot'
  ]);
  const [isZapped, setIsZapped] = useState<boolean>(false);
  const [searchItem, setSearchItem] = useState<string | null>(null);

  const handleZap = () => {
    setIsZapped(true);
    // Vaporize duplicates instantly!
    setItems(['📚 Space Comic', '🧸 Toy Robot', '🍎 Apple Snack']);
  };

  const handleReset = () => {
    setIsZapped(false);
    setItems([
      '📚 Space Comic', 
      '🧸 Toy Robot', 
      '📚 Space Comic', 
      '🍎 Apple Snack', 
      '🧸 Toy Robot'
    ]);
    setSearchItem(null);
  };

  const getItemLabel = (emoji: string): string => {
    switch (emoji) {
      case '📚': return 'Space Comic';
      case '🧸': return 'Toy Robot';
      case '🍎': return 'Apple Snack';
      default: return 'Gadget';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }} className="animate-fade-in">
      
      {/* Episode Intro Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: '#008cff' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#008cff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>EPISODE START: ROOM OVERFLOW!</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a', margin: 0 }}>Nobita's Messy Room Crisis!</h2>
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
          "Doraemon! Help! My room is overflowing with repeating comic books and toys! I can't find anything!"
        </p>
      </div>

      {/* Narrative & Visual pile */}
      <GlassCard style={{ padding: '24px', backgroundColor: 'rgba(255, 255, 255, 0.85)', border: '1.5px solid rgba(0, 140, 255, 0.12)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
            Doraemon pulls a shiny gadget from his pocket: <strong>The Duplicate Disintegrator Beam!</strong> 
            It vaporizes repeating copies instantly, leaving exactly one of each item behind.
          </p>

          <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
            {isZapped ? "✅ Room Cleared (Only unique items remain):" : "👇 Room Pile (Contains duplicate items):"}
          </div>

          {/* Visual representation of item pile */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center', 
            padding: '20px', 
            background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)', 
            borderRadius: '16px', 
            border: '1.5px solid rgba(0,0,0,0.04)',
            flexWrap: 'wrap'
          }}>
            {items.map((item, index) => (
              <div 
                key={index} 
                style={{ 
                  fontSize: '15px', 
                  padding: '10px 14px',
                  backgroundColor: 'white', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  transform: isZapped ? 'scale(1.05)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              >
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {!isZapped ? (
              <button 
                onClick={handleZap}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(239, 68, 68, 0.25)'
                }}
              >
                💥 Fire Disintegrator Beam!
              </button>
            ) : (
              <button 
                onClick={handleReset}
                style={{
                  backgroundColor: '#64748b',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                🔄 Reset Messy Room
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Instant presence checker mini-game */}
      {isZapped && (
        <GlassCard style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0, 140, 255, 0.08)' }} className="animate-fade-in">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HelpCircle size={14} style={{ color: '#008cff' }} />
              Nobita asks: "Are we sure my Space Comic didn't get destroyed?"
            </div>

            <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
              Point the <strong>Instant Pocket Finder</strong> to scan the unique room pile:
            </p>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['📚', '🧸', '🚁'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSearchItem(emoji)}
                  style={{
                    fontSize: '14px',
                    padding: '8px 16px',
                    backgroundColor: searchItem === emoji ? '#eff6ff' : 'white',
                    border: searchItem === emoji ? '2px solid #008cff' : '1px solid rgba(0,0,0,0.08)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600
                  }}
                >
                  <span>{emoji}</span>
                  <span style={{ fontSize: '12px', color: '#475569' }}>{emoji === '🚁' ? 'Bamboo Copter' : getItemLabel(emoji)}</span>
                </button>
              ))}
            </div>

            {searchItem && (
              <div style={{ 
                padding: '12px', 
                borderRadius: '8px', 
                backgroundColor: searchItem === '🚁' ? 'rgba(239, 68, 68, 0.03)' : 'rgba(34, 197, 94, 0.03)',
                border: searchItem === '🚁' ? '1px dashed #ef4444' : '1px dashed #22c55e',
                fontSize: '12px',
                color: searchItem === '🚁' ? '#b91c1c' : '#15803d',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle size={14} style={{ color: searchItem === '🚁' ? '#ef4444' : '#22c55e' }} />
                {searchItem === '🚁' 
                  ? `Not found! (Verified instantly in 1 check step)` 
                  : `Found ${getItemLabel(searchItem)}! (Verified instantly in 1 check step)`}
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Curious Question */}
      <GlassCard style={{ padding: '16px 20px', borderLeft: '4px solid #008cff', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}>
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
          💡 <strong>The Mystery:</strong> Checking a list for an item usually takes checking every spot one-by-one. How can the Pocket Finder verify containment in exactly **1 step**, regardless of how many items are in the pile? Let's join Doraemon and Nobita to find out!
        </p>
      </GlassCard>
    </div>
  );
};

export default Introduction;
