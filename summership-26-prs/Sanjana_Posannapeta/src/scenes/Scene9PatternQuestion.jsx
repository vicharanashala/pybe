import React, { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import StandingCharacter from '../components/StandingCharacter';
import audiImg from '../../assets/audi.png';

export default function Scene9PatternQuestion({ onNext }) {
  const [step, setStep] = useState(0);

  const conversation = [
    {
      speaker: "Priya",
      text: "You know, Kabir, this whole setup is exactly how Python handles variables! It uses these exact same sight lines.",
      accent: "teal"
    },
    {
      speaker: "Kabir",
      text: "Wait, really? How does programming connect to our campus corridors?",
      accent: "indigo"
    },
    {
      speaker: "Priya",
      text: "Think of the outermost part of our code as the Main Hall. If we write 'timeline = \"Coding Sprint\"' out here, it's like putting it on your public projector screen. Every function inside the code can look outward and see it!",
      accent: "teal"
    },
    {
      speaker: "Kabir",
      text: "Oh! So since 'timeline' is in the public square, any function we run can access it, just like you looking out your lab window? That's what we call Global Scope!",
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
    <div className="storyboard-bg-layout" style={{ backgroundImage: `url(${audiImg})`, position: 'relative' }}>
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
          <span className="storyboard-chapter-tag">Scene 09 / 11</span>
          <h1 className="storyboard-title-text" style={{ fontSize: '1.6rem' }}>Concept: Global Scope</h1>
          <span className="storyboard-location-tag">🌐 Coding Analogy: The Public Square</span>
        </div>

        <div className="storyboard-narrative-body" style={{ minHeight: '120px', color: '#fff', fontSize: '0.88rem', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {step < 2 ? (
            <p>Priya explains that Python variables behave exactly like physical spaces and sight lines at the festival.</p>
          ) : (
            <>
              <p>Variables declared in the outermost file area exist in the <strong>Global Scope</strong>, similar to the public Main Hall projector.</p>
              <div className="highlight-panel-v2" style={{ padding: '0.5rem 0.75rem', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <pre style={{ margin: 0, color: '#a5b4fc', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {"# Global variable (visible everywhere)\n"}
                  {"timeline = \"Coding Sprint\""}
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
              continueLabel={step < conversation.length - 1 ? "Next" : "Continue"}
              accent={current.accent}
              largeText={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
