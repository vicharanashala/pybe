import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MagicalScrollMadLibs({
  onUnlockFullEditor,
  onStepChange,
  onCodeForgedChange,
}) {
  const [tutorialStep, setTutorialStep] = useState(1);
  const [codeInputs, setCodeInputs] = useState({
    className: '',
    initMethod: '',
    selfArg: '',
    nameArg: 'name',
    selfAttr: '',
  });
  const [isCodeForged, setIsCodeForged] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isError, setIsError] = useState(false);
  const [draggedRune, setDraggedRune] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const isClassOk = codeInputs.className.trim().toLowerCase() === 'class';
  const isInitOk =
    codeInputs.initMethod.trim().toLowerCase() === '__init__' ||
    codeInputs.initMethod.trim().toLowerCase() === 'init';
  const isSelfOk = codeInputs.selfArg.trim().toLowerCase() === 'self';

  const checkValidation = (inputs) => {
    const classValid = inputs.className.trim().toLowerCase() === 'class';
    const initValid =
      inputs.initMethod.trim().toLowerCase() === '__init__' ||
      inputs.initMethod.trim().toLowerCase() === 'init';
    const selfValid = inputs.selfArg.trim().toLowerCase() === 'self';

    if (classValid && tutorialStep < 2) {
      setTutorialStep(2);
      if (onStepChange) onStepChange(2);
    }
    if (classValid && initValid && tutorialStep < 3) {
      setTutorialStep(3);
      if (onStepChange) onStepChange(3);
    }

    if (classValid && initValid && selfValid) {
      if (!isCodeForged) {
        setIsCodeForged(true);
        setIsError(false);
        if (onCodeForgedChange) onCodeForgedChange(true);
        setFeedback('✨ Master Blueprint Incantation Forged! Ready to Generate!');
      }
      return true;
    }
    return false;
  };

  const handleInputChange = (field, value) => {
    const updated = { ...codeInputs, [field]: value };
    setCodeInputs(updated);
    setIsError(false);
    checkValidation(updated);
  };

  // Drag Event Handlers
  const handleDragStart = (e, runeType) => {
    setDraggedRune(runeType);
    e.dataTransfer.setData('text/plain', runeType);
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  const handleDragOver = (e, slotName) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverSlot !== slotName) {
      setDragOverSlot(slotName);
    }
  };

  const handleDragLeave = (e, slotName) => {
    e.preventDefault();
    if (dragOverSlot === slotName) {
      setDragOverSlot(null);
    }
  };

  // Drop Handler with Detailed Educational Feedback
  const handleDrop = (e, slotName, expectedType) => {
    e.preventDefault();
    setDragOverSlot(null);

    const droppedRune = e.dataTransfer.getData('text/plain') || draggedRune;
    if (!droppedRune) return;

    let isCorrect = false;
    if (expectedType === 'class' && droppedRune === 'class') isCorrect = true;
    if (expectedType === 'init' && (droppedRune === 'init' || droppedRune === '__init__')) isCorrect = true;
    if (expectedType === 'self' && droppedRune === 'self') isCorrect = true;

    if (isCorrect) {
      let updated = { ...codeInputs };
      if (slotName === 'className') updated.className = 'class';
      if (slotName === 'initMethod') updated.initMethod = '__init__';
      if (slotName === 'selfArg') updated.selfArg = 'self';
      if (slotName === 'selfAttr') updated.selfAttr = 'self';

      setCodeInputs(updated);
      setIsError(false);
      checkValidation(updated);

      if (slotName === 'className') {
        setFeedback("✨ Perfect drop! 'class' declares the blueprint prototype header in Python.");
      } else if (slotName === 'initMethod') {
        setFeedback("🔥 Spot on! '__init__' is the special constructor method that initializes new objects.");
      } else if (slotName === 'selfArg' || slotName === 'selfAttr') {
        setFeedback("💎 Brilliant! 'self' represents the current instance being born and binds its attributes.");
      }
    } else {
      setIsError(true);
      if (slotName === 'className') {
        if (droppedRune === 'self') {
          setFeedback("❌ Wrong slot! 'self' is used inside methods to access instance traits, not to define a blueprint class. Drop 'class' here!");
        } else if (droppedRune === 'init') {
          setFeedback("❌ Wrong slot! '__init__' is the constructor method inside a class. To declare the blueprint header, drop 'class' here!");
        } else {
          setFeedback("❌ Incorrect keyword! Use 'class' to declare a blueprint header.");
        }
      } else if (slotName === 'initMethod') {
        if (droppedRune === 'class') {
          setFeedback("❌ Wrong slot! 'class' defines the outer blueprint structure. Inside def, use the '__init__' constructor method!");
        } else if (droppedRune === 'self') {
          setFeedback("❌ Wrong slot! 'self' is a parameter inside method parentheses. The initializer method name itself must be 'init'!");
        } else {
          setFeedback("❌ Incorrect keyword! Use 'init' or '__init__' for the constructor method.");
        }
      } else if (slotName === 'selfArg') {
        if (droppedRune === 'class') {
          setFeedback("❌ Wrong slot! 'class' is a top-level keyword! Inside method parentheses, the first parameter targeting the object must be 'self'.");
        } else if (droppedRune === 'init') {
          setFeedback("❌ Wrong slot! '__init__' is the method name! Inside the parentheses, the first parameter targeting the object is 'self'.");
        } else {
          setFeedback("❌ Incorrect parameter! The first parameter in Python methods must be 'self'.");
        }
      }
    }
    setDraggedRune(null);
  };

  const handleRuneClick = (runeType) => {
    let updated = { ...codeInputs };
    if (runeType === 'class') {
      if (!isClassOk) {
        updated.className = 'class';
        setIsError(false);
        setFeedback("✨ Placed 'class' rune in blueprint header!");
      } else {
        setFeedback("ℹ️ 'class' rune is already correctly placed!");
      }
    } else if (runeType === 'init') {
      if (!isInitOk) {
        updated.initMethod = '__init__';
        setIsError(false);
        setFeedback("🔥 Placed '__init__' rune in method declaration!");
      } else {
        setFeedback("ℹ️ '__init__' rune is already correctly placed!");
      }
    } else if (runeType === 'self') {
      if (!isSelfOk) {
        updated.selfArg = 'self';
        setIsError(false);
        setFeedback("💎 Placed 'self' rune in method parameter!");
      } else {
        updated.selfAttr = 'self';
        setFeedback("💎 'self' parameter already bound!");
      }
    }
    setCodeInputs(updated);
    checkValidation(updated);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const forged = checkValidation(codeInputs);
    if (forged || isCodeForged) {
      if (onUnlockFullEditor) {
        onUnlockFullEditor();
      }
    } else {
      setIsError(true);
      setFeedback("⚠️ Please drag and drop all required runes ('class', 'init', and 'self') into their correct slots!");
    }
  };

  return (
    <div className="w-full max-w-xl ml-auto h-full flex flex-col justify-between select-none relative p-1 gap-3">
      {/* 1. Frosted Glass Code Ledger Box */}
      <div className="w-full flex-1 p-[2px] rounded-3xl bg-gradient-to-br from-amber-400/70 via-emerald-500/80 to-amber-500/70 shadow-[0_0_40px_rgba(245,158,11,0.25)] relative overflow-hidden backdrop-blur-xl flex flex-col justify-between">
        
        {/* Ambient Glass Panel Content */}
        <div className="w-full h-full bg-black/80 rounded-[22px] p-5 sm:p-6 flex flex-col justify-between relative z-10 text-white overflow-y-auto">
          
          {/* Subtle Ambient Glow Orbs in Panel */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="space-y-1.5 border-b border-amber-500/30 pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="text-xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">📜</span>
                <h2 className="text-sm sm:text-base font-bold font-serif text-amber-300 tracking-wider uppercase drop-shadow">
                  THE BLUEPRINT INCANTATION LEDGER
                </h2>
              </div>
              <span className="text-[11px] font-mono bg-black/60 border border-emerald-400/50 text-emerald-300 px-3 py-1 rounded-full shadow-inner font-bold">
                Step {tutorialStep} / 3
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-300">
              Drag the glowing glass runes into their matching slots in the incantation ledger.
            </p>
          </div>

          {/* Feedback & Error Banner */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={isError ? { opacity: 1, y: 0, scale: 1, x: [-8, 8, -6, 6, 0] } : { opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`my-2 p-3 rounded-xl text-xs font-mono text-center font-bold shadow-xl backdrop-blur-md leading-relaxed border ${
                  isError
                    ? 'bg-rose-950/90 border-rose-500/80 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : isCodeForged
                    ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                    : 'bg-amber-950/90 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                }`}
              >
                {feedback}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Glowing Monospace Code Block with Interactive Drop Zones */}
          <div className="my-auto py-2 space-y-4">
            <div className="bg-[#080d12]/95 p-4 sm:p-5 rounded-2xl border border-emerald-500/40 shadow-[inset_0_0_25px_rgba(0,0,0,0.9)] font-mono text-xs sm:text-sm leading-relaxed space-y-3 relative overflow-hidden">
              
              {/* Monospace Code Comments */}
              <div className="text-slate-400 text-[11px] italic flex items-center justify-between">
                <span># Drag & Drop keywords to build the Fox class</span>
                <span className="text-[10px] text-amber-400/80 font-mono">Python 3</span>
              </div>

              {/* Code Line 1: [class] Fox: */}
              <div className="flex items-center space-x-2 flex-wrap text-slate-100 py-0.5">
                <span className="text-slate-500 select-none text-[11px] w-4">1</span>
                
                {/* [class] Drop Target Slot */}
                <div
                  onDragOver={(e) => handleDragOver(e, 'className')}
                  onDragLeave={(e) => handleDragLeave(e, 'className')}
                  onDrop={(e) => handleDrop(e, 'className', 'class')}
                  className={`relative flex items-center justify-center transition-all duration-300 rounded-lg ${
                    dragOverSlot === 'className'
                      ? 'border-2 border-dashed border-amber-300 bg-amber-500/20 scale-105 shadow-[0_0_20px_rgba(251,191,36,0.8)]'
                      : isClassOk
                      ? 'border border-emerald-400/80 bg-emerald-950/60 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                      : 'border-2 border-dashed border-amber-500/60 bg-black/60 shadow-inner'
                  }`}
                >
                  <input
                    type="text"
                    value={codeInputs.className}
                    onChange={(e) => handleInputChange('className', e.target.value)}
                    placeholder="[ class ]"
                    required
                    className={`w-24 px-2.5 py-1 rounded-lg bg-transparent border-none font-bold font-mono text-center focus:outline-none transition-all duration-300 text-xs sm:text-sm ${
                      isClassOk ? 'text-amber-300 font-extrabold' : 'text-amber-400/80 placeholder:text-amber-400/50'
                    }`}
                  />
                </div>

                <span className="text-amber-300 font-bold text-sm sm:text-base">Fox</span>
                <span className="text-white font-bold text-sm sm:text-base">:</span>
              </div>

              {/* Indented Block */}
              <div className="pl-6 space-y-2.5 text-xs border-l border-amber-500/20">
                {/* Code Line 2: def [__init__]([self], [name]): */}
                <div className="flex items-center space-x-1.5 flex-wrap py-0.5">
                  <span className="text-slate-500 select-none text-[11px] w-4 -ml-4">2</span>
                  <span className="text-orange-400 font-bold drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]">def</span>
                  
                  {/* [__init__] Drop Target Slot */}
                  <div
                    onDragOver={(e) => handleDragOver(e, 'initMethod')}
                    onDragLeave={(e) => handleDragLeave(e, 'initMethod')}
                    onDrop={(e) => handleDrop(e, 'initMethod', 'init')}
                    className={`relative flex items-center justify-center transition-all duration-300 rounded-lg ${
                      dragOverSlot === 'initMethod'
                        ? 'border-2 border-dashed border-orange-400 bg-orange-500/20 scale-105 shadow-[0_0_20px_rgba(249,115,22,0.8)]'
                        : isInitOk
                        ? 'border border-emerald-400/80 bg-emerald-950/60 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                        : 'border-2 border-dashed border-orange-400/60 bg-black/60 shadow-inner'
                    }`}
                  >
                    <input
                      type="text"
                      value={codeInputs.initMethod}
                      onChange={(e) => handleInputChange('initMethod', e.target.value)}
                      placeholder="[ init ]"
                      required
                      className={`w-24 px-2 py-0.5 rounded-lg bg-transparent border-none font-bold font-mono text-center focus:outline-none transition-all duration-300 text-xs ${
                        isInitOk ? 'text-orange-400 font-extrabold' : 'text-yellow-300/80 placeholder:text-yellow-400/50'
                      }`}
                    />
                  </div>

                  <span className="text-white">(</span>
                  
                  {/* [self] Drop Target Slot */}
                  <div
                    onDragOver={(e) => handleDragOver(e, 'selfArg')}
                    onDragLeave={(e) => handleDragLeave(e, 'selfArg')}
                    onDrop={(e) => handleDrop(e, 'selfArg', 'self')}
                    className={`relative flex items-center justify-center transition-all duration-300 rounded-lg ${
                      dragOverSlot === 'selfArg'
                        ? 'border-2 border-dashed border-sky-300 bg-sky-500/20 scale-105 shadow-[0_0_20px_rgba(56,189,248,0.8)]'
                        : isSelfOk
                        ? 'border border-emerald-400/80 bg-emerald-950/60 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                        : 'border-2 border-dashed border-sky-400/60 bg-black/60 shadow-inner'
                    }`}
                  >
                    <input
                      type="text"
                      value={codeInputs.selfArg}
                      onChange={(e) => handleInputChange('selfArg', e.target.value)}
                      placeholder="[ self ]"
                      required
                      className={`w-16 px-2 py-0.5 rounded-lg bg-transparent border-none font-bold font-mono text-center focus:outline-none transition-all duration-300 text-xs ${
                        isSelfOk ? 'text-sky-300 font-extrabold' : 'text-sky-300/80 placeholder:text-sky-300/50'
                      }`}
                    />
                  </div>

                  <span className="text-white">,</span>

                  {/* Distinct Illuminated [name] input field */}
                  <div className="relative inline-block">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-amber-400 rounded-lg blur-[3px] opacity-75 animate-pulse" />
                    <input
                      type="text"
                      value={codeInputs.nameArg}
                      onChange={(e) => handleInputChange('nameArg', e.target.value)}
                      placeholder="name"
                      required
                      className="relative px-2.5 py-0.5 rounded-lg bg-[#071927] border border-cyan-400 text-cyan-200 font-bold font-mono text-center focus:outline-none text-xs shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                    />
                  </div>

                  <span className="text-white font-bold">:</span>
                </div>

                {/* Code Line 3+: Method Body */}
                <div className="pl-4 space-y-1.5 font-mono text-[11px] text-slate-200">
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500 select-none text-[11px] w-4 -ml-8">3</span>
                    <span className="text-sky-300 font-bold">self</span>
                    <span className="text-white">.name = name</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500 select-none text-[11px] w-4 -ml-8">4</span>
                    <span className="text-sky-300 font-bold">self</span>
                    <span className="text-white">.legs =</span>
                    <span className="text-emerald-400 font-bold"> 4</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500 select-none text-[11px] w-4 -ml-8">5</span>
                    <span className="text-sky-300 font-bold">self</span>
                    <span className="text-white">.tails =</span>
                    <span className="text-emerald-400 font-bold"> 1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Draggable Glass Rune Stone Buttons */}
            <div className="pt-1 flex flex-col items-end space-y-2">
              <div className="text-[10px] font-mono text-amber-300/90 tracking-wider uppercase font-semibold flex items-center space-x-1.5">
                <span className="animate-pulse">✋ Drag Runes to Code Slots (or Click):</span>
              </div>

              {/* 4 Distinct Rounded Draggable Glowing Stone Rune Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap justify-end relative">
                {/* Rune Button 1: "self" */}
                <motion.div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'self')}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleRuneClick('self')}
                  className={`px-3.5 py-1.5 rounded-2xl bg-gradient-to-b from-sky-950/90 via-black/80 to-slate-900/90 border font-mono font-extrabold text-xs shadow-lg transition-all cursor-grab active:cursor-grabbing flex items-center space-x-1.5 ${
                    isSelfOk
                      ? 'border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.6)]'
                      : 'border-sky-400/80 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:border-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                  }`}
                >
                  <span className="text-xs">💎</span>
                  <span>self</span>
                </motion.div>

                {/* Rune Button 2: "self" */}
                <motion.div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'self')}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleRuneClick('self')}
                  className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-b from-sky-950/90 via-black/80 to-slate-900/90 border border-sky-400/80 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:border-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.6)] font-mono font-extrabold text-xs transition-all cursor-grab active:cursor-grabbing flex items-center space-x-1.5"
                >
                  <span className="text-xs">💎</span>
                  <span>self</span>
                </motion.div>

                {/* Rune Button 3: "class" */}
                <motion.div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'class')}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleRuneClick('class')}
                  className={`px-3.5 py-1.5 rounded-2xl bg-gradient-to-b from-amber-950/90 via-black/80 to-slate-900/90 border font-mono font-extrabold text-xs shadow-lg transition-all cursor-grab active:cursor-grabbing flex items-center space-x-1.5 ${
                    isClassOk
                      ? 'border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.6)]'
                      : 'border-amber-400/80 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.5)] hover:border-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                  }`}
                >
                  <span className="text-xs">🔮</span>
                  <span>class</span>
                </motion.div>

                {/* Rune Button 4: "init" */}
                <motion.div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'init')}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleRuneClick('init')}
                  className={`px-3.5 py-1.5 rounded-2xl bg-gradient-to-b from-orange-950/90 via-black/80 to-slate-900/90 border font-mono font-extrabold text-xs shadow-lg transition-all cursor-grab active:cursor-grabbing flex items-center space-x-1.5 ${
                    isInitOk
                      ? 'border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.6)]'
                      : 'border-orange-400/80 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.5)] hover:border-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                  }`}
                >
                  <span className="text-xs">🔥</span>
                  <span>init</span>
                </motion.div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Action Button (OUTSIDE the code box, positioned below the ledger) */}
      <div className="w-full shrink-0 relative pt-1">
        {/* Particle Sparkles & Lens Flare around action button */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/30 via-orange-500/40 to-amber-500/30 rounded-full blur-md opacity-70 animate-pulse pointer-events-none" />
        
        <motion.button
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSubmit}
          className="relative w-full py-3.5 sm:py-4 px-6 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-bold font-serif tracking-wider text-xs sm:text-sm shadow-[0_0_35px_rgba(249,115,22,0.6)] border border-amber-300/50 flex items-center justify-center space-x-3 cursor-pointer transition-all duration-300"
        >
          {/* Left side: small glowing fox head icon */}
          <div className="w-7 h-7 rounded-full bg-black/40 border border-amber-300/60 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(251,191,36,0.6)] shrink-0">
            🦊
          </div>

          {/* Right side: text */}
          <span className="font-extrabold tracking-wider text-white text-xs sm:text-sm drop-shadow">
            GENERATE THE FINAL BLUEPRINT
          </span>
        </motion.button>
      </div>
    </div>
  );
}
