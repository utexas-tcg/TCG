import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Contact, PaginatedResponse, SingleResponse } from '@/types'

export function useContacts(page = 1, perPage = 50) {
  return useQuery({
    queryKey: ['contacts', page, perPage],
    queryFn: () => api.get<PaginatedResponse<Contact>>(`/api/v1/contacts?page=${page}&per_page=${perPage}`),
  })
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ['contacts', id],
    queryFn: () => api.get<SingleResponse<Contact>>(`/api/v1/contacts/${id}`),
    enabled: !!id,
  })
}

export function useCreateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Contact>) => api.post<SingleResponse<Contact>>('/api/v1/contacts', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  })
}

export function useUpdateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contact> }) =>
      api.put<SingleResponse<Contact>>(`/api/v1/contacts/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  })
}

export function useDeleteContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/contacts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['contacts'] }),
  })
}
