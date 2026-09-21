import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, ArrowRight } from 'lucide-react';
import { SoundService } from '../services/soundEffects';

export default function SpeechBubble({
  dialogueList = [],
  currentLineIndex = 0,
  onNextLine,
  onComplete,
  isLastLine
}) {
  const line = dialogueList[currentLineIndex] || { speaker: 'Luna', text: '', sfx: null };
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter effect & sound trigger
  useEffect(() => {
    if (!line || !line.text) return;

    // Trigger line sound effect
    if (line.sfx === 'bark') SoundService.playBark();
    else if (line.sfx === 'boing') SoundService.playBoing();
    else if (line.sfx === 'chime') SoundService.playChime();
    else if (line.sfx === 'sadWobble') SoundService.playSadWobble();
    else if (line.sfx === 'pop') SoundService.playPop();
    else if (line.sfx === 'success') SoundService.playSuccess();
    else if (line.sfx === 'fanfare') SoundService.playFanfare();
    else if (line.sfx === 'whoosh') SoundService.playWhoosh();
    else if (line.sfx === 'zap') SoundService.playZap();
    else if (line.sfx === 'flame') SoundService.playFlame();
    else if (line.sfx === 'shield') SoundService.playShieldClank();
    else if (line.sfx === 'powerUp') SoundService.playPowerUp();

    // Voice Narration
    SoundService.speakDialogue(line.text, line.speaker);

    // Fast, clean typewriter animation for smooth reading
    setIsTyping(true);
    setDisplayedText('');
    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx++;
      setDisplayedText(line.text.slice(0, charIdx));
      if (charIdx >= line.text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 18);

    return () => {
      clearInterval(interval);
      SoundService.stopSpeech();
    };
  }, [line]);

  const handleReplayVoice = () => {
    if (line) {
      SoundService.speakDialogue(line.text, line.speaker);
    }
  };

  const getSpeakerAvatar = (speaker) => {
    if (speaker === 'Professor Nova' || speaker === 'Nova') return '🧑🏫 Professor Nova';
    if (speaker === 'Zippy') return '⚡ Zippy';
    if (speaker === 'Ember') return '🔥 Ember';
    if (speaker === 'Shieldy') return '🛡️ Shieldy';
    if (speaker === 'Hero') return '🦸 Hero (Base)';
    if (speaker === 'Buddy') return '🐶 Buddy';
    if (speaker === 'Capsule') return '🔒 Capsule';
    return '👩🏫 Teacher Luna';
  };

  return (
    <div className="storybook-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="speaker-avatar-tag">
          {getSpeakerAvatar(line.speaker)}
        </div>

        <button
          className="icon-btn-round"
          onClick={handleReplayVoice}
          title="Replay Voice"
        >
          <Volume2 size={16} /> Replay
        </button>
      </div>

      <p className="dialogue-text">
        {displayedText}
        {isTyping && <span style={{ opacity: 0.6, animation: 'statBlink 0.5s infinite' }}> |</span>}
      </p>

      <div className="dialogue-controls">
        <div className="dialogue-progress-dots">
          {dialogueList.map((_, idx) => (
            <div
              key={idx}
              className={`dialogue-dot ${idx === currentLineIndex ? 'active' : ''}`}
            />
          ))}
        </div>

        <div>
          {!isLastLine ? (
            <button className="btn-bouncy btn-next" onClick={onNextLine}>
              Continue <ArrowRight size={18} />
            </button>
          ) : (
            <button className="btn-bouncy btn-next" onClick={onComplete}>
              Next Episode 🌟
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
