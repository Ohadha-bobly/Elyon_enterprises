'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [supabase])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Link href="/client" className="text-blue-600 font-bold mb-6 block">← Back</Link>
        
        <h1 className="text-4xl font-bold mb-8">Account Settings</h1>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Account Status</label>
              <p className="text-lg text-gray-900">Active</p>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline">Change Password</Button>
          <Button variant="destructive">Logout</Button>
        </div>
      </div>
    </div>
  )
}
