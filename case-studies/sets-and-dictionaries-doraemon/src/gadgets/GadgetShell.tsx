import React from 'react';
import { GlassCard } from '../shared-components/GlassCard';

export type GadgetStatus = 'idle' | 'running' | 'success' | 'error';

interface GadgetShellProps {
  gadgetId: string;
  gadgetName: string;
  status?: GadgetStatus;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const GadgetShell: React.FC<GadgetShellProps> = ({
  gadgetId,
  gadgetName,
  status = 'idle',
  style,
  children
}) => {
  // Determine color for the status indicator light / bell
  const getStatusColor = () => {
    switch (status) {
      case 'running': return '#38bdf8'; // Blue flashing
      case 'success': return '#22c55e'; // Green stable
      case 'error': return '#ef4444'; // Red warning
      default: return '#ffcc00'; // Gold idle
    }
  };

  return (
    <GlassCard 
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1.5px solid rgba(0, 140, 255, 0.16)',
        overflow: 'hidden',
        height: '100%',
        width: '100%',
        ...style
      }}
    >
      {/* Gadget Shell Header */}
      <div style={{
        padding: '10px 16px',
        background: 'rgba(0, 140, 255, 0.06)',
        borderBottom: '1px solid rgba(0, 140, 255, 0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        {/* Left Side: ID Badge and Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            color: 'white',
            background: 'hsl(var(--doraemon-blue))',
            padding: '2px 6px',
            borderRadius: '4px',
            letterSpacing: '0.5px'
          }}>
            {gadgetId}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'white', letterSpacing: '0.2px' }}>
            {gadgetName.toUpperCase()}
          </span>
        </div>

        {/* Right Side: Doraemon Collar Bell Status Lamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {status}
          </span>
          {/* Collar Bell Ornament */}
          <div 
            className={status === 'running' ? 'animate-bell' : ''}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(),
              border: '1px solid rgba(0,0,0,0.3)',
              position: 'relative',
              boxShadow: `0 0 8px ${getStatusColor()}80`,
              transition: 'all 0.3s ease'
            }}
          >
            {/* Bell line slit */}
            <div style={{
              width: '8px',
              height: '1.5px',
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'absolute',
              top: '9px',
              left: '4px'
            }} />
            {/* Bell center dot */}
            <div style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              position: 'absolute',
              top: '5px',
              left: '6.5px'
            }} />
          </div>
        </div>
      </div>

      {/* Gadget Shell Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {children}
      </div>

    </GlassCard>
  );
};
export default GadgetShell;
