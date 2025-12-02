'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface Transaction {
  id: string
  amount: number
  payment_method: string
  status: string
  created_at: string
  user: { email: string }
}

export default function BillingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    failedPayments: 0,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select('*, user:users(email)')
        .order('created_at', { ascending: false })
        .limit(50)

      setTransactions(txData || [])

      // Calculate stats
      const completed = txData?.filter(t => t.status === 'completed') || []
      const pending = txData?.filter(t => t.status === 'pending') || []
      const failed = txData?.filter(t => t.status === 'failed') || []

      setStats({
        totalRevenue: completed.reduce((sum, t) => sum + t.amount, 0),
        pendingPayments: pending.reduce((sum, t) => sum + t.amount, 0),
        failedPayments: failed.reduce((sum, t) => sum + t.amount, 0),
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billing & Payments</h1>
        <p className="text-muted mt-2">Transaction history and financial reports</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted text-sm mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-success">KES {(stats.totalRevenue / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted text-sm mb-2">Pending Payments</p>
          <p className="text-3xl font-bold text-warning">KES {(stats.pendingPayments / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted text-sm mb-2">Failed Payments</p>
          <p className="text-3xl font-bold text-error">KES {(stats.failedPayments / 1000).toFixed(0)}K</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Method</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-card-hover">
                  <td className="px-6 py-4 text-sm text-foreground">{tx.user?.email}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">KES {tx.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-foreground capitalize">{tx.payment_method}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      tx.status === 'completed'
                        ? 'bg-success/20 text-success'
                        : tx.status === 'pending'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-error/20 text-error'
                    }`}>
                      {tx.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
