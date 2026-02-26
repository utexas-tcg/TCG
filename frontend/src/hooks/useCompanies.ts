import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Company, PaginatedResponse, SingleResponse } from '@/types'

export function useCompanies(page = 1, perPage = 50) {
  return useQuery({
    queryKey: ['companies', page, perPage],
    queryFn: () => api.get<PaginatedResponse<Company>>(`/api/v1/companies?page=${page}&per_page=${perPage}`),
  })
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => api.get<SingleResponse<Company>>(`/api/v1/companies/${id}`),
    enabled: !!id,
  })
}

export function useCreateCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Company>) => api.post<SingleResponse<Company>>('/api/v1/companies', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
  })
}

export function useUpdateCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      api.put<SingleResponse<Company>>(`/api/v1/companies/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
  })
}
