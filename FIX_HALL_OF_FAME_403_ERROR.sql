-- Fix 403 Errors for Hall of Fame Feature
-- Run this SQL in your Supabase SQL Editor to fix permission issues

-- ============================================
-- SOLUTION 1: Update RLS Policies (Recommended)
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage all hall of fame entries" ON hall_of_fame;
DROP POLICY IF EXISTS "Anyone can read published hall of fame entries" ON hall_of_fame;

-- Create more permissive policies for authenticated users (admins)
-- Policy: Allow ALL operations for authenticated users
CREATE POLICY "Allow authenticated users full access to hall of fame"
ON hall_of_fame FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow public to read published entries
CREATE POLICY "Allow public to read published hall of fame entries"
ON hall_of_fame FOR SELECT
TO anon
USING (is_published = true);

-- ============================================
-- SOLUTION 2: Fix Storage Policies
-- ============================================

-- First, make sure the bucket exists (do this manually in Supabase Dashboard if needed)
-- Supabase Dashboard → Storage → Create Bucket: "hall-of-fame-images" → Set to Public

-- Drop existing storage policies
DROP POLICY IF EXISTS "Hall of fame images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete hall of fame images" ON storage.objects;

-- Create comprehensive storage policies
-- Policy: Anyone can view images (public bucket)
CREATE POLICY "Public can view hall of fame images"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'hall-of-fame-images' );

-- Policy: Authenticated users can upload images
CREATE POLICY "Authenticated users can upload hall of fame images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'hall-of-fame-images' );

-- Policy: Authenticated users can update images
CREATE POLICY "Authenticated users can update hall of fame images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'hall-of-fame-images' );

-- Policy: Authenticated users can delete images
CREATE POLICY "Authenticated users can delete hall of fame images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'hall-of-fame-images' );

-- ============================================
-- SOLUTION 3: Alternative - Disable RLS Temporarily (NOT RECOMMENDED FOR PRODUCTION)
-- ============================================
-- Only use this for testing/debugging
-- Uncomment the lines below if you want to disable RLS temporarily:

-- ALTER TABLE hall_of_fame DISABLE ROW LEVEL SECURITY;

-- Remember to re-enable it later:
-- ALTER TABLE hall_of_fame ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'hall_of_fame';

-- Check storage policies
SELECT *
FROM storage.policies
WHERE bucket_id = 'hall-of-fame-images';

-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'hall_of_fame';

-- Test query (should work for authenticated users)
-- SELECT * FROM hall_of_fame LIMIT 1;

-- ============================================
-- ADDITIONAL FIXES
-- ============================================

-- Grant explicit permissions (if needed)
GRANT ALL ON TABLE hall_of_fame TO authenticated;
GRANT SELECT ON TABLE hall_of_fame TO anon;

-- Grant permissions on storage
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;

-- Grant permissions on storage.buckets
GRANT ALL ON storage.buckets TO authenticated;
GRANT SELECT ON storage.buckets TO anon;

-- ============================================
-- NOTES
-- ============================================
-- After running this SQL:
-- 1. Refresh your application
-- 2. Try uploading an image again
-- 3. Check browser console for any remaining errors
-- 4. Verify the bucket 'hall-of-fame-images' exists and is set to Public
-- 5. Check that you're logged in to the admin dashboard

-- Common Issues:
-- - Storage bucket doesn't exist → Create it manually in Supabase Dashboard
-- - Not logged in → Log in to admin dashboard first
-- - Service role key missing → Check environment variables
-- - RLS too restrictive → This SQL fixes that

-- ============================================
-- SUCCESS INDICATORS
-- ============================================
-- If fixed successfully, you should see:
-- ✓ No 403 errors in browser console
-- ✓ Images upload successfully
-- ✓ Hall of fame entries create/update/delete work
-- ✓ Public page displays entries correctly
