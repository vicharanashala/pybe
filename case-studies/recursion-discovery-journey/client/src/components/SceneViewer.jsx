import React, { useState } from 'react';
import { Sparkles, X, BookOpen, Lightbulb, MapPin, Eye } from 'lucide-react';

export default function SceneViewer({ lesson }) {
  const [activeSpot, setActiveSpot] = useState(null);

  return (
    <div className="relative w-full flex flex-col items-center">
      
      {/* 70% Viewport Height Hero Illustration Area */}
      <div className="scene-70vh-container group">
        
        {/* Main Educational Image */}
        <img
          key={`img-hero-${lesson.id}`}
          src={lesson.image}
          alt={lesson.title}
          className="scene-hero-img"
        />

        {/* Floating Hotspot Dots on the Image */}
        {lesson.hotspots?.map((spot, idx) => (
          <div
            key={idx}
            className="hotspot-dot-wrap"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            onClick={() => setActiveSpot(activeSpot === idx ? null : idx)}
            title={spot.title || "Click to explore concept"}
          >
            <div className="hotspot-ping-ring" />
            <div className="hotspot-dot">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
        ))}

        {/* Caption Bar Overlay (Bottom of Image) */}
        <div className="absolute bottom-3 left-4 right-4 bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 text-xs text-gray-200 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2 truncate">
            <Eye className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="font-semibold text-white truncate">{lesson.imageCaption}</span>
          </div>
          <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 shrink-0">
            Click dots on image to learn ✨
          </span>
        </div>

      </div>

      {/* Glassmorphism Hotspot Explanation Modal / Popup */}
      {activeSpot !== null && lesson.hotspots && lesson.hotspots[activeSpot] && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveSpot(null)}
        >
          <div 
            className="hotspot-explanation-popup relative flex flex-col gap-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <h4 className="font-extrabold text-lg text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {lesson.hotspots[activeSpot].title || "Concept Insights"}
                </h4>
              </div>
              <button 
                onClick={() => setActiveSpot(null)}
                className="w-8 h-8 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 📖 Story */}
            <div className="p-4 rounded-xl bg-purple-950/50 border border-purple-500/30 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>📖 Story Analogy</span>
              </div>
              <p className="text-sm text-purple-100 leading-relaxed font-medium">
                "{lesson.hotspots[activeSpot].story || lesson.theory}"
              </p>
            </div>

            {/* 🐍 Python Concept */}
            <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                <span className="text-sm">🐍</span>
                <span>Python Concept</span>
              </div>
              <p className="text-sm text-cyan-100 leading-relaxed font-medium">
                {lesson.hotspots[activeSpot].pythonConcept || lesson.pythonConcept}
              </p>
            </div>

            {/* 💡 Key Idea */}
            <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-500/30 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>💡 Key Idea</span>
              </div>
              <p className="text-sm text-amber-100 leading-relaxed font-bold">
                "{lesson.hotspots[activeSpot].keyIdea || lesson.keyTakeaway}"
              </p>
            </div>

            <button 
              onClick={() => setActiveSpot(null)}
              className="btn-primary py-2.5 px-5 text-xs font-bold w-full mt-1"
            >
              Got it! Return to Scene
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
