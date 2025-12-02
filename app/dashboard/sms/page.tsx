'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function SMSManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">SMS Management</h1>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">SMS Sent Today</h3>
          <p className="text-2xl font-bold mt-2">2,847</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Delivery Rate</h3>
          <p className="text-2xl font-bold mt-2">98.5%</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Failed Messages</h3>
          <p className="text-2xl font-bold mt-2 text-red-500">42</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Credits Balance</h3>
          <p className="text-2xl font-bold mt-2 text-green-500">5,230</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/dashboard/sms/templates">
              <Button className="w-full justify-start">
                Manage Templates
              </Button>
            </Link>
            <Link href="/dashboard/sms/campaigns">
              <Button className="w-full justify-start">
                Create Bulk Campaign
              </Button>
            </Link>
            <Link href="/dashboard/sms/logs">
              <Button className="w-full justify-start">
                View SMS Logs
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Recent SMS Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <div>
                <p className="font-medium">Payment Confirmation Sent</p>
                <p className="text-sm text-muted-foreground">2,847 users</p>
              </div>
              <span className="text-green-500">✓ Completed</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <div>
                <p className="font-medium">7-Day Expiry Warnings</p>
                <p className="text-sm text-muted-foreground">1,203 users</p>
              </div>
              <span className="text-blue-500">⧖ In Progress</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
