import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { OrderChallenge } from '../../types/mission'

interface Props {
  challenge: OrderChallenge
  onSuccess: () => void
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  // Guard against an accidental already-correct shuffle
  if (copy.map((c) => c).join() === arr.map((c) => c).join() && arr.length > 1) {
    return [copy[1], copy[0], ...copy.slice(2)]
  }
  return copy
}

export default function OrderChallengeView({ challenge, onSuccess }: Props) {
  const initial = useMemo(() => shuffle(challenge.blocks), [challenge])
  const [order, setOrder] = useState(initial)
  const [dragId, setDragId] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>('idle')
  const [showHint, setShowHint] = useState(false)

  const move = (from: number, to: number) => {
    setOrder((prev) => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return
    const fromIndex = order.findIndex((b) => b.id === dragId)
    const toIndex = order.findIndex((b) => b.id === targetId)
    move(fromIndex, toIndex)
    setDragId(null)
    setStatus('idle')
  }

  const moveByButton = (index: number, dir: -1 | 1) => {
    const target = index + dir
    if (target < 0 || target >= order.length) return
    move(index, target)
    setStatus('idle')
  }

  const check = () => {
    const ok = order.every((b, i) => b.id === challenge.correctOrder[i])
    if (ok) {
      setStatus('right')
      setTimeout(onSuccess, 700)
    } else {
      setStatus('wrong')
      setShowHint(true)
    }
  }

  return (
    <div>
      <p className="text-white/85 mb-4">{challenge.prompt}</p>
      <ul className="space-y-2" aria-label="Reorderable code blocks">
        {order.map((block, i) => (
          <motion.li
            key={block.id}
            layout
            draggable
            onDragStart={() => setDragId(block.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(block.id)}
            className={`group flex items-stretch gap-2 rounded-md border bg-[#050505] font-mono-tight text-xs sm:text-sm cursor-grab active:cursor-grabbing
              ${status === 'right' ? 'border-volt' : status === 'wrong' ? 'border-blood/60' : 'border-white/15'}`}
          >
            <div className="flex flex-col justify-center px-2 text-white/25 select-none">
              <span aria-hidden="true">::</span>
            </div>
            <pre className="flex-1 whitespace-pre-wrap break-words px-1 py-3 text-white/85">{block.code}</pre>
            <div className="flex flex-col justify-center gap-1 pr-2">
              <button
                aria-label="Move up"
                onClick={() => moveByButton(i, -1)}
                className="text-white/40 hover:text-volt px-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-volt"
              >
                {'\u25B2'}
              </button>
              <button
                aria-label="Move down"
                onClick={() => moveByButton(i, 1)}
                className="text-white/40 hover:text-volt px-1 focus-visible:outline focus-visible:outline-1 focus-visible:outline-volt"
              >
                {'\u25BC'}
              </button>
            </div>
          </motion.li>
        ))}
      </ul>

      {status === 'wrong' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-blood font-mono-tight">
          Not running yet. {showHint ? challenge.hint : ''}
        </motion.p>
      )}
      {status === 'right' && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-volt font-mono-tight">
          Order confirmed. Executing...
        </motion.p>
      )}

      <button
        onClick={check}
        disabled={status === 'right'}
        className="mt-4 px-6 py-2.5 rounded-sm border border-volt text-volt uppercase tracking-wider text-sm font-display hover:bg-volt/10 disabled:opacity-30"
      >
        Run Code
      </button>
      <p className="mt-2 text-[11px] text-white/35 font-mono-tight">
        Drag blocks to reorder, or use the arrows on touch devices.
      </p>
    </div>
  )
}
