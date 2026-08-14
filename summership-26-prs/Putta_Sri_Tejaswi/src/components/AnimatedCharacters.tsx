import React from 'react';

interface CharacterProps {
  state: 'breathing' | 'angry' | 'approving' | 'calm' | 'explaining' | 'worried' | 'happy';
  width?: number;
  height?: number;
}

export const KingAkbar: React.FC<CharacterProps> = React.memo(({ state, width = 120, height = 150 }) => {
  const isAngry = state === 'angry';
  const isApproving = state === 'approving';

  return (
    <svg width={width} height={height} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="select-none" role="img" aria-label="Emperor Akbar">
      <style>{`
        @keyframes float-crown {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(1deg); }
        }
        @keyframes nod-head {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(4px); }
        }
        @keyframes anger-shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-1px, 1px) rotate(-0.5deg); }
          40% { transform: translate(1px, -1px) rotate(0.5deg); }
          60% { transform: translate(-1px, -1px) rotate(-0.5deg); }
          80% { transform: translate(1px, 1px) rotate(0.5deg); }
        }
        .crown { 
          animation: float-crown 3s ease-in-out infinite; 
          transform-origin: 60px 40px;
        }
        .head { 
          animation: ${isApproving ? 'nod-head 1.5s ease-in-out infinite' : 'none'}; 
          transform-origin: 60px 70px;
        }
        .body-group {
          animation: ${isAngry ? 'anger-shake 0.4s ease-in-out infinite' : 'none'};
        }
      `}</style>

      <g className="body-group">
        <path d="M25 140 C25 100, 95 100, 95 140" fill="#8C1A2E" stroke="#D4AF37" strokeWidth="2" />
        <path d="M45 110 Q60 125, 75 110" stroke="#D4AF37" strokeWidth="4" fill="none" />
        <circle cx="60" cy="122" r="5" fill="#1A2F50" />

        <g className="head">
          <rect x="55" y="85" width="10" height="20" fill="#FAD09E" />
          <circle cx="60" cy="70" r="22" fill="#FAD09E" stroke="#8C1A2E" strokeWidth="1.5" />
          <path d="M45 78 Q60 90, 75 78 Q60 82, 45 78" fill="#1A1A1A" />
          <circle cx="52" cy="65" r="3" fill="#1A1A1A" />
          <circle cx="68" cy="65" r="3" fill="#1A1A1A" />
          
          {isAngry ? (
            <>
              <line x1="47" y1="58" x2="55" y2="62" stroke="#1A1A1A" strokeWidth="2" />
              <line x1="73" y1="58" x2="65" y2="62" stroke="#1A1A1A" strokeWidth="2" />
            </>
          ) : (
            <>
              <path d="M47 60 Q52 57, 57 60" stroke="#1A1A1A" strokeWidth="2" fill="none" />
              <path d="M63 60 Q68 57, 73 60" stroke="#1A1A1A" strokeWidth="2" fill="none" />
            </>
          )}

          <g className="crown">
            <path d="M42 48 L48 30 L60 38 L72 30 L78 48 Z" fill="#D4AF37" stroke="#8C1A2E" strokeWidth="1.5" />
            <circle cx="48" cy="30" r="2" fill="#8C1A2E" />
            <circle cx="60" cy="38" r="2" fill="#1A2F50" />
            <circle cx="72" cy="30" r="2" fill="#8C1A2E" />
          </g>
        </g>
      </g>
    </svg>
  );
});
KingAkbar.displayName = 'KingAkbar';

