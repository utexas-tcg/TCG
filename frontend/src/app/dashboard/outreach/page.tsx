'use client'
import { useOutreach } from '@/hooks/useOutreach'
import type { OutreachRecord, OutreachStatus } from '@/types'

const COLUMNS: { key: OutreachStatus; label: string; color: string }[] = [
  { key: 'not_contacted', label: 'Not Contacted', color: 'bg-tcg-gray-100 text-tcg-gray-600' },
  { key: 'reached_out', label: 'Reached Out', color: 'bg-tcg-blue-100 text-tcg-blue-700' },
  { key: 'replied', label: 'Replied', color: 'bg-yellow-100 text-yellow-700' },
  { key: 'meeting_scheduled', label: 'Meeting', color: 'bg-purple-100 text-purple-700' },
  { key: 'closed', label: 'Closed', color: 'bg-tcg-green/20 text-green-700' },
  { key: 'rejected', label: 'Rejected', color: 'bg-tcg-red/20 text-red-700' },
]

function OutreachCard({ record }: { record: OutreachRecord }) {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-tcg-blue-100 hover:shadow-md transition-shadow cursor-pointer">
      <p className="font-medium text-sm text-tcg-gray-900">
        {record.contact ? `${record.contact.first_name} ${record.contact.last_name}` : 'Unknown Contact'}
      </p>
      <p className="text-xs text-tcg-gray-600 mt-0.5">{record.company?.name ?? '—'}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs px-1.5 py-0.5 rounded bg-tcg-gray-50 text-tcg-gray-600 capitalize">{record.channel}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded capitalize ${
          record.priority === 'high' ? 'bg-red-100 text-red-700' :
          record.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
        }`}>{record.priority}</span>
      </div>
    </div>
  )
}

export default function OutreachPage() {
  const { data, isLoading } = useOutreach(1, 200)
  const records = data?.data ?? []

  const byStatus = COLUMNS.reduce((acc, col) => {
    acc[col.key] = records.filter(r => r.status === col.key)
    return acc
  }, {} as Record<OutreachStatus, OutreachRecord[]>)

  if (isLoading) return <div className="p-8 text-tcg-gray-400">Loading pipeline...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-tcg-gray-900">Outreach Pipeline</h1>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(col => (
          <div key={col.key} className="flex-shrink-0 w-64">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${col.color}`}>{col.label}</span>
              <span className="text-xs text-tcg-gray-400">{byStatus[col.key].length}</span>
            </div>
            <div className="space-y-2 min-h-[200px]">
              {byStatus[col.key].map(r => <OutreachCard key={r.id} record={r} />)}
              {byStatus[col.key].length === 0 && (
                <div className="border-2 border-dashed border-tcg-gray-100 rounded-lg p-4 text-center text-xs text-tcg-gray-400">
                  Empty
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
