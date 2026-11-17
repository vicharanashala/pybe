import React, { useState } from 'react';
import { CheckCircle2, Wand2 } from 'lucide-react';
import { SoundService } from '../services/soundEffects';
import '../styles/petCareUI.css';

export default function GuidedCodeChallenge({
  challenge,
  onSolved
}) {
  const [task1Selection, setTask1Selection] = useState(null);
  const [task2Selection, setTask2Selection] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!challenge) return null;

  const handleSelectTask1 = (val) => {
    setTask1Selection(val);
    SoundService.playPop();
    checkCompletion(val, task2Selection);
  };

  const handleSelectTask2 = (val) => {
    setTask2Selection(val);
    SoundService.playPop();
    checkCompletion(task1Selection, val);
  };

  const checkCompletion = (t1, t2) => {
    if (t1 === challenge.task1.correct && t2 === challenge.task2.correct) {
      setIsCompleted(true);
      SoundService.playSuccess();
      setTimeout(() => SoundService.playBark(), 350);
      if (onSolved) onSolved();
    }
  };

  return (
    <div className="challenge-box">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Wand2 size={24} color="#3B82F6" />
        <span style={{ fontFamily: 'Fredoka', fontSize: '1.2rem', fontWeight: 700, color: '#1E293B' }}>
          {challenge.prompt}
        </span>
      </div>

      {/* Code Outline Context Display */}
      <div style={{
        background: '#0F172A',
        color: '#E2E8F0',
        padding: '12px 18px',
        borderRadius: '12px',
        fontFamily: 'JetBrains Mono',
        fontSize: '0.9rem',
        marginBottom: '16px',
        lineHeight: 1.6
      }}>
        <div><span style={{ color: '#F472B6' }}>class</span> <span style={{ color: '#60A5FA' }}>Pet</span>:</div>
        <div style={{ paddingLeft: '16px' }}>
          <span style={{ color: '#F472B6' }}>def</span> <span style={{ color: '#FBBF24' }}>__init__</span>(self, name):
        </div>
        <div style={{ paddingLeft: '32px' }}>
          self.name = name
        </div>
        <div style={{ paddingLeft: '32px', color: task1Selection ? '#4ADE80' : '#FDE047', fontWeight: 700 }}>
          {task1Selection ? `${task1Selection} = 100` : 'self.________ = 100  # Task 1'}
        </div>
        <div style={{ paddingLeft: '16px', marginTop: '6px' }}>
          <span style={{ color: '#F472B6' }}>def</span> <span style={{ color: '#FBBF24' }}>set_health</span>(self, health):
        </div>
        <div style={{ paddingLeft: '32px', color: task2Selection ? '#4ADE80' : '#FDE047', fontWeight: 700 }}>
          {task2Selection ? task2Selection : '____________________  # Task 2'}
        </div>
        <div style={{ paddingLeft: '48px' }}>
          self.__health = health
        </div>
      </div>

      {/* Task 1 */}
      <div className="challenge-step">
        <div className="challenge-step-title">{challenge.task1.label}</div>
        <div className="challenge-tiles">
          {challenge.task1.options.map((opt) => (
            <button
              key={opt}
              className={`btn-tile ${task1Selection === opt ? (opt === challenge.task1.correct ? 'correct' : 'selected') : ''}`}
              onClick={() => handleSelectTask1(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Task 2 */}
      <div className="challenge-step">
        <div className="challenge-step-title">{challenge.task2.label}</div>
        <div className="challenge-tiles">
          {challenge.task2.options.map((opt) => (
            <button
              key={opt}
              className={`btn-tile ${task2Selection === opt ? (opt === challenge.task2.correct ? 'correct' : 'selected') : ''}`}
              onClick={() => handleSelectTask2(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {isCompleted && (
        <div className="choice-feedback-banner success" style={{ marginTop: '16px' }}>
          <CheckCircle2 size={22} color="#15803D" />
          <span>✨ Fantastic! You just wrote real encapsulated Python code for Buddy!</span>
        </div>
      )}
    </div>
  );
}
