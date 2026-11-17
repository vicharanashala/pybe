import React from 'react';

export default function DialogueBox({ 
  speaker, 
  text, 
  onContinue, 
  continueLabel = "Continue", 
  disabled = false,
  accent = 'indigo',
  largeText = false
}) {
  const isSystem = speaker === 'System' || !speaker;
  
  return (
    <div className={`dialogue-box-panel accent-${accent}`}>
      {!isSystem && (
        <div className={`dialogue-speaker-tab bg-${accent}`}>
          <span className="speaker-name">{speaker}</span>
          <span className="speaker-role-badge">
            {speaker === 'Kabir' ? 'Main Hall Coordinator' : speaker === 'Priya' ? 'Lab 101 Coordinator' : 'Campus Fest'}
          </span>
        </div>
      )}
      
      <div className="dialogue-body-content">
        <p className="dialogue-text" style={largeText ? { fontSize: '1.05rem', lineHeight: '1.6' } : {}}>{text}</p>
        
        {onContinue && (
          <button 
            className={`dialogue-continue-btn btn-${accent}`}
            onClick={onContinue}
            disabled={disabled}
          >
            <span>{continueLabel}</span>
            <span className="continue-arrow">➔</span>
          </button>
        )}
      </div>
    </div>
  );
}
