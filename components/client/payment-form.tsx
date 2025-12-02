import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface PaymentFormProps {
  packageId: string
  onSubmit: (data: any) => void
  loading?: boolean
}

export function PaymentForm({ packageId, onSubmit, loading }: PaymentFormProps) {
  const [phone, setPhone] = useState('+254')
  const [method, setMethod] = useState<'stk' | 'page'>('stk')

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Phone Number</label>
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+254701234567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Payment Method</label>
        <select value={method} onChange={(e) => setMethod(e.target.value as 'stk' | 'page')} className="w-full border rounded p-2">
          <option value="stk">STK Push</option>
          <option value="page">Payment Page</option>
        </select>
      </div>

      <Button
        onClick={() => onSubmit({ phone, method, packageId })}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </div>
  )
}
