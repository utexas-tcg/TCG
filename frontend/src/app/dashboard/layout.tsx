import { Sidebar } from '@/components/layout/Sidebar'
import { TopNav } from '@/components/layout/TopNav'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-tcg-blue-50">
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
