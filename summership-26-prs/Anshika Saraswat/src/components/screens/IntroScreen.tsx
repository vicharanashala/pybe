import { motion } from 'framer-motion'
import GlowButton from '../ui/GlowButton'
import ParticleField from '../layout/ParticleField'

interface Props {
  onEnter: () => void
}

export default function IntroScreen({ onEnter }: Props) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      <ParticleField count={40} color="#7A00FF" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(229,9,20,0.18), transparent 60%)',
        }}
        aria-hidden="true"
      />

      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.5em' }}
        animate={{ opacity: 1, letterSpacing: '0.35em' }}
        transition={{ duration: 1.2 }}
        className="relative z-10 text-volt text-glow-volt text-xs sm:text-sm font-mono-tight uppercase mb-4"
      >
        Classified — Hawkins Division
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 font-display text-6xl sm:text-8xl text-blood text-glow-blood tracking-widest text-center leading-none"
      >
        FUNCTIONS
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.55 }}
        className="relative z-10 font-display text-2xl sm:text-4xl text-white/90 tracking-[0.3em] text-center mt-1"
      >
        FIELD MANUAL
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="relative z-10 max-w-lg text-center text-white/60 text-sm sm:text-base mt-6 leading-relaxed"
      >
        Rifts are opening across Hawkins. You've just been recruited. Learn Python functions
        the way the team learned to survive — mission by mission, choice by choice.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="relative z-10 mt-10"
      >
        <GlowButton variant="blood" onClick={onEnter} className="text-xl px-10 py-4">
          Accept Assignment
        </GlowButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="relative z-10 mt-14 text-[11px] text-white/30 font-mono-tight tracking-widest"
      >
        10 MISSIONS &middot; 1 FINAL PROTOCOL &middot; NO PRIOR PYTHON REQUIRED
      </motion.div>
    </div>
  )
}
