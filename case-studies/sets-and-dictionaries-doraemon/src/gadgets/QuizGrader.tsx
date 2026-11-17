import React, { useState, useEffect } from 'react';
import { GlassCard } from '../shared-components/GlassCard';
import { GadgetShell } from './GadgetShell';
import { CheckCircle } from 'lucide-react';

interface QuizGraderProps {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  onGrade: (passed: boolean) => void;
  isCompleted?: boolean;
}

export const QuizGrader: React.FC<QuizGraderProps> = ({
  question,
  options,
  correctOptionIndex,
  explanation,
  onGrade,
  isCompleted = false
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(isCompleted);
  const [shake, setShake] = useState<boolean>(false);

  // Sync state if step changes
  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(isCompleted);
    setShake(false);
  }, [question, isCompleted]);

  const handleOptionClick = (optionIndex: number) => {
    if (isCompleted || isAnswered) return;
    
    setSelectedOption(optionIndex);
    
    if (optionIndex === correctOptionIndex) {
      setIsAnswered(true);
      onGrade(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      onGrade(false);
    }
  };

  return (
    <GadgetShell 
      gadgetId="GD-03" 
      gadgetName="Translation Grader"
      status={isAnswered ? 'success' : selectedOption !== null ? 'error' : 'idle'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
        <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#f1f5f9', fontWeight: 500, margin: 0 }}>
          {question}
        </p>
        
        <div 
          className={shake ? 'animate-shake' : ''}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          {options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === correctOptionIndex;
            
            let borderStyle = '1px solid rgba(255, 255, 255, 0.08)';
            let bgStyle = 'rgba(255, 255, 255, 0.02)';
            
            if (isSelected) {
              if (isCorrect) {
                borderStyle = '1px solid #10b981';
                bgStyle = 'rgba(16, 185, 129, 0.1)';
              } else {
                borderStyle = '1px solid #f43f5e';
                bgStyle = 'rgba(244, 63, 94, 0.1)';
              }
            } else if (isAnswered && isCorrect) {
              borderStyle = '1px solid #10b981';
              bgStyle = 'rgba(16, 185, 129, 0.05)';
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isCompleted || isAnswered}
                style={{
                  background: bgStyle,
                  border: borderStyle,
                  borderRadius: '10px',
                  padding: '14px 16px',
                  textAlign: 'left',
                  color: '#cbd5e1',
                  fontSize: '13px',
                  cursor: isCompleted || isAnswered ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  if (!isCompleted && !isAnswered) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCompleted && !isAnswered) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  }
                }}
              >
                <div style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: isSelected ? (isCorrect ? '#10b981' : '#f43f5e') : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {isSelected && (isCorrect ? '✓' : '✗')}
                </div>
                {option}
              </button>
            );
          })}
        </div>

        {(isCompleted || isAnswered) && (
          <GlassCard 
            style={{ 
              padding: '14px 16px', 
              border: '1px solid rgba(16, 185, 129, 0.2)', 
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              marginTop: '5px'
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', color: '#34d399' }}>
              <CheckCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '13px', display: 'block', marginBottom: '2px' }}>Graded Correctly</strong>
                <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>{explanation}</p>
              </div>
            </div>
          </GlassCard>
        )}
      </div>
    </GadgetShell>
  );
};
export default QuizGrader;
