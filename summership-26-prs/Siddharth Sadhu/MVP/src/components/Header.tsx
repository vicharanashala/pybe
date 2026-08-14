import React from 'react';
import { ShieldCheck, Layers, Sparkles, Wand2, Network, BookOpenCheck, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  serverStatus: 'connected' | 'busy' | 'offline';
  theme: 'light' | 'dark';
  activePhase: 'INTAKE' | 'PIPELINE' | 'STUDIO';
  onSelectPhase: (phase: 'INTAKE' | 'PIPELINE' | 'STUDIO') => void;
  hasProduction: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  serverStatus,
  theme,
  activePhase,
  onSelectPhase,
  hasProduction
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-2xl border-b transition-colors duration-300 ${
        isDark
          ? 'bg-slate-950/70 border-slate-800/80 text-white shadow-lg shadow-black/40'
          : 'bg-white/70 border-slate-200/80 text-slate-900 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* PyBe Brand Logo */}
        <div className="flex items-center space-x-3.5 group">
          <div className="p-1.5 rounded-2xl bg-white/95 border border-white shadow-md shadow-indigo-500/10 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
            <img
              src="/pybe-logo.png"
              alt="PyBe Logo"
              className="h-9 w-auto object-contain"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className={`font-black text-xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                PyBe
              </h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-indigo-950/90 text-indigo-300 border-indigo-700/60'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                v2.0
              </span>
            </div>
            <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Learning Intelligence System
            </p>
          </div>
        </div>

        {/* Phase Navigation Tabs (Zero Scroll Architecture) */}
        <div className="flex items-center p-1 rounded-2xl border backdrop-blur-xl bg-slate-900/40 border-slate-800/80 shadow-inner">
          <button
            type="button"
            onClick={() => onSelectPhase('INTAKE')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              activePhase === 'INTAKE'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-105'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>1. Intake</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPhase('PIPELINE')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              activePhase === 'PIPELINE'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-105'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>2. Reasoning Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => hasProduction && onSelectPhase('STUDIO')}
            disabled={!hasProduction}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              activePhase === 'STUDIO'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-105'
                : !hasProduction
                ? 'opacity-40 cursor-not-allowed text-slate-500'
                : isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>3. Studio Deliverable</span>
          </button>

          {/* Divider */}
          <div className={`w-px h-5 mx-1 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />

          {/* Architecture diagram — opens in new tab */}
          <a
            href="/architecture.html"
            target="_blank"
            rel="noopener noreferrer"
            title="PyBe Architecture & Theoretical Foundation"
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              isDark
                ? 'text-violet-400 hover:text-white hover:bg-violet-800/40 ring-1 ring-violet-700/40'
                : 'text-violet-700 hover:text-violet-900 hover:bg-violet-100/60 ring-1 ring-violet-300'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Architecture</span>
          </a>
        </div>

        {/* Server Status Badge */}
        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold">
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border backdrop-blur-md ${
              isDark
                ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                : 'bg-white/80 border-slate-200 text-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                serverStatus === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : serverStatus === 'busy'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span className="capitalize">{serverStatus === 'busy' ? 'Processing' : serverStatus}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
