import React from 'react';
import { BookOpen, Lightbulb, Sparkles, Code2, Flame } from 'lucide-react';

export default function CinematicScene({ lesson, subStep, onAdvance }) {
  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center pointer-events-none">
      
      {/* 1. Sub-step 1: Magical Floating Cloud Panel (📖 Story Explanation) */}
      {subStep === 1 && (
        <div 
          key={`cloud-story-${lesson.id}`}
          className="magical-cloud-panel pointer-events-auto cursor-pointer"
          onClick={onAdvance}
        >
          {/* Sparkle Trail Badge */}
          <div className="panel-sparkle-trail bg-purple-900/90 text-purple-200 border border-purple-400/50 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span>📖 Story Analogy</span>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <h4 className="font-extrabold text-lg text-purple-200" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Discovery in the Mirror World
            </h4>
            <p className="text-base md:text-lg text-purple-100 font-medium leading-relaxed">
              &ldquo;{lesson.story}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* 2. Sub-step 2: Holographic Code Panel (🐍 Python Concept) */}
      {subStep === 2 && (
        <div 
          key={`holo-concept-${lesson.id}`}
          className="holographic-code-panel pointer-events-auto cursor-pointer"
          onClick={onAdvance}
        >
          {/* Sparkle Trail Badge */}
          <div className="panel-sparkle-trail bg-cyan-950/90 text-cyan-200 border border-cyan-400/50 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>🐍 Python Concept</span>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <h4 className="font-extrabold text-lg text-cyan-200" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Executable Logic Matrix
            </h4>
            <p className="text-base md:text-lg text-cyan-100 font-medium leading-relaxed">
              {lesson.pythonConcept}
            </p>
          </div>
        </div>
      )}

      {/* 3. Sub-step 3: Glowing Crystal Energy Bubble (💡 Key Idea) */}
      {subStep === 3 && (
        <div 
          key={`crystal-idea-${lesson.id}`}
          className="glowing-crystal-panel pointer-events-auto cursor-pointer"
          onClick={onAdvance}
        >
          {/* Sparkle Trail Badge */}
          <div className="panel-sparkle-trail bg-amber-950/90 text-amber-200 border border-amber-400/50 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>💡 Key Idea</span>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <h4 className="font-extrabold text-lg text-amber-200" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Core Takeaway
            </h4>
            <p className="text-base md:text-lg text-amber-100 font-extrabold leading-relaxed">
              &ldquo;{lesson.keyIdea}&rdquo;
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
