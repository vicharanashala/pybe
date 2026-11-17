import React, { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import StandingCharacter from '../components/StandingCharacter';
import viewImg from '../../assets/view.png';

export default function Scene12FinalChallenge({ onRestart }) {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const challenges = [
    {
      id: 1,
      code: `timeline = "Lunch Break at 12:00 PM"
 
def coding_lab():
    print(timeline)
 
coding_lab()`,
      question: "Will Python find and print timeline?",
      choices: [
        { text: "Yes", correct: true, feedback: "Correct! Python searches the local scope of coding_lab(), doesn't find timeline, and looks outward to the global scope (timeline = 'Lunch Break...')." },
        { text: "No, this raises a NameError", correct: false, feedback: "Incorrect. Remember Priya looking through the window! Functions can look outward to read global variables." }
      ],
      prompt: "Can the function see outward to access the global variable 'timeline'?",
      thought: "Priya: 'This is similar to looking out the lab window. The print is inside, but the variable is outside in the Main Hall...'"
    },
    {
      id: 2,
      code: `def coding_lab():
    chalkboard_question = "Q4"
 
coding_lab()
print(chalkboard_question)`,
      question: "Will Python find and print chalkboard_question?",
      choices: [
        { text: "Yes", correct: false, feedback: "Incorrect. The variable 'chalkboard_question' is local to coding_lab(). The global print() outside cannot look inside to read it." },
        { text: "No, this raises a NameError", correct: true, feedback: "Correct! Since 'chalkboard_question' is defined inside coding_lab(), it is local. The global scope print() cannot look inward past the boundaries, causing a NameError." }
      ],
      prompt: "Can the global print statement look inside the function's boundary?",
      thought: "Kabir: 'This reminds me of trying to look inside Lab 101. The solid classroom wall blocks me from seeing their board...'"
    },
    {
      id: 3,
      code: `event = "Campus Tech Fest"
 
def coding_lab():
    event = "Coding Sprint"
    print(event)
 
coding_lab()`,
      question: "What will print when coding_lab() is executed?",
      choices: [
        { text: "Campus Tech Fest", correct: false, feedback: "Incorrect. Python starts searching in the local scope. Since a local 'event' exists, it stops looking and uses it immediately." },
        { text: "Coding Sprint", correct: true, feedback: "Correct! Python checks Local scope first. Finding event = 'Coding Sprint' inside the function, it stops searching without looking globally." }
      ],
      prompt: "If a variable exists locally AND globally, which one does Python resolve first?",
      thought: "Priya: 'Remember, Python searches from the inside out. The local variable inside the function takes priority over the global variable!'"
    }
  ];

  const activeChallenge = challenges[currentChallenge];
  const activeChoice = activeChallenge ? activeChallenge.choices.find(c => c.text === selectedAnswer) : null;

  function handleChoice(choice) {
    setSelectedAnswer(choice.text);
    setShowFeedback(true);
  }

  function handleNextChallenge() {
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (currentChallenge < challenges.length - 1) {
      setCurrentChallenge(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  }

  const hasSelectedCorrect = activeChoice && activeChoice.correct;

  // Dynamically set dialogue based on answer status
  let dialogueText = activeChallenge ? activeChallenge.thought : '';
  let speaker = activeChallenge ? activeChallenge.thought.split(':')[0] : 'Kabir';
  let accent = speaker === 'Priya' ? 'teal' : 'indigo';

  if (showFeedback) {
    speaker = "Priya";
    accent = "teal";
    dialogueText = activeChoice ? activeChoice.feedback : '';
  }

  if (isCompleted) {
    return (
      <div className="storyboard-bg-layout" style={{ backgroundImage: `url(${viewImg})`, position: 'relative' }}>
        <div className="storyboard-bg-overlay"></div>

        {/* Standing Priya */}
        <StandingCharacter character="Priya" style={{ left: '40px', bottom: '0px' }} />
        
        <div className="storyboard-quiz-container" style={{ 
          position: 'relative', 
          zIndex: 10, 
          maxWidth: '600px', 
          padding: '1.5rem',
          marginLeft: '220px',
          marginRight: 'auto'
        }}>
          <div className="storyboard-header-section" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span className="storyboard-chapter-tag">Scene 11 / 11</span>
            <h1 className="storyboard-title-text">Investigation Complete</h1>
            <span className="storyboard-location-tag">🎓 Scope Mastered</span>
          </div>

          {/* Recap Summary Table */}
          <div className="lab-board-screen" style={{ margin: '0.25rem 0' }}>
            <div className="lab-board-header" style={{ color: 'var(--brand-indigo)', fontSize: '0.8rem', padding: '0.35rem' }}>
              CAMPUS SCOPE SUMMARY
            </div>
            <div style={{ padding: '0.4rem' }}>
              <div className="lab-stat-row" style={{ padding: '0.2rem 0' }}>
                <span className="lab-stat-label" style={{ fontSize: '0.75rem' }}>🏛️ MAIN HALL</span>
                <span className="lab-stat-value" style={{ color: 'var(--brand-indigo)', fontSize: '0.75rem' }}>GLOBAL SCOPE</span>
              </div>
              <div className="lab-stat-row" style={{ padding: '0.2rem 0' }}>
                <span className="lab-stat-label" style={{ fontSize: '0.75rem' }}>💻 LAB 101</span>
                <span className="lab-stat-value" style={{ color: 'var(--brand-teal)', fontSize: '0.75rem' }}>LOCAL SCOPE</span>
              </div>
              <div className="lab-stat-row" style={{ padding: '0.2rem 0' }}>
                <span className="lab-stat-label" style={{ fontSize: '0.75rem' }}>🔍 LOOK OUTWARD</span>
                <span className="lab-stat-value" style={{ color: 'var(--brand-emerald)', fontSize: '0.75rem' }}>VARIABLE LOOKUP</span>
              </div>
              <div className="lab-stat-row" style={{ padding: '0.2rem 0' }}>
                <span className="lab-stat-label" style={{ fontSize: '0.75rem' }}>🛡️ CLASSROOM WALL</span>
                <span className="lab-stat-value" style={{ color: 'var(--brand-rose)', fontSize: '0.75rem' }}>SCOPE BOUNDARY</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 'auto', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <DialogueBox 
                speaker="System"
                text="Congratulations! You have completed the challenge. You've mastered how Python resolves variables by looking from the inside out."
                onContinue={onRestart}
                continueLabel="Restart"
                accent="indigo"
                largeText={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active challenge view
  return (
    <div className="storyboard-bg-layout" style={{ backgroundImage: `url(${viewImg})` }}>
      <div className="storyboard-bg-overlay"></div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem', alignItems: 'end' }}>
        
        {/* Left Column: Code Editor */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <div className="editor-window" style={{ height: '330px', display: 'flex', flexDirection: 'column', width: '100%', margin: 0 }}>
            <div className="editor-titlebar" style={{ padding: '0.35rem 0.6rem' }}>
              <div className="editor-dots">
                <div className="editor-dot red"></div>
                <div className="editor-dot yellow"></div>
                <div className="editor-dot green"></div>
              </div>
              <span className="editor-tab" style={{ fontSize: '0.75rem' }}>challenge_{currentChallenge + 1}.py</span>
              <span></span>
            </div>
            <div className="editor-content" style={{ fontSize: '0.85rem', padding: '0.75rem', overflowY: 'auto', flex: 1, fontFamily: 'monospace', lineHeight: 1.6 }}>
              <pre style={{ margin: 0, color: '#f8fafc', whiteSpace: 'pre-wrap' }}>
                {activeChallenge.code}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column: Quiz and Chatbot Dialogue */}
        <div className="storyboard-narrative-panel" style={{ minHeight: '380px', justifyContent: 'space-between', padding: '1.25rem', position: 'relative' }}>
          
          {/* Standing Character between columns */}
          {speaker && (speaker === 'Kabir' || speaker === 'Priya') && (
            <StandingCharacter 
              character={speaker} 
              style={{
                position: 'absolute',
                left: '-120px',
                bottom: '-20px',
                height: '240px',
                width: '160px',
                zIndex: 10
              }}
            />
          )}

          <div className="storyboard-header-section">
            <span className="storyboard-chapter-tag">Scene 11 / 11</span>
            <h1 className="storyboard-title-text" style={{ fontSize: '1.4rem' }}>Python Interpreter Challenge</h1>
            <span className="storyboard-location-tag">Challenge {currentChallenge + 1} of 3</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', textAlign: 'left', marginBottom: '0.25rem' }}>
              {activeChallenge.question}
            </div>

            <div className="choices-grid" style={{ gridTemplateColumns: '1fr', margin: 0, gap: '0.4rem' }}>
              {activeChallenge.choices.map(c => (
                <button
                  key={c.text}
                  onClick={() => handleChoice(c)}
                  className={`choice-card-v2 ${selectedAnswer === c.text ? (c.correct ? 'correct' : 'incorrect') : ''}`}
                  disabled={hasSelectedCorrect}
                  style={{ padding: '0.45rem 0.8rem', margin: 0 }}
                >
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'left' }}>{c.text}</span>
                </button>
              ))}
            </div>

            {hasSelectedCorrect && (
              <button
                className="ctrl-btn"
                onClick={handleNextChallenge}
                style={{ 
                  borderColor: 'var(--brand-indigo)',
                  fontSize: '0.75rem',
                  padding: '0.4rem 0.8rem',
                  marginTop: '0.5rem',
                  justifyContent: 'center'
                }}
              >
                {currentChallenge < challenges.length - 1 ? "Next Challenge" : "Finish Investigation"} ➔
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 'auto', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <DialogueBox 
                speaker={speaker}
                text={dialogueText}
                accent={accent}
                largeText={true}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
