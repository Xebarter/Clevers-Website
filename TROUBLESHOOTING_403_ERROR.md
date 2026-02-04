# Troubleshooting 403 Error - Hall of Fame

## 🔍 What is a 403 Error?

A **403 Forbidden** error means you don't have permission to access a resource. In the Hall of Fame feature, this can happen when:

1. **Image upload** - Supabase Storage denies the upload
2. **Database operation** - Row Level Security (RLS) blocks the query
3. **Missing authentication** - Not logged in as admin
4. **Missing storage bucket** - The bucket doesn't exist

---

## 🎯 Quick Fix (Choose Your Scenario)

### **Scenario 1: Image Upload Fails (Most Common)**

**Symptoms:**
- Error when clicking "upload image" button
- 403 error in browser console
- Image preview doesn't show

**Solution:**

1. **Check if storage bucket exists:**
   ```
   Supabase Dashboard → Storage → Look for "hall-of-fame-images"
   ```

2. **If bucket doesn't exist, create it:**
   ```
   Click "New Bucket"
   Name: hall-of-fame-images
   Public: ✓ (Check this!)
   Click "Create Bucket"
   ```

3. **Run the SQL fix:**
   ```sql
   -- Copy from FIX_HALL_OF_FAME_403_ERROR.sql
   -- Run in Supabase SQL Editor
   ```

---

### **Scenario 2: Creating/Editing Entry Fails**

**Symptoms:**
- Form submits but returns 403
- Entry doesn't appear in list
- Error in browser console

**Solution:**

1. **Run the database policy fix:**
   ```sql
   -- In Supabase SQL Editor:
   -- Run the RLS policies from FIX_HALL_OF_FAME_403_ERROR.sql
   ```

2. **Verify you're logged in as admin:**
   - Check if you're on `/admin` page
   - Try logging out and back in

---

### **Scenario 3: Can't View Entries in Admin Dashboard**

**Symptoms:**
- 403 when loading Hall of Fame tab
- Empty list with error

**Solution:**

1. **Check if table exists:**
   ```sql
   -- In Supabase SQL Editor:
   SELECT * FROM hall_of_fame LIMIT 1;
   ```

2. **If table doesn't exist:**
   ```
   Run NEW_SUPABASE_HALL_OF_FAME_SCHEMA.sql
   ```

3. **If table exists but still errors:**
   ```sql
   -- Run the RLS fix from FIX_HALL_OF_FAME_403_ERROR.sql
   ```

---

## 🔧 Step-by-Step Fix Guide

### **Step 1: Verify Database Setup**

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Run this query:
   ```sql
   SELECT tablename FROM pg_tables WHERE tablename = 'hall_of_fame';
   ```

**Expected Result:** Should return one row with `hall_of_fame`

**If empty:** Run `NEW_SUPABASE_HALL_OF_FAME_SCHEMA.sql`

---

### **Step 2: Verify Storage Bucket**

1. Open Supabase Dashboard
2. Go to **Storage**
3. Look for `hall-of-fame-images` bucket

**If doesn't exist:**
- Click "New Bucket"
- Name: `hall-of-fame-images`
- **IMPORTANT:** Check "Public bucket" ✓
- Click "Create Bucket"

**If exists but still errors:**
- Click on the bucket
- Go to "Policies" tab
- Run the storage policies from `FIX_HALL_OF_FAME_403_ERROR.sql`

---

### **Step 3: Fix RLS Policies**

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and run this SQL:

```sql
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage all hall of fame entries" ON hall_of_fame;
DROP POLICY IF EXISTS "Anyone can read published hall of fame entries" ON hall_of_fame;

-- Create permissive policy for authenticated users
CREATE POLICY "Allow authenticated users full access to hall of fame"
ON hall_of_fame FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow public to read published entries
CREATE POLICY "Allow public to read published hall of fame entries"
ON hall_of_fame FOR SELECT
TO anon
USING (is_published = true);
```

---

### **Step 4: Fix Storage Policies**

1. In Supabase SQL Editor, run:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Hall of fame images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update hall of fame images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete hall of fame images" ON storage.objects;

-- Create new policies
CREATE POLICY "Public can view hall of fame images"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'hall-of-fame-images' );

CREATE POLICY "Authenticated users can upload hall of fame images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'hall-of-fame-images' );

