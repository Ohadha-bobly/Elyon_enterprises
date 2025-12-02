'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SMSCampaignsPage() {
  const [formData, setFormData] = useState({
    campaignName: '',
    templateKey: 'payment_confirmation',
    targetUserType: 'all',
    targetStatus: 'active',
    scheduleTime: '',
  })

  const handleCreateCampaign = async () => {
    try {
      const response = await fetch('/api/sms/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert('Campaign created successfully!')
        setFormData({
          campaignName: '',
          templateKey: 'payment_confirmation',
          targetUserType: 'all',
          targetStatus: 'active',
          scheduleTime: '',
        })
      }
    } catch (error) {
      console.error('Campaign creation error:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bulk SMS Campaigns</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Create New Campaign</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Campaign Name</label>
            <Input
              placeholder="e.g., Monthly Expiry Reminders"
              value={formData.campaignName}
              onChange={(e) =>
                setFormData({ ...formData, campaignName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">SMS Template</label>
            <Select value={formData.templateKey} onValueChange={(value) =>
              setFormData({ ...formData, templateKey: value })
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment_confirmation">Payment Confirmation</SelectItem>
                <SelectItem value="expiry_warning_7days">7-Day Expiry Warning</SelectItem>
                <SelectItem value="expiry_warning_3days">3-Day Expiry Warning</SelectItem>
                <SelectItem value="expiry_warning_1day">1-Day Expiry Warning</SelectItem>
                <SelectItem value="renewal_successful">Renewal Successful</SelectItem>
                <SelectItem value="service_suspended">Service Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target User Type</label>
              <Select value={formData.targetUserType} onValueChange={(value) =>
                setFormData({ ...formData, targetUserType: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="pppoe">PPPoE Users Only</SelectItem>
                  <SelectItem value="hotspot">Hotspot Users Only</SelectItem>
                  <SelectItem value="reseller">Resellers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subscription Status</label>
              <Select value={formData.targetStatus} onValueChange={(value) =>
                setFormData({ ...formData, targetStatus: value })
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="all">All Statuses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Schedule Time (Optional)</label>
            <Input
              type="datetime-local"
              value={formData.scheduleTime}
              onChange={(e) =>
                setFormData({ ...formData, scheduleTime: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground mt-1">Leave empty to send immediately</p>
          </div>

          <Button onClick={handleCreateCampaign} className="w-full">
            Create & Send Campaign
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-muted rounded">
            <div>
              <p className="font-medium">Monthly Package Renewal</p>
              <p className="text-sm text-muted-foreground">Sent to 5,230 users</p>
            </div>
            <span className="text-green-500">Completed</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
