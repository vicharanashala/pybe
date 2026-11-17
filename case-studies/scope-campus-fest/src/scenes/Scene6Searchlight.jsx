import React, { useState } from 'react';
import DialogueBox from '../components/DialogueBox';
import StandingCharacter from '../components/StandingCharacter';
import viewImg from '../../assets/view.png';

export default function Scene6Searchlight({ onNext }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const choices = [
    { id: 'A', text: "Look around my reception desk in the Main Hall", correct: false, feedback: "My outer counter only has registrations and public schedules. It doesn't track Lab 101's internal stats." },
    { id: 'B', text: "Walk to Lab 101 and check out ", correct: true, feedback: "Yes! Since the room walls block my sight from the outside, going inside the classroom is the only way to see the local chalkboard." },
    { id: 'C', text: "Check the Main Hall projector timeline screen", correct: false, feedback: "The public timeline screen only shows general event times, not live room participants or remaining sprint time." }
  ];

  function handleSelect(choice) {
    setSelectedOption(choice.id);
    setShowResult(true);
  }

  const isCorrectSelected = selectedOption === 'B';

  let dialogueText = "Wait, the coordinator wants to know the lab stats... How should I find out the active student count inside Lab 101?";
  if (selectedOption) {
    if (isCorrectSelected) {
      dialogueText = "Ah, of course! Walking over and entering Lab 101 is the only way. Since the classroom walls block my view, the chalkboard inside is where the local details are kept!";
    } else {
      const selectedChoice = choices.find(c => c.id === selectedOption);
      dialogueText = `Hmm, that doesn't feel right. ${selectedChoice.feedback}`;
    }
  }

  return (
    <div className="storyboard-bg-layout" style={{ backgroundImage: `url(${viewImg})`, position: 'relative' }}>
      <div className="storyboard-bg-overlay"></div>

      {/* Standing Kabir */}
      <StandingCharacter character="Kabir" style={{ left: '40px', bottom: '0px' }} />

      <div className="storyboard-quiz-container" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '650px',
        padding: '1.5rem',
        marginLeft: '220px',
        marginRight: 'auto'
      }}>
        <div className="storyboard-header-section" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span className="storyboard-chapter-tag">Scene 06 / 11</span>
          <h1 className="storyboard-title-text" style={{ fontSize: '1.6rem' }}>Kabir's Search Choice</h1>
          <span className="storyboard-location-tag">🔍 Accessing Information</span>
        </div>

        <div className="storyboard-narrative-body" style={{ textAlign: 'center', fontSize: '0.88rem', color: '#fff', marginBottom: '1rem' }}>
          <p>
            <strong>Scenario:</strong> Kabir needs to find out the active student count and remaining sprint time in Lab 101. What should he do?
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div className="choices-grid" style={{ gridTemplateColumns: '1fr', margin: 0, gap: '0.5rem' }}>
            {choices.map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c)}
                className={`choice-card-v2 ${selectedOption === c.id ? (c.correct ? 'correct' : 'incorrect') : ''}`}
                disabled={selectedOption === 'B'}
                style={{ padding: '0.6rem 1rem', margin: 0 }}
              >
                <div className="choice-bullet" style={{ width: '22px', height: '22px', fontSize: '0.8rem' }}>{c.id}</div>
                <span className="choice-text" style={{ fontSize: '0.85rem', color: '#fff' }}>{c.text}</span>
              </button>
            ))}
          </div>

          {showResult && (
            <div className={`highlight-panel-v2 ${isCorrectSelected ? 'success' : ''}`} style={{
              padding: '0.6rem 0.9rem',
              fontSize: '0.8rem',
              margin: 0,
              borderColor: isCorrectSelected ? 'rgba(52, 211, 153, 0.2)' : 'rgba(248, 113, 113, 0.2)',
              background: isCorrectSelected ? 'rgba(52, 211, 153, 0.05)' : 'rgba(248, 113, 113, 0.05)'
            }}>
              {isCorrectSelected ? (
                <p style={{ margin: 0 }}>
                  <strong>✓ Search Successful:</strong> Kabir walks over to Lab 101, enters the room, and directly reads the blackboard.
                </p>
              ) : (
                <p style={{ color: 'var(--brand-rose)', margin: 0 }}>
                  <strong>✕ Failed:</strong> {choices.find(c => c.id === selectedOption).feedback}
                </p>
              )}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 'auto', width: '100%' }}>
          <div style={{ flex: 1 }}>
            <DialogueBox
              speaker="Kabir"
              text={dialogueText}
              onContinue={isCorrectSelected ? onNext : null}
              continueLabel="Next"
              accent="indigo"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
