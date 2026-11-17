import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Choice } from '../../types/mission'
import CharacterLine from '../ui/CharacterLine'
import GlowButton from '../ui/GlowButton'

interface Props {
  prompt: string
  choices: Choice[]
  onResolved: (choice: Choice) => void
}

export default function ChoiceStep({ prompt, choices, onResolved }: Props) {
  const [picked, setPicked] = useState<Choice | null>(null)
  const [reactionDone, setReactionDone] = useState(false)

  if (!picked) {
    return (
      <div>
        <p className="text-white/90 text-lg mb-5 font-display tracking-wide">{prompt}</p>
        <div className="space-y-3">
          {choices.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setPicked(c)}
              className="w-full text-left px-4 py-3.5 rounded-sm border border-white/15 bg-white/5 hover:border-volt/60 hover:bg-volt/5 text-white/85 text-sm sm:text-[15px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-volt"
            >
              <span className="text-volt/70 font-mono-tight mr-2">{String.fromCharCode(65 + i)}.</span>
              {c.label}
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-md border p-4 mb-5 ${picked.best ? 'border-volt/40 bg-volt/5' : 'border-blood/40 bg-blood/5'}`}
        >
          <p className="text-[11px] uppercase tracking-widest font-mono-tight mb-2 text-white/50">
            Consequence
          </p>
          <p className="text-white/85 leading-relaxed text-sm sm:text-base">{picked.consequence}</p>
        </motion.div>
      </AnimatePresence>

      <CharacterLine speaker={picked.reaction.speaker} text={picked.reaction.text} onDone={() => setReactionDone(true)} />

      <div className="flex justify-end mt-6">
        {picked.best ? (
          <GlowButton variant="volt" disabled={!reactionDone} onClick={() => onResolved(picked)}>
            Continue
          </GlowButton>
        ) : (
          <GlowButton
            variant="blood"
            disabled={!reactionDone}
            onClick={() => {
              setPicked(null)
              setReactionDone(false)
            }}
          >
            Try Again
          </GlowButton>
        )}
      </div>
    </div>
  )
}
