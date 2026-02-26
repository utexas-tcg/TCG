'use client'
import { motion, Variants } from 'framer-motion'

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
}

export default function FadeIn({ children, delay = 0, className = '', direction = 'up' }: FadeInProps) {
  const directionMap = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {},
  }

  const variants: Variants = {
    hidden: { opacity: 0, ...directionMap[direction] },
    visible: {
      opacity: 1, y: 0, x: 0,
      transition: { duration: 0.4, delay, ease: 'easeOut' },
    },
  }

  return (
    <motion.div className={className} variants={variants} initial="hidden" animate="visible">
      {children}
    </motion.div>
  )
}
