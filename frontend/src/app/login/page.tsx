'use client'
export const dynamic = 'force-dynamic'
import Aurora from '@/components/ReactBits/Aurora'
import SplitText from '@/components/ReactBits/SplitText'
import BlurText from '@/components/ReactBits/BlurText'
import FadeIn from '@/components/ReactBits/FadeIn'

export default function LoginPage() {
  async function signInWithGoogle() {
    const { createClient } = await import('@/lib/supabase')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'email profile https://www.googleapis.com/auth/gmail.send',
      },
    })
  }

  return (
    <Aurora>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <SplitText
              text="TCG Platform"
              className="text-4xl font-bold text-white justify-center mb-3"
            />
            <BlurText
              text="Tech Consulting Group @ UT Austin"
              className="text-white/70 text-lg justify-center"
              delay={150}
            />
          </div>
          <FadeIn delay={0.4}>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white text-tcg-gray-900 rounded-xl font-medium hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <p className="text-center text-xs text-white/40 mt-4">
                Internal platform — TCG members only
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </Aurora>
  )
}
