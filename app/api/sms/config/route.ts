// Get system SMS configuration and stats
import { createServerClient_ } from '@/lib/supabase-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient_()

    // Get provider config
    const { data: providerConfig } = await supabase
      .from('sms_provider_config')
      .select('*')
      .eq('is_active', true)
      .single()

    // Get SMS stats (today)
    const today = new Date().toISOString().split('T')[0]
    const { count: sentToday } = await supabase
      .from('sms_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'sent')
      .gte('created_at', `${today}T00:00:00`)

    const { count: failedToday } = await supabase
      .from('sms_logs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed')
      .gte('created_at', `${today}T00:00:00`)

    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      provider: providerConfig?.provider_name || 'Not configured',
      balance: providerConfig?.account_balance || 0,
      stats: {
        sent_today: sentToday || 0,
        failed_today: failedToday || 0,
        delivery_rate: sentToday ? (((sentToday - (failedToday || 0)) / sentToday) * 100).toFixed(1) : 0,
        total_users: totalUsers || 0,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
