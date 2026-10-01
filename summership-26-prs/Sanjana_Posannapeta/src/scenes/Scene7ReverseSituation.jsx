import React, { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import StandingCharacter from '../components/StandingCharacter';
import viewImg from '../../assets/view.png';

export default function Scene7ReverseSituation({ onNext }) {
  const [step, setStep] = useState(0);

  const conversation = [
    {
      speaker: "Priya",
      text: "Hey Kabir! I realized that from my desk  I can easily peek out the window and read your huge projector screen in the Main Hall. It's so handy when I need to check the next event!",
      accent: "teal"
    },
    {
      speaker: "Kabir",
      text: "Well, it's out in the open courtyard, so anyone can see it from pretty much anywhere even through the lab windows.",
      accent: "indigo"
    },
    {
      speaker: "Priya",
      text: "True, but only one way! I can see your screen outside, but you can't read what's on our lab board from out there.",
      accent: "teal"
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
    <div className="storyboard-bg-layout" style={{ backgroundImage: `url(${viewImg})`, position: 'relative' }}>
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
          <span className="storyboard-chapter-tag">Scene 07 / 11</span>
          <h1 className="storyboard-title-text" style={{ fontSize: '1.6rem' }}>The Looking Outward Rule</h1>
          <span className="storyboard-location-tag">💻 Discussing Sight Lines</span>
        </div>

        <div className="storyboard-narrative-body" style={{ minHeight: '80px', color: '#fff', fontSize: '0.88rem', lineHeight: 1.5 }}>
          {step === 0 && (
            <p>Priya and Kabir meet in the corridor during a brief recess to compare notes on the event.</p>
          )}
          {step === 1 && (
            <p>Kabir realizes that Priya's nested position inside the lab doesn't prevent her from accessing public information outside.</p>
          )}
          {step === 2 && (
            <p>They both notice a core pattern: looking from the inside to the outside is always open and works automatically.</p>
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
