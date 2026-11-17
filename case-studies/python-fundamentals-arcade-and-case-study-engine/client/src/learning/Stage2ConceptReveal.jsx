import React from 'react';
import { C, ConceptRevealText } from './utils.jsx';

// ─── Stage 2 Concept Reveal ─────────────────────────────────────────────────
export default function Stage2ConceptReveal({ caseStudy, onComplete }) {
  const { stage2 } = caseStudy;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', animation: 'csFadeIn .4s ease-out' }}>
      <style>{`@keyframes csFadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: C.accentBg, border: `1px solid ${C.accentBorder}`,
          borderRadius: '2rem', padding: '0.3rem 0.9rem',
          width: 'fit-content', fontSize: '0.75rem', fontWeight: 700,
          color: C.accent, letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          💡 Concept Reveal
        </div>
        <p style={{ color: C.muted, fontSize: '0.88rem', margin: 0 }}>
          You've reasoned through the problem. Here's the Python that powers it.
        </p>
      </div>

      {/* ── Reveal card ── */}
      <div style={{
        background: C.cardBg, border: `1px solid ${C.accentBorder}`,
        borderRadius: 12, padding: '1.75rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Top accent stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #7b9f27, transparent)' }} />
        <ConceptRevealText text={stage2.conceptReveal} />
      </div>

      {/* ── CTA ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onComplete}
          style={{
            background: C.darkBg, color: C.darkText, border: 'none',
            borderRadius: 10, padding: '0.75rem 1.75rem',
            fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
            transition: 'all .2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(23,35,31,.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'none'; }}
        >
          Got it let's practice the code ⚡
        </button>
      </div>
    </div>
  );
}
