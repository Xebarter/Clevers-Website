-- Comprehensive SQL schema for Gallery functionality in Supabase
-- This script creates all necessary tables, storage buckets, and security policies for gallery images

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket for gallery images
-- Manual step: Create a bucket named 'gallery-images' in the Supabase dashboard
-- The following SQL sets up the policies for that bucket:

-- After creating the 'gallery-images' bucket manually in the dashboard, run:
-- Set up storage policies for gallery images
DROP POLICY IF EXISTS "Gallery images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload gallery images" ON storage.objects;

-- Policy: Anyone can read gallery images (for public display)
CREATE POLICY "Gallery images are viewable by everyone"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'gallery-images' );

-- Policy: Authenticated users can upload images (for admin or users during creation)
CREATE POLICY "Users can upload gallery images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'gallery-images' );

-- Policy: Authenticated users can update images
CREATE POLICY "Users can update gallery images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'gallery-images' );

-- Policy: Authenticated users can delete images
CREATE POLICY "Users can delete gallery images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'gallery-images' );

-- Gallery Images Table
-- Stores information about gallery images
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  category TEXT,
  location TEXT,  -- Campus location (kitintale, kasokoso, maganjo)
  date_taken DATE DEFAULT CURRENT_DATE,
  description TEXT,
  tags TEXT[], -- Array of tags for the image
  uploaded_by UUID REFERENCES auth.users (id), -- User who uploaded the image
  is_featured BOOLEAN DEFAULT FALSE -- Whether this image should be featured
);

-- Create indexes for faster queries on gallery images
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON gallery_images (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images (category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_location ON gallery_images (location);
CREATE INDEX IF NOT EXISTS idx_gallery_images_date_taken ON gallery_images (date_taken);
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_featured ON gallery_images (is_featured);

-- Enable Row Level Security (RLS) on gallery images table
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery images table
-- Policy: Authenticated users (admins) can manage all gallery images
CREATE POLICY "Admins can manage all gallery images"
ON gallery_images FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Anyone can read gallery images (for public display)
CREATE POLICY "Anyone can read gallery images"
ON gallery_images FOR SELECT
TO anon, authenticated
USING (true);

-- Gallery Images Audit Log Table
-- Tracks changes to gallery images for audit purposes
CREATE TABLE IF NOT EXISTS gallery_images_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gallery_image_id UUID NOT NULL REFERENCES gallery_images(id) ON DELETE CASCADE,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users (id),
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB
);

-- Create index for faster queries on audit log
CREATE INDEX IF NOT EXISTS idx_gallery_images_audit_log_gallery_image_id ON gallery_images_audit_log (gallery_image_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_audit_log_changed_at ON gallery_images_audit_log (changed_at DESC);

-- Enable Row Level Security (RLS) on audit log table
ALTER TABLE gallery_images_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy for audit log: Only admins can access
CREATE POLICY "Admins can access gallery images audit logs"
ON gallery_images_audit_log FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON TABLE gallery_images TO authenticated;
GRANT SELECT ON TABLE gallery_images TO anon;
GRANT ALL ON TABLE gallery_images_audit_log TO authenticated;

-- Function to create a gallery image and log the creation
CREATE OR REPLACE FUNCTION create_gallery_image_and_log(
  p_title TEXT,
  p_file_url TEXT,
  p_file_name TEXT,
  p_alt_text TEXT,
  p_caption TEXT,
  p_category TEXT,
  p_location TEXT,
  p_date_taken DATE,
  p_description TEXT,
  p_tags TEXT[],
  p_uploaded_by UUID,
  p_is_featured BOOLEAN DEFAULT FALSE
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_gallery_image_id UUID;
  new_values JSONB;
BEGIN
  INSERT INTO gallery_images (
    title,
    file_url,
    file_name,
    alt_text,
    caption,
    category,
    location,
    date_taken,
    description,
    tags,
    uploaded_by,
    is_featured
  ) VALUES (
    p_title,
    p_file_url,
    p_file_name,
    p_alt_text,
    p_caption,
    p_category,
    p_location,
    p_date_taken,
    p_description,
    p_tags,
    p_uploaded_by,
    p_is_featured
  )
  RETURNING id INTO new_gallery_image_id;

  -- Log the creation
  new_values := jsonb_build_object(
    'id', new_gallery_image_id,
    'title', p_title,
    'file_url', p_file_url,
    'file_name', p_file_name,
    'alt_text', p_alt_text,
    'caption', p_caption,
    'category', p_category,
    'location', p_location,
    'date_taken', p_date_taken,
    'description', p_description,
    'tags', p_tags,
    'uploaded_by', p_uploaded_by,
    'is_featured', p_is_featured
  );

  INSERT INTO gallery_images_audit_log (
    gallery_image_id,
    action,
    new_values,
    changed_by
  ) VALUES (
    new_gallery_image_id,
    'INSERT',
    new_values,
    p_uploaded_by
  );

  RETURN new_gallery_image_id;
END;
$$;

-- The categories were previously referenced here but have been removed since there is no categories table in this schema