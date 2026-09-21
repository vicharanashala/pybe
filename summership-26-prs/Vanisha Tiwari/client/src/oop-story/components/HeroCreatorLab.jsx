import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Award, Play, Printer, RotateCcw, CheckCircle2 } from 'lucide-react';
import { SoundService } from '../services/soundEffects';
import '../styles/heroAcademy.css';

export default function HeroCreatorLab({
  onSpawnCustomHero,
  onRestartAdventure
}) {
  const [heroName, setHeroName] = useState('Cosmic Spark');
  const [superPower, setSuperPower] = useState('teleport()');
  const [heroColor, setHeroColor] = useState('#8B5CF6');
  const [heroEmoji, setHeroEmoji] = useState('⭐');
  const [studentName, setStudentName] = useState('Super Coder');
  const [created, setCreated] = useState(false);

  // Trigger celebration confetti
  useEffect(() => {
    SoundService.playFanfare();

    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

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

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handlePrint = () => {
    window.print();
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

      {/* Hero Academy Graduation Certificate */}
      {created && (
        <div className="hero-diploma-frame" style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🏆</div>
          <h3 className="diploma-title">HERO ACADEMY GRADUATION DIPLOMA</h3>
          <p style={{ margin: '0 0 14px 0', fontSize: '1.1rem', fontWeight: 600 }}>
            This diploma certifies that:
          </p>

          <input
            type="text"
            className="creator-text-input"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            style={{
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: 700,
              background: '#FFFFFF',
              color: '#B45309',
              border: '2px solid #D97706',
              maxWidth: '380px',
              margin: '0 auto 16px'
            }}
          />

          <p style={{ fontSize: '1.15rem', maxWidth: '640px', margin: '0 auto 16px', lineHeight: 1.5 }}>
            Has successfully mastered <strong>Inheritance in Python OOP</strong>, reduced code duplication by creating
            the <code>Hero</code> base class, and programmed <strong>{heroName}</strong> with superpower <code>{superPower}</code>!
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-bouncy btn-next" onClick={handlePrint}>
              <Printer size={18} /> Print / Save Diploma
            </button>
            <button className="btn-bouncy btn-replay" onClick={onRestartAdventure}>
              <RotateCcw size={18} /> Replay Hero Academy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
