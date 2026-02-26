'use client'
import { motion, Variants } from 'framer-motion'

interface BlurTextProps {
  text: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'characters'
}

export default function BlurText({ text, delay = 100, className = '', animateBy = 'words' }: BlurTextProps) {
  const parts = animateBy === 'words' ? text.split(' ') : text.split('')

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: delay / 1000 } },
  }

  const item: Variants = {
    hidden: { opacity: 0, filter: 'blur(10px)', y: 10 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <motion.span
      className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {parts.map((part, i) => (
        <motion.span key={i} variants={item}>{part}</motion.span>
      ))}
    </motion.span>
  )
}
