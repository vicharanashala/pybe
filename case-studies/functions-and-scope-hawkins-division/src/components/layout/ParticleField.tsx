import { useMemo } from 'react'

interface ParticleFieldProps {
  count?: number
  color?: string
}

export default function ParticleField({ count = 22, color = '#7A00FF' }: ParticleFieldProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 10 + Math.random() * 14,
        delay: Math.random() * 12,
        opacity: 0.25 + Math.random() * 0.4,
      })),
    [count]
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full animate-rise"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: p.opacity,
            boxShadow: `0 0 6px ${color}`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
