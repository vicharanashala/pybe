import React, { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import StandingCharacter from '../components/StandingCharacter';
import labImg from '../../assets/lab.png';

export default function Scene10GrandReveal({ onNext }) {
  const [step, setStep] = useState(0);

  const conversation = [
    {
      speaker: "Kabir",
      text: "Ah! So variables created inside a function are like your chalkboard inside Lab 101, right?",
      accent: "indigo"
    },
    {
      speaker: "Priya",
      text: "Exactly! When you define a variable inside a function, Python builds a private wall around it. We call this the Local Scope.",
      accent: "teal"
    },
    {
      speaker: "Kabir",
      text: "So if you write 'def coding_lab():' and put 'chalkboard_question = \"Q4\"' inside, that variable is locked inside that function's walls?",
      accent: "indigo"
    },
    {
      speaker: "Priya",
      text: "Yes! A print statement out in the Main Hall would get a NameError if it tried to read it, because the outside public square can't see through classroom walls.",
      accent: "teal"
    },
    {
      speaker: "Kabir",
      text: "This makes so much sense! Python's scope boundaries are just like classroom walls protecting private details.",
      accent: "indigo"
    }
  ];

  const current = conversation[step];

  function handleContinue() {
    if (step < conversation.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onNext();
    }
  }

  const isPriya = current.speaker === 'Priya';
  const isKabir = current.speaker === 'Kabir';

  return (
    <div className="storyboard-bg-layout" style={{ backgroundImage: `url(${labImg})`, position: 'relative' }}>
      <div className="storyboard-bg-overlay"></div>

      {/* Standalone characters */}
      {isPriya && (
        <StandingCharacter character="Priya" style={{ left: '40px', bottom: '0px' }} />
      )}
      {isKabir && (
        <StandingCharacter character="Kabir" style={{ left: '40px', bottom: '0px' }} />
      )}

      <div className="storyboard-quiz-container" style={{ 
        position: 'relative', 
        zIndex: 10, 
        maxWidth: '650px', 
        padding: '1.5rem',
        marginLeft: '220px',
        marginRight: 'auto'
      }}>
        <div className="storyboard-header-section" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span className="storyboard-chapter-tag">Scene 10 / 11</span>
          <h1 className="storyboard-title-text">Concept: Local Scope</h1>
          <span className="storyboard-location-tag">🔒 Coding Analogy: The Isolated Room</span>
        </div>

        <div className="storyboard-narrative-body" style={{ minHeight: '120px', color: '#fff', fontSize: '0.88rem', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {step < 2 ? (
            <p>Kabir and Priya connect the classroom walls to Python's function isolation rules.</p>
          ) : (
            <>
              <p>Variables created inside functions belong to the <strong>Local Scope</strong>, protected from the outside world.</p>
              <div className="highlight-panel-v2" style={{ padding: '0.5rem 0.75rem', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <pre style={{ margin: 0, color: '#2dd4bf', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {"def coding_lab():\n"}
                  {"    # Local variable (invisible outside)\n"}
                  {"    chalkboard_question = \"Q4\""}
                </pre>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 'auto', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <DialogueBox 
              speaker={current.speaker}
              text={current.text}
              onContinue={handleContinue}
              continueLabel={step < conversation.length - 1 ? "Next" : "Start Quiz"}
              accent={current.accent}
              largeText={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
