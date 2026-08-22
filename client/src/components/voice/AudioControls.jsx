import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, FastForward, MessageSquare } from 'lucide-react';

export default function AudioControls({
  textToSpeak,
  onPlay,
  onPause,
  isPlaying,
  speechRate,
  setSpeechRate,
  showTranscript,
  setShowTranscript
}) {
  const [muted, setMuted] = useState(false);

  return (
    <div className="audio-controls-panel">
      <div className="audio-primary-buttons">
        <button
          type="button"
          className="audio-btn main-play"
          onClick={() => (isPlaying ? onPause() : onPlay(textToSpeak))}
          title={isPlaying ? 'Pause Speech' : 'Play Spoken Explanation'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          <span>{isPlaying ? 'Pause' : 'Listen AI Voice'}</span>
        </button>

        <button
          type="button"
          className="audio-btn secondary"
          onClick={() => onPlay(textToSpeak)}
          title="Replay from start"
        >
          <RotateCcw size={16} />
          <span>Replay</span>
        </button>

        <button
          type="button"
          className={showTranscript ? 'audio-btn active' : 'audio-btn secondary'}
          onClick={() => setShowTranscript(!showTranscript)}
          title="Toggle Text Transcript"
        >
          <MessageSquare size={16} />
          <span>{showTranscript ? 'Hide Text' : 'Show Text'}</span>
        </button>
      </div>

      <div className="audio-settings-group">
        <label className="speed-selector">
          <FastForward size={14} />
          <span>Speed:</span>
          <select value={speechRate} onChange={(e) => setSpeechRate(parseFloat(e.target.value))}>
            <option value={0.75}>0.75x (Slower)</option>
            <option value={1.0}>1.0x (Normal)</option>
            <option value={1.25}>1.25x (Faster)</option>
            <option value={1.5}>1.5x (Fast)</option>
          </select>
        </label>
      </div>
    </div>
  );
}
