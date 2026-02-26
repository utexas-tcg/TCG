'use client'
import { motion, Variants } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
}

export default function SplitText({ text, className = '', delay = 50 }: SplitTextProps) {
  const words = text.split(' ')

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: delay / 1000 } },
  }

  const item: Variants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] } },
  }

  return (
    <motion.div
      className={`flex flex-wrap gap-x-[0.25em] overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden">
          <motion.span className="inline-block" variants={item}>{word}</motion.span>
        </div>
      ))}
    </motion.div>
  )
}
