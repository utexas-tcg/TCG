'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, Building2, TrendingUp, Mail, Search, Settings, ChevronLeft, BarChart3 } from 'lucide-react'
import { useUIStore } from '@/stores/useUIStore'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Users },
  { href: '/dashboard/companies', label: 'Companies', icon: Building2 },
  { href: '/dashboard/outreach', label: 'Outreach', icon: TrendingUp },
  { href: '/dashboard/emails', label: 'Emails', icon: Mail },
  { href: '/dashboard/search', label: 'Search', icon: Search },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <aside
      className={`flex flex-col h-full transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
      style={{ background: 'linear-gradient(180deg, #0a1628 0%, #0f2044 100%)' }}
    >
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {!sidebarCollapsed && (
          <span className="text-white font-bold text-lg tracking-tight">TCG Platform</span>
        )}
        <button onClick={toggleSidebar} className="text-white/60 hover:text-white p-1 rounded transition-colors ml-auto">
          <ChevronLeft className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                active
                  ? 'bg-tcg-blue-500 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-medium">{label}</span>}
            </Link>
          )
        })}
      </nav>
      {!sidebarCollapsed && (
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-white/40 text-xs">TCG @ UT Austin</p>
        </div>
      )}
    </aside>
  )
}
