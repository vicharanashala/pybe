import React from 'react';
import { Sparkles } from 'lucide-react';

export default function PortalEffect() {
  return (
    <div className="portal-overlay-container">
      {/* Ripple wave background */}
      <div className="portal-ripple-wave" />

      {/* Concentric expanding light portal rings */}
      <div className="portal-light-ring" style={{ animationDelay: '0s' }} />
      <div className="portal-light-ring" style={{ animationDelay: '0.15s', borderColor: 'rgba(167, 139, 250, 0.9)' }} />
      <div className="portal-light-ring" style={{ animationDelay: '0.3s', borderColor: 'rgba(251, 191, 36, 0.8)' }} />

      {/* Center portal energy spark */}
      <div className="relative z-10 flex flex-col items-center gap-2 animate-pulse">
        <div className="p-4 rounded-full bg-cyan-400/20 border-2 border-cyan-300 shadow-2xl shadow-cyan-400">
          <Sparkles className="w-8 h-8 text-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        <span className="text-xs font-mono font-bold tracking-widest text-cyan-200 uppercase bg-black/60 px-3 py-1 rounded-full border border-cyan-500/40">
          Entering Mirror Portal...
        </span>
      </div>
    </div>
  );
}
