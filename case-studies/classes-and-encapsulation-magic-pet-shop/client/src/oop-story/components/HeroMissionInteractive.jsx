import React, { useState } from 'react';
import { Zap, Flame, Shield, Swords, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { SoundService } from '../services/soundEffects';
import '../styles/heroAcademy.css';

export default function HeroMissionInteractive({
  onTriggerHeroAction,
  onSolved
}) {
  const [selectedHero, setSelectedHero] = useState('zippy'); // 'zippy' | 'ember' | 'shieldy'
  const [actionLog, setActionLog] = useState(null);
  const [testedActions, setTestedActions] = useState({ zippy: false, ember: false, shieldy: false });

  const heroes = [
    {
      id: 'zippy',
      name: '⚡ Zippy',
      className: 'SpeedHero',
      specialMethod: 'run_fast()',
      specialLabel: '⚡ Super Speed Run',
      color: '#0EA5E9'
    },
    {
      id: 'ember',
      name: '🔥 Ember',
      className: 'FireHero',
      specialMethod: 'use_fire()',
      specialLabel: '🔥 Blazing Fire Blast',
      color: '#EA580C'
    },
    {
      id: 'shieldy',
      name: '🛡️ Shieldy',
      className: 'ShieldHero',
      specialMethod: 'block_attack()',
      specialLabel: '🛡️ Unbreakable Block',
      color: '#059669'
    }
  ];

  const currentHero = heroes.find(h => h.id === selectedHero) || heroes[0];

  const handleSelectHero = (heroId) => {
    setSelectedHero(heroId);
    SoundService.playPop();
    if (onTriggerHeroAction) {
      onTriggerHeroAction(heroId, 'idle');
    }
  };

  // Trigger Inherited Method: fight()
  const handleTriggerFight = () => {
    SoundService.playPowerUp();
    if (onTriggerHeroAction) {
      onTriggerHeroAction(selectedHero, 'fight');
    }
    setActionLog({
      type: 'inherited',
      title: `🦸 Inherited Action: ${selectedHero}.fight()`,
      desc: `Passed down from parent Hero class! Every hero gets fight() automatically without writing it again!`,
      code: `# Calling method from parent Hero:\n${selectedHero}.fight()  # Output: "${currentHero.name} is fighting for justice!"`
    });

    const updated = { ...testedActions, [selectedHero]: true };
    setTestedActions(updated);
    if (Object.values(updated).filter(Boolean).length >= 2 && onSolved) {
      onSolved();
    }
  };

  // Trigger Special Child Method
  const handleTriggerSpecial = () => {
    if (selectedHero === 'zippy') {
      SoundService.playWhoosh();
      setTimeout(() => SoundService.playZap(), 150);
      if (onTriggerHeroAction) onTriggerHeroAction('zippy', 'running');
    } else if (selectedHero === 'ember') {
      SoundService.playFlame();
      if (onTriggerHeroAction) onTriggerHeroAction('ember', 'fire-blast');
    } else if (selectedHero === 'shieldy') {
      SoundService.playShieldClank();
      if (onTriggerHeroAction) onTriggerHeroAction('shieldy', 'shield-block');
    }

    setActionLog({
      type: 'special',
      title: `⭐ Special Child Action: ${selectedHero}.${currentHero.specialMethod}`,
      desc: `Defined exclusively inside class ${currentHero.className}! Only ${currentHero.name} has this superpower!`,
      code: `# Calling unique child method:\n${selectedHero}.${currentHero.specialMethod}`
    });

    const updated = { ...testedActions, [selectedHero]: true };
    setTestedActions(updated);
    if (Object.values(updated).filter(Boolean).length >= 2 && onSolved) {
      onSolved();
    }
  };

  return (
    <div className="hero-mission-panel">
      <div className="mission-header">
        <h3 className="mission-title">
          <Sparkles size={22} color="#38BDF8" />
          Interactive Hero Mission: Test Inherited vs Special Powers!
        </h3>
        <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>
          Episode 9 Interactive Lab
        </span>
      </div>

      {/* 1. Hero Picker */}
      <div className="hero-selector-row">
        {heroes.map((hero) => (
          <button
            key={hero.id}
            className={`btn-hero-select ${selectedHero === hero.id ? 'selected' : ''}`}
            onClick={() => handleSelectHero(hero.id)}
          >
            <span>{hero.name}</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>({hero.className})</span>
          </button>
        ))}
      </div>

      {/* 2. Action Trigger Buttons */}
      <div className="hero-action-buttons-row">
        {/* Inherited Method Button */}
        <button
          className="btn-hero-action inherited"
          onClick={handleTriggerFight}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Swords size={20} color="#FBBF24" />
            <span className="action-type-tag">🦸 INHERITED METHOD</span>
          </div>
          <span className="action-code-label">def fight(self)</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Shared from Parent Hero</span>
        </button>

        {/* Unique Child Method Button */}
        <button
          className="btn-hero-action special"
          onClick={handleTriggerSpecial}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#A5B4FC" />
            <span className="action-type-tag">⭐ SPECIAL CHILD METHOD</span>
          </div>
          <span className="action-code-label">def {currentHero.specialMethod}</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Unique to {currentHero.name}</span>
        </button>
      </div>

      {/* 3. Action Insight Feedback Card */}
      {actionLog && (
        <div className={`choice-feedback-banner ${actionLog.type === 'inherited' ? 'success' : 'success'}`} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
            <CheckCircle2 size={20} color="#15803D" />
            <strong style={{ fontSize: '1.05rem', color: '#065F46' }}>{actionLog.title}</strong>
          </div>
          <p style={{ margin: '2px 0 6px 0', fontSize: '0.95rem', color: '#1E293B' }}>
            {actionLog.desc}
          </p>
          <pre style={{ margin: 0, padding: '8px 12px', background: '#0F172A', color: '#38BDF8', borderRadius: '8px', fontSize: '0.85rem', width: '100%', overflowX: 'auto' }}>
            <code>{actionLog.code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
