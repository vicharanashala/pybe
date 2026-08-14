import { motion } from 'framer-motion'
import type { ConceptReveal } from '../../types/mission'
import CodeBlock from '../ui/CodeBlock'
import GlowButton from '../ui/GlowButton'

interface Props {
  concept: ConceptReveal
  onContinue: () => void
}

export default function ConceptRevealView({ concept, onContinue }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 140, damping: 14 }}
        className="rounded-md border border-rift/40 bg-rift/5 p-5 sm:p-6 mb-5"
      >
        <p className="text-[11px] uppercase tracking-[0.2em] text-rift font-mono-tight mb-2">
          Concept Unlocked
        </p>
        <h3 className="font-display text-2xl sm:text-3xl text-glow-rift text-white tracking-wide mb-3">
          {concept.heading}
        </h3>
        <p className="text-white/85 italic mb-4 leading-relaxed">"{concept.insight}"</p>
        <p className="text-white/70 leading-relaxed text-sm sm:text-base">{concept.explanation}</p>
      </motion.div>

      <CodeBlock code={concept.code} label={concept.codeLabel} />

      <div className="mt-6 flex justify-end">
        <GlowButton variant="rift" onClick={onContinue}>
          Try It Yourself
        </GlowButton>
      </div>
    </motion.div>
  )
}
