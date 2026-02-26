'use client'
import { useParams } from 'next/navigation'
import { useContact } from '@/hooks/useContacts'
import { ArrowLeft, Mail, Phone, Linkedin } from 'lucide-react'
import Link from 'next/link'

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useContact(id)
  const contact = data?.data

  if (isLoading) return <div className="p-8 text-tcg-gray-400">Loading...</div>
  if (!contact) return <div className="p-8 text-tcg-gray-400">Contact not found.</div>

  return (
    <div>
      <Link href="/dashboard/contacts" className="flex items-center gap-1 text-sm text-tcg-blue-600 hover:text-tcg-blue-500 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Contacts
      </Link>
      <div className="bg-white rounded-xl shadow-sm border border-tcg-blue-100 p-6">
        <h1 className="text-2xl font-bold text-tcg-gray-900">{contact.first_name} {contact.last_name}</h1>
        {contact.title && <p className="text-tcg-gray-600 mt-1">{contact.title}</p>}
        <div className="flex gap-4 mt-4">
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-tcg-blue-600 hover:text-tcg-blue-500">
              <Mail className="w-4 h-4" /> {contact.email}
            </a>
          )}
          {contact.phone && (
            <span className="flex items-center gap-2 text-sm text-tcg-gray-600">
              <Phone className="w-4 h-4" /> {contact.phone}
            </span>
          )}
          {contact.linkedin_url && (
            <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-tcg-blue-600 hover:text-tcg-blue-500">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          )}
        </div>
        {contact.notes && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-tcg-gray-900 mb-2">Notes</h3>
            <p className="text-sm text-tcg-gray-600">{contact.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
