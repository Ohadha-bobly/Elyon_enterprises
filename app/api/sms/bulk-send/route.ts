// Bulk SMS Campaign
import { createServerClient_ } from '@/lib/supabase-client'
import { initializeSMSProvider } from '@/lib/sms-client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { campaignId, templateKey, messageOverride } = await request.json()

    const supabase = await createServerClient_()
    const smsProvider = initializeSMSProvider()

    if (!smsProvider) {
      return NextResponse.json(
        { error: 'SMS provider not configured' },
        { status: 500 }
      )
    }

    // Get campaign
    const { data: campaign } = await supabase
      .from('sms_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single()

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Get template
    const { data: template } = await supabase
      .from('sms_templates')
      .select('message_content')
      .eq('template_key', templateKey)
      .single()

    const baseMessage = messageOverride || template?.message_content || ''

    // Get target users based on filter
    let query = supabase.from('users').select('id, phone, first_name')

    if (campaign.target_users_filter) {
      const filter = campaign.target_users_filter
      if (filter.user_type) query = query.eq('user_type', filter.user_type)
      if (filter.status) query = query.eq('status', filter.status)
    }

    const { data: users } = await query

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: 'No users matched the campaign filters' },
        { status: 400 }
      )
    }

    let successCount = 0
    let failureCount = 0

    // Send SMS to all users
    for (const user of users) {
      try {
        let message = baseMessage
          .replace(/{customer_name}/g, user.first_name || 'Valued Customer')

        const formattedPhone = smsProvider.formatPhoneNumber(user.phone)
        const smsResponse = await smsProvider.sendSMS(formattedPhone, message)

        // Log each SMS
        await supabase.from('sms_logs').insert({
          user_id: user.id,
          phone_number: formattedPhone,
          message_content: message,
          sms_type: 'bulk_campaign',
          status: smsResponse.success ? 'sent' : 'failed',
          external_sms_id: smsResponse.messageId,
          error_message: smsResponse.error,
          sent_at: new Date(),
        })

        if (smsResponse.success) {
          successCount++
        } else {
          failureCount++
        }
      } catch (err) {
        failureCount++
      }
    }

    // Update campaign status
    await supabase
      .from('sms_campaigns')
      .update({
        status: 'completed',
        successfully_sent: successCount,
        failed_count: failureCount,
        sent_at: new Date(),
      })
      .eq('id', campaignId)

    return NextResponse.json({
      success: true,
      totalSent: users.length,
      successCount,
      failureCount,
    })
  } catch (error: any) {
    console.error('[v0] Bulk SMS Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
