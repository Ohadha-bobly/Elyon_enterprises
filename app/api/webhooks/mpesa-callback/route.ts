import { createServerClient_ } from '@/lib/supabase-client'
import { initializeSMSProvider } from '@/lib/sms-client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const supabase = await createServerClient_()
    const smsProvider = initializeSMSProvider()

    // Extract MPESA data
    const mpesaData = body.Body.stkCallback

    if (mpesaData.ResultCode === 0) {
      // Payment successful
      const callbackMetadata = mpesaData.CallbackMetadata

      const amount = callbackMetadata.find(
        (item: any) => item.Name === 'Amount'
      )?.Value
      const mpesaReceiptNumber = callbackMetadata.find(
        (item: any) => item.Name === 'MpesaReceiptNumber'
      )?.Value
      const mpesaPhone = callbackMetadata.find(
        (item: any) => item.Name === 'PhoneNumber'
      )?.Value

      // Find user by phone number
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, first_name, phone, email')
        .eq('phone', mpesaPhone)
        .single()

      if (userError || !user) {
        console.warn(`[v0] No user found for phone: ${mpesaPhone}`)
      }

      // Insert transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          amount: amount,
          mpesa_receipt_number: mpesaReceiptNumber,
          mpesa_phone: mpesaPhone,
          payment_method: 'mpesa',
          status: 'completed',
          payment_reference: mpesaReceiptNumber,
        })
        .select()

      if (transactionError) throw transactionError

      if (smsProvider && user?.phone) {
        const formattedPhone = smsProvider.formatPhoneNumber(user.phone)
        const paymentMessage = `Hello ${user.first_name || 'Valued Customer'}, your payment of KES ${amount} has been received. Receipt: ${mpesaReceiptNumber}. Thank you!`

        const smsResponse = await smsProvider.sendSMS(
          formattedPhone,
          paymentMessage
        )

        // Log SMS
        await supabase.from('sms_logs').insert({
          user_id: user?.id,
          phone_number: formattedPhone,
          message_content: paymentMessage,
          sms_type: 'payment_confirmation',
          status: smsResponse.success ? 'sent' : 'failed',
          external_sms_id: smsResponse.messageId,
          error_message: smsResponse.error,
          sent_at: new Date(),
        })

        console.log('[v0] Payment confirmation SMS sent:', smsResponse.success)
      }

      if (user?.id) {
        const { data: activeSubscription } = await supabase
          .from('subscriptions')
          .select('id, end_date, package_id, packages(name, price_monthly)')
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (activeSubscription) {
          const endDate = new Date()
          endDate.setDate(endDate.getDate() + 30) // 30 days for monthly

          const { error: updateError } = await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              start_date: new Date(),
              end_date: endDate.toISOString(),
            })
            .eq('id', activeSubscription.id)

          if (updateError) throw updateError

          if (smsProvider && user.phone) {
            const formattedPhone = smsProvider.formatPhoneNumber(user.phone)
            const renewalMessage = `Welcome back ${user.first_name || 'Valued Customer'}! Your subscription has been renewed successfully. New expiry date: ${endDate.toLocaleDateString()}. Enjoy unlimited browsing!`

            const smsResponse = await smsProvider.sendSMS(
              formattedPhone,
              renewalMessage
            )

            await supabase.from('sms_logs').insert({
              user_id: user.id,
              phone_number: formattedPhone,
              message_content: renewalMessage,
              sms_type: 'renewal_successful',
              status: smsResponse.success ? 'sent' : 'failed',
              external_sms_id: smsResponse.messageId,
              error_message: smsResponse.error,
              sent_at: new Date(),
            })

            console.log('[v0] Renewal SMS sent:', smsResponse.success)
          }

          // Log to audit trail
          await supabase.from('audit_logs').insert({
            user_id: user.id,
            action: 'subscription_renewed',
            resource_type: 'subscription',
            resource_id: activeSubscription.id,
            changes: {
              status: 'active',
              end_date: endDate.toISOString(),
            },
          })
        }
      }

      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: 'Payment processed successfully',
      })
    } else {
      console.warn(
        `[v0] Payment failed: ${mpesaData.ResultDesc}`
      )

      if (smsProvider) {
        const mpesaPhone = mpesaData.PhoneNumber

        const { data: user } = await supabase
          .from('users')
          .select('id, first_name, phone')
          .eq('phone', mpesaPhone)
          .single()

        if (user?.phone) {
          const formattedPhone = smsProvider.formatPhoneNumber(user.phone)
          const failureMessage = `Hi ${user.first_name || 'Valued Customer'}, your payment failed. Please try again or contact support at 0795 673 453.`

          await smsProvider.sendSMS(formattedPhone, failureMessage)
        }
      }

      return NextResponse.json({
        ResultCode: 1,
        ResultDesc: 'Payment processing failed',
      })
    }
  } catch (error: any) {
    console.error('[v0] MPESA Webhook Error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
