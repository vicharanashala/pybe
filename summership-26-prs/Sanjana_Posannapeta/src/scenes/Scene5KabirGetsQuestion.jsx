import React, { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import StandingCharacter from '../components/StandingCharacter';
import audiImg from '../../assets/audi.png';

export default function Scene5KabirGetsQuestion({ onNext }) {
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const conversation = [
    {
      speaker: "Faculty Coordinator",
      text: "Hey Kabir, do you know how many students are currently coding inside Lab 101? We need the exact number to print the participation certificates.",
      accent: "indigo"
    },
    {
      speaker: "Kabir",
      text: "I actually don't know. I have to go to the lab to check it out.",
      accent: "indigo"
    }
  ];

  const current = conversation[dialogueIndex];

  function handleContinue() {
    if (dialogueIndex < conversation.length - 1) {
      setDialogueIndex(prev => prev + 1);
    } else {
      onNext();
    }
  }

  return (
    <div className="storyboard-bg-layout" style={{ backgroundImage: `url(${audiImg})`, position: 'relative' }}>
      <div className="storyboard-bg-overlay"></div>

      {/* Standing Speaker */}
      <StandingCharacter character={current.speaker} style={{ left: '40px', bottom: '0px' }} />

      <div className="storyboard-quiz-container" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '650px',
        padding: '1.5rem',
        marginLeft: '220px',
        marginRight: 'auto'
      }}>
        <div className="storyboard-header-section" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span className="storyboard-chapter-tag">Scene 05 / 11</span>
          <h1 className="storyboard-title-text" style={{ fontSize: '1.6rem' }}>Kabir's Inquiry</h1>
          <span className="storyboard-location-tag">🧱 Blocked Visibility</span>
        </div>

        <div className="storyboard-narrative-body" style={{ minHeight: '80px', color: '#fff', fontSize: '0.88rem', lineHeight: 1.5 }}>
          {dialogueIndex === 0 ? (
            <p>A coordinator walks up to Kabir's registration counter looking for active lab statistics.</p>
          ) : (
            <p>Kabir looks around the Main Hall, realizing that local classroom boards are completely invisible to the public square.</p>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 'auto', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <DialogueBox
              speaker={current.speaker}
              text={current.text}
              onContinue={handleContinue}
              continueLabel={dialogueIndex < conversation.length - 1 ? "Next" : "Continue"}
              accent={current.accent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
