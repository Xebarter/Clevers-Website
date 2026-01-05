import { NextResponse } from 'next/server';
import { uploadFileServer } from '../../../../lib/supabase/storage-server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Support both single-file (`file`) and multi-file (`files`) fields
    const files: File[] = [];
    const single = formData.get('file');
    if (single) files.push(single as File);

    const many = formData.getAll('files');
    if (many && many.length > 0) {
      for (const f of many) {
        files.push(f as File);
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const bucket = formData.get('bucket')?.toString() || 'gallery-images';
    const folder = formData.get('folder')?.toString() || 'images';

    const results = [] as any[];

    for (const file of files) {
      const res = await uploadFileServer(file as any, bucket, folder);
      results.push(res);
    }

    return NextResponse.json({ results }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
