-- URGENT FIX FOR STORAGE IMAGE UPLOAD ERROR
-- "StorageApiError: new row violates row-level security policy"
-- Run this in Supabase SQL Editor

-- ============================================
-- SOLUTION: Fix Storage Bucket Policies
-- ============================================

-- IMPORTANT: Make sure the bucket 'hall-of-fame-images' exists first!
-- If not, create it manually in Supabase Dashboard → Storage → New Bucket
-- Name: hall-of-fame-images
-- Public: ✓ (Check this!)

-- Step 1: Drop all existing storage policies for hall-of-fame-images
DROP POLICY IF EXISTS "Public can view hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Hall of fame images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete hall of fame images" ON storage.objects;

-- Step 2: Create PERMISSIVE policies for storage
-- These policies allow authenticated users to upload images without restriction

-- Policy 1: Anyone can SELECT (view) images
CREATE POLICY "allow_public_read_hall_of_fame_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'hall-of-fame-images');

-- Policy 2: Authenticated users can INSERT (upload) images
CREATE POLICY "allow_authenticated_upload_hall_of_fame_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hall-of-fame-images');

-- Policy 3: Authenticated users can UPDATE images
CREATE POLICY "allow_authenticated_update_hall_of_fame_images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'hall-of-fame-images')
WITH CHECK (bucket_id = 'hall-of-fame-images');

-- Policy 4: Authenticated users can DELETE images
CREATE POLICY "allow_authenticated_delete_hall_of_fame_images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'hall-of-fame-images');

-- Step 3: Grant explicit permissions on storage tables
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.buckets TO authenticated;
GRANT SELECT ON storage.buckets TO anon;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if policies were created
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%hall_of_fame%';

-- You should see 4 policies:
-- 1. allow_public_read_hall_of_fame_images (SELECT)
-- 2. allow_authenticated_upload_hall_of_fame_images (INSERT)
-- 3. allow_authenticated_update_hall_of_fame_images (UPDATE)
-- 4. allow_authenticated_delete_hall_of_fame_images (DELETE)

-- Check if bucket exists
SELECT * FROM storage.buckets WHERE id = 'hall-of-fame-images';

-- ============================================
-- ALTERNATIVE: Temporarily Disable RLS on Storage (NOT RECOMMENDED for production)
-- ============================================
-- Only use this if the above doesn't work and you need to test quickly
-- UNCOMMENT ONLY FOR TESTING:

-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Remember to re-enable it after testing:
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SUCCESS!
-- ============================================
-- After running this SQL:
-- 1. Image uploads should work
-- 2. No more "StorageApiError" 
-- 3. Images will be stored in hall-of-fame-images bucket

-- Next steps:
-- 1. Refresh your application
-- 2. Try uploading an image
-- 3. Should work! ✅
