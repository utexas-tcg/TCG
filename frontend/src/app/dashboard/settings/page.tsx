'use client'
import { useState } from 'react'
import { api } from '@/lib/api'

export default function SettingsPage() {
  const [apolloKey, setApolloKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function saveApolloKey() {
    setSaving(true)
    try {
      await api.put('/api/v1/auth/me', { apollo_api_key: apolloKey })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // TODO: show error
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-tcg-gray-900 mb-6">Settings</h1>
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-tcg-blue-100 p-6">
          <h2 className="text-lg font-semibold text-tcg-gray-900 mb-4">Apollo.io Integration</h2>
          <p className="text-sm text-tcg-gray-600 mb-4">Connect your Apollo.io API key to import contacts and companies.</p>
          <div className="flex gap-3">
            <input
              type="password"
              value={apolloKey}
              onChange={e => setApolloKey(e.target.value)}
              placeholder="Apollo API Key"
              className="flex-1 px-3 py-2 border border-tcg-gray-100 rounded-lg text-sm focus:outline-none focus:border-tcg-blue-500"
            />
            <button
              onClick={saveApolloKey}
              disabled={saving || !apolloKey}
              className="px-4 py-2 bg-tcg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-tcg-blue-500 disabled:opacity-50 transition-colors"
            >
              {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-tcg-blue-100 p-6">
          <h2 className="text-lg font-semibold text-tcg-gray-900 mb-4">Gmail Integration</h2>
          <p className="text-sm text-tcg-gray-600 mb-4">Connect Gmail to send emails directly from the platform.</p>
          <button className="px-4 py-2 border border-tcg-blue-500 text-tcg-blue-600 rounded-lg text-sm font-medium hover:bg-tcg-blue-50 transition-colors">
            Connect Gmail Account
          </button>
        </div>
      </div>
    </div>
  )
}
