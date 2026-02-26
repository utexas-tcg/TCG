export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  domain?: string
  industry?: string
  size_range?: string
  headquarters?: string
  website?: string
  linkedin_url?: string
  apollo_id?: string
  description?: string
  tags: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  title?: string
  linkedin_url?: string
  company_id?: string
  company?: Company
  apollo_id?: string
  source: 'manual' | 'apollo' | 'import'
  notes?: string
  tags: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export type OutreachStatus = 'not_contacted' | 'reached_out' | 'replied' | 'meeting_scheduled' | 'closed' | 'rejected'
export type OutreachChannel = 'email' | 'linkedin' | 'phone' | 'in_person'
export type Priority = 'low' | 'medium' | 'high'

export interface OutreachRecord {
  id: string
  contact_id: string
  contact?: Contact
  company_id?: string
  company?: Company
  status: OutreachStatus
  channel: OutreachChannel
  priority: Priority
  assigned_to?: string
  next_follow_up?: string
  notes?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body_html: string
  body_text?: string
  variables: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface EmailLog {
  id: string
  contact_id?: string
  contact?: Contact
  outreach_id?: string
  template_id?: string
  from_address: string
  to_address: string
  subject: string
  body_html?: string
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  scheduled_for?: string
  sent_at?: string
  gmail_message_id?: string
  error_message?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    per_page: number
  }
}

export interface SingleResponse<T> {
  data: T
}
