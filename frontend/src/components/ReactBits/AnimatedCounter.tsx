'use client'
import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  className?: string
  suffix?: string
  prefix?: string
  duration?: number
}

export default function AnimatedCounter({ value, className = '', suffix = '', prefix = '', duration = 1.5 }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0.1 })
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  useEffect(() => {
    if (isInView) motionValue.set(value)
  }, [isInView, motionValue, value])

  useEffect(() => {
    return springValue.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${prefix}${Math.round(v).toLocaleString()}${suffix}`
    })
  }, [springValue, prefix, suffix])

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>
}
