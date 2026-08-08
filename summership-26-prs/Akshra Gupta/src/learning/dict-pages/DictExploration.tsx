import React, { useState } from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { Sparkles, CheckCircle2, RotateCcw, Link2 } from 'lucide-react';

interface GadgetItem {
  name: string;
  action: string;
  icon: string;
}

const GADGET_PAIRS: GadgetItem[] = [
  { name: 'Anywhere Door', action: 'Dial destination & turn knob', icon: '🚪' },
  { name: 'Bamboo Copter', action: 'Attach to head & spin rotor', icon: '🚁' },
  { name: 'Small Light', action: 'Aim beam & press yellow button', icon: '🔦' },
  { name: 'Memory Bread', action: 'Press on textbook page & eat', icon: '🍞' }
];

export const DictExploration: React.FC = () => {
  const [pairedMap, setPairedMap] = useState<Record<string, string>>({});
  const [selectedGadget, setSelectedGadget] = useState<string | null>(null);

  const handlePairAction = (actionText: string) => {
    if (!selectedGadget) return;
    setPairedMap(prev => ({ ...prev, [selectedGadget]: actionText }));
    setSelectedGadget(null);
  };

  const handleReset = () => {
    setPairedMap({});
    setSelectedGadget(null);
  };

  const isComplete = Object.keys(pairedMap).length === GADGET_PAIRS.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} style={{ color: '#008cff' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#008cff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              STAGE 5 — INTERACTIVE EXPLORATION
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
            Help Nobita Build the Secret Codebook Manually
          </h2>
          <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
            Click a Gadget Name (Key), then click its matching Secret Action (Value) to pair them directly!
          </p>
        </div>

        <button
          onClick={handleReset}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 14px', borderRadius: '10px',
            border: '1px solid rgba(0,0,0,0.1)', background: 'white',
            color: '#64748b', fontSize: '12px', fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          <RotateCcw size={14} />
          <span>Reset Pairs</span>
        </button>
      </div>

      {/* Pairing Sandbox Container */}
      <GlassCard style={{ padding: '24px', background: 'white', border: '1.5px solid rgba(0, 140, 255, 0.2)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          
          {/* Column 1: Keys (Gadget Names) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#008cff', textTransform: 'uppercase', letterSpacing: '0.4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Link2 size={14} />
              <span>Step 1: Pick a Gadget Key</span>
            </div>

            {GADGET_PAIRS.map((item) => {
              const isSelected = selectedGadget === item.name;
              const isPaired = pairedMap[item.name] !== undefined;

              return (
                <button
                  key={item.name}
                  onClick={() => setSelectedGadget(item.name)}
                  style={{
                    padding: '14px 16px', borderRadius: '12px', textAlign: 'left',
                    background: isSelected ? 'rgba(0, 140, 255, 0.12)' : isPaired ? 'rgba(34, 197, 94, 0.06)' : 'white',
                    border: isSelected ? '2px solid #008cff' : isPaired ? '1.5px solid #22c55e' : '1px solid rgba(0,0,0,0.1)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{item.name}</div>
                    {isPaired && (
                      <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 600, marginTop: '2px' }}>
                        Linked: "{pairedMap[item.name]}"
                      </div>
                    )}
                  </div>
                  {isPaired && <CheckCircle2 size={16} style={{ color: '#22c55e' }} />}
                </button>
              );
            })}
          </div>

          {/* Column 2: Values (Actions) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Step 2: Assign Action Value
            </div>

            {GADGET_PAIRS.map((item) => {
              const isAssigned = Object.values(pairedMap).includes(item.action);

              return (
                <button
                  key={item.action}
                  onClick={() => handlePairAction(item.action)}
                  disabled={!selectedGadget || isAssigned}
                  style={{
                    padding: '14px 16px', borderRadius: '12px', textAlign: 'left',
                    background: isAssigned ? 'rgba(0,0,0,0.03)' : selectedGadget ? 'rgba(245, 158, 11, 0.08)' : 'white',
                    border: isAssigned ? '1px solid rgba(0,0,0,0.08)' : selectedGadget ? '1.5px dashed #f59e0b' : '1px solid rgba(0,0,0,0.08)',
                    opacity: isAssigned ? 0.6 : 1,
                    cursor: !selectedGadget || isAssigned ? 'default' : 'pointer',
                    fontSize: '13px', fontWeight: 600, color: '#334155',
                    transition: 'all 0.15s ease'
                  }}
                >
                  ⚡ "{item.action}"
                </button>
              );
            })}
          </div>

        </div>

        {/* Success completion banner */}
        {isComplete && (
          <div style={{
            marginTop: '20px', padding: '16px 20px', borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(255, 255, 255, 0.95) 100%)',
            border: '1.5px solid #22c55e', color: '#15803d',
            display: 'flex', alignItems: 'center', gap: '12px'
          }} className="animate-fade-in">
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', background: '#22c55e',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
              fontSize: '18px', flexShrink: 0
            }}>✓</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 900 }}>Nobita's Codebook Built Successfully!</div>
              <div style={{ fontSize: '12px', color: '#166534', marginTop: '2px' }}>
                Every gadget name is now directly paired to its activation action. Looking up any gadget returns its action instantly!
              </div>
            </div>
          </div>
        )}

      </GlassCard>

    </div>
  );
};

export default DictExploration;
