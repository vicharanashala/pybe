import { useEffect, useRef, useState } from 'react'

interface TypewriterProps {
  text: string
  speed?: number
  onDone?: () => void
  className?: string
}

export default function Typewriter({ text, speed = 18, onDone, className = '' }: TypewriterProps) {
  const [shown, setShown] = useState('')
  const doneRef = useRef(false)

  useEffect(() => {
    doneRef.current = false
    setShown('')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      setShown(text)
      if (!doneRef.current) {
        doneRef.current = true
        onDone?.()
      }
      return
    }

    let i = 0
    const interval = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        if (!doneRef.current) {
          doneRef.current = true
          onDone?.()
        }
      }
    }, speed)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <span className={className}>
      {shown}
      {shown.length < text.length && <span className="animate-pulseGlow">{'\u2588'}</span>}
    </span>
  )
}
