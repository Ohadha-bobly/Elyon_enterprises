'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface Package {
  id: string
  name: string
  bandwidth_mbps: number
  data_limit_gb: number | null
  price_monthly: number
  price_daily: number | null
  description: string
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/client/packages')
      const data = await response.json()
      setPackages(data.data || [])
    } catch (error) {
      console.error('Error fetching packages:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading packages...</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/client" className="text-blue-600 font-bold text-xl">
            ← Elyon ISP
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Internet Packages</h1>
        <p className="text-xl text-gray-600 mb-12">Choose the perfect plan for your needs</p>

        {packages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No packages available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="p-6 hover:shadow-lg transition flex flex-col">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-blue-600">{pkg.bandwidth_mbps}</span>
                    <span className="text-gray-600">Mbps</span>
                  </div>
                  {pkg.data_limit_gb && (
                    <p className="text-gray-600">Data: {pkg.data_limit_gb} GB/month</p>
                  )}
                </div>

                <div className="mb-6 flex-grow">
                  {pkg.price_monthly && (
                    <div className="mb-2">
                      <span className="text-2xl font-bold text-green-600">KES {pkg.price_monthly}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  )}
                  {pkg.price_daily && (
                    <div>
                      <span className="text-lg text-gray-600">or KES {pkg.price_daily}/day</span>
                    </div>
                  )}
                </div>

                <Link href={`/client/checkout?packageId=${pkg.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Select Plan
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
