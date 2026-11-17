import React from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { DictAnimator } from './DictAnimator';
import { Key, Sparkles, CheckCircle2 } from 'lucide-react';

export const DictConceptReveal: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} style={{ color: '#008cff' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#008cff', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            STAGE 7 — CONCEPT REVEAL
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          Meet the Python Dictionary (<code style={{ fontFamily: 'var(--font-mono)', color: '#008cff' }}>dict</code>)
        </h2>
        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
          Python already provides a built-in data structure that enforces your discovered rule automatically: the <strong>Dictionary</strong>.
        </p>
      </div>

      {/* Syntax Reveal Card */}
      <GlassCard style={{ padding: '24px', background: 'white', border: '1.5px solid rgba(0, 140, 255, 0.2)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Syntax Box */}
          <div style={{
            padding: '16px', borderRadius: '12px',
            background: '#091124', color: '#f1f5f9',
            fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6
          }}>
            <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '6px' }}># Defining a Python Dictionary with {'{key: value}'}</div>
            <div>
              <span style={{ color: '#ec4899' }}>pocket</span> = {'{'}
            </div>
            <div style={{ paddingLeft: '20px' }}>
              <span style={{ color: '#38bdf8' }}>"Door"</span>: <span style={{ color: '#34d399' }}>"Dial destination"</span>,
            </div>
            <div style={{ paddingLeft: '20px' }}>
              <span style={{ color: '#38bdf8' }}>"Copter"</span>: <span style={{ color: '#34d399' }}>"Attach to head"</span>,
            </div>
            <div style={{ paddingLeft: '20px' }}>
              <span style={{ color: '#38bdf8' }}>"Light"</span>: <span style={{ color: '#34d399' }}>"Press yellow button"</span>
            </div>
            <div>{'}'}</div>
            
            <div style={{ marginTop: '12px', color: '#64748b', fontSize: '11px' }}># Instant O(1) Lookup by Key:</div>
            <div>
              <span style={{ color: '#f59e0b' }}>print</span>(pocket[<span style={{ color: '#38bdf8' }}>"Light"</span>])  <span style={{ color: '#64748b' }}># Output: "Press yellow button"</span>
            </div>
          </div>

          {/* Key Rule Summary Points */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            
            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(0, 140, 255, 0.04)', border: '1px solid rgba(0, 140, 255, 0.15)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#008cff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={14} />
                <span>1. Keys Must Be Unique</span>
              </div>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                Just like Doraemon's gadgets, each Key in a dictionary is unique. Re-assigning an existing Key updates its Value!
              </p>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.04)', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#15803d', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} />
                <span>2. Instant O(1) Lookup</span>
              </div>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                Looking up `dict[key]` calculates its Hash Table position directly — no scanning needed!
              </p>
            </div>

          </div>

        </div>

      </GlassCard>

      {/* Embedded Interactive Animator */}
      <DictAnimator />

    </div>
  );
};

export default DictConceptReveal;
