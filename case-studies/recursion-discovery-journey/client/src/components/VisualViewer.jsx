import React, { useState } from 'react';
import { ZoomIn, Eye, Sparkles, X, MapPin } from 'lucide-react';

export default function VisualViewer({ lesson }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);

  return (
    <>
      {/* Hero Illustration Box (~60% screen height focal area) */}
      <div className="hero-illustration-container group animate-fade-in-scale">
        
        {/* Full visual image */}
        <img
          src={lesson.image}
          alt={lesson.title}
          className="hero-illustration-img"
        />

        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-black/60 backdrop-blur-md text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Educational Illustration
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-950/70 backdrop-blur-md text-purple-200 border border-purple-500/30">
            Image {lesson.id} of 7
          </span>
        </div>

        {/* Hotspots overlay */}
        {lesson.hotspots?.map((spot, idx) => (
          <div
            key={idx}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            onMouseEnter={() => setActiveHotspot(idx)}
            onMouseLeave={() => setActiveHotspot(null)}
          >
            <div className="w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow-lg animate-pulse" />
            
            {activeHotspot === idx && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl bg-[#0C0E2B]/95 border border-purple-500/50 backdrop-blur-md text-xs text-purple-100 shadow-2xl z-30 animate-fade-in-scale">
                <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                  {spot.label}
                </div>
                <div>{spot.tooltip}</div>
              </div>
            )}
          </div>
        ))}

        {/* Caption Bar */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/70 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10 text-xs text-gray-200 shadow-xl">
          <div className="flex items-center gap-2 min-w-0">
            <Eye className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="font-semibold text-white text-sm truncate">{lesson.imageCaption}</span>
          </div>

          <button
            onClick={() => setLightboxOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 transition-all shrink-0"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Full View</span>
          </button>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in-scale"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-6xl w-full flex flex-col items-center gap-4">
            <button 
              className="absolute top-2 right-2 text-white bg-gray-800/80 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center border border-white/20 z-10"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <img 
              src={lesson.image} 
              alt={lesson.title} 
              className="max-w-full max-h-[82vh] object-contain rounded-2xl border border-purple-500/40 shadow-2xl"
            />
            
            <p className="text-purple-200 text-center text-base font-semibold bg-purple-950/80 px-6 py-2.5 rounded-xl border border-purple-500/30">
              {lesson.imageCaption}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
