import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MCQChallenge } from '../../types/mission'

interface Props {
  challenge: MCQChallenge
  onSuccess: () => void
}

export default function MCQChallengeView({ challenge, onSuccess }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)

  const selected = challenge.options.find((o) => o.id === selectedId)

  const handleSelect = (id: string) => {
    setSelectedId(id)
    const opt = challenge.options.find((o) => o.id === id)
    if (opt?.correct) setSolved(true)
  }

  return (
    <div>
      <p className="text-white/85 mb-4">{challenge.prompt}</p>
      <div className="space-y-2" role="radiogroup" aria-label={challenge.prompt}>
        {challenge.options.map((opt) => {
          const isSelected = selectedId === opt.id
          const showCorrect = isSelected && opt.correct
          const showWrong = isSelected && !opt.correct
          return (
            <button
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(opt.id)}
              disabled={solved}
              className={`w-full text-left px-4 py-3 rounded-sm border text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-volt
                ${showCorrect ? 'border-volt bg-volt/10 text-volt' : showWrong ? 'border-blood bg-blood/10 text-blood' : 'border-white/15 bg-white/5 text-white/85 hover:border-white/35'}
                ${solved && !isSelected ? 'opacity-40' : ''}`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
      <AnimatePresence mode="wait">
        {selected && (
          <motion.p
            key={selected.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-sm font-mono-tight ${selected.correct ? 'text-volt' : 'text-blood'}`}
          >
            {selected.hint}
          </motion.p>
        )}
      </AnimatePresence>
      {solved && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onSuccess}
          className="mt-5 px-6 py-2.5 rounded-sm border border-volt text-volt uppercase tracking-wider text-sm font-display hover:bg-volt/10"
        >
          Continue {'\u2192'}
        </motion.button>
      )}
    </div>
  )
}
