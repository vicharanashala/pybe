import React from 'react';
import { BookOpen } from 'lucide-react';

function highlightTheory(text) {
  const keywords = [
    { word: 'recursion', cls: '' },
    { word: 'reflections', cls: 'cyan' },
    { word: 'reflection', cls: 'cyan' },
    { word: 'function', cls: 'cyan' },
    { word: 'base case', cls: 'amber' },
    { word: 'stopping condition', cls: 'amber' },
    { word: 'call stack', cls: 'pink' },
    { word: 'stack overflow', cls: 'pink' },
    { word: 'unwinding', cls: 'green' }
  ];

  const pattern = keywords.map(k => k.word).sort((a,b) => b.length - a.length).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    const lower = part.toLowerCase();
    const match = keywords.find(k => k.word === lower);
    if (match) {
      return (
        <span key={idx} className={`keyword-chip ${match.cls}`}>
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function TheorySection({ lesson }) {
  return (
    <div className="glass-card p-6 md:p-8 flex flex-col gap-4 relative overflow-hidden animate-fade-in-scale">
      
      {/* Card Title */}
      <div className="flex items-center gap-3 border-b border-purple-500/20 pb-4">
        <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h3 className="section-heading">📖 Story Explanation Card</h3>
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">{lesson.subtitle}</span>
        </div>
      </div>

      {/* Narrative Real-World Analogy Paragraph */}
      <p className="paragraph-text">
        {highlightTheory(lesson.theory)}
      </p>

    </div>
  );
}
