import { createServerClient_ } from '@/lib/supabase-client'
import { NextRequest, NextResponse } from 'next/server'

// GET - List all clients
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient_()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('user_type', ['pppoe', 'hotspot'])
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST - Create new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createServerClient_()

    // Create auth user first
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      email_confirm: true,
    })

    if (authError) throw authError

    // Create user profile
    const { data, error } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email: body.email,
        phone: body.phone,
        first_name: body.first_name,
        last_name: body.last_name,
        user_type: body.user_type || 'pppoe',
        status: 'active',
      })
      .select()

    if (error) throw error

    return NextResponse.json({ data: data[0] }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
