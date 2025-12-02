// Configure SMS provider settings
import { createServerClient_ } from '@/lib/supabase-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient_()

    const { data: config, error } = await supabase
      .from('sms_provider_config')
      .select('id, provider_name, is_active, sender_id, account_balance, last_balance_check')
      .order('created_at')

    if (error) throw error

    return NextResponse.json({ data: config })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { providerId, isActive, senderid, accountBalance } = await request.json()

    const supabase = await createServerClient_()

    const { data: config, error } = await supabase
      .from('sms_provider_config')
      .update({
        is_active: isActive,
        sender_id: senderid,
        account_balance: accountBalance,
        last_balance_check: new Date(),
        updated_at: new Date(),
      })
      .eq('id', providerId)
      .select()

    if (error) throw error

    return NextResponse.json({ data: config })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
