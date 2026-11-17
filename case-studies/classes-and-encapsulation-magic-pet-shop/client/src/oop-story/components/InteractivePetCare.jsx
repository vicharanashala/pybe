import React, { useState } from 'react';
import { SoundService } from '../services/soundEffects';
import '../styles/petCareUI.css';

export default function InteractivePetCare({
  buddyState = {},
  onUpdateBuddyState,
  onTriggerPropAnimation
}) {
  const [lastActionLog, setLastActionLog] = useState("Click a caring method below to watch Buddy act it out!");
  const [capsuleNotice, setCapsuleNotice] = useState(null);

  const handleFeed = () => {
    SoundService.playCrunch();
    if (onTriggerPropAnimation) {
      onTriggerPropAnimation({
        type: 'feed',
        icon: '🍎',
        startX: 15,
        startY: 30,
        targetX: 42,
        targetY: 55
      });
    }

    setLastActionLog("Executed: buddy.heal(15) 🍎 -> Buddy ate a yummy crispy apple!");
    setCapsuleNotice("Capsule verified: amount > 0 and safely updated health! 🛡️");
  };

  const handlePlayFetch = () => {
    SoundService.playBark();
    if (onTriggerPropAnimation) {
      onTriggerPropAnimation({
        type: 'play',
        icon: '🎾',
        startX: 75,
        startY: 60,
        targetX: 25,
        targetY: 65
      });
    }

    setLastActionLog("Executed: buddy.play() 🎾 -> Buddy ran after the tennis ball!");
    setCapsuleNotice("Capsule says: Buddy had a wonderful time playing fetch! ⭐");
  };

  const handleHeal = () => {
    SoundService.playChime();
    if (onTriggerPropAnimation) {
      onTriggerPropAnimation({
        type: 'heal',
        icon: '💚',
        startX: 42,
        startY: 15,
        targetX: 42,
        targetY: 50
      });
    }

    setLastActionLog("Executed: buddy.heal(30) 💚 -> Rest and magic herbs restored Buddy's vitality!");
    setCapsuleNotice("Capsule says: Healing method verified safe bounds (max 100)! 🛡️");
  };

  const handleCheckHealth = () => {
    SoundService.playPop();
    const currentHealth = buddyState.health !== undefined ? buddyState.health : 100;
    setLastActionLog(`Executed: buddy.get_health() 🔍 -> Returns ${currentHealth}`);
    setCapsuleNotice(`Getter safely peeked at self.__health: ${currentHealth} ❤️ without exposing data!`);
  };

  const handleTryOverfeed = () => {
    SoundService.playBoing();
    if (onTriggerPropAnimation) {
      onTriggerPropAnimation({
        type: 'overfeed',
        icon: '🍬',
        startX: 75,
        startY: 40,
        targetX: 30,
        targetY: 50
      });
    }

    setLastActionLog("Attempted: buddy.feed(9999) 🍬 -> Blocked by validation check!");
    setCapsuleNotice("BOING! 🔒 Capsule jumped in to block overfeeding! Validation kept Buddy safe!");
  };

  return (
    <div className="pet-care-station">
      <div className="pet-care-title">
        🐾 Buddy's Interactive Method Care Station
      </div>

      <div className="pet-care-actions-grid">
        <button className="btn-care-action" onClick={handleFeed}>
          <span className="care-icon">🍎</span>
          <span className="care-label">Feed Apple</span>
          <span className="care-effect">heal(+15 Health)</span>
        </button>

        <button className="btn-care-action" onClick={handlePlayFetch}>
          <span className="care-icon">🎾</span>
          <span className="care-label">Play Fetch</span>
          <span className="care-effect">play(+25 Happy)</span>
        </button>

        <button className="btn-care-action" onClick={handleHeal}>
          <span className="care-icon">💚</span>
          <span className="care-label">Magic Heal</span>
          <span className="care-effect">heal(+30 Health)</span>
        </button>

        <button
          className="btn-care-action"
          onClick={handleCheckHealth}
          style={{ borderColor: '#3B82F6', background: '#EFF6FF' }}
        >
          <span className="care-icon">👀</span>
          <span className="care-label">Check Health</span>
          <span className="care-effect" style={{ color: '#1D4ED8', background: '#DBEAFE' }}>
            get_health()
          </span>
        </button>

        <button
          className="btn-care-action"
          onClick={handleTryOverfeed}
          style={{ borderColor: '#F59E0B', background: '#FFFBEB' }}
        >
          <span className="care-icon">🍬</span>
          <span className="care-label">100 Candies</span>
          <span className="care-effect" style={{ color: '#D97706', background: '#FEF3C7' }}>
            Test Safety Rule
          </span>
        </button>
      </div>

      <div style={{ marginTop: '14px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.95rem', color: '#0369A1', fontWeight: 600 }}>
          {lastActionLog}
        </div>
        {capsuleNotice && (
          <div style={{ marginTop: '6px', fontFamily: 'Fredoka', fontSize: '1rem', color: '#D97706', fontWeight: 700 }}>
            {capsuleNotice}
          </div>
        )}
      </div>
    </div>
  );
}
