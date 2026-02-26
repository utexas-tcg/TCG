'use client'
import { useState } from 'react'
import { useEmails } from '@/hooks/useEmails'
import { Send } from 'lucide-react'
import type { EmailLog } from '@/types'
import { EmailComposer } from '@/components/EmailComposer'

function StatusBadge({ status }: { status: EmailLog['status'] }) {
  const styles = {
    sent: 'bg-green-100 text-green-700',
    scheduled: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-700',
  }
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status]}`}>{status}</span>
}

export default function EmailsPage() {
  const [composeOpen, setComposeOpen] = useState(false)
  const { data, isLoading } = useEmails()
  const emails = data?.data ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-tcg-gray-900">Emails</h1>
        <button
          onClick={() => setComposeOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-tcg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-tcg-blue-500 transition-colors"
        >
          <Send className="w-4 h-4" />
          Compose
        </button>
      </div>

      <EmailComposer open={composeOpen} onClose={() => setComposeOpen(false)} />

      <div className="bg-white rounded-xl shadow-sm border border-tcg-blue-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-tcg-gray-400">Loading emails...</div>
        ) : emails.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-tcg-gray-400">No emails yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-tcg-gray-100">
            {emails.map(email => (
              <div key={email.id} className="px-6 py-4 hover:bg-tcg-blue-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-tcg-gray-900">{email.subject}</p>
                    <p className="text-xs text-tcg-gray-600 mt-0.5">To: {email.to_address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={email.status} />
                    <span className="text-xs text-tcg-gray-400">
                      {email.sent_at ? new Date(email.sent_at).toLocaleDateString() : '—'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
