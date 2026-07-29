import React, { useState } from 'react';

export default function InteractiveView({ caseStudy, onReset }) {
  const [level, setLevel] = useState(caseStudy.userState?.level || 1);
  const [score, setScore] = useState(caseStudy.userState?.score || 0);
  const [userInputs, setUserInputs] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  if (!caseStudy) return null;

  const {
    domain,
    character,
    concept,
    example_scenario = {},
    practice_scenario = {}
  } = caseStudy;

  const {
    pure_story: practiceStory,
    evaluation,
    options = {},
    explanations = {},
    raw_python_template,
    raw_pseudo_template
  } = practice_scenario;

  const handleInputChange = (key, value) => {
    setUserInputs(prev => ({ ...prev, [key]: value }));
    if (feedback) setFeedback(null); // clear old feedback on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    // Evaluate accuracy: For Level 1 options, index 0 is always the correct intended answer.
    // For input blanks (Levels 2-4), check if input is non-empty and reasonably accurate.
    let isCorrect = false;
    if (level === 1) {
      const b1Correct = !options.blank_1 || userInputs['blank_1'] === options.blank_1[0];
      const b2Correct = !options.blank_2 || userInputs['blank_2'] === options.blank_2[0];
      isCorrect = b1Correct && b2Correct;
    } else {
      // In levels 2, 3, 4 check if learner filled in code that matches core keywords
      const ans = Object.values(userInputs).join(' ').trim().toLowerCase();
      isCorrect = ans.length > 2 && (ans.includes('while') || ans.includes('=') || ans.includes('<') || ans.includes('>') || ans.includes('if') || ans.includes('def') || ans.includes('print'));
    }

    try {
      const res = await fetch('/api/personalized/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'guest_user',
          topic: concept,
          isCorrect,
          themeId: caseStudy.themeId
        })
      });
      const data = await res.json();
      if (data.success) {
        const newLvl = data.data.userState.level;
        const newScr = data.data.userState.score;
        if (newLvl > level) {
          setShowLevelUp(true);
          setTimeout(() => setShowLevelUp(false), 3500);
        }
        setLevel(newLvl);
        setScore(newScr);
        setFeedback({
          success: isCorrect,
          message: data.data.message
        });
      }
    } catch (err) {
      console.error("Evaluation error:", err);
      // Fallback local evaluation if offline
      setFeedback({
        success: isCorrect,
        message: isCorrect ? "Great job! (Offline verification)" : "Let's review the story and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Level Up Overlay Animation */}
      {showLevelUp && (
        <div style={styles.levelUpOverlay}>
          <div style={styles.levelUpCard}>
            <span style={{ fontSize: '3rem' }}>🎉 ⚡ 🚀</span>
            <h2 style={{ color: '#38bdf8', margin: '0.5rem 0' }}>LEVEL UP!</h2>
            <p style={{ color: '#e2e8f0' }}>You mastered this tier! Promoting to Difficulty Level {level}</p>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div style={styles.headerBar}>
        <div>
          <h2 style={styles.title}>⚡ Adaptive Learning: {concept.toUpperCase()}</h2>
          <p style={styles.subtitle}>Domain: <strong>{domain}</strong> | Hero: <strong>{character}</strong></p>
        </div>
        <div style={styles.statusBadge}>
          <span style={styles.levelTag}>Level {level} / 4</span>
          <span style={styles.scoreTag}>Score: {score} pts</span>
          <button onClick={onReset} style={styles.backBtn}>← 50-Grid Dashboard</button>
        </div>
      </div>

      {/* Step 1: The Example Story */}
      <section style={styles.card}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNum}>Step 1</span>
          <h3 style={styles.stepTitle}>The Example Story (No Coding Jargon)</h3>
        </div>
        <p style={styles.storyText}>{example_scenario.pure_story}</p>
      </section>

      {/* Step 2: The Discovery (Side-by-Side) */}
      <section style={styles.card}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNum}>Step 2</span>
          <h3 style={styles.stepTitle}>In plain words... vs. In Python...</h3>
        </div>
        <p style={styles.sideDescription}>
          See exactly how plain 8-year-old English translates line-by-line into real Python syntax:
        </p>
        <div style={styles.sideBySideGrid}>
          {/* Left: Plain Words */}
          <div style={styles.codeBoxLeft}>
            <div style={styles.boxLabelLeft}>🗣️ In Plain Words (8-Year-Old English)</div>
            <pre style={styles.preText}>{example_scenario.pseudo_code}</pre>
          </div>
          {/* Right: Python Code */}
          <div style={styles.codeBoxRight}>
            <div style={styles.boxLabelRight}>🐍 In Python (Machine Syntax)</div>
            <pre style={styles.preCode}>{example_scenario.python_code}</pre>
          </div>
        </div>
      </section>

      {/* Step 3 & 4: Practice Story & Adaptive Evaluation */}
      <section style={styles.cardHighlight}>
        <div style={styles.stepHeader}>
          <span style={styles.stepNumHighlight}>Step 3 & 4</span>
          <h3 style={styles.stepTitleHighlight}>Practice Story & Adaptive Evaluation</h3>
        </div>
        <p style={styles.storyText}>{practiceStory}</p>

        <div style={styles.evaluationBox}>
          <h4 style={{ color: '#38bdf8', marginBottom: '1rem' }}>
            🎯 Your Task (Difficulty Level {level}: {level === 1 ? 'Select Options' : level === 2 ? 'Fill in Blanks' : level === 3 ? 'Fewer Blanks' : 'Write Full Code'})
          </h4>

          <form onSubmit={handleSubmit}>
            {level === 1 && (
              <div style={styles.formGroup}>
                <p style={{ color: '#cbd5e1', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  Complete the pseudo-code logic based on the practice story above:
                </p>
                <div style={styles.optionRow}>
                  <label style={styles.label}>[ BLANK 1 ] (Action):</label>
                  <select
                    style={styles.selectInput}
                    value={userInputs['blank_1'] || ''}
                    onChange={(e) => handleInputChange('blank_1', e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Choose Option --</option>
                    {(options.blank_1 || []).map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.optionRow}>
                  <label style={styles.label}>[ BLANK 2 ] (Condition):</label>
                  <select
                    style={styles.selectInput}
                    value={userInputs['blank_2'] || ''}
                    onChange={(e) => handleInputChange('blank_2', e.target.value)}
                    required
                  >
                    <option value="" disabled>-- Choose Option --</option>
                    {(options.blank_2 || []).map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {level === 2 && (
              <div style={styles.formGroup}>
                <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
                  Template: <code style={styles.inlineCode}>{raw_python_template || 'while [ BLANK 3 ]: [ BLANK 4 ]'}</code>
                </p>
                <div style={styles.optionRow}>
                  <label style={styles.label}>Type condition for [ BLANK 3 ]:</label>
                  <input
                    type="text"
                    style={styles.textInput}
                    placeholder="e.g. score < 10"
                    value={userInputs['blank_3'] || ''}
                    onChange={(e) => handleInputChange('blank_3', e.target.value)}
                    required
                  />
                </div>
                <div style={styles.optionRow}>
                  <label style={styles.label}>Type action for [ BLANK 4 ]:</label>
                  <input
                    type="text"
                    style={styles.textInput}
                    placeholder="e.g. print('keep going')"
                    value={userInputs['blank_4'] || ''}
                    onChange={(e) => handleInputChange('blank_4', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {level === 3 && (
              <div style={styles.formGroup}>
                <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>Fewer Blanks (Keyword Scaffolding Removed):</p>
                <pre style={styles.minimalBox}>
                  {evaluation?.data || raw_python_template?.replace('while', '_____')}
                </pre>
                <input
                  type="text"
                  style={styles.fullInput}
                  placeholder="Type the missing keyword and logic here..."
                  value={userInputs['lvl3_ans'] || ''}
                  onChange={(e) => handleInputChange('lvl3_ans', e.target.value)}
                  required
                />
              </div>
            )}

            {level === 4 && (
              <div style={styles.formGroup}>
                <p style={{ color: '#cbd5e1', marginBottom: '0.5rem' }}>No Scaffolding! Write the complete Python code:</p>
                <textarea
                  style={styles.textareaInput}
                  rows={4}
                  placeholder="while condition:\n    action()"
                  value={userInputs['lvl4_ans'] || ''}
                  onChange={(e) => handleInputChange('lvl4_ans', e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" disabled={isSubmitting} style={styles.submitBtn}>
              {isSubmitting ? "Evaluating..." : "⚡ Verify Practice Solution"}
            </button>
          </form>

          {/* Feedback & Explanations Block */}
          {feedback && (
            <div style={feedback.success ? styles.successAlert : styles.errorAlert}>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {feedback.success ? "✅ Correct Solution!" : "❌ Needs Improvement"}
              </div>
              <p style={{ margin: 0, marginBottom: !feedback.success ? '1rem' : 0 }}>{feedback.message}</p>

              {!feedback.success && (
                <div style={styles.explanationsBlock}>
                  <div style={{ fontWeight: '600', color: '#fca5a5', marginBottom: '0.4rem' }}>
                    💡 Inline Tutor Explanations:
                  </div>
                  {Object.entries(explanations || {}).map(([k, text], idx) => (
                    <div key={idx} style={{ fontSize: '0.9rem', color: '#fee2e2', marginBottom: '0.3rem' }}>
                      • <strong>{k.replace('wrong_', '').replace('_', ' ').toUpperCase()}:</strong> {text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    minHeight: '100vh',
    padding: '2rem',
    fontFamily: "'Inter', 'Roboto', sans-serif",
    position: 'relative'
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: '1.2rem 2rem',
    borderRadius: '12px',
    border: '1px solid #334155',
    marginBottom: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#38bdf8',
    textShadow: '0 0 10px rgba(56, 189, 248, 0.3)'
  },
  subtitle: {
    margin: '0.3rem 0 0',
    color: '#94a3b8',
    fontSize: '0.95rem'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  levelTag: {
    backgroundColor: '#0284c7',
    color: '#fff',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.85rem'
  },
  scoreTag: {
    backgroundColor: '#10b981',
    color: '#fff',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    fontWeight: 'bold',
    fontSize: '0.85rem'
  },
  backBtn: {
    backgroundColor: 'transparent',
    color: '#38bdf8',
    border: '1px solid #38bdf8',
    padding: '0.4rem 0.8rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '1.8rem',
    marginBottom: '2rem',
    border: '1px solid #334155',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  cardHighlight: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '1.8rem',
    marginBottom: '2rem',
    border: '2px solid #0284c7',
    boxShadow: '0 0 25px rgba(2, 132, 199, 0.2)'
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '1rem'
  },
  stepNum: {
    backgroundColor: '#334155',
    color: '#38bdf8',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  stepNumHighlight: {
    backgroundColor: '#0284c7',
    color: '#fff',
    padding: '0.2rem 0.6rem',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  stepTitle: {
    margin: 0,
    fontSize: '1.25rem',
    color: '#e2e8f0'
  },
  stepTitleHighlight: {
    margin: 0,
    fontSize: '1.25rem',
    color: '#38bdf8'
  },
  storyText: {
    fontSize: '1.05rem',
    lineHeight: '1.7',
    color: '#cbd5e1',
    backgroundColor: '#0f172a',
    padding: '1.2rem',
    borderRadius: '8px',
    borderLeft: '4px solid #38bdf8',
    margin: 0
  },
  sideDescription: {
    color: '#94a3b8',
    marginBottom: '1.2rem',
    fontSize: '0.95rem'
  },
  sideBySideGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  codeBoxLeft: {
    backgroundColor: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  codeBoxRight: {
    backgroundColor: '#090d16',
    border: '1px solid #0284c7',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 0 15px rgba(2, 132, 199, 0.15)'
  },
  boxLabelLeft: {
    backgroundColor: '#1e293b',
    padding: '0.6rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#e2e8f0',
    borderBottom: '1px solid #334155'
  },
  boxLabelRight: {
    backgroundColor: '#0369a1',
    padding: '0.6rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#fff'
  },
  preText: {
    padding: '1rem',
    margin: 0,
    color: '#cbd5e1',
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: '0.95rem',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.5'
  },
  preCode: {
    padding: '1rem',
    margin: 0,
    color: '#7dd3fc',
    fontFamily: "'Fira Code', 'Courier New', monospace",
    fontSize: '0.95rem',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.5'
  },
  evaluationBox: {
    marginTop: '1.5rem',
    backgroundColor: '#0f172a',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #334155'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  optionRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  label: {
    fontWeight: '600',
    color: '#cbd5e1',
    minWidth: '220px'
  },
  selectInput: {
    flex: 1,
    padding: '0.6rem 1rem',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: '#1e293b',
    color: '#fff',
    fontSize: '0.95rem'
  },
  textInput: {
    flex: 1,
    padding: '0.6rem 1rem',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: '#1e293b',
    color: '#fff',
    fontSize: '0.95rem'
  },
  fullInput: {
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: '#1e293b',
    color: '#fff',
    fontSize: '0.95rem',
    marginTop: '0.5rem'
  },
  textareaInput: {
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '6px',
    border: '1px solid #475569',
    backgroundColor: '#1e293b',
    color: '#7dd3fc',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.95rem'
  },
  minimalBox: {
    backgroundColor: '#1e293b',
    padding: '1rem',
    borderRadius: '6px',
    border: '1px dashed #64748b',
    color: '#f8fafc'
  },
  inlineCode: {
    backgroundColor: '#334155',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    color: '#38bdf8'
  },
  submitBtn: {
    backgroundColor: '#0284c7',
    color: '#fff',
    padding: '0.8rem 1.8rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s',
    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
  },
  successAlert: {
    marginTop: '1.5rem',
    backgroundColor: '#065f46',
    border: '1px solid #059669',
    padding: '1.2rem',
    borderRadius: '8px',
    color: '#ecfdf5'
  },
  errorAlert: {
    marginTop: '1.5rem',
    backgroundColor: '#7f1d1d',
    border: '1px solid #b91c1c',
    padding: '1.2rem',
    borderRadius: '8px',
    color: '#fef2f2'
  },
  explanationsBlock: {
    marginTop: '1rem',
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: '0.8rem',
    borderRadius: '6px',
    borderLeft: '3px solid #ef4444'
  },
  levelUpOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    animation: 'fadeIn 0.3s ease-in-out'
  },
  levelUpCard: {
    backgroundColor: '#1e293b',
    border: '2px solid #38bdf8',
    padding: '2.5rem',
    borderRadius: '16px',
    textAlign: 'center',
    boxShadow: '0 0 50px rgba(56, 189, 248, 0.5)',
    animation: 'scaleUp 0.3s ease-in-out'
  }
};
