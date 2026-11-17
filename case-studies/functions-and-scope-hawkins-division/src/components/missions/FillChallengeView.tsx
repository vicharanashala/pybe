import { useState } from 'react'
import { motion } from 'framer-motion'
import type { FillChallenge } from '../../types/mission'

interface Props {
  challenge: FillChallenge
  onSuccess: () => void
}

export default function FillChallengeView({ challenge, onSuccess }: Props) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle')
  const [showHint, setShowHint] = useState(false)

  const [before, after] = challenge.codeTemplate.split('___')

  const check = () => {
    const normalized = value.trim().toLowerCase()
    const ok = challenge.acceptedAnswers.some((a) => a.toLowerCase() === normalized)
    if (ok) {
      setStatus('right')
      setTimeout(onSuccess, 650)
    } else {
      setStatus('wrong')
      setShowHint(true)
    }
  }

  return (
    <div>
      <p className="text-white/85 mb-4">{challenge.prompt}</p>
      <div className="rounded-md border border-volt/25 bg-[#050505] p-4 font-mono-tight text-[13px] sm:text-sm leading-relaxed overflow-x-auto">
        <pre className="whitespace-pre-wrap break-words">
          <span className="text-white/80">{before}</span>
          <input
            aria-label="Fill in the missing code"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setStatus('idle')
            }}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            className={`inline-block mx-1 px-2 py-0.5 rounded bg-white/10 border outline-none w-32 sm:w-40 text-center
              ${status === 'right' ? 'border-volt text-volt' : status === 'wrong' ? 'border-blood text-blood' : 'border-white/25 text-white focus:border-volt'}`}
            placeholder="___"
            spellCheck={false}
          />
          <span className="text-white/80">{after}</span>
        </pre>
      </div>

      {status === 'wrong' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-blood font-mono-tight">
          Not quite. {showHint ? challenge.hint : ''}
        </motion.p>
      )}
      {status === 'right' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-volt font-mono-tight">
          That's it. Locking it in...
        </motion.p>
      )}

      <div className="mt-4 flex gap-3">
        <button
          onClick={check}
          disabled={!value.trim() || status === 'right'}
          className="px-6 py-2.5 rounded-sm border border-volt text-volt uppercase tracking-wider text-sm font-display hover:bg-volt/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Run Code
        </button>
      </div>
    </div>
  )
}
