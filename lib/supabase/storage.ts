/**
 * DEPRECATED: client-side Supabase storage helper
 *
 * This file previously attempted to use the `SUPABASE_SERVICE_ROLE_KEY` from
 * `process.env` in client-side code. That key must remain server-only.
 *
 * To prevent accidental usage, this module now throws a clear runtime error
 * directing developers to use the server API at `/api/upload` or the
 * server-side helper `lib/supabase/storage-server.ts`.
 */

// Keep the same export shape for compatibility but throw when called.
export interface UploadResult {
  url?: string
  path?: string
  error?: string
}

export async function uploadFile(
  _file: File,
  _bucketName: string = 'announcements',
  _folder: string = 'images'
): Promise<UploadResult> {
  throw new Error('DEPRECATED: client-side uploadFile is removed. Use server API `/api/upload` or server helper `lib/supabase/storage-server.ts`.');
}
