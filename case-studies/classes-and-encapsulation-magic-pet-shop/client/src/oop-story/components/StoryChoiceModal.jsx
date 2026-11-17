import React, { useState } from 'react';
import { Sparkles, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { SoundService } from '../services/soundEffects';
import '../styles/petCareUI.css';

export default function StoryChoiceModal({
  mcq,
  onSolved
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!mcq) return null;

  const handleSelect = (option) => {
    setSelectedOption(option.id);
    if (option.correct) {
      setIsCorrect(true);
      setFeedback(option.feedback);
      SoundService.playSuccess();
      setTimeout(() => SoundService.playBark(), 300);
      if (onSolved) onSolved();
    } else {
      setIsCorrect(false);
      setFeedback(option.feedback);
      SoundService.playSadWobble();
    }
  };

  return (
    <div className="story-choice-container">
      <div className="story-choice-q">
        <HelpCircle size={22} color="#D97706" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
        {mcq.question}
      </div>

      <div className="story-choice-options">
        {mcq.options.map((option) => {
          let btnClass = 'btn-story-option';
          if (selectedOption === option.id) {
            btnClass += option.correct ? ' correct' : ' incorrect';
          }

          return (
            <button
              key={option.id}
              className={btnClass}
              onClick={() => handleSelect(option)}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`choice-feedback-banner ${isCorrect ? 'success' : 'try-again'}`}>
          {isCorrect ? (
            <>
              <CheckCircle2 size={20} color="#15803D" />
              <span>{feedback}</span>
            </>
          ) : (
            <>
              <XCircle size={20} color="#B45309" />
              <span>{feedback} (Try another option!)</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
