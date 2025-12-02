import { createServerClient_ } from '@/lib/supabase-client'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createServerClient_()

    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
