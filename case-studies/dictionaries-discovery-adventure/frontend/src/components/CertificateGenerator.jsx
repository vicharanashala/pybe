import React, { useRef, useState, useEffect } from 'react';
import { Download, Award, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSoundFX } from '../hooks/useSoundFX';

export const CertificateGenerator = () => {
  const { xp, unlockedBadges } = useGame();
  const { playClick } = useSoundFX();

  const canvasRef = useRef(null);
  const [userName, setUserName] = useState('Master Thief');

  const drawCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Background Dark Slate Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0A0A18');
    bgGrad.addColorStop(0.5, '#121228');
    bgGrad.addColorStop(1, '#080814');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Glowing Gold Border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#F2C94C';
    ctx.strokeRect(25, 25, width - 50, height - 50);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00F0FF';
    ctx.strokeRect(36, 36, width - 72, height - 72);

    // Header Stars
    ctx.fillStyle = '#F2C94C';
    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.fillText('★  ★  ★  THE ROYAL GUILD OF CODE HEISTS  ★  ★  ★', width / 2, 85);

    // Title
    ctx.fillStyle = '#00F0FF';
    ctx.font = 'bold 38px sans-serif';
    ctx.fillText('CERTIFICATE OF ACCOMPLISHMENT', width / 2, 140);

    // Subtitle
    ctx.fillStyle = '#A0A0B0';
    ctx.font = '20px sans-serif';
    ctx.fillText('This honor certifies that the clever adventurer known as', width / 2, 185);

    // Learner Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(userName || 'Master Thief', width / 2, 245);

    // Decorative underline under name
    ctx.strokeStyle = '#FF2E93';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, 260);
    ctx.lineTo(width / 2 + 200, 260);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#E0E0F0';
    ctx.font = '18px sans-serif';
    ctx.fillText('Has conquered the Wizard’s Magic Chest, mastered Python Hashmaps & Dictionaries,', width / 2, 305);
    ctx.fillText('outran the guard dog with O(1) Instant Speed, and disarmed the deadly KeyError trap!', width / 2, 335);

    // Stats Bar
    ctx.fillStyle = '#1A1A35';
    ctx.fillRect(80, 370, width - 160, 65);
    ctx.strokeStyle = '#F2C94C';
    ctx.lineWidth = 1;
    ctx.strokeRect(80, 370, width - 160, 65);

    ctx.fillStyle = '#F2C94C';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`✨ TOTAL HEIST XP: ${xp}   |   🏆 BADGES EARNED: ${unlockedBadges.length}/6`, width / 2, 410);

    // Signatures
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'italic bold 22px serif';
    ctx.fillText('Sly the Goblin', 220, 500);
    ctx.strokeStyle = '#A0A0B0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(120, 510);
    ctx.lineTo(320, 510);
    ctx.stroke();
    ctx.fillStyle = '#A0A0B0';
    ctx.font = '14px sans-serif';
    ctx.fillText('Chief Heist Strategist', 220, 530);

    // Honorary Seal
    ctx.fillStyle = '#FF2E93';
    ctx.beginPath();
    ctx.arc(width - 200, 495, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#F2C94C';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('OFFICIAL', width - 200, 490);
    ctx.fillText('SEAL', width - 200, 508);
  };

  useEffect(() => {
    drawCertificate();
  }, [userName, xp, unlockedBadges]);

  const handleDownload = () => {
    playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `Goblin_Heist_Certificate_${userName.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  return (
    <div className="certificate-card glass-card" style={{ padding: '30px', border: '1px solid var(--success)', margin: '20px 0', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
        <Award size={32} color="var(--accent)" />
        <h3 style={{ color: '#fff', fontSize: '1.5rem', margin: 0 }}>
          Claim Your Master Thief Certificate
        </h3>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
        Inscribe your name below and download your official achievement certificate!
      </p>

      {/* Name Input */}
      <div style={{ maxWidth: '420px', margin: '0 auto 24px auto' }}>
        <input 
          type="text"
          className="web3-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your hero / thief name..."
          style={{ textAlign: 'center', fontSize: '1.2rem', borderColor: 'var(--accent)' }}
        />
      </div>

      {/* Canvas Display */}
      <div style={{ maxWidth: '800px', margin: '0 auto 24px auto', overflowX: 'auto', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
        <canvas 
          ref={canvasRef} 
          width={880} 
          height={580} 
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* Download Button */}
      <button 
        className="web3-button"
        onClick={handleDownload}
        style={{
          padding: '16px 36px',
          fontSize: '1.1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'linear-gradient(135deg, var(--success), var(--secondary))',
          color: '#000'
        }}
      >
        <Download size={20} /> Download Certificate (PNG)
      </button>
    </div>
  );
};
