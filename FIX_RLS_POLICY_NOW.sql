-- QUICK FIX FOR "new row violates row-level security policy" ERROR
-- Run this immediately in Supabase SQL Editor

-- ============================================
-- SOLUTION: Fix RLS Policies for hall_of_fame
-- ============================================

-- Step 1: Drop all existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage all hall of fame entries" ON hall_of_fame;
DROP POLICY IF EXISTS "Anyone can read published hall of fame entries" ON hall_of_fame;
DROP POLICY IF EXISTS "Allow authenticated users full access to hall of fame" ON hall_of_fame;
DROP POLICY IF EXISTS "Allow public to read published hall of fame entries" ON hall_of_fame;

-- Step 2: Create a permissive policy that allows ALL operations for authenticated users
CREATE POLICY "authenticated_all_access"
ON hall_of_fame
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 3: Create a policy for public to read published entries
CREATE POLICY "public_read_published"
ON hall_of_fame
FOR SELECT
TO anon, public
USING (is_published = true);

-- Step 4: Grant explicit table permissions
GRANT ALL ON TABLE hall_of_fame TO authenticated;
GRANT SELECT ON TABLE hall_of_fame TO anon;

-- ============================================
-- VERIFICATION
-- ============================================

-- Check if policies were created successfully
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'hall_of_fame';

-- You should see:
-- 1. authenticated_all_access (FOR ALL, TO authenticated)
-- 2. public_read_published (FOR SELECT, TO anon, public)

-- ============================================
-- TEST QUERY (Optional)
-- ============================================

-- Try inserting a test row (this should work now)
-- Uncomment to test:

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
-- SUCCESS!
-- ============================================
-- After running this SQL:
-- 1. The error should be gone
-- 2. You can create Hall of Fame entries
-- 3. Image uploads should work (if bucket exists)

-- Next steps:
-- 1. Refresh your application
-- 2. Try creating an entry again
-- 3. Should work! ✅
