// Automated Expiry Notifications (run as a cron job)
import { createServerClient_ } from '@/lib/supabase-client'
import { initializeSMSProvider } from '@/lib/sms-client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient_()
    const smsProvider = initializeSMSProvider()

    if (!smsProvider) {
      return NextResponse.json(
        { error: 'SMS provider not configured' },
        { status: 500 }
      )
    }

    // Calculate dates for different warning levels
    const now = new Date()
    const oneDay = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)
    const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    // Check for 7-day expiry warning
    const { data: expiringSoon7 } = await supabase
      .from('subscriptions')
      .select('id, user_id, end_date, users(phone, first_name)')
      .eq('status', 'active')
      .gte('end_date', sevenDays.toISOString())
      .lte('end_date', new Date(sevenDays.getTime() + 24 * 60 * 60 * 1000).toISOString())

    // Send 7-day warnings
    for (const sub of expiringSoon7 || []) {
      const notificationExists = await supabase
        .from('expiry_notifications_sent')
        .select('id')
        .eq('subscription_id', sub.id)
        .eq('notification_type', 'warning_7days')
        .single()

      if (!notificationExists.data) {
        const user = sub.users as any
        const formattedPhone = smsProvider.formatPhoneNumber(user.phone)
        const message = `Hi ${user.first_name}, your internet subscription expires in 7 days. Renew now to maintain continuous service.`

        await smsProvider.sendSMS(formattedPhone, message)

        // Log notification
        await supabase
          .from('sms_logs')
          .insert({
            user_id: sub.user_id,
            phone_number: formattedPhone,
            message_content: message,
            sms_type: 'expiry_warning',
            status: 'sent',
            sent_at: new Date(),
          })

        // Track notification sent
        await supabase
          .from('expiry_notifications_sent')
          .insert({
            subscription_id: sub.id,
            notification_type: 'warning_7days',
          })
      }
    }

    // Similar logic for 3-day and 1-day warnings
    // (Implementation follows same pattern)

    return NextResponse.json({
      success: true,
      message: 'Expiry notifications processed',
    })
  } catch (error: any) {
    console.error('[v0] Expiry Notification Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
