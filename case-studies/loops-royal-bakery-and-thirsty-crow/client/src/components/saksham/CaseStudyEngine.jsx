import React, { useState } from 'react';
import { C } from './utils.jsx';
import Stage1LogicTest    from './Stage1LogicTest.jsx';
import Stage2ConceptReveal from './Stage2ConceptReveal.jsx';
import Stage3CodeBuild    from './Stage3CodeBuild.jsx';

// ─── Stage progress indicator ─────────────────────────────────────────────────
function StageIndicator({ currentStage }) {
  const stages = [
    { num: 1, label: 'Logic Test',    icon: '🧠' },
    { num: 2, label: 'Concept Reveal', icon: '💡' },
    { num: 3, label: 'Code Build',    icon: '⚡' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
      {stages.map((stage, i) => {
        const isDone   = stage.num < currentStage;
        const isActive = stage.num === currentStage;

        return (
          <div key={stage.num} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', minWidth: 80 }}>
              {/* Circle */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: isDone   ? C.darkBg
                           : isActive ? C.accentBg
                           : '#f4f1ea',
                border: isActive ? `2px solid #7b9f27`
                       : isDone  ? `2px solid #7b9f27`
                       : `2px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: isDone ? '0.75rem' : '0.9rem', transition: 'all .3s ease',
              }}>
                {isDone ? <span style={{ color: C.darkText }}>✓</span> : stage.icon}
              </div>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: isActive ? 700 : 400,
                color: isActive ? C.accent : isDone ? C.body : C.muted,
                whiteSpace: 'nowrap',
              }}>
                {stage.label}
              </span>
            </div>

            {/* Connector */}
            {i < stages.length - 1 && (
              <div style={{
                height: 2, width: 48, marginBottom: 18,
                background: currentStage > stage.num
                  ? 'linear-gradient(90deg, #7b9f27, #d8f07c)'
                  : '#e7dfd2',
                transition: 'background .4s ease', borderRadius: 1,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Case study progress dots ─────────────────────────────────────────────────
function CaseStudyProgress({ total, current }) {
  if (total <= 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: i === current ? 24 : 8, height: 8, borderRadius: 4,
          background: i < current ? '#d8f07c' : i === current ? '#7b9f27' : '#e7dfd2',
          border: i === current ? '1px solid #7b9f27' : `1px solid ${C.border}`,
          transition: 'all .3s ease',
        }} />
      ))}
      <span style={{ fontSize: '0.75rem', color: C.muted }}>
        Case study {current + 1} / {total}
      </span>
    </div>
  );
}

// ─── Level complete screen ────────────────────────────────────────────────────
function LevelCompleteScreen({ onReset, onGenerateMap }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem 2rem', textAlign: 'center', animation: 'csFadeIn .5s ease-out' }}>
      <div style={{ fontSize: '4.5rem' }}>🏆</div>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#17201d', marginBottom: '0.5rem' }}>
          🎉 Interactive Case Study Solved!
        </h2>
        <p style={{ color: '#2e3a35', fontSize: '1.05rem', margin: '0 auto', maxWidth: '520px', lineHeight: '1.5' }}>
          You mastered Saksham's Stage 1 logic puzzle, analyzed the Python concept reveal, and successfully built the code with guided syntax tokens!
        </p>
      </div>
      <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
        <button
          onClick={onReset}
          style={{ background: '#fffdf7', border: `2px solid #ded7cb`, borderRadius: 12, color: '#2e3a35', padding: '0.8rem 1.5rem', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#7b9f27'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ded7cb'}
        >
          🔄 Play Story Again (Reset Demo)
        </button>
        {onGenerateMap && (
          <button
            onClick={onGenerateMap}
            style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)', border: 'none', borderRadius: 12, color: '#ffffff', padding: '0.8rem 1.8rem', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 20px rgba(13, 148, 136, 0.4)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🗺️ Generate Visual Concept Map (AI Architecture) →
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Case Study Engine orchestrates stages across case studies ──────────────
export default function CaseStudyEngine({ levelData, topicLevelCount, levelId, onBack, onGoToLevel, onGenerateMap }) {
  const caseStudies     = levelData.caseStudies;
  const [caseStudyIndex, setCaseStudyIndex] = useState(0);
  const [currentStage, setCurrentStage]     = useState(1);
  const [levelDone, setLevelDone]           = useState(false);

  const currentCaseStudy = caseStudies[caseStudyIndex];
  const hasNextLevel     = levelId + 1 <= topicLevelCount;

  const handleStage3Complete = () => {
    if (caseStudyIndex < caseStudies.length - 1) {
      setCaseStudyIndex((i) => i + 1);
      setCurrentStage(1);
    } else {
      setLevelDone(true);
    }
  };

  if (levelDone) {
    return (
      <LevelCompleteScreen
        onReset={() => {
          setLevelDone(false);
          setCaseStudyIndex(0);
          setCurrentStage(1);
        }}
        onGenerateMap={onGenerateMap}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top meta row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <StageIndicator currentStage={currentStage} />
        <CaseStudyProgress total={caseStudies.length} current={caseStudyIndex} />
      </div>

      <div style={{ height: 1, background: C.border }} />

      {currentStage === 1 && (
        <Stage1LogicTest
          key={`${caseStudyIndex}-s1`}
          caseStudy={currentCaseStudy}
          onComplete={() => setCurrentStage(2)}
        />
      )}
      {currentStage === 2 && (
        <Stage2ConceptReveal
          key={`${caseStudyIndex}-s2`}
          caseStudy={currentCaseStudy}
          onComplete={() => setCurrentStage(3)}
        />
      )}
      {currentStage === 3 && (
        <Stage3CodeBuild
          key={`${caseStudyIndex}-s3`}
          caseStudy={currentCaseStudy}
          onComplete={handleStage3Complete}
        />
      )}
    </div>
  );
}
