import React, { useState } from 'react';
import { Gamepad2, BookOpen, Network, Award, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import CaseStudyEngine from './saksham/CaseStudyEngine.jsx';

export default function SakshamInteractivePlayer({ sakshamData, scenario, onGenerateMap, childrenTextbook }) {
  const [activeMode, setActiveMode] = useState('interactive'); // 'interactive' or 'textbook'
  const [keyReset, setKeyReset] = useState(0);

  if (!sakshamData) {
    return <>{childrenTextbook}</>;
  }

  return (
    <div style={{ marginBottom: '28px', animation: 'fadeIn 0.3s ease' }}>
      {/* Top Toggle & Title Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        border: '1px solid rgba(167, 139, 250, 0.4)',
        borderRadius: '16px 16px 0 0',
        padding: '16px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            background: 'rgba(250, 204, 21, 0.2)',
            color: '#facc15',
            border: '1px solid rgba(250, 204, 21, 0.5)',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: '800',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Award size={14} /> SAKSHAM SHARMA OFFICIAL PR ENGINE
          </span>
        </div>

        {/* Mode Switches */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0, 0, 0, 0.35)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            onClick={() => setActiveMode('interactive')}
            style={{
              background: activeMode === 'interactive' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'transparent',
              color: activeMode === 'interactive' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: activeMode === 'interactive' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeMode === 'interactive' ? '0 2px 10px rgba(16, 185, 129, 0.4)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Gamepad2 size={16} style={{ color: activeMode === 'interactive' ? '#fff' : '#10b981' }} />
            <span>Interactive 3-Stage Puzzle</span>
          </button>

          <button
            onClick={() => setActiveMode('textbook')}
            style={{
              background: activeMode === 'textbook' ? 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)' : 'transparent',
              color: activeMode === 'textbook' ? '#fff' : '#94a3b8',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              fontWeight: activeMode === 'textbook' ? '700' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeMode === 'textbook' ? '0 2px 10px rgba(124, 58, 237, 0.4)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <BookOpen size={16} style={{ color: activeMode === 'textbook' ? '#fff' : '#a78bfa' }} />
            <span>E-Textbook Mode (5 Pages)</span>
          </button>
        </div>
      </div>

      {/* Main Mode Area */}
      {activeMode === 'interactive' ? (
        <div style={{
          background: '#f4f1ea', // Saksham's original warm beige background required for his theme tokens
          color: '#17201d',
          border: '1px solid rgba(167, 139, 250, 0.4)',
          borderTop: 'none',
          borderRadius: '0 0 16px 16px',
          padding: '32px 36px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top Demo Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '16px' }}>
            <button
              onClick={() => setKeyReset((k) => k + 1)}
              style={{
                background: '#fffdf7',
                border: '1px solid #ded7cb',
                color: '#516058',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7b9f27'; e.currentTarget.style.color = '#17201d'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ded7cb'; e.currentTarget.style.color = '#516058'; }}
              title="Reset the multi-stage puzzle back to Step 1"
            >
              <RotateCcw size={13} /> Reset Puzzle Step
            </button>
          </div>

          {/* Actual Saksham PR Engine */}
          <div key={keyReset} className="saksham-interactive-container">
            <CaseStudyEngine
              levelData={{ caseStudies: [sakshamData] }}
              topicLevelCount={1}
              levelId={1}
              onBack={() => setKeyReset((k) => k + 1)}
              onGoToLevel={() => setKeyReset((k) => k + 1)}
              onGenerateMap={onGenerateMap}
            />
          </div>
        </div>
      ) : (
        /* Render normal textbook reader when in textbook mode */
        <div>
          {childrenTextbook}
        </div>
      )}
    </div>
  );
}
