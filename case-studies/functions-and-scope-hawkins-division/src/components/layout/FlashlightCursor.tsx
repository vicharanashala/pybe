import { useEffect, useRef, useState } from 'react'

export default function FlashlightCursor() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [enabled, setEnabled] = useState(true)
  const raf = useRef<number | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarse = window.matchMedia('(pointer: coarse)')
    setEnabled(!mq.matches && !coarse.matches)

    const handleMove = (e: MouseEvent) => {
      if (raf.current) cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }))
    }
    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [])

  if (!enabled || !pos) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 mix-blend-screen"
      aria-hidden="true"
      style={{
        background: `radial-gradient(circle 260px at ${pos.x}px ${pos.y}px, rgba(255,244,214,0.10), rgba(255,244,214,0.02) 45%, transparent 70%)`,
      }}
    />
  )
}
