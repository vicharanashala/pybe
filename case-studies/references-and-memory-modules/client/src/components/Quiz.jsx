import CodeSlotChallenge from './CodeSlotChallenge';
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';

const Quiz = ({ questions, onPass, onComplete, codeChallenge, onClose }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState('');

  const [jumbleSelected, setJumbleSelected] = useState([]);
  const [debugInput, setDebugInput] = useState('');

  useEffect(() => {
    setJumbleSelected([]);
    setDebugInput('');
    setFeedback('');
  }, [currentQ]);

  const handleNext = (isCorrect) => {
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('Correct!');
    } else {
      setFeedback('Incorrect, but keep going!');
    }

    setTimeout(() => {
      if (currentQ + 1 < questions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        setShowResult(true);
        const finalScore = score + (isCorrect ? 1 : 0);
        if (finalScore === questions.length && !codeChallenge) {
          if (onPass) onPass();
          if (onComplete) onComplete();
        }
      }
    }, 1000);
  };

  if (showResult) {
    if (score === questions.length && codeChallenge) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            padding: '16px 20px',
            background: '#e9f4ec',
            border: '1.5px solid #4f9a63',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 4px 16px rgba(79, 154, 99, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle size={24} color="#2f6564" />
              <div>
                <h4 style={{ margin: 0, color: '#256038', fontSize: '1.15rem', fontFamily: '"Fraunces", Georgia, serif', fontWeight: 800 }}>
                  Questions Passed (3/3 Correct)!
                </h4>
                <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: '#4a443b' }}>
                  Now complete the practical challenge below to patch the code and unlock the next level!
                </p>
              </div>
            </div>
            <span style={{
              background: '#2f6564',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.74rem',
              padding: '4px 12px',
              borderRadius: '999px',
              letterSpacing: '0.3px',
              textTransform: 'uppercase'
            }}>
              Final Practical Challenge
            </span>
          </div>

          <CodeSlotChallenge
            {...codeChallenge}
            onClose={onClose}
            onUnlockNextLevel={() => {
              if (onPass) onPass();
              if (onComplete) onComplete();
            }}
          />
        </div>
      );
    }

    const isFullScore = score === questions.length;

    return (
      <div style={{
        padding: '28px',
        background: '#fffdfa',
        border: `1.5px solid ${isFullScore ? '#4f9a63' : '#e4dcc8'}`,
        borderRadius: '18px',
        marginTop: '10px',
        boxShadow: '0 12px 36px rgba(43, 30, 20, 0.08)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: isFullScore ? '#e9f4ec' : '#fbeae7',
          color: isFullScore ? '#4f9a63' : '#c25b4a',
          marginBottom: '16px'
        }}>
          {isFullScore ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
        </div>

        <h3 style={{
          color: isFullScore ? '#256038' : '#c25b4a',
          fontSize: '1.4rem',
          fontFamily: '"Fraunces", Georgia, serif',
          margin: '0 0 8px',
          fontWeight: 800
        }}>
          {isFullScore ? (questions.length >= 10 ? "Mega Exam Mastered!" : "Quiz Mastered!") : "Quiz Incomplete"}
        </h3>

        <p style={{ fontSize: '1.05rem', color: '#5b5648', margin: '0 0 18px' }}>
          You scored <strong style={{ color: '#2b2b2b' }}>{score}</strong> out of <strong style={{ color: '#2b2b2b' }}>{questions.length}</strong>.
        </p>

        {isFullScore ? (
          <div style={{
            padding: '14px 18px',
            background: '#e9f4ec',
            borderRadius: '12px',
            border: '1px solid #4f9a63',
            maxWidth: '480px',
            margin: '0 auto'
          }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#256038', fontSize: '0.92rem' }}>
              🏆 Outstanding! You answered all {questions.length} questions correctly!
            </p>
          </div>
        ) : (
          <button
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #FA994F 0%, #c4682c 100%)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.92rem',
              padding: '12px 24px',
              borderRadius: '999px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(250, 153, 79, 0.3)'
            }}
            onClick={() => { setCurrentQ(0); setScore(0); setShowResult(false); }}
          >
            <RotateCcw size={16} /> {questions.length >= 10 ? "Retry Exam" : "Retry Quiz"}
          </button>
        )}
      </div>
    );
  }

  const q = questions[currentQ];
  const qType = q.type || 'mcq';

  const checkTextAnswer = () => {
    const trimmedInput = debugInput.trim().toLowerCase();
    if (q.acceptableWords && Array.isArray(q.acceptableWords)) {
      return q.acceptableWords.map(w => w.toLowerCase()).includes(trimmedInput);
    }
    return trimmedInput === (q.correctWord || '').toLowerCase();
  };

  const getTypeBadge = () => {
    switch (qType) {
      case 'mcq':
        return { label: 'MULTIPLE CHOICE', bg: '#fdf3e2', border: '#e8a33d', color: '#8c5914' };
      case 'debug':
        return { label: 'DEBUGGING', bg: '#fbeae7', border: '#c25b4a', color: '#c25b4a' };
      case 'fill':
        return { label: 'FILL IN THE BLANKS', bg: '#fff2e8', border: 'rgba(246, 159, 92, 0.5)', color: '#7c4a2d' };
      case 'jumble':
        return { label: 'JUMBLED CODE', bg: '#e9f4ec', border: '#4f9a63', color: '#2f6564' };
      default:
        return { label: 'QUESTION', bg: '#f0ece0', border: '#e4dcc8', color: '#5b5648' };
    }
  };

  const badge = getTypeBadge();

  return (
    <div style={{
      padding: '28px',
      background: '#fffdfa',
      border: '1.5px solid #e4dcc8',
      borderRadius: '18px',
      marginTop: '10px',
      boxShadow: '0 12px 36px rgba(43, 30, 20, 0.08)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #e4dcc8', paddingBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '1.25rem', fontFamily: '"Fraunces", Georgia, serif', color: '#2b2b2b', fontWeight: 800 }}>
          Question {currentQ + 1} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#7c7365' }}>of {questions.length}</span>
        </h3>
        <span style={{
          fontSize: '0.74rem',
          fontWeight: 700,
          letterSpacing: '0.5px',
          padding: '4px 12px',
          borderRadius: '999px',
          background: badge.bg,
          border: `1px solid ${badge.border}`,
          color: badge.color
        }}>
          {badge.label}
        </span>
      </div>

      {/* Question prompt */}
      <p style={{ fontSize: '1.05rem', marginBottom: '22px', lineHeight: '1.6', color: '#2b2b2b', textAlign: 'left', fontWeight: 600 }}>
        {q.question}
      </p>
      
      {/* MCQ options */}
      {qType === 'mcq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              style={{
                justifyContent: 'flex-start',
                textAlign: 'left',
                padding: '14px 18px',
                lineHeight: '1.45',
                background: '#ffffff',
                border: '1.5px solid #e4dcc8',
                borderRadius: '12px',
                color: '#2b2b2b',
                fontSize: '0.94rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.15s ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FA994F';
                e.currentTarget.style.background = '#fff8f2';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e4dcc8';
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              onClick={() => handleNext(opt.isCorrect)}
            >
              <span style={{
                background: '#f4efe4',
                color: '#7c4a2d',
                fontWeight: 700,
                fontSize: '0.8rem',
                padding: '3px 8px',
                borderRadius: '6px',
                minWidth: '22px',
                textAlign: 'center'
              }}>
                {String.fromCharCode(65 + i)}
              </span>
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Jumble code */}
      {qType === 'jumble' && (
        <div>
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '16px',
            minHeight: '48px',
            padding: '12px 14px',
            background: '#faf6ee',
            borderRadius: '12px',
            border: '2px dashed #d1c7b7',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {jumbleSelected.length === 0 ? (
              <span style={{ color: '#7c7365', fontSize: '0.88rem', fontStyle: 'italic' }}>
                Click word tokens below to construct code...
              </span>
            ) : (
              jumbleSelected.map((word, i) => (
                <span
                  key={i}
                  style={{
                    background: 'linear-gradient(135deg, #FA994F 0%, #c4682c 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontSize: '0.88rem',
                    boxShadow: '0 2px 8px rgba(250, 153, 79, 0.28)'
                  }}
                  onClick={() => setJumbleSelected(jumbleSelected.filter((_, idx) => idx !== i))}
                  title="Click to remove token"
                >
                  {word} ✕
                </span>
              ))
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {q.words.map((word, i) => (
              <button
                key={i}
                type="button"
                disabled={jumbleSelected.includes(word)}
                style={{
                  fontFamily: 'monospace',
                  padding: '8px 14px',
                  background: jumbleSelected.includes(word) ? '#f0ece0' : '#ffffff',
                  border: '1.5px solid #e4dcc8',
                  borderRadius: '8px',
                  color: jumbleSelected.includes(word) ? '#9e978a' : '#2b2b2b',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: jumbleSelected.includes(word) ? 'not-allowed' : 'pointer'
                }}
                onClick={() => setJumbleSelected([...jumbleSelected, word])}
              >
                {word}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              style={{
                background: 'linear-gradient(135deg, #FA994F 0%, #c4682c 100%)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '10px 22px',
                borderRadius: '999px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(250, 153, 79, 0.3)'
              }}
              onClick={() => handleNext(jumbleSelected.join(' ') === q.correctOrder.join(' '))}
            >
              Submit Order
            </button>
            {jumbleSelected.length > 0 && (
              <button
                type="button"
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #e4dcc8',
                  color: '#5b5648',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  padding: '10px 18px',
                  borderRadius: '999px',
                  cursor: 'pointer'
                }}
                onClick={() => setJumbleSelected([])}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Debug or Fill in the blanks */}
      {(qType === 'debug' || qType === 'fill') && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            background: '#241e1a',
            padding: '18px 20px',
            fontFamily: 'monospace',
            fontSize: '1.05rem',
            marginBottom: '20px',
            borderRadius: '12px',
            color: '#fce7cf',
            border: '1.5px solid #3d352e'
          }}>
            {q.codeSnippet.split('___').map((part, index, array) => (
              <React.Fragment key={index}>
                <span>{part}</span>
                {index < array.length - 1 && (
                  <input 
                    type="text" 
                    value={debugInput} 
                    onChange={(e) => setDebugInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNext(checkTextAnswer());
                    }}
                    placeholder="enter code..."
                    style={{
                      width: '140px',
                      padding: '7px 12px',
                      textAlign: 'center',
                      borderRadius: '8px',
                      border: '2px solid #FA994F',
                      background: '#ffffff',
                      color: '#2b2b2b',
                      outline: 'none',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      fontSize: '0.98rem',
                      boxShadow: '0 0 0 3px rgba(250, 153, 79, 0.2)'
                    }}
                    autoComplete="off"
                    autoFocus
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <button
            type="button"
            style={{
              background: 'linear-gradient(135deg, #FA994F 0%, #c4682c 100%)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              padding: '10px 22px',
              borderRadius: '999px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(250, 153, 79, 0.3)'
            }}
            onClick={() => handleNext(checkTextAnswer())}
          >
            Submit Answer
          </button>
        </div>
      )}
      
      {/* Feedback text */}
      {feedback && (
        <div style={{
          marginTop: '18px',
          padding: '10px 16px',
          borderRadius: '10px',
          background: feedback === 'Correct!' ? '#e9f4ec' : '#fbeae7',
          border: `1px solid ${feedback === 'Correct!' ? '#4f9a63' : '#c25b4a'}`,
          color: feedback === 'Correct!' ? '#256038' : '#c25b4a',
          fontWeight: 700,
          fontSize: '0.94rem'
        }}>
          {feedback}
        </div>
      )}
    </div>
  );
};

export default Quiz;
