'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function ClientPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUser(user)
      }
      setLoading(false)
    }
    getUser()
  }, [router, supabase])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Elyon ISP</h1>
            <p className="text-sm text-gray-600">Internet Services</p>
          </div>
          <div className="flex gap-4">
            <Link href="/client/subscriptions">
              <Button variant="outline">My Subscriptions</Button>
            </Link>
            <Link href="/client/account">
              <Button variant="outline">Account</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Elyon ISP</h2>
          <p className="text-xl text-gray-600">Fast, reliable internet packages for your home or business</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">High Speed</h3>
            <p className="text-gray-600">Up to 100 Mbps for lightning-fast internet</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">Affordable</h3>
            <p className="text-gray-600">Flexible plans starting from just 500 KES</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-2">Reliable</h3>
            <p className="text-gray-600">99.9% uptime guarantee with 24/7 support</p>
          </Card>
        </div>

        <div className="text-center mb-8">
          <Link href="/client/packages">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Browse Packages
            </Button>
          </Link>
        </div>

        <Card className="p-8 bg-blue-50">
          <h3 className="text-2xl font-bold mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">100+</div>
              <p className="text-gray-600">Cities Covered</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <p className="text-gray-600">Support</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">99.9%</div>
              <p className="text-gray-600">Uptime</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
