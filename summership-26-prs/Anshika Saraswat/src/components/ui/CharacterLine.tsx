import { motion } from 'framer-motion'
import type { Speaker } from '../../types/mission'
import Typewriter from './Typewriter'

interface CharacterMeta {
  name: string
  initials: string
  color: string
  glowClass: string
}

export const CHARACTERS: Record<Speaker, CharacterMeta> = {
  dustin: { name: 'Dustin', initials: 'DH', color: '#00C2FF', glowClass: 'border-glow-volt' },
  steve: { name: 'Steve', initials: 'SH', color: '#E50914', glowClass: 'border-glow-blood' },
  robin: { name: 'Robin', initials: 'RB', color: '#00C2FF', glowClass: 'border-glow-volt' },
  elle: { name: 'Elle', initials: 'EL', color: '#7A00FF', glowClass: '' },
  hopper: { name: 'Chief Hopper', initials: 'JH', color: '#E50914', glowClass: 'border-glow-blood' },
  system: { name: 'SYSTEM', initials: '//', color: '#8f8f8f', glowClass: '' },
}

interface CharacterLineProps {
  speaker: Speaker
  text: string
  animate?: boolean
  onDone?: () => void
}

export default function CharacterLine({ speaker, text, animate = true, onDone }: CharacterLineProps) {
  const meta = CHARACTERS[speaker]
  const isSystem = speaker === 'system'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex items-start gap-3 ${isSystem ? 'opacity-70' : ''}`}
    >
      <div
        className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono-tight text-[11px] font-semibold border"
        style={{ borderColor: meta.color, color: meta.color, boxShadow: `0 0 12px ${meta.color}55` }}
      >
        {meta.initials}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[11px] uppercase tracking-widest font-mono-tight mb-1"
          style={{ color: meta.color }}
        >
          {meta.name}
        </p>
        <div
          className={`rounded-md rounded-tl-none border border-white/10 bg-voidRaised/80 px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-[15px] leading-relaxed text-white/90 ${isSystem ? 'font-mono-tight italic' : ''}`}
        >
          {animate ? <Typewriter text={text} onDone={onDone} /> : text}
        </div>
      </div>
    </motion.div>
  )
}
