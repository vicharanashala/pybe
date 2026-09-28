import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, Printer, RotateCcw, CheckCircle2 } from 'lucide-react';
import { SoundService } from '../services/soundEffects';
import '../styles/petCareUI.css';

export default function GraduationCeremony({ onRestartStory }) {
  const [studentName, setStudentName] = useState('Super Coder');

  // Trigger celebration confetti & fanfare
  useEffect(() => {
    SoundService.playFanfare();
    setTimeout(() => SoundService.playBark(), 800);

    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="graduation-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
        <Sparkles size={28} color="#D97706" />
        <h2 style={{ fontFamily: 'Fredoka', fontSize: '2rem', color: '#B45309', margin: 0 }}>
          🎉 Congratulations, Pet Hero! 🎉
        </h2>
        <Sparkles size={28} color="#D97706" />
      </div>

      <p style={{ fontFamily: 'Nunito', fontSize: '1.2rem', color: '#78350F', margin: '0 0 16px' }}>
        You learned why we organize data into objects and how to protect them with safe methods!
      </p>

      {/* 3 Core Philosophical Takeaways */}
      <div style={{
        background: '#FEF3C7',
        border: '2px solid #F59E0B',
        borderRadius: '18px',
        padding: '16px 20px',
        marginBottom: '20px',
        textAlign: 'left'
      }}>
        <div style={{ fontFamily: 'Fredoka', fontSize: '1.1rem', color: '#B45309', fontWeight: 700, marginBottom: '8px' }}>
          🔒 What You Discovered Today:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'Nunito', fontSize: '1rem', color: '#451A03' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#D97706" />
            <span><strong>Related information stays together:</strong> Buddy's name, health, and happiness belong in one Pet entity.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#D97706" />
            <span><strong>The object controls its own changes:</strong> Outside code can't set health to -500; methods validate all updates.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#D97706" />
            <span><strong>Python gives us the tools:</strong> Classes, methods, and double underscore (<code>__</code>) represent this idea in code.</span>
          </div>
        </div>
      </div>

      {/* Official Certificate Card */}
      <div className="certificate-frame">
        <div className="cert-title">🐾 Official Magic Pet Shop Certificate 🐾</div>
        <div className="cert-subtitle">This certificate is proudly awarded to:</div>

        <input
          type="text"
          className="cert-name-input"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Type Your Name Here"
        />

        <p style={{ fontFamily: 'Nunito', fontSize: '1.15rem', color: '#334155', maxWidth: '600px', margin: '0 auto 16px' }}>
          For mastering <strong>Python OOP Encapsulation</strong>, protecting private variables with <code>__</code>,
          and keeping magical pets healthy and happy!
        </p>

        <div className="cert-badge-row">
          <div className="cert-badge">
            <span style={{ fontSize: '2rem' }}>🔒</span>
            <span>Master of Encapsulation</span>
          </div>
          <div className="cert-badge">
            <span style={{ fontSize: '2rem' }}>🐶</span>
            <span>Buddy's Best Friend</span>
          </div>
          <div className="cert-badge">
            <span style={{ fontSize: '2rem' }}>✨</span>
            <span>Certified Python Hero</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '18px' }}>
        <button className="btn-bouncy btn-next" onClick={handlePrint}>
          <Printer size={18} /> Print / Save Certificate
        </button>
        <button className="btn-bouncy btn-replay" onClick={onRestartStory}>
          <RotateCcw size={18} /> Play Story Again
        </button>
      </div>
    </div>
  );
}
