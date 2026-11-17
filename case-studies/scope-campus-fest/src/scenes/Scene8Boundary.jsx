import React, { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import StandingCharacter from '../components/StandingCharacter';
import viewImg from '../../assets/view.png';

export default function Scene8Boundary({ onNext }) {
  const [step, setStep] = useState(0);

  const conversation = [
    {
      speaker: "Kabir",
      text: "But man, it's the exact opposite for me! When I'm standing out here in the Main Hall, I have no clue what's happening inside the lab. I literally have to walk all the way inside to see anything.",
      accent: "indigo"
    },
    {
      speaker: "Priya",
      text: "Haha, that’s actually the idea! The walls keep things inside the room focused, so we don’t get distracted by what’s happening outside, and people outside don’t get mixed up with what’s going on here.",
      accent: "teal"
    },
    {
      speaker: "Kabir",
      text: "A solid boundary. What's inside stays private to the lab, and what's outside is public for everyone. That makes so much sense!",
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
          <span className="storyboard-chapter-tag">Scene 08 / 11</span>
          <h1 className="storyboard-title-text" style={{ fontSize: '1.6rem' }}>The Boundary Block</h1>
          <span className="storyboard-location-tag">🧱 Understanding Boundaries</span>
        </div>

        <div className="storyboard-narrative-body" style={{ minHeight: '80px', color: '#fff', fontSize: '0.88rem', lineHeight: 1.5 }}>
          {step === 0 && (
            <p>Kabir points out the asymmetry of information: he cannot see what's inside Lab 101 from the outside.</p>
          )}
          {step === 1 && (
            <p>Priya explains that this isolation is intentional—it keeps local details hidden and safe inside the room.</p>
          )}
          {step === 2 && (
            <p>They conclude that walls act as boundaries protecting local room details, creating a secure hierarchy of visibility.</p>
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
