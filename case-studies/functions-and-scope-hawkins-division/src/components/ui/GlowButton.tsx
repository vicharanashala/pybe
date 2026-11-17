import { motion } from 'framer-motion'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'blood' | 'volt' | 'rift' | 'ghost'

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  fullWidth?: boolean
}

const variantClasses: Record<Variant, string> = {
  blood: 'bg-blood/90 hover:bg-blood text-white shadow-blood border border-blood/60',
  volt: 'bg-volt/10 hover:bg-volt/20 text-volt border border-volt/60 shadow-volt',
  rift: 'bg-rift/10 hover:bg-rift/20 text-rift border border-rift/60 shadow-rift',
  ghost: 'bg-white/5 hover:bg-white/10 text-white border border-white/15',
}

export default function GlowButton({ variant = 'blood', children, fullWidth, className = '', ...rest }: GlowButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative px-6 py-3 rounded-sm font-display text-lg tracking-wider uppercase transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  )
}
