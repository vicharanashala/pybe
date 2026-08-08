import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import type { DialogueLine } from '../../types/mission'
import CharacterLine from '../ui/CharacterLine'
import GlowButton from '../ui/GlowButton'

interface Props {
  lines: DialogueLine[]
  onComplete: () => void
}

export default function StoryStep({ lines, onComplete }: Props) {
  const [visibleCount, setVisibleCount] = useState(1)
  const [typingDone, setTypingDone] = useState(false)

  const isLast = visibleCount >= lines.length

  const advance = () => {
    if (!typingDone) return
    if (isLast) {
      onComplete()
    } else {
      setVisibleCount((c) => c + 1)
      setTypingDone(false)
    }
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        <AnimatePresence initial={false}>
          {lines.slice(0, visibleCount).map((line, i) => (
            <CharacterLine
              key={i}
              speaker={line.speaker}
              text={line.text}
              animate={i === visibleCount - 1}
              onDone={() => setTypingDone(true)}
            />
          ))}
        </AnimatePresence>
      </div>
      <div className="flex justify-end">
        <GlowButton variant="volt" onClick={advance} disabled={!typingDone}>
          {isLast ? 'Continue' : 'Next'}
        </GlowButton>
      </div>
    </div>
  )
}
