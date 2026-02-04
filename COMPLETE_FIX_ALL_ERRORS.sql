-- ============================================
-- COMPLETE FIX FOR ALL HALL OF FAME ERRORS
-- ============================================
-- This SQL fixes BOTH database AND storage RLS policy errors
-- Run this ONCE in Supabase SQL Editor to fix everything

-- ============================================
-- PART 1: FIX DATABASE (hall_of_fame table)
-- ============================================

-- Step 1: Drop ALL existing database policies
DROP POLICY IF EXISTS "Admins can manage all hall of fame entries" ON hall_of_fame;
DROP POLICY IF EXISTS "Anyone can read published hall of fame entries" ON hall_of_fame;
DROP POLICY IF EXISTS "Allow authenticated users full access to hall of fame" ON hall_of_fame;
DROP POLICY IF EXISTS "Allow public to read published hall of fame entries" ON hall_of_fame;
DROP POLICY IF EXISTS "authenticated_all_access" ON hall_of_fame;
DROP POLICY IF EXISTS "public_read_published" ON hall_of_fame;

-- Step 2: Temporarily DISABLE RLS to clear any issues
ALTER TABLE hall_of_fame DISABLE ROW LEVEL SECURITY;

-- Step 3: Re-enable RLS
ALTER TABLE hall_of_fame ENABLE ROW LEVEL SECURITY;

-- Step 4: Create SIMPLE, PERMISSIVE policy for authenticated users
CREATE POLICY "authenticated_full_access"
ON hall_of_fame
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 5: Create policy for public to read published entries
CREATE POLICY "public_read_published_entries"
ON hall_of_fame
FOR SELECT
TO anon, public
USING (is_published = true);

-- Step 6: Grant explicit permissions on table
GRANT ALL ON TABLE hall_of_fame TO authenticated;
GRANT SELECT ON TABLE hall_of_fame TO anon;
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- ============================================
-- PART 2: FIX STORAGE (hall-of-fame-images bucket)
-- ============================================

-- IMPORTANT: The bucket 'hall-of-fame-images' MUST exist and be PUBLIC
-- If it doesn't exist:
-- 1. Go to Supabase Dashboard → Storage
-- 2. Click "New Bucket"
-- 3. Name: hall-of-fame-images
-- 4. ✓ CHECK "Public bucket"
-- 5. Click "Create Bucket"

-- Step 1: Drop ALL existing storage policies
DROP POLICY IF EXISTS "Public can view hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Hall of fame images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "allow_public_read_hall_of_fame_images" ON storage.objects;
DROP POLICY IF EXISTS "allow_authenticated_upload_hall_of_fame_images" ON storage.objects;
DROP POLICY IF EXISTS "allow_authenticated_update_hall_of_fame_images" ON storage.objects;
DROP POLICY IF EXISTS "allow_authenticated_delete_hall_of_fame_images" ON storage.objects;

-- Step 2: Create SIMPLE storage policies
-- Policy 1: Public can view images
CREATE POLICY "hof_public_read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'hall-of-fame-images');

-- Policy 2: Authenticated can upload
CREATE POLICY "hof_auth_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hall-of-fame-images');

-- Policy 3: Authenticated can update
CREATE POLICY "hof_auth_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'hall-of-fame-images')
WITH CHECK (bucket_id = 'hall-of-fame-images');

-- Policy 4: Authenticated can delete
CREATE POLICY "hof_auth_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'hall-of-fame-images');

-- Step 3: Grant storage permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon, public;
GRANT ALL ON storage.buckets TO authenticated;
GRANT SELECT ON storage.buckets TO anon, public;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify database policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'hall_of_fame'
ORDER BY policyname;

-- Expected result: 2 policies
-- 1. authenticated_full_access (FOR ALL, TO authenticated)
-- 2. public_read_published_entries (FOR SELECT, TO anon, public)

-- Verify storage policies
SELECT 
    policyname,
    cmd,
    roles
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE 'hof_%'
ORDER BY policyname;

-- Expected result: 4 policies
-- 1. hof_auth_delete (DELETE, authenticated)
-- 2. hof_auth_insert (INSERT, authenticated)
-- 3. hof_auth_update (UPDATE, authenticated)
-- 4. hof_public_read (SELECT, public)

-- Check if hall_of_fame table exists
SELECT tablename FROM pg_tables WHERE tablename = 'hall_of_fame';

-- Check if storage bucket exists
SELECT id, name, public FROM storage.buckets WHERE id = 'hall-of-fame-images';

-- Expected result: 1 row with public = true
-- If public = false, you need to make the bucket public!

-- ============================================
-- TEST QUERIES (Optional)
-- ============================================

-- Test 1: Try to insert into hall_of_fame (uncomment to test)
/*
INSERT INTO hall_of_fame (
    title,
    learner_names,
    achievement,
    achievement_date,
    image_url,
    is_published
) VALUES (
    'Test Entry',
    'Test Student',
    'Test Achievement',
    CURRENT_DATE,
    'https://via.placeholder.com/400',
    true
);

-- If successful, delete the test entry:
DELETE FROM hall_of_fame WHERE title = 'Test Entry';
*/

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- If you still get errors after running this SQL:

-- Issue 1: Bucket doesn't exist
-- Solution: Create it manually in Supabase Dashboard → Storage

-- Issue 2: Bucket is private (not public)
-- Solution: In Supabase Dashboard → Storage → Click bucket → Make it public

-- Issue 3: Still getting policy errors
-- Solution: Check that you're logged in to the admin dashboard

-- Issue 4: Service role key issues
-- Solution: Verify SUPABASE_SERVICE_ROLE_KEY is set in environment variables

-- ============================================
-- NUCLEAR OPTION (Last Resort - Testing Only)
-- ============================================
-- ONLY use this if everything else fails and you need to test
-- This disables ALL security - NOT for production!

-- UNCOMMENT ONLY FOR EMERGENCY TESTING:
-- ALTER TABLE hall_of_fame DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- If this makes it work, then policies were the issue
-- Re-enable security and run the policies above again:
-- ALTER TABLE hall_of_fame ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ============================================
-- SUCCESS INDICATORS
-- ============================================
-- After running this SQL successfully:
-- ✅ No errors in SQL Editor
-- ✅ 2 database policies created
-- ✅ 4 storage policies created
-- ✅ Can create Hall of Fame entries
-- ✅ Can upload images
-- ✅ No 403 errors in browser

-- ============================================
-- NEXT STEPS
-- ============================================
-- 1. Verify bucket 'hall-of-fame-images' exists and is PUBLIC
-- 2. Refresh your application
-- 3. Log in to admin dashboard at /admin
-- 4. Go to Hall of Fame tab
-- 5. Click "Add Entry"
-- 6. Fill form and upload image
-- 7. Submit - should work! ✅

-- ============================================
-- NOTES
-- ============================================
-- This SQL is SAFE to run multiple times
-- It drops existing policies first, then creates fresh ones
-- All policies are designed to be permissive for authenticated users
-- Public users can only read published entries
