export default function DashboardPage() {
  const stats = [
    { label: 'Total Contacts', value: '—', color: 'text-tcg-blue-600' },
    { label: 'Companies', value: '—', color: 'text-tcg-blue-600' },
    { label: 'Active Outreach', value: '—', color: 'text-tcg-gold' },
    { label: 'Emails Sent', value: '—', color: 'text-tcg-green' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-tcg-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-tcg-blue-100">
            <p className="text-sm text-tcg-gray-600">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-tcg-blue-100">
        <h2 className="text-lg font-semibold text-tcg-gray-900 mb-4">Recent Activity</h2>
        <p className="text-tcg-gray-400 text-sm">No recent activity yet.</p>
      </div>
    </div>
  )
}
