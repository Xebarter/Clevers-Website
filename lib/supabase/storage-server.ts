import { createClient } from '@supabase/supabase-js'

interface UploadResult {
  url?: string
  path?: string
  error?: string
}

export async function uploadFileServer(
  file: File | Blob,
  bucketName: string = 'announcements',
  folder: string = 'images'
): Promise<UploadResult> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
    }

    if (!supabaseServiceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables (server)');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false }
    });

    // Build a unique filename
    const mime = (file as any).type || 'application/octet-stream';
    const fileExt = mime.split('/').pop() || 'bin';
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    // Convert to buffer for node-friendly upload
    const arrayBuffer = await (file as any).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: mime,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return { error: error.message };
    }

    const { data: publicData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(fileName);

    // @ts-ignore
    return { url: publicData.publicUrl, path: fileName };
  } catch (err: any) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}
