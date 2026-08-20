import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function MagicalLedger({ onCraft, foxCount = 0 }) {
  const [name, setName] = useState('');
  const [essence, setEssence] = useState('Red Flame');
  const [legs, setLegs] = useState('4');
  const [tails, setTails] = useState('1');
  const [eyeColor, setEyeColor] = useState('Glowing Amber');
  const [aura, setAura] = useState('Arcane Sparks');
  const [furPattern, setFurPattern] = useState('Solid Ember');
  const [earShape, setEarShape] = useState('Pointed');
  const [temperament, setTemperament] = useState('Playful');
  const [paws, setPaws] = useState('Velvet Soft');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (legs !== '4') {
      setErrorMsg("A magical fox must have exactly 4 legs! Type '4'.");
      return;
    }
    if (tails !== '1') {
      setErrorMsg("A magical fox must have exactly 1 tail! Type '1'.");
      return;
    }

    setErrorMsg('');

    if (onCraft) {
      onCraft({
        name: name.trim(),
        essence,
        legs,
        tails,
        eyeColor,
        aura,
        furPattern,
        earShape,
        temperament,
        paws,
      });
    }

    // Reset name input for repetitive molding
    setName('');
  };

  return (
    <div className="w-full max-w-lg mx-auto h-[82vh] max-h-[750px] p-6 flex flex-col justify-between select-none relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl text-white">
      {/* Decorative Corner Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header & Counter */}
      <div className="space-y-2 z-10 shrink-0">
        <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📜</span>
            <h2 className="text-base font-bold font-serif-magical text-amber-300 tracking-wide uppercase">
              The Manual Parchment Ledger
            </h2>
          </div>
          <span className="text-xs font-mono bg-black/40 border border-orange-400/40 text-amber-200 px-3 py-1 rounded-full shadow-md">
            Molded: {foxCount} / 3 Creatures
          </span>
        </div>

        <p className="text-[11px] text-slate-200 font-sans-rounded font-semibold leading-relaxed">
          Every detail must be manually entered into the ledger.
        </p>
      </div>

      {/* Vertically Scrollable Tedious Form Inputs */}
      <form onSubmit={handleSubmit} className="space-y-3.5 my-2 py-2 z-10 w-full overflow-y-auto pr-2 max-h-[460px] custom-scrollbar">
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-900/90 border border-rose-400 text-rose-100 text-xs font-mono text-center shadow-md">
            {errorMsg}
          </div>
        )}

        {/* FOX 1 - Locked Section (Rendered when foxCount >= 1) */}
        {foxCount >= 1 && (
          <div className="bg-black/40 border border-amber-400/30 rounded-2xl p-3.5 space-y-2 opacity-75 shadow-inner">
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold font-serif-magical text-amber-300">
                <span>🔒</span>
                <span>FOX 1 (Ember spark)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 uppercase">
                Molded & Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300 pt-1">
              <div><span className="text-amber-200">Name:</span> Ember spark</div>
              <div><span className="text-amber-200">Essence:</span> 🔥 Red Flame</div>
              <div><span className="text-amber-200">Legs:</span> 4</div>
              <div><span className="text-amber-200">Tails:</span> 1</div>
              <div><span className="text-amber-200">Eyes:</span> 👁️ Glowing Amber</div>
              <div><span className="text-amber-200">Aura:</span> ✨ Arcane Sparks</div>
              <div><span className="text-amber-200">Pattern:</span> 🦊 Solid Ember</div>
              <div><span className="text-amber-200">Ears:</span> 🦊 Pointed</div>
              <div><span className="text-amber-200">Temperament:</span> 🎭 Playful</div>
              <div><span className="text-amber-200">Paws:</span> 🐾 Velvet Soft</div>
            </div>
          </div>
        )}

        {/* FOX 2 - Locked Section (Rendered when foxCount >= 2) */}
        {foxCount >= 2 && (
          <div className="bg-black/40 border border-amber-400/30 rounded-2xl p-3.5 space-y-2 opacity-75 shadow-inner">
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold font-serif-magical text-amber-300">
                <span>🔒</span>
                <span>FOX 2 (Azure Glint)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40 uppercase">
                Molded & Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300 pt-1">
              <div><span className="text-amber-200">Name:</span> Azure Glint</div>
              <div><span className="text-amber-200">Essence:</span> 🌙 Silver Moon</div>
              <div><span className="text-amber-200">Legs:</span> 4</div>
              <div><span className="text-amber-200">Tails:</span> 1</div>
              <div><span className="text-amber-200">Eyes:</span> 👁️ Sapphire Blue</div>
              <div><span className="text-amber-200">Aura:</span> 🌟 Flame Shimmer</div>
              <div><span className="text-amber-200">Pattern:</span> 🦊 Tiger Stripes</div>
              <div><span className="text-amber-200">Ears:</span> 🦊 Curved</div>
              <div><span className="text-amber-200">Temperament:</span> 🎭 Wise</div>
              <div><span className="text-amber-200">Paws:</span> 🐾 Flame Touched</div>
            </div>
          </div>
        )}

        {/* FOX Section Header for New Creature */}
        {foxCount >= 1 && (
          <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
            <span className="text-sm">🔓</span>
            <h3 className="text-xs font-bold font-serif-magical text-amber-300 uppercase tracking-wider">
              {foxCount >= 2 ? 'FOX 3 (New Creature)' : 'FOX 2 (New Creature)'}
            </h3>
          </div>
        )}

        {/* Creature Name */}

        <div className="space-y-1">
          <label htmlFor="creature-name" className="block text-xs font-serif-magical font-bold text-amber-200 uppercase tracking-wider">
            Creature Name <span className="text-orange-400">*</span>
          </label>
          <input
            id="creature-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={foxCount >= 2 ? "e.g. Zephyr Whispers" : "e.g. Ember Spark"}
            required
            className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm font-sans-rounded font-bold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
        </div>

        {/* Essence (Fur Color) */}
        <div className="space-y-1">
          <label htmlFor="creature-essence" className="block text-xs font-serif-magical font-bold text-amber-200 uppercase tracking-wider">
            Essence (Fur Color)
          </label>
          <select
            id="creature-essence"
            value={essence}
            onChange={(e) => setEssence(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm font-sans-rounded font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
          >
            <option value="Red Flame">🔥 Red Flame</option>
            <option value="Silver Moon">🌙 Silver Moon</option>
            <option value="Midnight Black">🌌 Midnight Black</option>
            <option value="Golden Sun">☀️ Golden Sun</option>
          </select>
        </div>

        {/* Legs & Tails Inputs Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label htmlFor="creature-legs" className="block text-xs font-serif-magical font-bold text-amber-200 uppercase tracking-wider">
              Legs (Type 4) <span className="text-orange-400">*</span>
            </label>
            <input
              id="creature-legs"
              type="number"
              value={legs}
              onChange={(e) => setLegs(e.target.value)}
              placeholder="4"
              required
              className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm font-sans-rounded font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-center"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="creature-tails" className="block text-xs font-serif-magical font-bold text-amber-200 uppercase tracking-wider">
              Tails (Type 1) <span className="text-orange-400">*</span>
            </label>
            <input
              id="creature-tails"
              type="number"
              value={tails}
              onChange={(e) => setTails(e.target.value)}
              placeholder="1"
              required
              className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm font-sans-rounded font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-center"
            />
          </div>
        </div>

        {/* Eye Color */}
        <div className="space-y-1">
          <label htmlFor="creature-eyes" className="block text-xs font-serif-magical font-bold text-amber-200 uppercase tracking-wider">
            Eye Color
          </label>
          <select
            id="creature-eyes"
            value={eyeColor}
            onChange={(e) => setEyeColor(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm font-sans-rounded font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
          >
            <option value="Glowing Amber">👁️ Glowing Amber</option>
            <option value="Emerald Green">👁️ Emerald Green</option>
            <option value="Sapphire Blue">👁️ Sapphire Blue</option>
            <option value="Amethyst Purple">👁️ Amethyst Purple</option>
          </select>
        </div>

        {/* Magical Aura */}
        <div className="space-y-1">
          <label htmlFor="creature-aura" className="block text-xs font-serif-magical font-bold text-amber-200 uppercase tracking-wider">
            Aura Type
          </label>
          <select
            id="creature-aura"
            value={aura}
            onChange={(e) => setAura(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm font-sans-rounded font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
          >
            <option value="Arcane Sparks">✨ Arcane Sparks</option>
            <option value="Flame Shimmer">🌟 Flame Shimmer</option>
            <option value="Starlight Glow">💫 Starlight Glow</option>
            <option value="Void Whisper">🌀 Void Whisper</option>
          </select>
        </div>

        {/* Fur Pattern */}
        <div className="space-y-1">
          <label htmlFor="creature-pattern" className="block text-xs font-serif-magical font-bold text-amber-200 uppercase tracking-wider">
            Fur Pattern
          </label>
          <select
            id="creature-pattern"
            value={furPattern}
            onChange={(e) => setFurPattern(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm font-sans-rounded font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
          >
            <option value="Solid Ember">🦊 Solid Ember</option>
            <option value="Tiger Stripes">🦊 Tiger Stripes</option>
            <option value="Celestial Dots">🦊 Celestial Dots</option>
            <option value="Flame Tips">🦊 Flame Tips</option>
          </select>
        </div>

        {/* Ear Shape */}
        <div className="space-y-1">
          <label htmlFor="creature-ears" className="block text-xs font-serif-magical font-bold text-amber-200 uppercase tracking-wider">
            Ear Shape
          </label>
          <select
            id="creature-ears"
            value={earShape}
            onChange={(e) => setEarShape(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm font-sans-rounded font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
          >
            <option value="Pointed">🦊 Pointed</option>
            <option value="Curved">🦊 Curved</option>
            <option value="Tufted">🦊 Tufted</option>
            <option value="Fluffy">🦊 Fluffy</option>
          </select>
        </div>

        {/* Temperament */}
        <div className="space-y-1">
          <label htmlFor="creature-temperament" className="block text-xs font-serif-magical font-bold text-amber-200 uppercase tracking-wider">
            Temperament
          </label>
          <select
            id="creature-temperament"
            value={temperament}
            onChange={(e) => setTemperament(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm font-sans-rounded font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
          >
            <option value="Playful">🎭 Playful</option>
            <option value="Fierce">🎭 Fierce</option>
            <option value="Wise">🎭 Wise</option>
            <option value="Mischievous">🎭 Mischievous</option>
          </select>
        </div>

        {/* Paws */}
        <div className="space-y-1">
          <label htmlFor="creature-paws" className="block text-xs font-serif-magical font-bold text-amber-200 uppercase tracking-wider">
            Paws
          </label>
          <select
            id="creature-paws"
            value={paws}
            onChange={(e) => setPaws(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-sm font-sans-rounded font-bold text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer [&>option]:bg-slate-900 [&>option]:text-white"
          >
            <option value="Velvet Soft">🐾 Velvet Soft</option>
            <option value="Flame Touched">🐾 Flame Touched</option>
            <option value="Shadow Silent">🐾 Shadow Silent</option>
            <option value="Golden Claws">🐾 Golden Claws</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.04, textShadow: '0px 0px 8px rgb(255,255,255)' }}
            whileTap={{ scale: 0.92 }}
            type="submit"
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold font-serif-magical tracking-wider text-xs sm:text-sm shadow-[0_4px_25px_rgba(249,115,22,0.5)] border border-white/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <span>
              {foxCount >= 2
                ? 'MOLD FINAL FOX ➜'
                : foxCount === 1
                ? 'MOLD ANOTHER FOX ➜'
                : 'HELP ME MOLD A FOX ➜'}
            </span>
          </motion.button>
        </div>

      </form>

      {/* Footer Instructions */}
      <div className="border-t border-white/15 pt-2 text-[11px] font-mono text-slate-300 font-semibold flex items-center justify-between z-10 shrink-0">
        <span>Hand-Crafting Mode</span>
        <span className="text-amber-200 italic font-bold">Tedious repetition enforced...</span>
      </div>
    </div>
  );
}



