import React, { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import StandingCharacter from '../components/StandingCharacter';
import viewImg from '../../assets/view.png';

export default function Scene4PriyaNeedsBigPicture({ onNext }) {
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const conversation = [
    {
      speaker: "Sprint Participant",
      text: "Hey Priya, do you know what event is happening next on the main stage? Our lab timer is ticking, but we need to plan our break.",
      accent: "indigo"
    },
    {
      speaker: "Priya",
      text: "Yes! The large projector screen in the Main Hall clearly shows that the Lunch Break begins at 12:00 PM right after our sprint.",
      accent: "teal"
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
    <div className="storyboard-bg-layout" style={{ backgroundImage: `url(${viewImg})`, position: 'relative' }}>
      <div className="storyboard-bg-overlay"></div>

      {/* Standing Speaker */}
      <StandingCharacter character={current.speaker} style={{ left: '20px', bottom: '0px' }} />

      <div className="storyboard-quiz-container" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '650px',
        padding: '1.5rem',
        marginLeft: '220px',
        marginRight: 'auto'
      }}>
        <div className="storyboard-header-section" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span className="storyboard-chapter-tag">Scene 04 / 11</span>
          <h1 className="storyboard-title-text" style={{ fontSize: '1.6rem' }}>Priya's Window View</h1>
          <span className="storyboard-location-tag">🔍 Checking the Timeline</span>
        </div>

        <div className="storyboard-narrative-body" style={{ minHeight: '80px', color: '#fff', fontSize: '0.88rem', lineHeight: 1.5 }}>
          {dialogueIndex === 0 ? (
            <p>A participant walks up to Priya's desk with a question about the general fest schedule.</p>
          ) : (
            <p>Priya doesn't have the overall timeline on her desk, but she looks out of the window at the public square projector screen.</p>
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
