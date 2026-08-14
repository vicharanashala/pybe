import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicalLedger from './MagicalLedger';
import MagicalEditor from './components/MagicalEditor';
import MagicalScrollMadLibs from './MagicalScrollMadLibs';
import SummoningLedger from './components/SummoningLedger';
import BlueprintSuccessLedger from './components/BlueprintSuccessLedger';

/**
 * Visual Novel State Machine Stages:
 * 'intro' -> 'molding_1' -> 'molding_2' -> 'molding_3' -> 'exhaustion' -> 'epiphany' -> 'fill_in_the_blank' -> 'blueprint_success' -> 'summoning' -> 'full_editor'
 */
export default function RightPanelManager({ triggerOrionDialogue, onStageChange, initialStage = 'molding_1' }) {
  const [activeStage, setActiveStage] = useState(initialStage);
  const [foxesCrafted, setFoxesCrafted] = useState(0);

  useEffect(() => {
    if (initialStage && initialStage !== activeStage) {
      setActiveStage(initialStage);
    }
  }, [initialStage]);

  const setStage = (newStage, dialogueText) => {
    setActiveStage(newStage);
    if (onStageChange) onStageChange(newStage);
    if (triggerOrionDialogue && dialogueText) triggerOrionDialogue(dialogueText);
  };

  const handleMoldFox = (creatureData) => {
    const newCount = foxesCrafted + 1;
    setFoxesCrafted(newCount);

    if (activeStage === 'molding_1') {
      setStage(
        'molding_2',
        "Wonderful, Ember spark breathes! Our first guardian. But let's not stop—the Whispering Woods needs many more to heal. Let us forge another, this time with a different essence, perhaps?"
      );
    } else if (activeStage === 'molding_2') {
      setStage(
        'molding_3',
        "Two guardians now grace our woods! But the magic is still unstable. We need just one more to complete the trio. Keep going, apprentice. Precision is key—do not let the repetition break your focus!"
      );
    } else if (activeStage === 'molding_3') {
      // Transition to Exhaustion stage
      setStage(
        'exhaustion',
        `"Your fingers are completely exhausted! Typing every single attribute for every single creature by hand... There MUST be a better way!"`
      );

      // Auto-transition to Epiphany after 4 seconds
      setTimeout(() => {
        setStage(
          'epiphany',
          `"Master Orion reaches into his robes and pulls out a glowing Midnight Parchment! 'Behold the secret of Python Classes! Unfold the blueprint scroll!'"`,
        );
      }, 4000);
    }
  };

  const handleUnfoldBlueprint = () => {
    setStage(
      'fill_in_the_blank',
      `"Listen closely, apprentice. Before we can manifest any creature, we must define its essence using a class. Think of a class not as the creature itself, and as the Dhancha—the architectural blueprint or rubber stamp. It holds the rules every it to relet have legs and a tall, but it doesn't give the le le .you in programming, a class is a user-defined prototype that bundles d |"`
    );
  };

  const handleUnlockBlueprintSuccess = () => {
    setStage(
      'blueprint_success',
      "It worked! The incantation holds! We didn't need to sculpt a hundred creatures by hand—we forged a living Class! Now, this master Dhancha stands ready, allowing us to summon as many guardians as we desire with a single command!"
    );
  };

  const handleUnlockSummoning = () => {
    setStage(
      'summoning',
      "The Dhancha is locked in, but a blueprint alone doesn't walk the path. Now, we perform the ritual of Instantiation. Watch what happens when we invoke the class name and pass unique arguments like a name and an essence. Fill in the invocation scroll!"
    );
  };

  const handleUnlockFullEditor = () => {
    setStage(
      'full_editor',
      `"Unbelievable work, apprentice! The full Python CodeMirror Editor is now unlocked. Cast spells with Pyodide WASM!"`
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent overflow-hidden relative select-none p-2 justify-center items-center">
      <AnimatePresence mode="wait">
        {/* MOLDING STAGES (1, 2, 3) */}
        {(activeStage === 'molding_1' || activeStage === 'molding_2' || activeStage === 'molding_3') && (
          <motion.div
            key="molding"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <MagicalLedger onCraft={handleMoldFox} foxCount={foxesCrafted} />
          </motion.div>
        )}

        {/* EXHAUSTION STAGE */}
        {activeStage === 'exhaustion' && (
          <motion.div
            key="exhaustion"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full max-w-lg mx-auto flex flex-col items-center justify-center p-8 text-center bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-3xl text-white"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 rounded-full bg-black/40 border-2 border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.4)] flex items-center justify-center mb-6 text-5xl"
            >
              😓
            </motion.div>

            <h3 className="text-2xl font-bold font-serif-magical text-amber-300 mb-3">
              Fingers Exhausted...
            </h3>
            <p className="text-sm font-sans-rounded font-semibold text-slate-200 max-w-md leading-relaxed mb-6">
              Molded {foxesCrafted} foxes manually... Typing Name, Essence, Legs (4), and Tails (1) over and over is too tedious!
            </p>

            <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-200 bg-black/40 px-4 py-2 rounded-full border border-orange-400/40 shadow-inner font-bold">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span>Orion is unfolding a solution in 4s...</span>
            </div>
          </motion.div>
        )}

        {/* EPIPHANY STAGE */}
        {activeStage === 'epiphany' && (
          <motion.div
            key="epiphany"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
            className="w-full h-full max-w-lg mx-auto flex flex-col items-center justify-between p-8 text-center bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-3xl text-white"
          >
            <div className="space-y-4 my-auto">
              <motion.div
                animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-24 h-24 rounded-full bg-black/40 border-2 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)] mx-auto flex items-center justify-center text-5xl"
              >
                📜✨
              </motion.div>

              <h2 className="text-2xl font-bold font-serif-magical text-amber-300">
                The Blueprint Epiphany!
              </h2>

              <p className="text-sm font-sans-rounded font-semibold text-slate-200 leading-relaxed max-w-md mx-auto">
                Instead of hand-crafting every creature and typing 4 legs / 1 tail manually, a <span className="font-mono font-bold text-amber-300">Class</span> is a reusable Blueprint that instantiates infinite foxes instantly!
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, textShadow: '0px 0px 8px rgb(255,255,255)' }}
              whileTap={{ scale: 0.92 }}
              onClick={handleUnfoldBlueprint}
              className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold font-serif-magical tracking-wider text-sm shadow-[0_4px_25px_rgba(249,115,22,0.5)] border border-white/20 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span>📜 Unfold Blueprint Scroll</span>
            </motion.button>
          </motion.div>
        )}

        {/* FILL IN THE BLANK STAGE */}
        {activeStage === 'fill_in_the_blank' && (
          <motion.div
            key="fill_in_the_blank"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <MagicalScrollMadLibs
              onUnlockFullEditor={handleUnlockBlueprintSuccess}
              onStepChange={(step) => {
                if (step === 2) {
                  triggerOrionDialogue(
                    "A blueprint alone remains flat on the desk. To awaken it into reality, we need an initializer spell: __init__. In Python, this is a special constructor method. The moment you decide to mint a new creature, the universe automatically invokes __init__, injecting raw energy and custom attributes (like a unique name or essence) into the brand-new form right as it is born!"
                  );
                } else if (step === 3) {
                  triggerOrionDialogue(
                    "Now, the final secret: self. Imagine I wave my wand to paint a tail crimson red. Without a target, the magic might accidentally paint my own beard red! self is the targeting rune representing the current instance being born. It tells the magic: 'Apply these specific traits to this exact fox currently standing on the workbench, and keep it separate from all other foxes.' Now, complete the incantation ledger!"
                  );
                }
              }}
            />
          </motion.div>
        )}

        {/* BLUEPRINT SUCCESS STAGE */}
        {(activeStage === 'blueprint_success' || activeStage === 'blueprint_forged') && (
          <motion.div
            key="blueprint_success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <BlueprintSuccessLedger onProceed={handleUnlockSummoning} />
          </motion.div>
        )}

        {/* SUMMONING RITUAL STAGE */}
        {(activeStage === 'summoning' || activeStage === 'summoning_ritual') && (
          <motion.div
            key="summoning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <SummoningLedger
              onSummonSuccess={() => {
                triggerOrionDialogue(
                  "Magnificent! Look at them come to life! With a single class definition, we can mint infinite unique guardians without rewriting a single line of structural code. That is the ultimate elegance of Object-Oriented Programming!"
                );
              }}
              onUnlockFullEditor={handleUnlockFullEditor}
            />
          </motion.div>
        )}

        {/* FULL EDITOR STAGE */}
        {activeStage === 'full_editor' && (
          <motion.div
            key="full_editor"
            initial={{ opacity: 0, y: -150, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, mass: 1.2 }}
            className="w-full h-full"
          >
            <MagicalEditor />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
