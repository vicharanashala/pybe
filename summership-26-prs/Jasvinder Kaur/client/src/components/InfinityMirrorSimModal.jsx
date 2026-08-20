import React, { useState, useEffect, useRef } from 'react';
import { Layers, Sliders, ShieldAlert, Sparkles, X, RefreshCw, Info, Activity } from 'lucide-react';

export default function InfinityMirrorSimModal({ onClose }) {
  const [depth, setDepth] = useState(5);
  const [hasBaseCase, setHasBaseCase] = useState(true);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Dynamic background gradient
    const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width * 0.8);
    bgGradient.addColorStop(0, '#13113B');
    bgGradient.addColorStop(0.6, '#080922');
    bgGradient.addColorStop(1, '#040512');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Vanishing Point Perspective Grid Lines
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
    ctx.lineWidth = 1;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
      ctx.beginPath();
      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(width / 2 + Math.cos(angle) * width, height / 2 + Math.sin(angle) * height);
      ctx.stroke();
    }

    const maxRenderDepth = hasBaseCase ? Math.min(depth, 15) : Math.min(depth, 25);

    let currentW = width * 0.82;
    let currentH = height * 0.86;
    let centerX = width / 2;
    let centerY = height / 2;

    for (let i = 0; i < maxRenderDepth; i++) {
      const scale = Math.pow(0.82, i);
      const w = currentW * scale;
      const h = currentH * scale;
      const x = centerX - w / 2;
      const y = centerY - h / 2;

      // Outer wooden/neon frame
      ctx.strokeStyle = i === 0 ? '#A78BFA' : i % 2 === 0 ? '#8B5CF6' : '#06B6D4';
      ctx.lineWidth = Math.max(1.5, 6 * scale);
      ctx.strokeRect(x, y, w, h);

      // Glass tint & inner glow
      ctx.fillStyle = `rgba(139, 92, 246, ${0.07 * scale})`;
      ctx.fillRect(x, y, w, h);

      // Character Silhouette
      ctx.fillStyle = `rgba(243, 244, 246, ${0.85 * scale})`;
      ctx.beginPath();
      // Head
      ctx.arc(centerX, y + h * 0.35, 14 * scale, 0, Math.PI * 2);
      ctx.fill();
      // Body
      ctx.fillRect(centerX - 10 * scale, y + h * 0.45, 20 * scale, 24 * scale);

      // Frame text label
      ctx.fillStyle = `rgba(196, 181, 253, ${0.85 * scale})`;
      ctx.font = `${Math.max(10, Math.round(13 * scale))}px 'Outfit', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`Reflection ${i + 1} (depth=${maxRenderDepth - i})`, centerX, y + h * 0.82);

      // Base Case Glowing Curtain
      if (hasBaseCase && i === maxRenderDepth - 1) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.40)';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = '#22D3EE';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 13px "Outfit", sans-serif';
        ctx.fillText('✨ BASE CASE CURTAIN', centerX, centerY);
      }
    }

    // Stack overflow warning check
    if (!hasBaseCase && depth >= 12) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }

  }, [depth, hasBaseCase]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-panel glass-card max-w-4xl border-cyan-500/40 p-6 md:p-8 flex flex-col gap-6"
        style={{ border: '1px solid rgba(6,182,212,0.35)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl flex-shrink-0" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.30)' }}>
              <Layers className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Infinity Mirror Physics Simulator</h3>
              <p className="text-xs text-cyan-300">Visualizing Recursion Depth, Call Stack Memory & Base Case Curtains</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Canvas Wrapper (Left 8 Cols) */}
          <div className={`md:col-span-8 sim-canvas-wrapper relative p-2 ${isOverflowing ? 'animate-bounce' : ''}`}>
            <canvas 
              ref={canvasRef} 
              width={560} 
              height={370} 
              className="w-full h-auto rounded-xl"
            />

            {/* Overflow Overlay */}
            {isOverflowing && (
              <div className="absolute inset-0 bg-red-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
                <ShieldAlert className="w-14 h-14 text-red-400 mb-3 animate-bounce" />
                <h4 className="font-extrabold text-2xl text-red-100 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  STACK OVERFLOW DETECTED!
                </h4>
                <p className="text-xs md:text-sm text-red-200 mt-2 max-w-md leading-relaxed font-medium">
                  Recursion went too deep without a Base Case Curtain! Python terminated execution to protect system memory (RecursionError).
                </p>
                <button 
                  onClick={() => { setHasBaseCase(true); setDepth(5); }}
                  className="mt-5 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Lower Base Case Curtain & Reset</span>
                </button>
              </div>
            )}
          </div>

          {/* Controls & Explanation (Right 4 Cols) */}
          <div className="md:col-span-4 flex flex-col gap-5 glass-card p-5 border-cyan-500/20 bg-cyan-950/10">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-cyan-200 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                <Sliders className="w-4 h-4 text-cyan-400" />
                Physics Controls
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-500/30">
                RAM: {depth * 48}KB
              </span>
            </div>

            {/* Recursion Depth Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
                <span>Recursion Depth (n):</span>
                <span className="text-cyan-400 font-bold font-mono text-base">{depth}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="15" 
                value={depth} 
                onChange={(e) => setDepth(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-gray-800 rounded-lg cursor-pointer h-2"
              />
            </div>

            {/* Base Case Curtain Toggle */}
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-200 block">Base Case Curtain</span>
                <span className="text-[10px] text-purple-300/70">Blocks infinite recursion</span>
              </div>
              <button 
                onClick={() => setHasBaseCase(!hasBaseCase)}
                className={`w-11 h-6 rounded-full transition-all relative ${hasBaseCase ? 'bg-cyan-500' : 'bg-gray-700'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${hasBaseCase ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Call Stack Counter */}
            <div className="p-3 rounded-xl bg-gray-900/60 border border-white/10 flex items-center gap-3">
              <Activity className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <span className="text-[11px] text-gray-400 block font-medium">Active Stack Frames</span>
                <span className="text-xs font-bold text-cyan-300 font-mono">
                  {hasBaseCase ? depth : depth >= 12 ? 'CRASHED (Overflow)' : depth} Frames
                </span>
              </div>
            </div>

            {/* Depth Insight Tip */}
            <div className="text-[11px] text-gray-300 bg-purple-950/30 p-3 rounded-xl border border-purple-500/20 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong>Mirror Physics Insight:</strong> Each reflection represents a paused function frame waiting for deeper calls to return.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
