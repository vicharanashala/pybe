import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Moon, Sun } from 'lucide-react';

interface AmbientBackgroundProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ theme, onToggleTheme }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Sync video audio mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (!isMuted) {
        videoRef.current.play().catch((err) => console.log('Autoplay audio blocked:', err));
      }
    }
  }, [isMuted]);

  // Handle video source switch when theme changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => console.log('Video play error:', err));
    }
  }, [theme]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const videoSrc = theme === 'dark' ? '/videos/dark_mode.mp4' : '/videos/light_mode.mp4';

  return (
    <>
      {/* Background Fullscreen Video Asset */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        key={theme}
        className="fixed inset-0 w-full h-full object-cover pointer-events-none -z-20 transition-opacity duration-1000"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Atmospheric Warm Contrast Glass Overlay - Formulated for both Light & Dark themes */}
      <div
        className={`fixed inset-0 pointer-events-none -z-10 transition-all duration-700 ${
          theme === 'dark'
            ? 'bg-slate-950/75 backdrop-brightness-[0.8] backdrop-contrast-[1.15] bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-indigo-950/80'
            : 'bg-white/65 backdrop-brightness-[0.98] backdrop-contrast-[1.08] bg-gradient-to-b from-amber-50/60 via-white/50 to-amber-100/60'
        }`}
      />

      {/* Floating Bottom-Right Controls Bar */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3">
        {/* Theme Mode Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className={`p-3 rounded-full shadow-2xl backdrop-blur-2xl border transition-all duration-300 flex items-center justify-center ${
            theme === 'dark'
              ? 'bg-slate-900/90 border-white/20 text-amber-300 hover:bg-slate-800 hover:scale-105 shadow-black/80'
              : 'bg-white/90 border-slate-300 text-indigo-600 hover:bg-indigo-50 hover:scale-105 shadow-slate-400/50'
          }`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Audio Mute/Unmute Control Pill */}
        <button
          type="button"
          onClick={toggleMute}
          title={isMuted ? 'Unmute Background Video Audio' : 'Mute Background Video Audio'}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-2xl border text-xs font-semibold transition-all duration-300 ${
            isMuted
              ? theme === 'dark'
                ? 'bg-slate-900/90 border-white/15 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-white/90 border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              : theme === 'dark'
              ? 'bg-indigo-600/90 border-indigo-400/80 text-white shadow-indigo-500/40 ring-2 ring-indigo-400/50'
              : 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/30'
          }`}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span>Video Sound Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Playing Video Audio
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
};
