'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'

interface EmailComposerProps {
  open: boolean
  onClose: () => void
  defaultTo?: string
  defaultSubject?: string
}

export function EmailComposer({ open, onClose, defaultTo = '', defaultSubject = '' }: EmailComposerProps) {
  const [to, setTo] = useState(defaultTo)
  const [subject, setSubject] = useState(defaultSubject)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const qc = useQueryClient()

  const handleSend = async () => {
    if (!to || !subject || !body) return
    setSending(true)
    setError('')
    try {
      await api.post('/api/v1/emails/send', {
        to_address: to,
        subject,
        body_html: `<p>${body.replace(/\n/g, '</p><p>')}</p>`,
      })
      setSent(true)
      qc.invalidateQueries({ queryKey: ['emails'] })
      setTimeout(() => {
        setSent(false)
        onClose()
        setTo(defaultTo)
        setSubject(defaultSubject)
        setBody('')
      }, 1500)
    } catch (e: unknown) {
      const err = e as { message?: string }
      setError(err.message || 'Failed to send email. Make sure Gmail is connected.')
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              initial={{ y: 40, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 40, scale: 0.97 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-tcg-gray-100">
                <h2 className="text-lg font-semibold text-tcg-gray-900">New Email</h2>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-tcg-gray-50 text-tcg-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-tcg-gray-600 mb-1">To</label>
                  <input
                    type="email"
                    value={to}
                    onChange={e => setTo(e.target.value)}
                    placeholder="recipient@example.com"
                    className="w-full px-3 py-2 border border-tcg-gray-100 rounded-lg text-sm focus:outline-none focus:border-tcg-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-tcg-gray-600 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="Email subject..."
                    className="w-full px-3 py-2 border border-tcg-gray-100 rounded-lg text-sm focus:outline-none focus:border-tcg-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-tcg-gray-600 mb-1">Message</label>
                  <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder="Write your message..."
                    rows={8}
                    className="w-full px-3 py-2 border border-tcg-gray-100 rounded-lg text-sm focus:outline-none focus:border-tcg-blue-500 resize-none"
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-tcg-gray-100 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-tcg-gray-600 hover:text-tcg-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending || sent || !to || !subject || !body}
                  className="flex items-center gap-2 px-5 py-2 bg-tcg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-tcg-blue-500 disabled:opacity-50 transition-colors"
                >
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {sent ? 'Sent!' : sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
