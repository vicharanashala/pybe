import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle, AlertCircle, Lightbulb, ChevronRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

/**
 * QuizCard Component with 3-tier Hint Ladder and Informative Feedback
 *
 * Props:
 * - id: unique string
 * - question: string
 * - options: Array of { label, isCorrect, explanation } OR Array of strings with correctAnswer & explanations map
 * - hints: [step1Nudge, step2Clue, step3NearAnswer]
 * - onPassed: callback
 */
export const QuizCard = ({ 
  id, 
  question, 
  options, 
  correctAnswer, 
  explanations = {}, 
  hints = [], 
  onPassed 
}) => {
  const { 
    xp, 
    spendXP, 
    addXP, 
    raiseDogMeter, 
    lowerDogMeter, 
    triggerConfetti 
  } = useGame();
  const { playSuccess, playWrong, playClick } = useSoundFX();

  const [selected, setSelected] = useState(null);
  const [passed, setPassed] = useState(false);
  const [wrongFeedback, setWrongFeedback] = useState(null);
  const [hintTier, setHintTier] = useState(0); // 0 = none, 1 = nudge, 2 = clue, 3 = near-answer

  // Normalize options to objects { text, isCorrect, why }
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string') {
      const isCorrect = opt === correctAnswer;
      return {
        text: opt,
        isCorrect,
        why: explanations[opt] || (isCorrect ? 'Spot on! This matches the magic principles perfectly.' : 'Not quite. Think about how the drawers or symbols behave.')
      };
    }
    return opt;
  });

  const handleSelect = (opt) => {
    if (passed) return;
    playClick();
    setSelected(opt.text);

    if (opt.isCorrect) {
      setPassed(true);
      setWrongFeedback(null);
      lowerDogMeter(15);
      addXP(25);
      playSuccess();
      triggerConfetti();
      if (onPassed) onPassed();
    } else {
      setWrongFeedback(opt.why);
      raiseDogMeter(25);
      playWrong();
    }
  };

  const handleUnlockHint = () => {
    playClick();
    const cost = hintTier === 0 ? 2 : hintTier === 1 ? 5 : 10;
    if (xp < cost) {
      alert(`You need ${cost} XP for this hint! Solve more challenges or try an educated guess.`);
      return;
    }
    spendXP(cost);
    setHintTier(prev => Math.min(3, prev + 1));
  };

  const hintLabels = [
    '💡 Need a hint? (-2 XP for Nudge)',
    '💡 Bigger Clue (-5 XP)',
    '💡 Near-Answer Revelation (-10 XP)'
  ];

  return (
    <motion.div 
      className="quiz-card-container glass-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '24px',
        margin: '20px 0',
        border: passed ? '1px solid var(--success)' : '1px solid rgba(255, 255, 255, 0.1)',
        background: passed ? 'rgba(0, 255, 163, 0.04)' : 'rgba(15, 15, 25, 0.5)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={20} color={passed ? 'var(--success)' : 'var(--accent)'} />
          <span style={{ fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: passed ? 'var(--success)' : 'var(--accent)' }}>
            {passed ? 'Checkpoint Cleared (+25 XP)' : 'Security Checkpoint'}
          </span>
        </div>

        {/* Hint Ladder Trigger */}
        {!passed && hints.length > 0 && hintTier < 3 && (
          <button
            onClick={handleUnlockHint}
            className="hint-ladder-btn"
            style={{
              background: 'rgba(242, 201, 76, 0.12)',
              border: '1px solid rgba(242, 201, 76, 0.3)',
              color: 'var(--accent)',
              fontSize: '0.8rem',
              padding: '6px 12px',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '600'
            }}
          >
            <Lightbulb size={14} />
            {hintLabels[hintTier]}
          </button>
        )}
      </div>

      <p style={{ fontSize: '1.05rem', fontWeight: '600', color: '#fff', marginBottom: '18px', lineHeight: '1.5' }}>
        {question}
      </p>

      {/* Hint Ladder Display */}
      <AnimatePresence>
        {hintTier > 0 && hints[hintTier - 1] && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(242, 201, 76, 0.08)',
              borderLeft: '3px solid var(--accent)',
              padding: '10px 14px',
              borderRadius: '0 8px 8px 0',
              marginBottom: '18px',
              fontSize: '0.9rem',
              color: '#FFDE7D'
            }}
          >
            <strong>Hint Step {hintTier}:</strong> {hints[hintTier - 1]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {normalizedOptions.map((opt, idx) => {
          const isSelected = selected === opt.text;
          let btnStyle = {
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-main)',
            padding: '14px 18px',
            borderRadius: '12px',
            cursor: passed ? 'default' : 'pointer',
            textAlign: 'left',
            fontSize: '0.96rem',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          };

          if (isSelected) {
            if (opt.isCorrect) {
              btnStyle.background = 'rgba(0, 255, 163, 0.15)';
              btnStyle.borderColor = 'var(--success)';
              btnStyle.color = 'var(--success)';
              btnStyle.boxShadow = '0 0 15px rgba(0, 255, 163, 0.2)';
            } else {
              btnStyle.background = 'rgba(255, 76, 76, 0.15)';
              btnStyle.borderColor = 'var(--error)';
              btnStyle.color = 'var(--error)';
              btnStyle.boxShadow = '0 0 15px rgba(255, 76, 76, 0.2)';
            }
          }

          return (
            <button
              key={idx}
              style={btnStyle}
              onClick={() => handleSelect(opt)}
              disabled={passed}
            >
              <span>{opt.text}</span>
              {isSelected && opt.isCorrect && <CheckCircle size={18} color="var(--success)" />}
              {isSelected && !opt.isCorrect && <AlertCircle size={18} color="var(--error)" />}
            </button>
          );
        })}
      </div>

      {/* Feedback Messages */}
      <AnimatePresence>
        {wrongFeedback && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: '15px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(255, 76, 76, 0.12)',
              border: '1px solid rgba(255, 76, 76, 0.3)',
              color: '#FFA3A3',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              lineHeight: '1.4'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Why that didn't work:</strong> {wrongFeedback}
              <div style={{ fontSize: '0.82rem', marginTop: '4px', color: '#ffbaba' }}>
                🐶 Guard Dog heard the rattle! (+25% Dog Wake Meter)
              </div>
            </div>
          </motion.div>
        )}

        {passed && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: '15px',
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(0, 255, 163, 0.1)',
              border: '1px solid rgba(0, 255, 163, 0.3)',
              color: 'var(--success)',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <CheckCircle size={18} />
            <span><strong>Lock disarmed!</strong> Guard dog settled back to sleep (-15% Dog Wake Meter).</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
