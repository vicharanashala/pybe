import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Award, RotateCcw, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

export const HeistExam = ({ onExamPassed }) => {
  const { addXP, triggerConfetti } = useGame();
  const { playSuccess, playWrong, playClick } = useSoundFX();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [examSubmitted, setExamSubmitted] = useState(false);

  const questions = [
    {
      id: 1,
      concept: 'Time Complexity (O(N) vs O(1))',
      question: 'Why does searching a List of 1,000,000 items wake the dog, while a Hashmap does not?',
      options: [
        { text: 'A List checks every drawer one by one O(N), but a Hashmap jumps straight to the exact drawer in 1 step O(1).', isCorrect: true },
        { text: 'A List makes more physical noise when clicking on the computer screen.', isCorrect: false },
        { text: 'Hashmaps only work if the dog is already asleep.', isCorrect: false }
      ]
    },
    {
      id: 2,
      concept: 'Python Dictionary Syntax',
      question: 'Which symbol in a Python dictionary connects a Key (sticker) to its Value (treasure)?',
      options: [
        { text: 'The colon (:)', isCorrect: true },
        { text: 'The equal sign (=)', isCorrect: false },
        { text: 'The plus sign (+)', isCorrect: false }
      ]
    },
    {
      id: 3,
      concept: 'Error Handling (KeyError)',
      question: 'What happens if Sly looks up a missing key with square brackets: wizard_chest["dragon"]?',
      options: [
        { text: 'Python crashes with a KeyError alarm, alerting the dog!', isCorrect: true },
        { text: 'Python quietly creates a dragon inside the room.', isCorrect: false },
        { text: 'It automatically returns zero coins without error.', isCorrect: false }
      ]
    },
    {
      id: 4,
      concept: 'Hash Functions & Math',
      question: 'How does a Hashmap turn the word "star" into a specific drawer number?',
      options: [
        { text: 'It scrambles the letters through a math formula (hash function) and uses modulo (%) to pick a drawer.', isCorrect: true },
        { text: 'It randomly guesses until it gets lucky.', isCorrect: false },
        { text: 'It asks the guard dog for permission.', isCorrect: false }
      ]
    },
    {
      id: 5,
      concept: 'Safe Retrieval (.get())',
      question: 'Why is wizard_chest.get("dragon", "Empty!") the safest way to loot?',
      options: [
        { text: 'It returns "Empty!" gracefully instead of crashing with a KeyError.', isCorrect: true },
        { text: 'It opens all drawers at once.', isCorrect: false },
        { text: 'It deletes the chest from memory.', isCorrect: false }
      ]
    }
  ];

  const handleSelectOption = (qId, option) => {
    playClick();
    setSelectedAnswers(prev => ({
      ...prev,
      [qId]: option
    }));
  };

  const handleSubmitExam = () => {
    playClick();
    setExamSubmitted(true);

    const correctCount = questions.filter(q => selectedAnswers[q.id]?.isCorrect).length;
    if (correctCount >= 4) {
      playSuccess();
      triggerConfetti();
      addXP(50);
      if (onExamPassed) onExamPassed();
    } else {
      playWrong();
    }
  };

  const handleRetake = () => {
    playClick();
    setSelectedAnswers({});
    setExamSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = questions.filter(q => selectedAnswers[q.id]?.isCorrect).length;
  const weakSpots = questions.filter(q => !selectedAnswers[q.id]?.isCorrect);

  return (
    <div className="heist-exam-card glass-card" style={{ padding: '30px', border: '1px solid var(--accent)', margin: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Award size={28} color="var(--accent)" />
          <div>
            <h3 style={{ color: '#fff', margin: 0, fontSize: '1.3rem' }}>The Grand Heist Exam</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
              Pass 4 out of 5 questions to claim your Master Thief Certificate!
            </p>
          </div>
        </div>
        <div style={{ background: 'rgba(242, 201, 76, 0.15)', color: 'var(--accent)', padding: '6px 14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          {answeredCount} / {questions.length} Answered
        </div>
      </div>

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
        {questions.map((q, qIdx) => {
          const selected = selectedAnswers[q.id];
          return (
            <div 
              key={q.id}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '18px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Question {qIdx + 1} • {q.concept}
                </span>
                {examSubmitted && (
                  selected?.isCorrect ? (
                    <span style={{ color: 'var(--success)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={16} /> Correct
                    </span>
                  ) : (
                    <span style={{ color: 'var(--error)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={16} /> Review
                    </span>
                  )
                )}
              </div>

              <div style={{ color: '#fff', fontSize: '1.02rem', fontWeight: '600', marginBottom: '14px' }}>
                {q.question}
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((opt, oIdx) => {
                  const isChecked = selected?.text === opt.text;
                  let bg = 'rgba(255,255,255,0.04)';
                  let border = 'rgba(255,255,255,0.1)';
                  let color = 'var(--text-main)';

                  if (isChecked) {
                    if (examSubmitted) {
                      bg = opt.isCorrect ? 'rgba(0, 255, 163, 0.2)' : 'rgba(255, 76, 76, 0.2)';
                      border = opt.isCorrect ? 'var(--success)' : 'var(--error)';
                      color = opt.isCorrect ? 'var(--success)' : 'var(--error)';
                    } else {
                      bg = 'rgba(0, 240, 255, 0.15)';
                      border = 'var(--secondary)';
                      color = 'var(--secondary)';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => !examSubmitted && handleSelectOption(q.id, opt)}
                      disabled={examSubmitted}
                      style={{
                        background: bg,
                        border: `1px solid ${border}`,
                        color,
                        padding: '10px 16px',
                        borderRadius: '10px',
                        textAlign: 'left',
                        cursor: examSubmitted ? 'default' : 'pointer',
                        fontSize: '0.92rem',
                        transition: 'all 0.15s'
                      }}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit / Results */}
      {!examSubmitted ? (
        <button
          className="web3-button"
          onClick={handleSubmitExam}
          disabled={answeredCount < questions.length}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '1.1rem',
            background: answeredCount === questions.length ? 'linear-gradient(135deg, var(--accent), #FF8C00)' : 'rgba(255,255,255,0.05)',
            color: answeredCount === questions.length ? '#000' : 'var(--text-muted)'
          }}
        >
          {answeredCount === questions.length ? 'Submit Final Heist Exam' : `Answer All Questions to Submit (${answeredCount}/${questions.length})`}
        </button>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{
            background: correctCount >= 4 ? 'rgba(0, 255, 163, 0.12)' : 'rgba(255, 76, 76, 0.12)',
            border: `1px solid ${correctCount >= 4 ? 'var(--success)' : 'var(--error)'}`,
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            <h3 style={{ color: correctCount >= 4 ? 'var(--success)' : 'var(--error)', fontSize: '1.5rem', margin: '0 0 8px 0' }}>
              {correctCount >= 4 ? '🎉 EXAM PASSED: MASTER THIEF ACCREDITED!' : 'ALMOST THERE! REVIEW WEAK SPOTS'}
            </h3>
            <p style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>
              You scored <strong>{correctCount} / {questions.length}</strong> correct!
            </p>

            {/* Weak Spots Diagnostic */}
            {weakSpots.length > 0 && (
              <div style={{ marginTop: '16px', textAlign: 'left', background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px' }}>
                <strong style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>💡 Areas to Review:</strong>
                <ul style={{ margin: '8px 0 0 20px', color: '#D8F8FF', fontSize: '0.88rem' }}>
                  {weakSpots.map(w => (
                    <li key={w.id}>{w.concept}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="web3-button"
              onClick={handleRetake}
              style={{
                flex: 1,
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <RotateCcw size={16} /> Retake Exam
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
