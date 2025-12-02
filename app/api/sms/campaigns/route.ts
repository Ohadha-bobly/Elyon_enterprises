// Create and manage SMS campaigns
import { createServerClient_ } from '@/lib/supabase-client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      templateKey,
      targetUserType,
      targetStatus,
      scheduleTime,
    } = await request.json()

    const supabase = await createServerClient_()

    // Build filter criteria
    const targetFilter: any = {}
    if (targetUserType !== 'all') {
      targetFilter.user_type = targetUserType
    }
    if (targetStatus !== 'all') {
      targetFilter.subscription_status = targetStatus
    }

    // Get current user (admin)
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    const { data: adminUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', authUser?.id)
      .single()

    const { data: campaign, error } = await supabase
      .from('sms_campaigns')
      .insert({
        created_by: adminUser?.id,
        name,
        template_id: templateKey,
        target_users_filter: targetFilter,
        scheduled_at: scheduleTime ? new Date(scheduleTime) : new Date(),
        status: scheduleTime ? 'scheduled' : 'in_progress',
      })
      .select()

    if (error) throw error

    // If not scheduled, send immediately
    if (!scheduleTime) {
      await fetch(`${request.nextUrl.origin}/api/sms/bulk-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: campaign[0].id,
          templateKey,
        }),
      })
    }

    return NextResponse.json({ data: campaign })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const limit = request.nextUrl.searchParams.get('limit') || '20'
    const offset = request.nextUrl.searchParams.get('offset') || '0'

    const supabase = await createServerClient_()

    const { data, error, count } = await supabase
      .from('sms_campaigns')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)

    if (error) throw error

    return NextResponse.json({
      data,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
