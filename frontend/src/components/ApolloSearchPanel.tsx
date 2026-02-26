'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, UserPlus, Building2, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'

interface ApolloContact {
  id: string
  first_name: string
  last_name: string
  email?: string
  title?: string
  organization?: { name: string; id: string }
  linkedin_url?: string
}

interface ApolloSearchPanelProps {
  open: boolean
  onClose: () => void
}

export function ApolloSearchPanel({ open, onClose }: ApolloSearchPanelProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ApolloContact[]>([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState<Set<string>>(new Set())
  const [imported, setImported] = useState<Set<string>>(new Set())
  const [error, setError] = useState('')
  const qc = useQueryClient()

  // Debounced search with 300ms delay
  const handleSearch = async (q: string) => {
    setQuery(q)
    setError('')
    if (q.length < 2) { setResults([]); return }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await api.post<{ data: { people?: ApolloContact[] } }>(
          '/api/v1/apollo/search/people',
          { query: q }
        )
        setResults(data.data.people ?? [])
      } catch (e: unknown) {
        const err = e as { message?: string }
        if (err.message?.includes('Apollo API key not configured')) {
          setError('Apollo API key not configured. Go to Settings to add it.')
        } else {
          setError('Search failed. Check your Apollo API key.')
        }
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }

  const importContact = async (contact: ApolloContact) => {
    setImporting(prev => new Set(prev).add(contact.id))
    try {
      await api.post('/api/v1/apollo/import/contact', contact)
      setImported(prev => new Set(prev).add(contact.id))
      qc.invalidateQueries({ queryKey: ['contacts'] })
    } catch {
      // silently fail — user can retry
    } finally {
      setImporting(prev => { const s = new Set(prev); s.delete(contact.id); return s })
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Slide-over panel */}
          <motion.div
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-tcg-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-tcg-gray-900">Apollo.io Search</h2>
                <p className="text-xs text-tcg-gray-400">Search and import contacts</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-tcg-gray-50 text-tcg-gray-400 hover:text-tcg-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search input */}
            <div className="px-6 py-4 border-b border-tcg-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tcg-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search by name, title, company..."
                  className="w-full pl-9 pr-4 py-2.5 border border-tcg-gray-100 rounded-lg text-sm text-tcg-gray-900 placeholder-tcg-gray-400 focus:outline-none focus:border-tcg-blue-500 transition-colors"
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-5 h-5 text-tcg-blue-500 animate-spin" />
                </div>
              )}
              {!loading && results.length === 0 && query.length >= 2 && !error && (
                <div className="py-12 text-center text-sm text-tcg-gray-400">No results found</div>
              )}
              {!loading && query.length < 2 && (
                <div className="py-12 text-center text-sm text-tcg-gray-400">Type at least 2 characters to search</div>
              )}
              <ul className="divide-y divide-tcg-gray-100">
                {results.map(contact => {
                  const isImporting = importing.has(contact.id)
                  const isImported = imported.has(contact.id)
                  return (
                    <motion.li
                      key={contact.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-6 py-4 flex items-start justify-between gap-3 hover:bg-tcg-blue-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-tcg-gray-900 truncate">
                          {contact.first_name} {contact.last_name}
                        </p>
                        {contact.title && (
                          <p className="text-xs text-tcg-gray-600 truncate">{contact.title}</p>
                        )}
                        {contact.organization && (
                          <p className="text-xs text-tcg-gray-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            {contact.organization.name}
                          </p>
                        )}
                        {contact.email && (
                          <p className="text-xs text-tcg-gray-400 mt-0.5">{contact.email}</p>
                        )}
                      </div>
                      <button
                        onClick={() => importContact(contact)}
                        disabled={isImporting || isImported}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isImported
                            ? 'bg-tcg-green/10 text-tcg-green cursor-default'
                            : 'bg-tcg-blue-600 text-white hover:bg-tcg-blue-500 disabled:opacity-50'
                        }`}
                      >
                        {isImporting ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : isImported ? (
                          '✓ Imported'
                        ) : (
                          <><UserPlus className="w-3 h-3" /> Import</>
                        )}
                      </button>
                    </motion.li>
                  )
                })}
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
