'use client'
import { Search } from 'lucide-react'
import { useUIStore } from '@/stores/useUIStore'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function TopNav() {
  const { setCommandPaletteOpen } = useUIStore()
  const router = useRouter()

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [setCommandPaletteOpen])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="h-14 bg-white border-b border-tcg-blue-100 flex items-center px-6 gap-4">
      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-tcg-gray-50 border border-tcg-gray-100 text-tcg-gray-400 text-sm hover:border-tcg-blue-400 transition-colors flex-1 max-w-sm"
      >
        <Search className="w-4 h-4" />
        <span>Search... </span>
        <kbd className="ml-auto text-xs bg-tcg-gray-100 px-1.5 py-0.5 rounded">⌘K</kbd>
      </button>
      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={handleSignOut}
          className="text-sm text-tcg-gray-600 hover:text-tcg-gray-900 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
