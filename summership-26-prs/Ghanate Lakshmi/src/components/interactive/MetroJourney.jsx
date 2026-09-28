import React, { useState, useEffect } from 'react';
import { Train, MapPin, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import CharacterAvatar from '../CharacterAvatar';
import { soundFx } from '../../utils/soundEffects';

export default function MetroJourney({ stations = [], initialStationIdx = 0, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(initialStationIdx);

  useEffect(() => {
    if (initialStationIdx !== undefined) {
      setCurrentIndex(initialStationIdx);
    }
  }, [initialStationIdx]);

  const currentStation = stations[currentIndex] || stations[0] || { name: 'Ameerpet', desc: 'Station Check #1: Not Raidurg!' };
  const isReached = currentStation.name === 'Raidurg';

  const handleNextStation = () => {
    soundFx.playMetroChime();
    if (currentIndex < stations.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (stations[nextIdx]?.name === 'Raidurg') {
        soundFx.playSuccess();
      }
      if (onComplete) {
        onComplete();
      }
    } else if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-amber-900/40 p-5 sm:p-6 shadow-2xl space-y-5 animate-fade-in">
      
      {/* 1. TOP HEADER BANNER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-blue-950 via-slate-900 to-amber-950 p-4 rounded-xl border border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-400/30 animate-pulse">
            <Train className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase font-mono text-blue-300 font-bold tracking-wider">
              HYDERABAD METRO BLUE LINE
            </div>
            <div className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
              Current Stop: <span className="text-amber-400 font-mono">{currentStation.name}</span>
            </div>
          </div>
        </div>

        <div className="text-right flex items-center sm:block gap-2">
          <div className="text-[10px] text-stone-400 font-mono uppercase tracking-widest">DESTINATION</div>
          <div className="text-sm font-extrabold text-amber-300 flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-lg border border-amber-500/20">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Raidurg Station</span>
          </div>
        </div>
      </div>

      {/* 2. STATION PROGRESS TRACK (HORIZONTAL ROUTE LINE) */}
      <div className="overflow-x-auto py-2 scrollbar-thin">
        <div className="flex items-center justify-between gap-2 min-w-max px-2">
          {stations.map((st, idx) => {
            const isVisited = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <React.Fragment key={st.name}>
                <div className="flex flex-col items-center group cursor-default">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-amber-500 text-black ring-4 ring-amber-500/40 scale-110 shadow-lg shadow-amber-500/50' 
                        : isVisited 
                        ? 'bg-blue-600 text-white border border-blue-400' 
                        : 'bg-stone-800 text-stone-500 border border-stone-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className={`text-[11px] font-mono mt-2 font-medium max-w-[90px] text-center truncate ${
                    isCurrent ? 'text-amber-300 font-bold' : isVisited ? 'text-stone-300' : 'text-stone-600'
                  }`}>
                    {st.name}
                  </span>
                </div>

                {idx < stations.length - 1 && (
                  <div className={`h-1.5 flex-1 min-w-[36px] sm:min-w-[48px] transition-colors duration-500 rounded-full ${
                    idx < currentIndex ? 'bg-blue-500' : 'bg-stone-800'
                  }`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 3. CURRENT STATION DETAILS & CHARACTER REACTION */}
      <div className="bg-stone-950/90 p-5 rounded-xl border border-stone-800 space-y-4 shadow-inner">
        <div className="flex items-center justify-between text-xs font-mono text-stone-400 border-b border-stone-800/80 pb-2.5">
          <span className="font-bold text-amber-400">Station Check #{currentIndex + 1}</span>
          <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
            isReached 
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' 
              : 'bg-amber-950 text-amber-300 border border-amber-500/30'
          }`}>
            {isReached ? 'DESTINATION REACHED ✓' : `Status: Not Raidurg!`}
          </span>
        </div>

        {/* Character Dialogue Box */}
        <div className="space-y-2">
          {currentStation.speaker && (
            <CharacterAvatar charKey={currentStation.speaker} size="sm" />
          )}
          <div className="bg-stone-900/90 p-4 rounded-xl border border-stone-800 text-stone-100 font-medium text-sm sm:text-base leading-relaxed">
            "{currentStation.reaction}"
          </div>
        </div>
      </div>

      {/* 4. LOOP STATUS INDICATOR & BUTTON CONTROLLER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        
        {/* Visual Loop Rule Hint */}
        <div className="text-xs text-amber-400/90 font-mono flex items-center gap-2 bg-amber-500/10 px-3.5 py-2 rounded-xl border border-amber-500/30 w-full sm:w-auto">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold">Loop Rule: Repeat train stop check while station != Raidurg</span>
        </div>

        {/* Next Station Button */}
        {!isReached ? (
          <button
            onClick={handleNextStation}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transform transition hover:scale-105 active:scale-95 shrink-0"
          >
            <span>NEXT STATION →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transform transition hover:scale-105 shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>PROCEED TO LOOK BACK →</span>
          </button>
        )}
      </div>

    </div>
  );
}

