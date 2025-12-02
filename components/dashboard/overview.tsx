'use client'

import { StatCard } from '@/components/ui/stat-card'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export function DashboardOverview({ user }: { user: any }) {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    routerHealth: 0,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch stats from Supabase
      // This is placeholder - will be implemented with real data
      setStats({
        totalClients: 1240,
        activeSubscriptions: 890,
        monthlyRevenue: 125400,
        routerHealth: 98,
      })
    }

    fetchStats()
  }, [supabase])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted mt-2">Welcome back, {user?.email}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Clients"
          value={stats.totalClients.toLocaleString()}
          change="+12%"
          icon="👥"
          trend="up"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions.toLocaleString()}
          change="+8%"
          icon="✓"
          trend="up"
        />
        <StatCard
          title="Monthly Revenue"
          value={`KES ${(stats.monthlyRevenue / 1000).toFixed(0)}K`}
          change="+24%"
          icon="💰"
          trend="up"
        />
        <StatCard
          title="Router Health"
          value={`${stats.routerHealth}%`}
          change="Optimal"
          icon="🔌"
          trend="stable"
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h2>
          <div className="h-64 bg-background rounded-lg flex items-center justify-center text-muted">
            <p>Chart placeholder - integrate with Recharts</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-2">
                  <span className="text-success">✓</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">Payment received</p>
                    <p className="text-xs text-muted">2 hours ago</p>
                  </div>
                </div>
                <span className="text-success font-semibold">+KES 5,000</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
