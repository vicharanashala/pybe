import React from 'react';

/**
 * VisualIndexRuler renders a beautiful visual diagram of a Python list
 * showing both positive and negative indices for each element.
 */
export default function VisualIndexRuler({ questionId }) {
  // Statically define list data matching the questions
  const getListData = (id) => {
    switch (id) {
      case 1:
        return [800, 1066, 1215, 1348, 1453, 1492, 1600, 1789];
      case 2:
        return ["Rome", "Magna Carta", "Moon Landing", "Internet", "First AI"];
      case 3:
        return ["Glitch A", "Internet", "Glitch B", "Magna Carta", "Glitch C", "Rome"];
      default:
        return [];
    }
  };

  const list = getListData(questionId);
  if (list.length === 0) return null;

  const len = list.length;

  return (
    <div style={{
      background: 'rgba(26, 79, 84, 0.03)',
      border: '1px solid rgba(26, 79, 84, 0.12)',
      borderRadius: '12px',
      padding: '1rem',
      marginTop: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      <div style={{
        fontSize: '0.8rem',
        fontWeight: 700,
        color: 'var(--accent-teal)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        📊 Slicing Index Reference
      </div>

      <div style={{ 
        display: 'flex', 
        overflowX: 'auto', 
        paddingBottom: '0.5rem',
        gap: '2px',
        alignItems: 'stretch'
      }}>
        {list.map((val, idx) => {
          const positiveIndex = idx;
          const negativeIndex = idx - len;

          return (
            <div 
              key={idx} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                minWidth: '60px',
                textAlign: 'center'
              }}
            >
              {/* Positive Index (Teal) */}
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-teal)',
                marginBottom: '4px',
                background: 'rgba(26, 79, 84, 0.08)',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {positiveIndex}
              </div>

              {/* Value Box */}
              <div style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '0.5rem 0.25rem',
                width: '100%',
                fontWeight: 600,
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                minHeight: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                wordBreak: 'break-word'
              }}>
                {typeof val === 'string' && val.length > 8 ? `${val.substring(0, 6)}..` : val}
              </div>

              {/* Negative Index (Brown/Clay) */}
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#7a5e4d',
                marginTop: '4px',
                background: 'rgba(171, 155, 142, 0.15)',
                width: '24px',
                height: '20px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {negativeIndex}
              </div>
            </div>
          );
        })}
      </div>
      
      <div style={{ 
        fontSize: '0.75rem', 
        color: 'var(--text-muted)', 
        lineHeight: 1.3,
        borderTop: '1px solid rgba(0,0,0,0.03)',
        paddingTop: '0.5rem'
      }}>
        💡 <strong>Slicing rule:</strong> <code>list[start:end]</code> captures elements from <code>start</code> index up to <code>end</code> index (exclusive). Leave blank to select to the boundary.
      </div>
    </div>
  );
}
