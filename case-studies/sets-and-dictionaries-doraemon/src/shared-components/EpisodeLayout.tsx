import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialogue } from './Dialogue';
import type { CharacterType } from './Dialogue';

interface EpisodeLayoutProps {
  totalSteps: number;
  currentStepIndex: number;
  dialogues: string[];
  character?: CharacterType;
  onNext: () => void;
  onBack: () => void;
  isNextDisabled?: boolean;
  isBackDisabled?: boolean;
  children: React.ReactNode;
}

export const EpisodeLayout: React.FC<EpisodeLayoutProps> = ({
  totalSteps,
  currentStepIndex,
  dialogues,
  character = 'doraemon',
  onNext,
  onBack,
  isNextDisabled = false,
  isBackDisabled = false,
  children
}) => {
  const progressPercentage = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
    }} className="animate-fade-in">
      
      {/* 1. Progress Bar (Top) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
          <span>EPISODE PROGRESS</span>
          <span style={{ color: 'hsl(var(--doraemon-blue))' }}>
            Step {currentStepIndex + 1} of {totalSteps} ({progressPercentage}%)
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '9999px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.03)'
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: '100%',
            background: 'linear-gradient(to right, #008cff, #38bdf8)',
            borderRadius: '9999px',
            boxShadow: '0 0 10px rgba(0, 140, 255, 0.4)',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
      </div>

      {/* 2. Dialogue Area (Custom Typing Dialogue component) */}
      <Dialogue 
        dialogues={dialogues}
        character={character}
      />

      {/* 3. Content Area Slot */}
      <div style={{ minHeight: '200px', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>

      {/* 4. Navigation Controls (Bottom) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '20px',
        marginTop: '10px'
      }}>
        <button
          onClick={onBack}
          disabled={isBackDisabled}
          className="btn btn-secondary"
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: isBackDisabled ? 0.4 : 1
          }}
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className="btn btn-primary"
          style={{
            padding: '10px 24px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {currentStepIndex === totalSteps - 1 ? 'Complete Concept' : 'Continue'}
          <ChevronRight size={16} />
        </button>
      </div>

    </div>
  );
};
export default EpisodeLayout;
