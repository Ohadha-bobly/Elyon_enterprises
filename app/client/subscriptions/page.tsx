'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/client/subscriptions')
      const data = await response.json()
      setSubscriptions(data.data || [])
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading subscriptions...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <Link href="/client" className="text-blue-600 font-bold mb-6 block">← Back</Link>
        
        <h1 className="text-4xl font-bold mb-8">My Subscriptions</h1>

        {subscriptions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-6">No active subscriptions</p>
            <Link href="/client/packages">
              <Button>Browse Packages</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptions.map((sub) => (
              <Card key={sub.id} className="p-6">
                <h3 className="text-2xl font-bold mb-4">{sub.package_id}</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">Status: <span className="text-green-600 font-bold">Active</span></p>
                  <p className="text-gray-600">Start: {new Date(sub.start_date).toLocaleDateString()}</p>
                  {sub.end_date && <p className="text-gray-600">Expires: {new Date(sub.end_date).toLocaleDateString()}</p>}
                </div>
                <Link href="/client/packages">
                  <Button className="w-full">Renew</Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
