import { createClient } from '@supabase/supabase-js';

interface UploadResult {
  url?: string;
  path?: string; // Add path to return the file path
  error?: string;
}

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param bucketName The name of the storage bucket
 * @param folderPath The folder path within the bucket (optional)
 * @returns An object with the file URL or an error message
 */
export async function uploadFile(
  file: File, 
  bucketName: string, 
  folderPath?: string
): Promise<UploadResult> {
  try {
    // Validate inputs
    if (!file) {
      return { error: 'No file provided' };
    }
    
    if (!bucketName) {
      return { error: 'No bucket name provided' };
    }

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
    }

    if (!supabaseServiceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
    }

    // Create a client with service role key for full access
    const supabaseWithServiceRole = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
      }
    });

    // Generate a unique filename
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name}`;
    const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

    // Upload the file to Supabase Storage
    const { data, error } = await supabaseWithServiceRole
      .storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { error: error.message };
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabaseWithServiceRole
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (publicUrlData?.publicUrl) {
      return { 
        url: publicUrlData.publicUrl,
        path: filePath // Return the path as well
      };
    } else {
      return { error: 'Failed to generate public URL' };
    }
  } catch (err) {
    console.error('Unexpected error during upload:', err);
    return { error: err instanceof Error ? err.message : 'Unknown error occurred' };
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param url The public URL of the file to delete
 * @param bucketName The name of the storage bucket
 * @returns A promise that resolves when the file is deleted
 */
export async function deleteFile(
  url: string,
  bucketName: string
): Promise<{ error?: string }> {
  try {
    if (!url || !bucketName) {
      return { error: 'URL and bucket name are required' };
    }

    // Extract the file path from the public URL
    const urlParts = url.split(`${bucketName}/`);
    if (urlParts.length < 2) {
      return { error: 'Invalid URL format' };
    }
    
    const filePath = urlParts[1].split('?')[0]; // Remove query parameters if any

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
    }

    if (!supabaseServiceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment variables');
    }

    // Create a client with service role key for full access
    const supabaseWithServiceRole = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Delete the file
    const { error } = await supabaseWithServiceRole
      .storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return { error: error.message };
    }

    return {};
  } catch (err) {
    console.error('Unexpected error during delete:', err);
    return { error: err instanceof Error ? err.message : 'Unknown error occurred' };
  }
}