export const SageBirbal: React.FC<CharacterProps> = React.memo(({ state, width = 120, height = 150 }) => {
  const isExplaining = state === 'explaining';

  return (
    <svg width={width} height={height} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="select-none" role="img" aria-label="Sage Birbal">
      <style>{`
        @keyframes wave-hand {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-25deg); }
        }
        @keyframes gentle-breath {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
        .explaining-arm {
          animation: ${isExplaining ? 'wave-hand 2s ease-in-out infinite' : 'none'};
          transform-origin: 30px 105px;
        }
        .birbal-body {
          animation: gentle-breath 4s ease-in-out infinite;
        }
      `}</style>

      <g className="birbal-body">
        <path d="M28 140 C28 95, 92 95, 92 140" fill="#FCFBF7" stroke="#E6DFD3" strokeWidth="2" />
        <path d="M40 102 C50 112, 70 112, 80 102" fill="#1A2F50" />

        <rect x="55" y="85" width="10" height="20" fill="#FAD09E" />
        <circle cx="60" cy="70" r="20" fill="#FAD09E" stroke="#1A2F50" strokeWidth="1.5" />
        <path d="M42 76 C42 105, 78 105, 78 76" fill="#F6F3EB" stroke="#E6DFD3" strokeWidth="1" />
        <circle cx="53" cy="67" r="2.5" fill="#1A1A1A" />
        <circle cx="67" cy="67" r="2.5" fill="#1A1A1A" />
        <path d="M55 76 Q60 80, 65 76" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
        
        <ellipse cx="60" cy="50" rx="22" ry="10" fill="#1A2F50" stroke="#D4AF37" strokeWidth="1" />
        <circle cx="60" cy="42" r="3" fill="#D4AF37" />

        <g className="explaining-arm">
          <path d="M28 105 Q15 105, 10 95" stroke="#FCFBF7" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="8" cy="94" r="5" fill="#FAD09E" />
          <rect x="3" y="84" width="10" height="6" rx="1" fill="#B87333" stroke="#D4AF37" strokeWidth="0.5" />
          <path d="M8 84 L8 80" stroke="#B87333" strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
});
SageBirbal.displayName = 'SageBirbal';

export const ScribeDharamDas: React.FC<CharacterProps> = React.memo(({ state, width = 120, height = 150 }) => {
  const isWorried = state === 'worried';
  const isHappy = state === 'happy';

  return (
    <svg width={width} height={height} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="select-none" role="img" aria-label="Scribe Dharam Das">
      <style>{`
        @keyframes worried-shake {
          0%, 100% { transform: translate(0, 0); }
          10%, 90% { transform: translate(-0.5px, 0.5px); }
          30%, 70% { transform: translate(0.5px, -0.5px); }
          50% { transform: translate(-0.5px, -0.5px); }
        }
        @keyframes sweat-drip {
          0% { transform: translateY(0px); opacity: 0; }
          10%, 80% { opacity: 0.8; }
          100% { transform: translateY(12px); opacity: 0; }
        }
        @keyframes happy-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .sweat {
          animation: sweat-drip 2s linear infinite;
        }
        .worried-face {
          animation: ${isWorried ? 'worried-shake 0.2s ease-in-out infinite' : 'none'};
        }
        .happy-body {
          animation: ${isHappy ? 'happy-bounce 1s ease-in-out infinite' : 'none'};
        }
      `}</style>

      <g className="happy-body">
        <path d="M30 140 C30 100, 90 100, 90 140" fill="#E28743" stroke="#D4AF37" strokeWidth="1" />

        <g className="worried-face">
          <rect x="55" y="85" width="10" height="20" fill="#FAD09E" />
          <circle cx="60" cy="70" r="18" fill="#FAD09E" stroke="#E28743" strokeWidth="1.5" />
          
          {isWorried ? (
            <>
              <circle cx="53" cy="67" r="4" fill="white" stroke="#1A1A1A" strokeWidth="1" />
              <circle cx="53" cy="67" r="1.5" fill="#1A1A1A" />
              <circle cx="67" cy="67" r="4" fill="white" stroke="#1A1A1A" strokeWidth="1" />
              <circle cx="67" cy="67" r="1.5" fill="#1A1A1A" />
              <path d="M53 77 Q60 74, 67 77" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
              <circle cx="43" cy="65" r="1.5" fill="#76D7EA" className="sweat" />
            </>
          ) : (
            <>
              <path d="M50 67 Q53 64, 56 67" stroke="#1A1A1A" strokeWidth="2" fill="none" />
              <path d="M64 67 Q67 64, 70 67" stroke="#1A1A1A" strokeWidth="2" fill="none" />
              <path d="M52 75 Q60 84, 68 75 Z" fill="#8C1A2E" />
            </>
          )}

          <path d="M42 58 Q60 48, 78 58 Z" fill="#1A2F50" stroke="#D4AF37" strokeWidth="1" />
        </g>

        <g className="worried-face">
          {isWorried ? (
            <>
              <rect x="25" y="112" width="70" height="24" rx="2" fill="#F6F3EB" stroke="#D4AF37" strokeWidth="1" />
              <line x1="22" y1="110" x2="22" y2="138" stroke="#8A5A36" strokeWidth="4" />
              <line x1="98" y1="110" x2="98" y2="138" stroke="#8A5A36" strokeWidth="4" />
              <line x1="30" y1="118" x2="60" y2="118" stroke="#999" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="30" y1="124" x2="80" y2="124" stroke="#999" strokeWidth="1" strokeDasharray="2,4" />
              <line x1="30" y1="130" x2="50" y2="130" stroke="#999" strokeWidth="1" strokeDasharray="4,2" />
            </>
          ) : (
            <>
              <circle cx="25" cy="105" r="5" fill="#FAD09E" />
              <circle cx="95" cy="105" r="5" fill="#FAD09E" />
            </>
          )}
        </g>
      </g>
    </svg>
  );
});
ScribeDharamDas.displayName = 'ScribeDharamDas';
