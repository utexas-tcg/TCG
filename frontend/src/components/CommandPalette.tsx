'use client'
import { Command } from 'cmdk'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/stores/useUIStore'
import { Users, Building2, TrendingUp, Mail, Search, Settings, BarChart3 } from 'lucide-react'

const commands = [
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3, group: 'Navigate' },
  { label: 'Contacts', href: '/dashboard/contacts', icon: Users, group: 'Navigate' },
  { label: 'Companies', href: '/dashboard/companies', icon: Building2, group: 'Navigate' },
  { label: 'Outreach Pipeline', href: '/dashboard/outreach', icon: TrendingUp, group: 'Navigate' },
  { label: 'Emails', href: '/dashboard/emails', icon: Mail, group: 'Navigate' },
  { label: 'Search', href: '/dashboard/search', icon: Search, group: 'Navigate' },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings, group: 'Navigate' },
]

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore()
  const [query, setQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!commandPaletteOpen) setQuery('')
  }, [commandPaletteOpen])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [commandPaletteOpen, setCommandPaletteOpen])

  if (!commandPaletteOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-tcg-blue-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <Command>
          <div className="border-b border-tcg-gray-100">
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search or jump to..."
              className="w-full px-4 py-3.5 text-tcg-gray-900 placeholder-tcg-gray-400 text-sm outline-none bg-transparent"
              autoFocus
            />
          </div>
          <Command.List className="max-h-80 overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-tcg-gray-400">
              No results found.
            </Command.Empty>
            <Command.Group
              heading="Navigate"
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-tcg-gray-400"
            >
              {commands.map(cmd => (
                <Command.Item
                  key={cmd.href}
                  value={cmd.label}
                  onSelect={() => {
                    router.push(cmd.href)
                    setCommandPaletteOpen(false)
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-tcg-gray-700 cursor-pointer hover:bg-tcg-blue-50 hover:text-tcg-blue-700 aria-selected:bg-tcg-blue-50 aria-selected:text-tcg-blue-700 transition-colors"
                >
                  <cmd.icon className="w-4 h-4 text-tcg-gray-400" />
                  {cmd.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
          <div className="px-4 py-2 border-t border-tcg-gray-100 flex items-center gap-3 text-xs text-tcg-gray-400">
            <span><kbd className="bg-tcg-gray-100 px-1.5 py-0.5 rounded">↑↓</kbd> navigate</span>
            <span><kbd className="bg-tcg-gray-100 px-1.5 py-0.5 rounded">↵</kbd> go</span>
            <span><kbd className="bg-tcg-gray-100 px-1.5 py-0.5 rounded">esc</kbd> close</span>
          </div>
        </Command>
      </div>
    </div>
  )
}
