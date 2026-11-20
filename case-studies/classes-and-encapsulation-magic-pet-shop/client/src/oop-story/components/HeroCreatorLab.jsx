import {createStoryTimersHook} from '../../../../../../shared/story-timers.mjs';
const useStoryTimers=createStoryTimersHook(React);
import React, { useState, useEffect } from 'react';

import { Sparkles, Award, Play, Printer, RotateCcw, CheckCircle2 } from 'lucide-react';
import { SoundService } from '../services/soundEffects';
import '../styles/heroAcademy.css';

export default function HeroCreatorLab({
  onSpawnCustomHero,
  onRestartAdventure
}) {
  const {setTimeout,clearTimeout,setInterval,clearInterval}=useStoryTimers();
  const [heroName, setHeroName] = useState('Cosmic Spark');
  const [superPower, setSuperPower] = useState('teleport()');
  const [heroColor, setHeroColor] = useState('#8B5CF6');
  const [heroEmoji, setHeroEmoji] = useState('⭐');

  const [created, setCreated] = useState(false);

  const handleCreateHero = () => {
    setCreated(true);
    SoundService.playPowerUp();
    setTimeout(() => SoundService.playSuccess(), 400);

    // Spawn on stage
    if (onSpawnCustomHero) {
      onSpawnCustomHero({
        name: heroName,
        power: superPower,
        color: heroColor,
        avatarEmoji: heroEmoji,
        visible: true,
        x: 50,
        y: 35
      });
    }

  };


  const generatedPythonCode = `# 🦸 Your Custom Superhero Class!
class Hero:
    def __init__(self, name):
        self.name = name
        self.health = 100

    def fight(self):
        print(f"{self.name} is fighting for justice!")

# ✨ Child Class Inherits from Hero
class CustomHero(Hero):
    def ${superPower.replace('()', '')}(self):
        print(f"✨ {self.name} uses ${superPower}!")

my_hero = CustomHero("${heroName}")
my_hero.fight()       # 🦸 Inherited from Hero
my_hero.${superPower} # ⭐ Your Unique Superpower!`;

  return (
    <div className="hero-creator-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <Sparkles size={28} color="#F59E0B" />
        <h2 style={{ fontFamily: 'Fredoka', fontSize: '1.8rem', color: '#FBBF24', margin: 0 }}>
          🦸 Final Challenge: Build Your Own Superhero!
        </h2>
        <Sparkles size={28} color="#F59E0B" />
      </div>

      <p style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '1.05rem', margin: '0 0 12px 0' }}>
        Create a child class that inherits from <code>Hero</code>, give it a name, and program a unique superpower!
      </p>

      {/* Creator Form Grid */}
      <div className="creator-inputs-grid">
        <div className="creator-input-group">
          <label className="creator-label">1. Superhero Name:</label>
          <input
            type="text"
            className="creator-text-input"
            value={heroName}
            onChange={(e) => setHeroName(e.target.value)}
            placeholder="e.g. Star-Girl, Thunder-Boy"
          />
        </div>

        <div className="creator-input-group">
          <label className="creator-label">2. Unique Superpower Method:</label>
          <input
            type="text"
            className="creator-text-input"
            value={superPower}
            onChange={(e) => setSuperPower(e.target.value)}
            placeholder="e.g. cast_starlight(), fly()"
          />
        </div>

        <div className="creator-input-group">
          <label className="creator-label">3. Hero Emblem & Emoji:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['⭐', '⚡', '🦅', '🌊', '❄️', '🚀'].map((em) => (
              <button
                key={em}
                className={`btn-hero-select ${heroEmoji === em ? 'selected' : ''}`}
                style={{ padding: '6px 12px', fontSize: '1.3rem' }}
                onClick={() => setHeroEmoji(em)}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div className="creator-input-group">
          <label className="creator-label">4. Hero Suit Color Theme:</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { label: 'Violet', col: '#8B5CF6' },
              { label: 'Cyan', col: '#0EA5E9' },
              { label: 'Emerald', col: '#10B981' },
              { label: 'Rose', col: '#F43F5E' },
              { label: 'Gold', col: '#F59E0B' }
            ].map((c) => (
              <button
                key={c.col}
                className="btn-hero-select"
                style={{
                  background: c.col,
                  width: '36px',
                  height: '36px',
                  borderRadius: '999px',
                  border: heroColor === c.col ? '3px solid #FFFFFF' : '2px solid transparent'
                }}
                onClick={() => setHeroColor(c.col)}
                title={c.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Generated Real Python Code */}
      <div style={{ background: '#090D16', border: '1.5px solid #334155', borderRadius: '14px', padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontFamily: 'Fredoka', color: '#38BDF8', fontWeight: 700, fontSize: '0.95rem' }}>
            🐍 Real Python Inheritance Code:
          </span>
          <button
            className="btn-bouncy btn-next"
            onClick={handleCreateHero}
            style={{ padding: '8px 18px', fontSize: '1rem' }}
          >
            <Play size={16} /> Run & Spawn Hero on Stage! 🌟
          </button>
        </div>
        <pre style={{ margin: 0, fontFamily: 'JetBrains Mono', fontSize: '0.9rem', color: '#FEF08A', overflowX: 'auto' }}>
          <code>{generatedPythonCode}</code>
        </pre>
      </div>

      {created&&<div className="hero-story-summary"><p>Your custom hero shares the Hero base class and adds a unique power. Try another hero to compare their behavior.</p><button className="btn-bouncy btn-replay" onClick={onRestartAdventure}>Replay Hero Academy</button></div>}
    </div>
  );
}
