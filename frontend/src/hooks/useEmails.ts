import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { EmailLog, EmailTemplate, PaginatedResponse, SingleResponse } from '@/types'

export function useEmails(page = 1, perPage = 50) {
  return useQuery({
    queryKey: ['emails', page, perPage],
    queryFn: () => api.get<PaginatedResponse<EmailLog>>(`/api/v1/emails?page=${page}&per_page=${perPage}`),
  })
}

export function useEmailTemplates() {
  return useQuery({
    queryKey: ['email-templates'],
    queryFn: () => api.get<PaginatedResponse<EmailTemplate>>('/api/v1/email-templates'),
  })
}

export function useSendEmail() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<EmailLog>) => api.post<SingleResponse<EmailLog>>('/api/v1/emails/send', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['emails'] }),
  })
}
