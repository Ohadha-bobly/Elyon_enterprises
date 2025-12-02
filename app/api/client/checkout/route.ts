import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Create subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        package_id: body.packageId,
        status: 'pending',
        start_date: new Date(),
      })
      .select()
      .single()

    if (subError) throw subError

    // Create transaction
    const { data: transaction, error: transError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        subscription_id: subscription.id,
        amount: body.amount || 1000,
        payment_method: 'mpesa',
        mpesa_phone: body.phoneNumber,
        status: 'pending',
      })
      .select()
      .single()

    if (transError) throw transError

    // TODO: Initiate MPESA payment
    return NextResponse.json({ success: true, transactionId: transaction.id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
