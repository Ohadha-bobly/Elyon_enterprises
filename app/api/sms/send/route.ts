// Send Individual SMS
import { createServerClient_ } from '@/lib/supabase-client'
import { initializeSMSProvider } from '@/lib/sms-client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, message, templateKey, variables } = await request.json()

    const supabase = await createServerClient_()
    const smsProvider = initializeSMSProvider()

    if (!smsProvider) {
      return NextResponse.json(
        { error: 'SMS provider not configured' },
        { status: 500 }
      )
    }

    // Get user phone number
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, phone, first_name')
      .eq('id', userId)
      .single()

    if (userError || !user?.phone) {
      return NextResponse.json(
        { error: 'User not found or phone not available' },
        { status: 404 }
      )
    }

    // Get template if using template-based message
    let finalMessage = message
    if (templateKey) {
      const { data: template } = await supabase
        .from('sms_templates')
        .select('message_content')
        .eq('template_key', templateKey)
        .single()

      if (template) {
        finalMessage = template.message_content
        // Replace variables
        if (variables) {
          Object.entries(variables).forEach(([key, value]) => {
            finalMessage = finalMessage.replace(
              new RegExp(`{${key}}`, 'g'),
              String(value)
            )
          })
        }
      }
    }

    const formattedPhone = smsProvider.formatPhoneNumber(user.phone)
    const smsResponse = await smsProvider.sendSMS(formattedPhone, finalMessage)

    // Log SMS
    const { data: smsLog } = await supabase
      .from('sms_logs')
      .insert({
        user_id: userId,
        phone_number: formattedPhone,
        message_content: finalMessage,
        template_id: templateKey ? null : undefined,
        sms_type: templateKey || 'manual',
        status: smsResponse.success ? 'sent' : 'failed',
        external_sms_id: smsResponse.messageId,
        error_message: smsResponse.error,
        sent_at: new Date(),
      })
      .select()

    return NextResponse.json({
      success: smsResponse.success,
      messageId: smsResponse.messageId,
      logId: smsLog?.[0]?.id,
      error: smsResponse.error,
    })
  } catch (error: any) {
    console.error('[v0] SMS Send Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
