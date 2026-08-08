import React from 'react';
import { GlassCard } from '../../shared-components/GlassCard';
import { AlertCircle } from 'lucide-react';

export const DictProblem: React.FC = () => {
  const gadgetList = ["Anywhere Door", "Bamboo Copter", "Small Light", "Memory Bread"];
  const actionList = ["Dial destination", "Attach to head", "Press yellow button", "Press on textbook"];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }} className="animate-fade-in">
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            STAGE 3 — THE PROBLEM SCENE
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
          Nobita's Mismatched Gadget Lists
        </h2>
        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
          Inspect Nobita's current setup below. What goes wrong when items are stored in two separate lists?
        </p>
      </div>

      {/* Visual Two-List Clutter Container */}
      <GlassCard style={{ padding: '24px', background: 'white', border: '1.5px solid rgba(239, 68, 68, 0.2)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          {/* List 1: Gadget Names */}
          <div style={{
            padding: '16px', borderRadius: '14px',
            background: 'rgba(0, 140, 255, 0.04)',
            border: '1.5px solid rgba(0, 140, 255, 0.2)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#008cff', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              📋 List A: Gadget Names
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {gadgetList.map((item, idx) => (
                <div key={idx} style={{
                  padding: '10px 14px', borderRadius: '8px', background: 'white',
                  border: '1px solid rgba(0, 140, 255, 0.15)', fontSize: '13px',
                  fontWeight: 700, color: '#0f172a', display: 'flex', justifyContent: 'space-between'
                }}>
                  <span>{item}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Index [{idx}]</span>
                </div>
              ))}
            </div>
          </div>

          {/* List 2: Activation Actions */}
          <div style={{
            padding: '16px', borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.04)',
            border: '1.5px solid rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#d97706', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              ⚡ List B: Activation Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {actionList.map((action, idx) => (
                <div key={idx} style={{
                  padding: '10px 14px', borderRadius: '8px', background: 'white',
                  border: '1px solid rgba(245, 158, 11, 0.15)', fontSize: '13px',
                  fontWeight: 600, color: '#334155', display: 'flex', justifyContent: 'space-between'
                }}>
                  <span>{action}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Index [{idx}]</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Learner Prompt */}
        <div style={{
          marginTop: '20px', padding: '14px 18px', borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)',
          fontSize: '13px', color: '#b91c1c', fontWeight: 700, textAlign: 'center'
        }}>
          ❓ Help Nobita: What happens if Nobita inserts a new gadget at the top of List A, but forgets to update List B?
        </div>

      </GlassCard>

    </div>
  );
};

export default DictProblem;
