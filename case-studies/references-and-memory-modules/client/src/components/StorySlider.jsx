import React, { useState, useEffect } from 'react';
import { playSlideTransition, unlockAudio } from '../utils/audio';

const StorySlider = ({ slides, storyStep, setStoryStep, steps, isLightMode = true }) => {
  const [slideDirection, setSlideDirection] = useState('next');
  const [activePointIndex, setActivePointIndex] = useState(0);
  const slide = slides[storyStep];

  // Reset active point index when slide changes
  useEffect(() => {
    setActivePointIndex(0);
  }, [storyStep]);

  // Only unlock slides up to what the user has reached (at start: scenes 0 & 1; scene 3 unlocks after crash)
  const maxUnlockedStep = Math.max(storyStep, 1);
  const validStepIds = steps
    .map(s => s.id)
    .filter(id => slides[id] != null && id <= maxUnlockedStep);
  const currentIndex = validStepIds.indexOf(storyStep);

  const hasPrev = currentIndex > 0;
  const hasNextSlide = currentIndex !== -1 && currentIndex < validStepIds.length - 1;

  const goToStep = (targetStep, direction = 'next') => {
    unlockAudio();
    playSlideTransition(direction);
    setSlideDirection(direction);
    setStoryStep(targetStep);
  };

  const handlePrev = () => {
    if (hasPrev) {
      goToStep(validStepIds[currentIndex - 1], 'prev');
    }
  };

  const handleNext = () => {
    if (slide.action) {
      unlockAudio();
      playSlideTransition('next');
      slide.action();
    } else if (hasNextSlide) {
      goToStep(validStepIds[currentIndex + 1], 'next');
    } else {
      unlockAudio();
      playSlideTransition('next');
      setSlideDirection('next');
      setStoryStep(storyStep + 1);
    }
  };

  // Parse points if text contains structured problem definitions
  const parseSlidePoints = (text) => {
    if (!text || !text.includes(';') || !text.includes(':')) return null;
    const firstColonIdx = text.indexOf(':');
    const textBeforeColon = text.substring(0, firstColonIdx);
    const matchBoundary = textBeforeColon.match(/^(.*?[.!?])\s+([^.!?]+)$/s);
    let intro = '';
    let pointsBlock = '';
    if (matchBoundary) {
      intro = matchBoundary[1].trim();
      pointsBlock = matchBoundary[2] + text.substring(firstColonIdx);
    } else {
      pointsBlock = text;
    }
    const rawPoints = pointsBlock.split(';').map(p => p.trim()).filter(Boolean);
    const points = rawPoints.map(p => {
      const cIdx = p.indexOf(':');
      if (cIdx !== -1) {
        const rawDesc = p.substring(cIdx + 1).trim().replace(/\.$/, '');
        const desc = rawDesc ? rawDesc.charAt(0).toUpperCase() + rawDesc.slice(1) : '';
        return {
          title: p.substring(0, cIdx).trim(),
          desc: desc
        };
      }
      const rawDesc = p.trim().replace(/\.$/, '');
      const desc = rawDesc ? rawDesc.charAt(0).toUpperCase() + rawDesc.slice(1) : '';
      return { title: '', desc: desc };
    });
    return { intro, points };
  };

  const parsed = slide ? parseSlidePoints(slide.text) : null;
  const hasMultiplePoints = Boolean(parsed && parsed.points.length > 1);
  const totalPoints = parsed ? parsed.points.length : 0;
  const isLastPoint = !hasMultiplePoints || activePointIndex >= totalPoints - 1;

  const handleStepForward = () => {
    if (hasMultiplePoints && !isLastPoint) {
      setActivePointIndex(prev => prev + 1);
    } else {
      handleNext();
    }
  };

  const handleStepBackward = () => {
    if (hasMultiplePoints && activePointIndex > 0) {
      setActivePointIndex(prev => prev - 1);
    } else if (hasPrev) {
      handlePrev();
    }
  };

  const canGoBack = hasPrev || (hasMultiplePoints && activePointIndex > 0);
  const prevButtonLabel = "← Previous";
  const nextButtonLabel = (hasMultiplePoints && !isLastPoint) ? "Next Problem →" : slide.buttonText;

  // Keyboard navigation for arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && canGoBack) {
        handleStepBackward();
      } else if (e.key === 'ArrowRight') {
        handleStepForward();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canGoBack, hasMultiplePoints, isLastPoint, activePointIndex]);

  if (!slide) return null;

  // Formats text into a clean single problem card (without redundant heading tabs or inner buttons)
  const renderFormattedText = () => {
    if (!slide || !slide.text) return null;

    if (parsed) {
      const { intro, points } = parsed;
      const safePointIndex = Math.min(Math.max(0, activePointIndex), points.length - 1);
      const currentPt = points[safePointIndex] || points[0];

      const getIcon = (title) => {
        const lower = (title || '').toLowerCase();
        if (lower.includes('memory') || lower.includes('bloat') || lower.includes('leak')) return '💥';
        if (lower.includes('sync') || lower.includes('desync') || lower.includes('ghost')) return '🔄';
        if (lower.includes('cpu') || lower.includes('lag') || lower.includes('stack') || lower.includes('overhead')) return '⏳';
        if (lower.includes('crash') || lower.includes('oom') || lower.includes('fatal')) return '🛑';
        if (lower.includes('blocked') || lower.includes('redundant')) return '⛔';
        return '⚠️';
      };

      return (
        <div className="slide-formatted-body">
          {intro && <p className="slide-intro-paragraph">{intro}</p>}

          {/* Single Focused Issue Card (NO extra 3 headings) */}
          <div className="slide-single-point-card" key={safePointIndex}>
            <div className="point-card-header">
              <div className="point-badge-left">
                <span className="point-icon-badge">{getIcon(currentPt.title)}</span>
                <span className="point-counter-pill">
                  Problem {safePointIndex + 1} of {points.length}
                </span>
              </div>
              <div className="point-nav-dots" title={`Problem ${safePointIndex + 1} of ${points.length}`}>
                {points.map((_, idx) => (
                  <span
                    key={idx}
                    className={`point-nav-dot ${idx === safePointIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* 1. Situation First */}
            <div className="point-situation-box">
              <div className="point-situation-label">Situation:</div>
              <p className="point-situation-desc">
                {currentPt.desc}
              </p>
            </div>

            {/* 2. Then Concept Callout */}
            {currentPt.title && (
              <div className="point-concept-callout">
                <span className="point-concept-prefix">⚡ This is called:</span>
                <strong className="point-concept-name">{currentPt.title}</strong>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <p className="slide-default-paragraph">
        {slide.text}
      </p>
    );
  };

  return (
    <div className={`scene-overlay ${isLightMode ? 'level1-light-theme' : ''}`}>
      <div className="scene-slider-wrapper">
        {/* Animated Slide Card with Directional Horizontal Animation */}
        <div
          key={`${storyStep}-${slideDirection}`}
          className={`scene-card-animated ${slideDirection === 'prev' ? 'slide-from-left' : 'slide-from-right'}`}
          style={{
            border: `2px solid ${slide.color}`,
            boxShadow: isLightMode
              ? `0 0 35px ${slide.color}20, 0 16px 36px rgba(0,0,0,0.08)`
              : `0 0 50px ${slide.color}35, 0 20px 40px rgba(0,0,0,0.6)`
          }}
        >
          {/* Top Slide Progress Strip */}
          <div className="story-progress-strip">
            <div
              className="story-progress-fill"
              style={{
                width: `${((currentIndex + 1) / validStepIds.length) * 100}%`,
                backgroundColor: slide.color
              }}
            />
          </div>

          {/* Top Story Timeline Tabs / Pills */}
          <div className="scene-step-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', flexWrap: 'wrap', gap: '8px' }}>
            {steps.map((s) => {
              const isActive = storyStep === s.id;
              const isPast = storyStep > s.id;
              const isAvailable = validStepIds.includes(s.id);

              return (
                <button
                  key={s.id}
                  onClick={() => {
                    if (isAvailable && s.id !== storyStep) {
                      goToStep(s.id, s.id > storyStep ? 'next' : 'prev');
                    }
                  }}
                  disabled={!isAvailable}
                  className="scene-step-pill"
                  style={{
                    background: isActive
                      ? (isLightMode ? 'linear-gradient(135deg, #FFBC57, #FA994F)' : slide.color)
                      : isPast
                        ? (isLightMode ? '#ffeeda' : 'rgba(255,255,255,0.12)')
                        : (isLightMode ? '#fff8f2' : 'rgba(255,255,255,0.04)'),
                    color: isActive
                      ? (isLightMode ? '#2e1505' : '#ffffff')
                      : (isLightMode ? (isPast ? '#2e1505' : '#7c4a2d') : (isPast ? '#94a3b8' : '#475569')),
                    border: isActive
                      ? (isLightMode ? '1px solid #FA994F' : `1px solid ${slide.color}`)
                      : (isLightMode ? '1px solid rgba(246, 159, 92, 0.28)' : '1px solid rgba(255,255,255,0.08)'),
                    borderRadius: '999px',
                    boxShadow: isActive ? (isLightMode ? '0 4px 14px rgba(250, 153, 79, 0.35)' : `0 0 16px ${slide.color}80`) : 'none',
                    cursor: isAvailable ? 'pointer' : 'default',
                    opacity: isAvailable ? 1 : 0.4
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>

          {/* Scene Title */}
          <h2
            style={{
              fontSize: '2.5rem',
              fontFamily: '"Fraunces", Georgia, serif',
              color: isLightMode ? '#3b2012' : slide.color,
              marginBottom: '20px',
              textShadow: isLightMode ? 'none' : `0 0 25px ${slide.color}50`,
              fontWeight: 600
            }}
          >
            {slide.title}
          </h2>

          {/* Slider Content Grid */}
          <div className="slide-content-grid" style={{ display: 'flex', flexDirection: 'row', gap: '36px', alignItems: 'center', width: '100%' }}>
            {/* Left: Illustrated Concept Art */}
            <div className="slide-image-pane" style={{ flex: '1', display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div
                className="scene-image-container"
                style={{
                  border: isLightMode ? '1px solid rgba(246, 159, 92, 0.3)' : `2px solid ${slide.color}80`,
                  boxShadow: isLightMode
                    ? '0 4px 16px rgba(0, 0, 0, 0.08)'
                    : '0 12px 35px rgba(0,0,0,0.6)',
                  background: isLightMode ? '#fffdfa' : 'rgba(15, 23, 42, 0.9)'
                }}
              >
                <div className="scene-light-sweep-effect">
                  <div className="scene-light-sweep-bar" />
                </div>

                <img
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    width: '100%',
                    maxHeight: '42vh',
                    objectFit: 'contain',
                    borderRadius: '16px',
                    display: 'block'
                  }}
                />

                {/* Floating Status Badge on the Image */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '12px',
                    right: '12px',
                    background: isLightMode ? 'rgba(255, 253, 249, 0.95)' : 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(8px)',
                    border: isLightMode ? '1px solid rgba(246, 159, 92, 0.4)' : `1px solid ${slide.color}60`,
                    borderRadius: '8px',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '0.82rem',
                    color: isLightMode ? '#7c4a2d' : slide.color,
                    fontWeight: 700,
                    zIndex: 3
                  }}
                >
                  <span>
                    {slide.badge || (storyStep === 0 ? "📖 Dilemma Overview" : storyStep === 1 ? "⚠️ Problem & Memory Bloat" : "⚡ Solution & Optimization")}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Narrative Description & Action Flow */}
            <div className="slide-content-pane" style={{ flex: '1.15', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
              {renderFormattedText()}

              {/* Slider Bottom Action Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%', flexWrap: 'wrap', marginTop: 'auto' }}>
                {canGoBack && (
                  <button
                    className="scene-prev-btn"
                    onClick={handleStepBackward}
                    style={{
                      padding: '12px 22px',
                      background: isLightMode ? '#f0ece0' : 'rgba(255, 255, 255, 0.08)',
                      border: isLightMode ? '1px solid #e4dcc8' : '1px solid rgba(255, 255, 255, 0.2)',
                      color: isLightMode ? '#5b5648' : '#cbd5e1',
                      borderRadius: '999px',
                      fontFamily: '"Nunito Sans", sans-serif',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isLightMode ? '#e4dcc8' : 'rgba(255, 255, 255, 0.16)';
                      e.currentTarget.style.color = isLightMode ? '#2b2b2b' : '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isLightMode ? '#f0ece0' : 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = isLightMode ? '#5b5648' : '#cbd5e1';
                    }}
                  >
                    <span>{prevButtonLabel}</span>
                  </button>
                )}

                <button
                  className="scene-next-btn"
                  style={{
                    background: slide.color,
                    borderRadius: '999px',
                    fontFamily: '"Nunito Sans", sans-serif',
                    boxShadow: `0 8px 24px ${slide.color}60`
                  }}
                  onClick={handleStepForward}
                >
                  <span>{nextButtonLabel}</span>
                  <span className="arrow-slide-anim">➔</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Slider Dots Pagination */}
          <div className="scene-slider-dots">
            {validStepIds.map((stepId, idx) => {
              const isCurrent = storyStep === stepId;
              const targetSlide = slides[stepId];
              return (
                <button
                  key={stepId}
                  onClick={() => goToStep(stepId, stepId > storyStep ? 'next' : 'prev')}
                  className={`scene-slider-dot ${isCurrent ? 'active' : ''}`}
                  style={{
                    background: isCurrent ? (targetSlide?.color || slide.color) : 'rgba(255, 255, 255, 0.25)',
                    color: targetSlide?.color || slide.color
                  }}
                  title={`Go to Slide ${idx + 1}`}
                  aria-label={`Go to Slide ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorySlider;
