import React, { useState } from 'react';
import { Clock, CheckCircle2, RotateCcw, Play } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function CountdownWheel({ onComplete }) {
  const [currentValue, setCurrentValue] = useState(10);
  const [generatedSequence, setGeneratedSequence] = useState([10]);
  const [isDone, setIsDone] = useState(false);

  const handleTickDown = () => {
    if (currentValue > 1) {
      soundFx.playClick();
      const next = currentValue - 1;
      setCurrentValue(next);
      setGeneratedSequence(prev => [...prev, next]);
      if (next === 1) {
        setIsDone(true);
        soundFx.playSuccess();
        if (onComplete) onComplete();
      }
    }
  };

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-amber-900/40 p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between bg-amber-950/30 p-4 rounded-xl border border-amber-800/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
            <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <div>
            <h3 className="font-extrabold text-amber-200 text-lg">Auditorium Event Countdown</h3>
            <p className="text-xs text-stone-400">Generate number sequence automatically: range(10, 0, -1)</p>
          </div>
        </div>
        <div className="font-mono text-3xl font-extrabold text-red-500 bg-black/60 px-4 py-1.5 rounded-xl border border-red-500/30">
          00:{currentValue < 10 ? `0${currentValue}` : currentValue}
        </div>
      </div>

      {/* Sequence Numbers Banner */}
      <div className="bg-stone-950/80 p-5 rounded-xl border border-stone-800 space-y-3">
        <div className="text-xs font-mono text-stone-400">Generated Numbers Sequence:</div>
        <div className="flex items-center gap-2 flex-wrap">
          {generatedSequence.map(num => (
            <span
              key={num}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-extrabold text-base transition-all transform hover:scale-110 ${
                num === currentValue
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 scale-110 ring-2 ring-red-400'
                  : 'bg-stone-800 text-amber-300 border border-stone-700'
              }`}
            >
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end pt-2">
        {!isDone ? (
          <button
            onClick={handleTickDown}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-red-600/20 transform transition hover:scale-105"
          >
            <Clock className="w-4 h-4" />
            <span>Tick Down 1 Minute ({currentValue} ➔ {currentValue - 1})</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
            <span>Countdown Reached 1 Minute! Event Doors Opening!</span>
          </div>
        )}
      </div>
    </div>
  );
}
