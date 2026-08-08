import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiEffect from './ConfettiEffect';

export default function SummoningLedger({ onSummonSuccess }) {
  const [guardianName, setGuardianName] = useState('Ember');
  const [guardianEssence, setGuardianEssence] = useState('Flame');
  const [summonedGuardians, setSummonedGuardians] = useState([]);
  const [confettiKey, setConfettiKey] = useState(0);
  const [feedback, setFeedback] = useState('');

  const defaultSuggestions = [
    { name: 'Frost', essence: 'Ice' },
    { name: 'Spark', essence: 'Lightning' },
    { name: 'Sol', essence: 'Sunlight' },
    { name: 'Aura', essence: 'Starlight' },
    { name: 'Shadow', essence: 'Midnight' },
  ];

  const handleSummon = (e) => {
    if (e) e.preventDefault();
    
    const name = guardianName.trim();
    const essence = guardianEssence.trim();

    if (!name || !essence) {
      setFeedback('⚠️ Please specify both a Name and an Essence for your guardian!');
      return;
    }

    const newGuardian = {
      id: Date.now(),
      varName: `fox_${summonedGuardians.length + 1}`,
      name: name,
      essence: essence,
    };

    const updatedList = [newGuardian, ...summonedGuardians];
    setSummonedGuardians(updatedList);
    setConfettiKey((prev) => prev + 1);

    setFeedback(`✨ Success! ${name} the ${essence} Fox instantiated! (Total: ${updatedList.length})`);

    // Prepare next suggested input values for continuous creation
    const nextIndex = updatedList.length % defaultSuggestions.length;
    setGuardianName(defaultSuggestions[nextIndex].name);
    setGuardianEssence(defaultSuggestions[nextIndex].essence);

    if (onSummonSuccess) {
      onSummonSuccess({
        name: name,
        essence: essence,
        totalCount: updatedList.length,
      });
    }
  };

  const isSummoned = summonedGuardians.length > 0;

  return (
    <div className="w-full max-w-xl ml-auto h-full flex flex-col justify-between select-none relative p-1">
      {/* Confetti Celebration on each Summon */}
      {confettiKey > 0 && <ConfettiEffect key={confettiKey} />}

      {/* Outer Amber-Green Gradient Border Glass Panel Container */}
      <div className={`w-full h-full p-[2px] rounded-3xl bg-gradient-to-br transition-all duration-700 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between ${
        isSummoned
          ? 'from-emerald-400/80 via-amber-400/80 to-emerald-500/80 shadow-[0_0_50px_rgba(52,211,153,0.4)]'
          : 'from-amber-400/70 via-emerald-500/80 to-amber-500/70 shadow-[0_0_40px_rgba(245,158,11,0.25)]'
      }`}>
        
        {/* Ambient Glass Panel Content */}
        <div className="w-full h-full bg-black/75 rounded-[22px] p-5 sm:p-6 flex flex-col justify-between relative z-10 text-white overflow-y-auto space-y-3">
          
          {/* Subtle Ambient Glow Orbs in Panel */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-1.5 border-b border-amber-500/30 pb-3 shrink-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">🦊</span>
                <h2 className="text-sm sm:text-base font-bold font-serif text-amber-300 tracking-wider uppercase drop-shadow">
                  THE CREATURE SUMMONING SCROLL
                </h2>
              </div>
              
              <span className={`text-[11px] font-mono px-3 py-1 rounded-full shadow font-bold flex items-center space-x-1.5 ${
                isSummoned
                  ? 'bg-emerald-950/90 border border-emerald-400/80 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                  : 'bg-black/60 border border-amber-400/50 text-amber-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isSummoned ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                <span>{isSummoned ? `INSTANTIATED (${summonedGuardians.length})` : 'INSTANTIATION RITUAL'}</span>
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-300">
              Type any name & essence into the blanks and click the spell button to instantiate as many living foxes as you desire!
            </p>
          </div>

          {/* Feedback Banner */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                key={feedback}
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-2.5 rounded-xl text-xs font-mono text-center font-bold shadow-xl backdrop-blur-md border ${
                  isSummoned
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                    : 'bg-amber-950/90 border-amber-400 text-amber-200'
                }`}
              >
                {feedback}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Python Instantiation Code Block */}
          <form onSubmit={handleSummon} className="my-auto py-1 space-y-3">
            <div className="bg-[#080d12]/95 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 shadow-[inset_0_0_25px_rgba(0,0,0,0.9)] font-mono text-xs sm:text-sm leading-relaxed space-y-3 relative overflow-hidden">
              
              {/* Monospace Code Comment Header */}
              <div className="text-slate-400 text-[11px] italic flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span># Instantiate a living guardian from our Fox Class</span>
                <span className="text-[10px] text-amber-400/80 font-mono">Python 3</span>
              </div>

              {/* Code Lines: my_guardian = Fox( ... ) */}
              <div className="space-y-2 text-slate-100">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-slate-500 select-none text-[11px] w-4">1</span>
                  <span className="text-sky-300 font-bold">
                    fox_{summonedGuardians.length + 1}
                  </span>
                  <span className="text-amber-300 font-bold">=</span>
                  <span className="text-amber-300 font-extrabold text-sm">Fox</span>
                  <span className="text-white font-bold">(</span>
                </div>

                <div className="pl-6 space-y-2 border-l border-amber-500/20">
                  {/* Parameter: name */}
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-slate-500 select-none text-[11px] w-4 -ml-4">2</span>
                    <span className="text-sky-300 font-bold">name</span>
                    <span className="text-white">=</span>
                    <div className="relative inline-block">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-amber-400 rounded-lg blur-[2px] opacity-70 animate-pulse" />
                      <input
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        placeholder="Ember"
                        required
                        className="relative px-3 py-1 rounded-lg bg-[#071927] border border-cyan-400 text-cyan-200 font-bold font-mono text-center focus:outline-none text-xs shadow-[0_0_10px_rgba(34,211,238,0.8)] w-32"
                      />
                    </div>
                    <span className="text-white font-bold">,</span>
                  </div>

                  {/* Parameter: essence */}
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-slate-500 select-none text-[11px] w-4 -ml-4">3</span>
                    <span className="text-sky-300 font-bold">essence</span>
                    <span className="text-white">=</span>
                    <div className="relative inline-block">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg blur-[2px] opacity-70 animate-pulse" />
                      <input
                        type="text"
                        value={guardianEssence}
                        onChange={(e) => setGuardianEssence(e.target.value)}
                        placeholder="Flame"
                        required
                        className="relative px-3 py-1 rounded-lg bg-[#1a0e07] border border-amber-400 text-amber-200 font-bold font-mono text-center focus:outline-none text-xs shadow-[0_0_10px_rgba(251,191,36,0.8)] w-32"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-slate-500 select-none text-[11px] w-4">4</span>
                  <span className="text-white font-bold">)</span>
                </div>
              </div>
            </div>

            {/* List of Created Instantiated Guardians */}
            {isSummoned && (
              <div className="space-y-2 pt-1">
                <div className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>✨ Instantiated Objects ({summonedGuardians.length}):</span>
                  <span className="text-amber-300">Infinite Blueprint Instances</span>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  <AnimatePresence initial={false}>
                    {summonedGuardians.map((g, index) => (
                      <motion.div
                        key={g.id}
                        initial={{ opacity: 0, x: -10, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-emerald-950/80 border border-emerald-400/60 rounded-xl p-2 text-xs font-mono shadow-md flex items-center justify-between backdrop-blur-md"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-amber-300 font-bold">#{summonedGuardians.length - index}</span>
                          <span className="text-sky-300 font-bold">{g.varName}</span>
                          <span className="text-slate-400">=</span>
                          <span className="text-emerald-300 font-bold">Fox</span>
                          <span className="text-slate-300">(name="<span className="text-cyan-200 font-bold">{g.name}</span>", essence="<span className="text-amber-200 font-bold">{g.essence}</span>")</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 bg-black/60 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold shrink-0 ml-2">
                          legs:4 • tails:1
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 relative shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/30 via-amber-500/40 to-emerald-500/30 rounded-full blur-md opacity-70 animate-pulse pointer-events-none" />
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="relative w-full py-3.5 sm:py-4 px-6 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-500 hover:from-orange-600 hover:to-emerald-600 text-white font-bold font-serif tracking-wider text-xs sm:text-sm shadow-[0_0_35px_rgba(249,115,22,0.6)] border border-amber-300/50 flex items-center justify-center space-x-3 cursor-pointer transition-all duration-300"
              >
                <span className="text-lg">🔮</span>
                <span className="font-extrabold tracking-wider text-white text-xs sm:text-sm drop-shadow uppercase">
                  {isSummoned ? 'CAST INSTANTIATION SPELL AGAIN 🔮' : 'CAST INSTANTIATION SPELL 🔮'}
                </span>
              </motion.button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
