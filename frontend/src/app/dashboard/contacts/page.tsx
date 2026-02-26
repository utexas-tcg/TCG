'use client'
import { useState } from 'react'
import { useContacts } from '@/hooks/useContacts'
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import type { Contact } from '@/types'
import { Plus } from 'lucide-react'

const columnHelper = createColumnHelper<Contact>()

const columns = [
  columnHelper.accessor(row => `${row.first_name} ${row.last_name}`, {
    id: 'name',
    header: 'Name',
    cell: info => <span className="font-medium text-tcg-gray-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('email', { header: 'Email', cell: info => info.getValue() ?? '—' }),
  columnHelper.accessor('title', { header: 'Title', cell: info => info.getValue() ?? '—' }),
  columnHelper.accessor('source', {
    header: 'Source',
    cell: info => (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-tcg-blue-100 text-tcg-blue-700 capitalize">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor('created_at', {
    header: 'Added',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
]

export default function ContactsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useContacts(page)
  const contacts = data?.data ?? []
  const total = data?.meta.total ?? 0

  const table = useReactTable({
    data: contacts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-tcg-gray-900">Contacts</h1>
          <p className="text-tcg-gray-600 text-sm mt-1">{total} total contacts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-tcg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-tcg-blue-500 transition-colors">
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-tcg-blue-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-tcg-gray-400">Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-tcg-gray-400">No contacts yet. Add your first contact or import from Apollo.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-tcg-gray-50 border-b border-tcg-gray-100">
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(h => (
                    <th key={h.id} className="text-left px-4 py-3 text-xs font-medium text-tcg-gray-600 uppercase tracking-wide">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-tcg-gray-100">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-tcg-blue-50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-tcg-gray-600">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {total > 50 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-tcg-gray-600">Page {page} of {Math.ceil(total / 50)}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1 text-sm border border-tcg-gray-100 rounded-lg disabled:opacity-50">Prev</button>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 50)}
              className="px-3 py-1 text-sm border border-tcg-gray-100 rounded-lg disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
