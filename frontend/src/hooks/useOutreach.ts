import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { OutreachRecord, PaginatedResponse, SingleResponse } from '@/types'

export function useOutreach(page = 1, perPage = 50) {
  return useQuery({
    queryKey: ['outreach', page, perPage],
    queryFn: () => api.get<PaginatedResponse<OutreachRecord>>(`/api/v1/outreach?page=${page}&per_page=${perPage}`),
  })
}

export function useUpdateOutreach() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OutreachRecord> }) =>
      api.put<SingleResponse<OutreachRecord>>(`/api/v1/outreach/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['outreach'] }),
  })
}
