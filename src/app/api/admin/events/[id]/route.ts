import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../../lib/supabase/client'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('events')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return new NextResponse(error.message || 'Failed to update event', { status: 400 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return new NextResponse(err?.message || String(err), { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', params.id)

    if (error) {
      return new NextResponse(error.message || 'Failed to delete event', { status: 400 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (err: any) {
    return new NextResponse(err?.message || String(err), { status: 500 })
  }
}
