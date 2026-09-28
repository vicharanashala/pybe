import React, { useState } from 'react';
import { Grid, CheckCircle2, Play, Code } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

export default function SeatGrid({ rows = 5, seatsPerRow = 6, onComplete }) {
  const [checkedSeats, setCheckedSeats] = useState([]);
  const [currentRow, setCurrentRow] = useState(1);
  const [currentSeat, setCurrentSeat] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const handleStepNextSeat = () => {
    soundFx.playClick();
    const key = `R${currentRow}S${currentSeat}`;
    setCheckedSeats(prev => [...prev, key]);

    if (currentSeat < seatsPerRow) {
      setCurrentSeat(prev => prev + 1);
    } else if (currentRow < rows) {
      setCurrentRow(prev => prev + 1);
      setCurrentSeat(1);
    } else {
      setIsFinished(true);
      setIsAutoPlaying(false);
      soundFx.playSuccess();
      if (onComplete) onComplete();
    }
  };

  const handleAutoRun = () => {
    setIsAutoPlaying(true);
    let r = currentRow;
    let s = currentSeat;

    const interval = setInterval(() => {
      soundFx.playClick();
      const key = `R${r}S${s}`;
      setCheckedSeats(prev => [...prev, key]);

      if (s < seatsPerRow) {
        s++;
      } else if (r < rows) {
        r++;
        s = 1;
      } else {
        clearInterval(interval);
        setIsFinished(true);
        setIsAutoPlaying(false);
        soundFx.playSuccess();
        if (onComplete) onComplete();
      }
      setCurrentRow(r);
      setCurrentSeat(s);
    }, 200);
  };

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-amber-900/40 p-6 shadow-2xl space-y-6">
      
      {/* Header & Live Variable Pointers */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-950/30 p-4 rounded-xl border border-amber-800/30">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Grid className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-amber-200 text-lg">Nested Loop Auditorium Matrix</h3>
            <p className="text-xs text-stone-400">Watch the outer loop (Rows) & inner loop (Seats) iterate live!</p>
          </div>
        </div>

        {/* Live Loop Variables Indicator */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-xl font-bold">
            row = <span className="text-amber-400 text-sm font-black">{currentRow - 1}</span> (Row {currentRow})
          </div>
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl font-bold">
            seat = <span className="text-emerald-400 text-sm font-black">{currentSeat - 1}</span> (Seat {currentSeat})
          </div>
        </div>
      </div>

      {/* Code Highlight Box */}
      <div className="bg-[#121110] p-4 rounded-xl border border-stone-800 font-mono text-xs sm:text-sm space-y-1">
        <div className="text-stone-500 text-[10px]"># Live Python Nested Loop Execution</div>
        <div className={currentRow > 0 ? "text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded" : "text-stone-400"}>
          for row in range(5):  <span className="text-stone-500"># Currently row = {currentRow - 1}</span>
        </div>
        <div className={currentSeat > 0 ? "text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded pl-6" : "text-stone-400 pl-6"}>
          for seat in range(6):  <span className="text-stone-500"># Currently seat = {currentSeat - 1}</span>
        </div>
        <div className="text-stone-300 pl-12">
          align_seat(row, seat)
        </div>
      </div>

      {/* Auditorium Seat Matrix Grid */}
      <div className="space-y-3 bg-stone-950/80 p-5 rounded-xl border border-stone-800">
        {Array.from({ length: rows }).map((_, rIdx) => {
          const rNum = rIdx + 1;
          const isRowActive = rNum === currentRow && !isFinished;

          return (
            <div
              key={rNum}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-300 ${
                isRowActive
                  ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/40 shadow-lg'
                  : 'bg-stone-900/40 border-stone-800/80'
              }`}
            >
              <div className="w-20 font-mono text-xs font-bold text-amber-300 flex items-center gap-1">
                {isRowActive && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>}
                Row {rNum}
              </div>

              <div className="grid grid-cols-6 gap-2 flex-1">
                {Array.from({ length: seatsPerRow }).map((_, sIdx) => {
                  const sNum = sIdx + 1;
                  const seatKey = `R${rNum}S${sNum}`;
                  const isChecked = checkedSeats.includes(seatKey);
                  const isCurrent = rNum === currentRow && sNum === currentSeat && !isFinished;

                  return (
                    <div
                      key={seatKey}
                      className={`h-10 rounded-lg flex flex-col items-center justify-center font-mono text-xs font-bold border transition-all duration-200 ${
                        isChecked
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                          : isCurrent
                          ? 'bg-amber-500 text-black border-amber-300 animate-pulse ring-4 ring-amber-400 scale-105 shadow-xl'
                          : 'bg-stone-800/80 text-stone-500 border-stone-700'
                      }`}
                    >
                      <span>S{sNum}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controller Buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-stone-400 font-mono">
          {checkedSeats.length} / 30 Total Seats Checked
        </div>

        {!isFinished ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleAutoRun}
              disabled={isAutoPlaying}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-mono text-xs font-bold border border-amber-500/40 flex items-center gap-1.5 transition"
            >
              <Play className="w-3.5 h-3.5" /> Auto-Step Loop
            </button>

            <button
              onClick={handleStepNextSeat}
              disabled={isAutoPlaying}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transform transition hover:scale-105"
            >
              <Grid className="w-4 h-4" />
              <span>Step Next Seat (Row {currentRow - 1}, Seat {currentSeat - 1})</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5" />
            <span>All 30 Auditorium Seats Checked via Nested Loops!</span>
          </div>
        )}
      </div>
    </div>
  );
}
