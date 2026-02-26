'use client'
import { useState } from 'react'
import { useCompanies } from '@/hooks/useCompanies'
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import type { Company } from '@/types'
import { Plus } from 'lucide-react'

const columnHelper = createColumnHelper<Company>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Company',
    cell: info => <span className="font-medium text-tcg-gray-900">{info.getValue()}</span>,
  }),
  columnHelper.accessor('industry', { header: 'Industry', cell: info => info.getValue() ?? '—' }),
  columnHelper.accessor('size_range', { header: 'Size', cell: info => info.getValue() ?? '—' }),
  columnHelper.accessor('headquarters', { header: 'HQ', cell: info => info.getValue() ?? '—' }),
  columnHelper.accessor('created_at', {
    header: 'Added',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
  }),
]

export default function CompaniesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useCompanies(page)
  const companies = data?.data ?? []
  const total = data?.meta.total ?? 0

  const table = useReactTable({ data: companies, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-tcg-gray-900">Companies</h1>
          <p className="text-tcg-gray-600 text-sm mt-1">{total} total companies</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-tcg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-tcg-blue-500 transition-colors">
          <Plus className="w-4 h-4" />
          Add Company
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-tcg-blue-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-tcg-gray-400">Loading companies...</div>
        ) : companies.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-tcg-gray-400">No companies yet.</p>
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
    </div>
  )
}
