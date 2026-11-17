import React from 'react';
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { SoundService } from '../services/soundEffects';
import '../styles/petCareUI.css';

export default function EpisodeNavigation({
  episodes = [],
  currentEpisodeId = 1,
  onSelectEpisode,
  onPrev,
  onNext,
  soundOn = true,
  onToggleSound,
  voiceOn = true,
  onToggleVoice
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', width: '100%' }}>
      {/* Stepper Dots */}
      <div className="scene-stepper-bar">
        <button
          className="icon-btn-round"
          onClick={onPrev}
          disabled={currentEpisodeId <= 1}
          style={{ padding: '6px 10px' }}
        >
          <ArrowLeft size={16} />
        </button>

        {episodes.map((ep) => {
          const isActive = ep.id === currentEpisodeId;
          const isCompleted = ep.id < currentEpisodeId;

          return (
            <button
              key={ep.id}
              className={`btn-step-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => {
                SoundService.playPop();
                onSelectEpisode(ep.id);
              }}
              title={ep.title}
            >
              {isCompleted ? '✓' : ep.id}
            </button>
          );
        })}

        <button
          className="icon-btn-round"
          onClick={onNext}
          disabled={currentEpisodeId >= episodes.length}
          style={{ padding: '6px 10px' }}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
