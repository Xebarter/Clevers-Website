import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../lib/supabase/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('events')
      .insert(body)
      .select()
      .single()

    if (error) {
      return new NextResponse(error.message || 'Failed to create event', { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return new NextResponse(err?.message || String(err), { status: 500 })
  }
}
