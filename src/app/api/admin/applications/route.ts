import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../lib/supabase/client'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return new NextResponse(error.message || 'Failed to fetch applications', { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return new NextResponse(err?.message || String(err), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('applications')
      .insert(body)
      .select()
      .single()

    if (error) {
      return new NextResponse(error.message || 'Failed to create application', { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err: any) {
    return new NextResponse(err?.message || String(err), { status: 500 })
  }
}