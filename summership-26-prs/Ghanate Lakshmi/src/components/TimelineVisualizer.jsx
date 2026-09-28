import React, { useState } from 'react';
import { Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

export default function TimelineVisualizer({ onComplete }) {
  const [activeConcept, setActiveConcept] = useState('while');

  const timelineSteps = [
    { label: 'REAL LIFE', desc: 'Lakshmi & friends experiencing everyday Hyderabad college routines.' },
    { label: 'REPETITION', desc: 'Checking 9 metro station stops, 5 canteen dishes, 30 auditorium seats.' },
    { label: 'PATTERN', desc: 'Noticing that identical steps repeat under specific rules or collections.' },
    { label: 'ALGORITHM', desc: 'Formulating step-by-step logic rules (Check ➔ Is Raidurg? ➔ Next).' },
    { label: 'LOOP', desc: 'Generalizing the repeating structure as a formal programming construct.' },
    { label: 'PYTHON', desc: 'Expressing the loop logic cleanly using Python loop syntax!' }
  ];

  const syntaxList = [
    {
      id: 'while',
      title: 'while Loop',
      storyMatch: 'Chapter 1 — The Metro Journey',
      syntax: `station = "Ameerpet"
while station != "Raidurg":
    print("Checking:", station)
    station = get_next_station()

print("Reached Raidurg!")`,
      explanation: 'Repeats a block of code AS LONG AS a condition (station != "Raidurg") evaluates to True.'
    },
    {
      id: 'for',
      title: 'for Loop',
      storyMatch: 'Chapter 2 — Canteen Orders',
      syntax: `orders = ["Samosa", "Puff", "Dosa", "Juice", "Biryani"]

for dish in orders:
    print("Preparing dish:", dish)`,
      explanation: 'Iterates through each element in a sequence or collection in sequential order.'
    },
    {
      id: 'nested',
      title: 'Nested Loops',
      storyMatch: 'Chapter 3 — Auditorium Seats',
      syntax: `rows = [1, 2, 3, 4, 5]
seats = [1, 2, 3, 4, 5, 6]

for r in rows:
    for s in seats:
        print("Row", r, "Seat", s, "checked")`,
      explanation: 'A loop placed inside the body of another loop to iterate over 2D grid matrix structures.'
    }
  ];

  return (
    <div className="space-y-8 bg-stone-950 rounded-2xl border border-amber-900/40 p-6 lg:p-8 shadow-2xl">
      
      {/* Real Life to Python Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-extrabold text-lg">
          <Sparkles className="w-5 h-5" />
          <span>The Discovery Timeline: How Real Life Becomes Python Code</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {timelineSteps.map((step, idx) => (
            <div
              key={step.label}
              className="bg-stone-900/80 p-4 rounded-xl border border-amber-500/20 flex flex-col justify-between space-y-2 relative group hover:border-amber-500/60 transition shadow-md"
            >
              <div>
                <span className="font-mono text-[10px] text-amber-400 font-bold block">STEP {idx + 1}</span>
                <span className="font-extrabold text-sm text-stone-100">{step.label}</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-tight">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Concept Selector Tabs */}
      <div className="space-y-4 border-t border-stone-800 pt-6">
        <h3 className="font-extrabold text-xl text-amber-200 flex items-center gap-2">
          <Code2 className="w-6 h-6 text-amber-400" />
          <span>Official Python Loop Syntax Cards</span>
        </h3>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {syntaxList.map(item => (
            <button
              key={item.id}
              onClick={() => {
                soundFx.playClick();
                setActiveConcept(item.id);
              }}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition whitespace-nowrap border ${
                activeConcept === item.id
                  ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
                  : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-amber-300'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Selected Syntax Detail Card */}
        {(() => {
          const current = syntaxList.find(s => s.id === activeConcept);
          return (
            <div className="bg-stone-900 p-6 rounded-2xl border border-amber-500/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <h4 className="font-extrabold text-lg text-amber-300">{current.title}</h4>
                  <span className="text-xs text-stone-400 italic">Story Match: {current.storyMatch}</span>
                </div>
                <span className="font-mono text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-semibold">
                  Core Topic
                </span>
              </div>

              <p className="text-stone-300 text-sm leading-relaxed">{current.explanation}</p>

              <div className="relative group">
                <pre className="bg-[#121110] p-5 rounded-xl border border-stone-800 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto leading-relaxed shadow-inner">
                  <code>{current.syntax}</code>
                </pre>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Proceed Button */}
      <div className="flex justify-end pt-4 border-t border-stone-800">
        <button
          onClick={onComplete}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-black font-extrabold text-base flex items-center gap-2 shadow-xl shadow-amber-500/20 transform transition hover:scale-105"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Launch "HELP LAKSHMI & FRIENDS" Mini-Game</span>
        </button>
      </div>

    </div>
  );
}
