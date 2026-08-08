import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'secondary';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', children }) => {
  const getStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.25)',
        };
      case 'error':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          border: '1px solid rgba(239, 68, 68, 0.25)',
        };
      case 'warning':
        return {
          backgroundColor: 'rgba(255, 196, 0, 0.15)',
          color: '#fbbf24',
          border: '1px solid rgba(255, 196, 0, 0.3)',
        };
      case 'secondary':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          color: '#cbd5e1',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        };
      default:
        // Doraemon Sky Blue
        return {
          backgroundColor: 'rgba(0, 140, 255, 0.15)',
          color: '#38bdf8',
          border: '1px solid rgba(0, 140, 255, 0.3)',
        };
    }
  };

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 12px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.2px',
        textTransform: 'uppercase',
        ...getStyle()
      }}
    >
      {children}
    </span>
  );
};
export default Badge;
