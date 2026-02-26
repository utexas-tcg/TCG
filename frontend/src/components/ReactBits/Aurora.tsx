'use client'
import { motion } from 'framer-motion'

export default function Aurora({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden min-h-screen" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #1a3a6b 50%, #2563eb 100%)' }}>
      {/* Animated aurora blobs */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(ellipse 80% 60% at 20% 30%, #2563eb44 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, #1a3a6b55 0%, transparent 60%)',
            'radial-gradient(ellipse 80% 60% at 60% 50%, #2563eb44 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 80%, #1a3a6b55 0%, transparent 60%)',
            'radial-gradient(ellipse 80% 60% at 30% 70%, #2563eb44 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 70% 20%, #1a3a6b55 0%, transparent 60%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 50%, #f59e0b22, transparent)' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
