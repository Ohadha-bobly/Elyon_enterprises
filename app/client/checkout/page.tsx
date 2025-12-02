'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const packageId = searchParams.get('packageId')
  
  const [loading, setLoading] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('+254')
  const [paymentMethod, setPaymentMethod] = useState<'stk' | 'payment-page'>('stk')

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/client/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          phoneNumber,
          paymentMethod,
        }),
      })
      
      const data = await response.json()
      if (data.success) {
        router.push('/client/subscriptions')
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button onClick={() => router.back()} className="text-blue-600 font-bold">
            ← Back
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+254701234567"
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="stk"
                  checked={paymentMethod === 'stk'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'stk')}
                  className="mr-2"
                />
                STK Push (Immediate)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="payment-page"
                  checked={paymentMethod === 'payment-page'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'payment-page')}
                  className="mr-2"
                />
                Payment Page (QR Code)
              </label>
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            disabled={loading || !packageId}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {loading ? 'Processing...' : 'Complete Payment'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
