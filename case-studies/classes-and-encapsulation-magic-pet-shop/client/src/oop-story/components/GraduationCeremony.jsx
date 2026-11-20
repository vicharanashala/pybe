import React, { useState, useEffect } from 'react';

import { Award, Sparkles, Printer, RotateCcw, CheckCircle2 } from 'lucide-react';
import { SoundService } from '../services/soundEffects';
import '../styles/petCareUI.css';

export default function GraduationCeremony({ onRestartStory }) {
  return (
    <div className="graduation-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
        <Sparkles size={28} color="#D97706" />
        <h2 style={{ fontFamily: 'Fredoka', fontSize: '2rem', color: '#B45309', margin: 0 }}>
          Our Pet Shop Story, Revisited
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

      <button className="btn-bouncy btn-replay" onClick={onRestartStory}>Play Story Again</button>
    </div>
  );
}
