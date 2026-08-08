import React, { useEffect, useRef } from 'react';

export default function WaveformVisualizer({ isListening, isSpeaking, color = '#6366f1' }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      if (!isListening && !isSpeaking) {
        // Idle subtle line
        ctx.beginPath();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        return;
      }

      phase += 0.08;
      const numBars = 32;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 2);
        const frequency = isSpeaking ? 0.2 : 0.35;
        const amplitude = isSpeaking ? 22 : 35;
        const barHeight = Math.abs(Math.sin(phase + i * frequency)) * amplitude + 6;

        const gradient = ctx.createLinearGradient(0, centerY - barHeight / 2, 0, centerY + barHeight / 2);
        gradient.addColorStop(0, isSpeaking ? '#ec4899' : '#6366f1');
        gradient.addColorStop(1, isSpeaking ? '#8b5cf6' : '#06b6d4');

        ctx.fillStyle = gradient;
        ctx.shadowColor = isSpeaking ? 'rgba(236,72,153,0.5)' : 'rgba(99,102,241,0.5)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 3);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isListening, isSpeaking, color]);

  return (
    <div className="waveform-container">
      <canvas ref={canvasRef} width={380} height={60} className="waveform-canvas" />
      <div className="waveform-status">
        {isListening && <span className="status-badge listening">🎙️ Listening... Speak now</span>}
        {isSpeaking && <span className="status-badge speaking">🔊 AI Tutor Speaking...</span>}
        {!isListening && !isSpeaking && <span className="status-badge idle">Ready • Tap mic to speak</span>}
      </div>
    </div>
  );
}
