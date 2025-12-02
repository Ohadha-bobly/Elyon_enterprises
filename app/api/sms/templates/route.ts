// Get and manage SMS templates
import { createServerClient_ } from '@/lib/supabase-client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient_()

    const { data: templates, error } = await supabase
      .from('sms_templates')
      .select('*')
      .order('created_at')

    if (error) throw error

    return NextResponse.json({ data: templates })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, message_content, is_active } = await request.json()

    const supabase = await createServerClient_()

    const { data: template, error } = await supabase
      .from('sms_templates')
      .update({
        message_content,
        is_active,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json({ data: template })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
