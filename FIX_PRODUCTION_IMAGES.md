# Fix Hall of Fame Images Not Showing in Production

## 🔍 Problem
Images show on localhost but not on your hosted application (Netlify/Vercel).

## 🎯 Common Causes & Solutions

### **1. Storage Bucket Not Public (Most Common)**

**Check:**
1. Go to Supabase Dashboard
2. Click **Storage**
3. Click on `hall-of-fame-images` bucket
4. Look at the top - does it show:
   - 🌐 **Public** - Good! ✅
   - 🔒 **Private** - This is the problem! ❌

**Fix:**
If the bucket is Private:
1. Click on the bucket
2. Click **Settings** or **Configuration**
3. Toggle to **Public**
4. Save changes

**Why This Happens:**
- Private buckets require authentication to view images
- Your localhost might have cached auth tokens
- Production doesn't have these tokens
- Result: Images blocked (403/404 errors)

---

### **2. Images Stored with Localhost URLs**

**Check:**
1. Go to Supabase Dashboard
2. Go to **Table Editor**
3. Open `hall_of_fame` table
4. Look at `image_url` column
5. Do URLs look like:
   - ❌ `http://localhost:54321/storage/v1/object/public/...`
   - ❌ `http://127.0.0.1:54321/storage/v1/object/public/...`
   - ✅ `https://[your-project].supabase.co/storage/v1/object/public/...`

**Fix:**
If URLs have localhost:
1. The upload API is using local Supabase (not production)
2. Check your environment variables are correct
3. Re-upload images from production admin panel

---

### **3. Wrong Supabase URL in Production**

**Check Environment Variables:**

In your hosting platform (Netlify/Vercel):
1. Go to **Settings** → **Environment Variables**
2. Verify these are set correctly:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-key
   SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-key
   ```

**Common Mistakes:**
- ❌ Using localhost URL
- ❌ Using wrong project URL
- ❌ Missing environment variables
- ❌ Typo in variable names

**Fix:**
1. Get correct values from Supabase Dashboard → Settings → API
2. Update environment variables in hosting platform
3. Redeploy application

---

### **4. CORS Issues**

**Check:**
Open browser DevTools (F12) on production site:
1. Go to **Console** tab
2. Look for errors like:
   - `CORS policy: No 'Access-Control-Allow-Origin' header`
   - `Failed to load resource: net::ERR_BLOCKED_BY_CLIENT`

**Fix:**
Supabase storage should allow CORS by default, but if blocked:
1. Check browser ad-blockers (disable temporarily)
2. Verify bucket is Public
3. Check network tab for actual error

---

### **5. Image Paths Incorrect**

**Check:**
In browser DevTools → Network tab:
1. Filter by "Img"
2. Look at failed image requests
3. Check the URL that's being requested
4. Compare with actual Supabase storage URL

**Common Issues:**
- Missing `/public/` in path
- Wrong bucket name
- Incorrect project reference

---

## 🔧 Quick Fixes

### **Fix 1: Make Bucket Public (Do This First!)**

```sql
-- Run in Supabase SQL Editor
-- This ensures bucket is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'hall-of-fame-images';
```

Then verify storage policies exist:
```sql
-- Check policies
SELECT * FROM storage.policies 
WHERE bucket_id = 'hall-of-fame-images';
```

---

### **Fix 2: Add Image Error Handling**

Update the component to show when images fail:

**Add this to HallOfFameForm.tsx (to see errors):**
```tsx
<Image
  src={entry.image_url}
  alt={entry.image_alt_text || entry.learner_names}
  fill
  className="object-contain lg:object-cover"
  quality={95}
  onError={(e) => {
    console.error('Image failed to load:', entry.image_url);
    // Show placeholder or log error
  }}
/>
```

---

### **Fix 3: Verify Upload Endpoint**

Check that the upload route is using correct Supabase instance:

```tsx
// In src/app/api/admin/hall-of-fame/upload/route.ts
const supabaseAdmin = getSupabaseAdmin();

