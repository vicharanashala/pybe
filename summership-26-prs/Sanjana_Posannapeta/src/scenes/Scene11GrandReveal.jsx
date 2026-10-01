import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function Scene11GrandReveal({ onNext }) {
  const [revealStep, setRevealStep] = useState(0);

  useEffect(() => {
    if (revealStep < 3) {
      const timer = setTimeout(() => {
        setRevealStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [revealStep]);

  return (
    <div className="scene-container" style={{ background: '#02050b', justifyContent: 'center', alignItems: 'center' }}>
      {revealStep === 0 && (
        <div style={{ textAlign: 'center', animation: 'slideIn 0.8s ease' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-text-muted)', letterSpacing: '0.15em' }}>WAIT...</h1>
        </div>
      )}

      {revealStep === 1 && (
        <div style={{ textAlign: 'center', animation: 'slideIn 0.8s ease', maxWidth: '500px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--color-text-main)', lineHeight: 1.5 }}>
            You've been learning a core programming concept this entire time.
          </h2>
        </div>
      )}

      {revealStep >= 2 && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', animation: 'slideIn 0.8s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--neon-pink)', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.2em' }}>
            <Sparkles size={16} /> THE REVEAL
          </div>
          
          <h1 className="reveal-text-large">THIS IS SCOPE.</h1>
          
          <div className="scene-intro-card" style={{ maxWidth: '600px', background: 'rgba(236, 72, 153, 0.05)', borderColor: 'rgba(236,72,153,0.2)' }}>
            <p style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff' }}>
              "Scope is the region of a program where a variable can be accessed."
            </p>
          </div>

          <table className="reveal-table">
            <thead>
              <tr>
                <th>Campus Fest Metaphor</th>
                <th>Python Programming Term</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🏛️ Main Hall</td>
                <td>🌐 Global Scope</td>
              </tr>
              <tr>
                <td>💻 Lab 101</td>
                <td>🔒 Local Scope</td>
              </tr>
              <tr>
                <td>🚪 Lab Wall / Door</td>
                <td>🛡️ Scope Boundary</td>
              </tr>
              <tr>
                <td>🔍 Searching the Campus</td>
                <td>⚙️ Variable Lookup</td>
              </tr>
            </tbody>
          </table>

          <div style={{ marginTop: '1rem' }}>
            <button className="cta-btn-primary" onClick={onNext} style={{ background: 'linear-gradient(135deg, var(--neon-pink), var(--neon-purple))', boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)' }}>
              Meet the Lookup Rules (LEGB) →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
