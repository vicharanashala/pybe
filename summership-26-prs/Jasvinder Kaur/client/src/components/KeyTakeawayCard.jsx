import React from 'react';
import { Lightbulb } from 'lucide-react';

export default function KeyTakeawayCard({ lesson }) {
  return (
    <div className="glass-card p-6 md:p-8 border-l-4 border-l-amber-400 bg-gradient-to-r from-amber-500/10 via-purple-900/20 to-transparent animate-fade-in-scale">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shrink-0 mt-1">
          <Lightbulb className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="section-heading text-amber-200 mb-2">💡 Key Takeaway Card</h3>
          <p className="paragraph-text text-amber-100/90 font-medium leading-relaxed">
            "{lesson.keyTakeaway}"
          </p>
        </div>
      </div>
    </div>
  );
}
