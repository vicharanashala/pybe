import React, { useEffect, useState } from 'react';

const CONFETTI_COLORS = [
  '#39d353', '#f0c040', '#a371f7', '#39c5cf', '#ff7b72', '#79c0ff', '#ffa657'
];

/**
 * AchievementBadge — full-screen celebration modal shown on chapter completion.
 *
 * Props:
 *   chapterTitle   — e.g. "The Backpack Adventure"
 *   subtitle       — e.g. "Python Lists"
 *   emoji          — trophy / chapter emoji
 *   xp             — XP earned
 *   chapterColor
 *   chapterGlow
 *   nextLabel      — text for the primary CTA (e.g. "Next Chapter →")
 *   onNext         — called when user clicks primary CTA
 *   onHome         — called when user clicks "Go Home"
 */
export default function AchievementBadge({
  chapterTitle,
  subtitle,
  emoji,
  xp,
  chapterColor,
  chapterGlow,
  nextLabel = 'Next Chapter →',
  onNext,
  onHome
}) {
  const [confetti, setConfetti] = useState([]);

  // Generate confetti pieces on mount
  useEffect(() => {
    const pieces = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      duration: `${1.5 + Math.random() * 2}s`,
      delay: `${Math.random() * 0.8}s`,
      size: `${6 + Math.random() * 8}px`,
      rotation: `${Math.random() * 360}deg`
    }));
    setConfetti(pieces);
  }, []);

  return (
    <>
      {/* Confetti */}
      {confetti.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            background: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
            transform: `rotate(${p.rotation})`
          }}
        />
      ))}

      {/* Modal */}
      <div className="badge-modal-backdrop" role="dialog" aria-modal="true" aria-label="Chapter complete!">
        <div
          className="badge-modal"
          style={{
            '--chapter-color': chapterColor,
            '--chapter-glow': chapterGlow,
            borderColor: `rgba(${chapterColor}, 0.3)`
          }}
        >
          {/* Glow border */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            boxShadow: `0 0 60px ${chapterGlow}`,
            pointerEvents: 'none'
          }} />

          <span className="badge-trophy" role="img" aria-label="Achievement">
            {emoji}
          </span>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(57,211,83,0.12)',
            border: '1px solid rgba(57,211,83,0.25)',
            borderRadius: '999px',
            padding: '4px 14px',
            fontSize: '0.72rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#39d353',
            marginBottom: '12px',
            position: 'relative',
            zIndex: 1
          }}>
            ✓ Chapter Complete!
          </div>

          <h2 className="badge-title">{chapterTitle}</h2>
          <p className="badge-subtitle">{subtitle} — Mastered!</p>

          <div className="badge-xp">
            <span>⭐</span>
            <span>+{xp} XP Earned</span>
          </div>

          <div className="badge-actions">
            {onNext && (
              <button
                className="btn btn-primary btn-lg"
                onClick={onNext}
                id="next-chapter-btn"
                style={{ background: `linear-gradient(135deg, ${chapterColor}, rgba(255,255,255,0.3))` }}
              >
                {nextLabel}
              </button>
            )}
            <button
              className="btn btn-secondary"
              onClick={onHome}
              id="go-home-btn"
            >
              🏠 Back to Adventure Map
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
