'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Search } from 'lucide-react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{
    contacts?: { id: string; first_name: string; last_name: string; email?: string }[]
    companies?: { id: string; name: string; industry?: string }[]
  } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query || query.length < 2) { setResults(null); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await api.get<{
          contacts?: { id: string; first_name: string; last_name: string; email?: string }[]
          companies?: { id: string; name: string; industry?: string }[]
        }>(`/api/v1/search?q=${encodeURIComponent(query)}`)
        setResults(data)
      } catch {
        setResults(null)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div>
      <h1 className="text-2xl font-bold text-tcg-gray-900 mb-6">Search</h1>
      <div className="relative max-w-2xl mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-tcg-gray-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search contacts, companies, outreach..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-tcg-blue-100 rounded-xl text-tcg-gray-900 placeholder-tcg-gray-400 focus:outline-none focus:border-tcg-blue-500 transition-colors"
          autoFocus
        />
      </div>
      {loading && <p className="text-tcg-gray-400 text-sm">Searching...</p>}
      {results && (
        <div className="space-y-6">
          {results.contacts && results.contacts.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-tcg-gray-600 uppercase tracking-wide mb-3">Contacts</h2>
              <div className="bg-white rounded-xl shadow-sm border border-tcg-blue-100 divide-y divide-tcg-gray-100">
                {results.contacts.map((c) => (
                  <div key={c.id} className="px-4 py-3">
                    <p className="font-medium text-sm text-tcg-gray-900">{c.first_name} {c.last_name}</p>
                    <p className="text-xs text-tcg-gray-600">{c.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {results.companies && results.companies.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-tcg-gray-600 uppercase tracking-wide mb-3">Companies</h2>
              <div className="bg-white rounded-xl shadow-sm border border-tcg-blue-100 divide-y divide-tcg-gray-100">
                {results.companies.map((c) => (
                  <div key={c.id} className="px-4 py-3">
                    <p className="font-medium text-sm text-tcg-gray-900">{c.name}</p>
                    <p className="text-xs text-tcg-gray-600">{c.industry}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