CREATE POLICY "Authenticated users can update hall of fame images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'hall-of-fame-images' );

CREATE POLICY "Authenticated users can delete hall of fame images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'hall-of-fame-images' );
```

---

### **Step 5: Verify Fix**

1. **Refresh your application** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Log in to admin dashboard** at `/admin`
3. **Go to Hall of Fame tab**
4. **Try creating an entry:**
   - Fill in name, achievement, date
   - Upload an image
   - Click "Create Entry"

**Expected:** Entry created successfully! ✅

---

## 🚨 Common Issues & Solutions

### **Issue 1: "Bucket doesn't exist"**

**Error:** `Error: Bucket hall-of-fame-images not found`

**Solution:**
```
Supabase Dashboard → Storage → New Bucket
Name: hall-of-fame-images
Public: ✓
Create Bucket
```

---

### **Issue 2: "Permission denied for table hall_of_fame"**

**Error:** `Error: permission denied for table hall_of_fame`

**Solution:** Run the RLS policy fix from Step 3 above

---

### **Issue 3: "Not authenticated"**

**Error:** `Error: Not authenticated`

**Solution:**
1. Go to `/admin`
2. Log in with admin credentials
3. Try again

---

### **Issue 4: "Row level security violation"**

**Error:** `Error: new row violates row-level security policy`

**Solution:** 
```sql
-- Make sure this policy exists:
CREATE POLICY "Allow authenticated users full access to hall of fame"
ON hall_of_fame FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

---

## 🔍 Debugging Steps

### **Check Browser Console**

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for red error messages
4. Share the error message for specific help

### **Check Network Tab**

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try uploading an image
4. Look for failed requests (red)
5. Click on the failed request
6. Check the "Response" tab for error details

### **Check Supabase Logs**

1. Supabase Dashboard → Logs
2. Look for recent errors
3. Check error messages

---

## ✅ Verification Checklist

After applying fixes, verify:

- [ ] Storage bucket `hall-of-fame-images` exists
- [ ] Storage bucket is set to **Public**
- [ ] Table `hall_of_fame` exists
- [ ] RLS policies are created (run verification query below)
- [ ] Storage policies are created
- [ ] You're logged in to admin dashboard
- [ ] No 403 errors in browser console
- [ ] Image uploads successfully
- [ ] Entry creates successfully
- [ ] Entry appears in list

**Verification Query:**
```sql
-- Check RLS policies
SELECT policyname FROM pg_policies WHERE tablename = 'hall_of_fame';

-- Should return at least:
-- "Allow authenticated users full access to hall of fame"
-- "Allow public to read published hall of fame entries"
```

---

## 💡 Prevention Tips

1. **Always create storage bucket before using the feature**
2. **Set bucket to Public** (with policies for security)
3. **Run the complete SQL schema** before first use
4. **Test with a sample entry** after setup
5. **Keep service role key** in environment variables

---

## 📞 Still Getting 403 Errors?

If you've tried everything above and still get 403 errors:

1. **Check environment variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Restart development server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Select "Cached images and files"
   - Clear data

4. **Try in incognito/private mode:**
   - Rules out browser caching issues

5. **Check Supabase service status:**
   - Visit Supabase status page
   - Ensure no outages

---

## 🎯 Quick Reference

**Most common cause:** Storage bucket doesn't exist or isn't public

**Quickest fix:** 
1. Create `hall-of-fame-images` bucket (Public)
2. Run `FIX_HALL_OF_FAME_403_ERROR.sql`
3. Refresh page

**Files to use:**
- `FIX_HALL_OF_FAME_403_ERROR.sql` - Permission fixes
- `NEW_SUPABASE_HALL_OF_FAME_SCHEMA.sql` - Initial setup
- `TROUBLESHOOTING_403_ERROR.md` - This guide

---

## 📝 Success Example

After fixing, you should see:

```
✅ Storage bucket created: hall-of-fame-images
✅ RLS policies active: 2 policies
✅ Storage policies active: 4 policies
✅ Image upload: Success
✅ Entry creation: Success
✅ Entry displayed: Success
```

**Browser console:** No errors
**Network tab:** All requests return 200 OK
**Admin dashboard:** Entries visible and editable

---

**Last Updated:** February 4, 2026  
**Version:** 1.0  
**Status:** Complete troubleshooting guide