// This should use production Supabase, not localhost
// Check lib/supabase/client.ts that getSupabaseAdmin() 
// uses NEXT_PUBLIC_SUPABASE_URL (not hardcoded localhost)
```

---

### **Fix 4: Test Image URL Directly**

1. Copy an image URL from the database
2. Paste it directly in browser
3. Does it load?
   - ✅ **Yes** → Problem is in your code/Next.js config
   - ❌ **No** → Problem is with Supabase storage/permissions

---

## 🧪 Debugging Steps

### **Step 1: Check Browser Console**
```
F12 → Console tab
Look for errors related to images
```

Common errors:
- `403 Forbidden` → Bucket not public or missing policies
- `404 Not Found` → Wrong URL or file doesn't exist
- `CORS error` → CORS policy issue
- `net::ERR_BLOCKED_BY_CLIENT` → Ad blocker

---

### **Step 2: Check Network Tab**
```
F12 → Network tab → Filter: Img
Try to load the page
Click on failed image request
Check:
  - Request URL (is it correct?)
  - Status Code (403, 404, 200?)
  - Response (what's the error?)
```

---

### **Step 3: Check Database**
```sql
-- In Supabase SQL Editor
SELECT id, title, image_url 
FROM hall_of_fame 
LIMIT 5;
```

Look at `image_url` values:
- Should start with `https://`
- Should have your project reference
- Should NOT have `localhost`

---

### **Step 4: Test Storage Directly**

1. Go to Supabase Dashboard → Storage
2. Click `hall-of-fame-images` bucket
3. Click on any uploaded image
4. Click "Get URL"
5. Copy the public URL
6. Paste in new browser tab
7. Does it load?
   - ✅ **Yes** → Bucket is public, URLs are working
   - ❌ **No** → Bucket not public or policies wrong

---

## ✅ Complete Checklist

Work through this checklist:

- [ ] **Bucket is Public**
  - Supabase → Storage → hall-of-fame-images
  - Shows 🌐 icon (not 🔒)

- [ ] **Storage Policies Exist**
  - Run: `SELECT * FROM storage.policies WHERE bucket_id = 'hall-of-fame-images'`
  - Should show 4 policies

- [ ] **Environment Variables Correct**
  - Check hosting platform (Netlify/Vercel)
  - NEXT_PUBLIC_SUPABASE_URL is production URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
  - SUPABASE_SERVICE_ROLE_KEY is correct

- [ ] **Image URLs Correct**
  - Check database: `SELECT image_url FROM hall_of_fame LIMIT 1`
  - Should be: `https://[project].supabase.co/storage/v1/object/public/hall-of-fame-images/...`
  - Should NOT be: `http://localhost:54321/...`

- [ ] **Images Upload from Production**
  - Delete test entries
  - Upload new entry from production admin panel
  - Check if that image shows

- [ ] **No Browser Extensions Blocking**
  - Try in incognito mode
  - Disable ad blockers temporarily
  - Check if images show

- [ ] **Redeployed After Env Changes**
  - If you changed environment variables
  - Redeploy the application
  - Wait for deploy to complete

---

## 🚀 Most Likely Solution

**90% of the time, the issue is:**

1. **Bucket is Private** (not Public) ← Check this first!
2. **Missing storage policies** ← Run the SQL fixes
3. **Wrong environment variables** ← Verify in hosting platform

**Quick Fix Sequence:**
1. Make bucket Public (Supabase Dashboard)
2. Run `COMPLETE_FIX_ALL_ERRORS.sql` (for policies)
3. Verify environment variables
4. Redeploy application
5. Clear browser cache
6. Test again

---

## 📞 Still Not Working?

If images still don't show after trying everything:

1. **Share these details:**
   - What do you see in browser console? (F12)
   - What's in Network tab for failed images?
   - What's a sample image URL from database?
   - Is bucket showing 🌐 or 🔒?
   - Did you redeploy after env changes?

2. **Temporary Test:**
   ```tsx
   // Add this to HallOfFame.tsx to see actual URLs
   console.log('Image URL:', entry.image_url);
   ```
   Check browser console on production to see what URLs are being used.

3. **Nuclear Option (Testing Only):**
   Upload image to a public CDN (Cloudinary, ImgBB)
   Manually update database with that URL
   If it shows → confirms Supabase storage is the issue
   If it doesn't show → confirms Next.js Image component issue

---

## 💡 Prevention

To avoid this in future:

1. **Always use production Supabase** (not local)
2. **Set bucket to Public** from the start
3. **Test in production** after adding features
4. **Verify env variables** before deploying
5. **Use absolute URLs** (not relative)

---

**Most likely fix: Make the bucket Public!** 🎯

Check Supabase Dashboard → Storage → hall-of-fame-images → Should show 🌐 (not 🔒)
