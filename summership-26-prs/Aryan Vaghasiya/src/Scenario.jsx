import React, { useState } from 'react';

function Scenario({ data, onFinish }) {
  const [history, setHistory] = useState(['start']);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const currentStepId = history[currentIndex];
  const step = data.steps[currentStepId];

  if (!step) {
    return <div>Error: Step not found.</div>;
  }

  const handleOptionClick = (option) => {
    if (option.feedback) {
      setFeedbackMsg(option.feedback);
    } else {
      setFeedbackMsg(null);
    }

    if (option.next === 'end') {
      onFinish();
    } else if (option.next !== currentStepId) {
      // If we are answering a question from a previous point in history,
      // we discard the future and branch off.
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(option.next);
      setHistory(newHistory);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFeedbackMsg(null);
    }
  };

  const handleNext = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFeedbackMsg(null);
    }
  };

  return (
    <div className="card fade-in" key={currentStepId + currentIndex}>
      <div className="scenario-nav">
        <button 
          className="nav-btn" 
          onClick={handleBack} 
          disabled={currentIndex === 0}
        >
          ← Back
        </button>
        
        <button className="nav-btn home-btn" onClick={onFinish}>
          ⌂ Home
        </button>

        <button 
          className="nav-btn" 
          onClick={handleNext} 
          disabled={currentIndex === history.length - 1}
        >
          Next →
        </button>
      </div>

      <h2 className="scenario-title">{data.title}</h2>
      
      {step.image && (
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <img 
            src={step.image} 
            alt="Scenario visualization" 
            style={{ maxWidth: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
          />
        </div>
      )}

      <div className="story-text">
        {step.text}
      </div>

      {step.snippet && (
        <div className="python-snippet">
          {step.snippet}
        </div>
      )}

      {step.teaser && (
        <div className="teaser-text">
          {step.teaser}
        </div>
      )}

      <div className="options-container">
        {step.options.map((opt, idx) => (
          <button 
            key={idx} 
            className="option-btn"
            onClick={() => handleOptionClick(opt)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {feedbackMsg && (
        <div className="feedback-box">
          {feedbackMsg}
        </div>
      )}
    </div>
  );
}

export default Scenario;
