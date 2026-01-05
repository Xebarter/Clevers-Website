-- Comprehensive SQL schema for Announcements functionality in Supabase
-- This script creates all necessary tables, storage buckets, and security policies for announcements

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket for announcement images
-- Manual step: Create a bucket named 'announcements' in the Supabase dashboard
-- The following SQL sets up the policies for that bucket:

-- After creating the 'announcements' bucket manually in the dashboard, run:
-- Set up storage policies for announcement images
DROP POLICY IF EXISTS "Announcement images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload announcement images" ON storage.objects;

-- Policy: Anyone can read announcement images (for public display)
CREATE POLICY "Announcement images are viewable by everyone"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'announcements' );

-- Policy: Authenticated users can upload announcement images (for admin)
CREATE POLICY "Admins can upload announcement images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'announcements' );

-- Policy: Authenticated users can update announcement images
CREATE POLICY "Admins can update announcement images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'announcements' );

-- Policy: Authenticated users can delete announcement images
CREATE POLICY "Admins can delete announcement images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'announcements' );

-- Announcements Table
-- Stores information about school announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- general, academic, event, achievement, community
  pinned BOOLEAN DEFAULT FALSE, -- Whether this announcement should be pinned
  author TEXT, -- Author of the announcement
  image_url TEXT, -- URL to an associated image in Supabase storage
  cta_text TEXT, -- Call to action text
  cta_link TEXT, -- Call to action link
  tags TEXT[], -- Array of tags for the announcement
  created_by UUID REFERENCES auth.users (id), -- User who created the announcement
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries on announcements
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON announcements (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_category ON announcements (category);
CREATE INDEX IF NOT EXISTS idx_announcements_pinned ON announcements (pinned);
CREATE INDEX IF NOT EXISTS idx_announcements_author ON announcements (author);

-- Enable Row Level Security (RLS) on announcements table
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policies for announcements table
-- Policy: Authenticated users (admins) can manage all announcements
CREATE POLICY "Admins can manage all announcements"
ON announcements FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Anyone can read announcements (for public display)
CREATE POLICY "Anyone can read announcements"
ON announcements FOR SELECT
TO anon, authenticated
USING (true);

-- Announcements Audit Log Table
-- Tracks changes to announcements for audit purposes
CREATE TABLE IF NOT EXISTS announcements_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users (id),
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB
);

-- Create index for faster queries on audit log
CREATE INDEX IF NOT EXISTS idx_announcements_audit_log_announcement_id ON announcements_audit_log (announcement_id);
CREATE INDEX IF NOT EXISTS idx_announcements_audit_log_changed_at ON announcements_audit_log (changed_at DESC);

-- Enable Row Level Security (RLS) on audit log table
ALTER TABLE announcements_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy for audit log: Only admins can access
CREATE POLICY "Admins can access announcements audit logs"
ON announcements_audit_log FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at when announcement records are modified
DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
CREATE TRIGGER update_announcements_updated_at 
    BEFORE UPDATE ON announcements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create an announcement and log the creation
CREATE OR REPLACE FUNCTION create_announcement_and_log(
  p_title TEXT,
  p_content TEXT,
  p_category TEXT DEFAULT 'general',
  p_pinned BOOLEAN DEFAULT FALSE,
  p_author TEXT DEFAULT NULL,
  p_image_url TEXT DEFAULT NULL,
  p_cta_text TEXT DEFAULT NULL,
  p_cta_link TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT '{}',
  p_created_by UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_announcement_id UUID;
  new_values JSONB;
BEGIN
  INSERT INTO announcements (
    title,
    content,
    category,
    pinned,
    author,
    image_url,
    cta_text,
    cta_link,
    tags,
    created_by
  ) VALUES (
    p_title,
    p_content,
    p_category,
    p_pinned,
    p_author,
    p_image_url,
    p_cta_text,
    p_cta_link,
    p_tags,
    p_created_by
  )
  RETURNING id INTO new_announcement_id;

  -- Log the creation
  new_values := jsonb_build_object(
    'id', new_announcement_id,
    'title', p_title,
    'content', p_content,
    'category', p_category,
    'pinned', p_pinned,
    'author', p_author,
    'image_url', p_image_url,
    'cta_text', p_cta_text,
    'cta_link', p_cta_link,
    'tags', p_tags,
    'created_by', p_created_by
  );

  INSERT INTO announcements_audit_log (
    announcement_id,
    action,
    new_values,
    changed_by
  ) VALUES (
    new_announcement_id,
    'INSERT',
    new_values,
    p_created_by
  );

  RETURN new_announcement_id;
END;
$$;

-- The announcement categories were previously referenced here but have been removed since there is no categories table in this schema