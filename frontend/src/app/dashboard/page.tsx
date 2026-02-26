import FadeIn from '@/components/ReactBits/FadeIn'
import BlurText from '@/components/ReactBits/BlurText'

const stats = [
  { label: 'Total Contacts', color: 'text-tcg-blue-600' },
  { label: 'Companies', color: 'text-tcg-blue-600' },
  { label: 'Active Outreach', color: 'text-tcg-gold' },
  { label: 'Emails Sent', color: 'text-tcg-green' },
]

export default function DashboardPage() {
  return (
    <div>
      <FadeIn className="mb-6">
        <BlurText
          text="Dashboard"
          className="text-2xl font-bold text-tcg-gray-900"
          animateBy="words"
        />
        <p className="text-tcg-gray-600 text-sm mt-1">Welcome back to TCG Platform</p>
      </FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <FadeIn key={s.label} delay={0.1 * i}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-tcg-blue-100">
              <p className="text-sm text-tcg-gray-600">{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>—</p>
            </div>
          </FadeIn>
        ))}
      </div>
      <FadeIn delay={0.4}>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-tcg-blue-100">
          <h2 className="text-lg font-semibold text-tcg-gray-900 mb-4">Recent Activity</h2>
          <p className="text-tcg-gray-400 text-sm">No recent activity yet.</p>
        </div>
      </FadeIn>
    </div>
  )
}
