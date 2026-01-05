import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../../lib/supabase/client'

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return new NextResponse(error.message || 'Failed to fetch messages', { status: 500 });
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

    // Try inserting with a default `read: false` then fallback without `read` if schema differs
    const withRead = await supabase
      .from('messages')
      .insert({ ...body, read: body.read ?? false })
      .select()
      .single()

    if (!withRead.error) {
      return NextResponse.json(withRead.data, { status: 201 })
    }

    const errMsg = String(withRead.error.message || withRead.error)
    if (errMsg.includes("Could not find the 'read' column") || /read column/i.test(errMsg)) {
      const withoutRead = await supabase
        .from('messages')
        .insert(body)
        .select()
        .single()

      if (withoutRead.error) {
        return new NextResponse(withoutRead.error.message || 'Failed to create message', { status: 400 })
      }

      return NextResponse.json(withoutRead.data, { status: 201 })
    }

    return new NextResponse(withRead.error.message || 'Failed to create message', { status: 400 })
  } catch (err: any) {
    return new NextResponse(err?.message || String(err), { status: 500 })
  }
}