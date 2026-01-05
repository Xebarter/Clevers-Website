-- Comprehensive SQL schema for Resources functionality in Supabase
-- This script creates all necessary tables, storage buckets, and security policies for resources

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket for resources
-- Manual step: Create a bucket named 'resources' in the Supabase dashboard
-- The following SQL sets up the policies for that bucket:

-- After creating the 'resources' bucket manually in the dashboard, run:
-- Set up storage policies for resources
DROP POLICY IF EXISTS "Resources are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload resources" ON storage.objects;

-- Policy: Anyone can read resources (for public access to documents)
CREATE POLICY "Resources are viewable by everyone"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'resources' );

-- Policy: Authenticated users can upload resources (for admin)
CREATE POLICY "Users can upload resources"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'resources' );

-- Policy: Authenticated users can update resources
CREATE POLICY "Users can update resources"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'resources' );

-- Policy: Authenticated users can delete resources
CREATE POLICY "Users can delete resources"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'resources' );

-- Resources Table
-- Stores information about educational resources and documents
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  category TEXT, -- academic, forms, policies, calendar, newsletters
  type TEXT, -- file extension or type (pdf, docx, etc.)
  file_size INTEGER, -- file size in bytes
  upload_date DATE DEFAULT CURRENT_DATE,
  uploaded_by UUID REFERENCES auth.users (id), -- User who uploaded the resource
  is_featured BOOLEAN DEFAULT FALSE, -- Whether this resource should be featured
  download_count INTEGER DEFAULT 0, -- Track how many times the resource has been downloaded
  tags TEXT[] -- Array of tags for the resource
);

-- Create indexes for faster queries on resources
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources (category);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources (type);
CREATE INDEX IF NOT EXISTS idx_resources_is_featured ON resources (is_featured);
CREATE INDEX IF NOT EXISTS idx_resources_upload_date ON resources (upload_date);

-- Enable Row Level Security (RLS) on resources table
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policies for resources table
-- Policy: Authenticated users (admins) can manage all resources
CREATE POLICY "Admins can manage all resources"
ON resources FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Anyone can read resources (for public display)
CREATE POLICY "Anyone can read resources"
ON resources FOR SELECT
TO anon, authenticated
USING (true);

-- Resources Audit Log Table
-- Tracks changes to resources for audit purposes
CREATE TABLE IF NOT EXISTS resources_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users (id),
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB
);

-- Create index for faster queries on audit log
CREATE INDEX IF NOT EXISTS idx_resources_audit_log_resource_id ON resources_audit_log (resource_id);
CREATE INDEX IF NOT EXISTS idx_resources_audit_log_changed_at ON resources_audit_log (changed_at DESC);

-- Enable Row Level Security (RLS) on audit log table
ALTER TABLE resources_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy for audit log: Only admins can access
CREATE POLICY "Admins can access resources audit logs"
ON resources_audit_log FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Download Tracking Table
-- Tracks individual downloads for analytics
CREATE TABLE IF NOT EXISTS resource_downloads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT, -- Browser/OS information
  ip_address INET, -- IP address of the downloader
  user_id UUID REFERENCES auth.users (id) -- Authenticated user who downloaded
);

-- Create indexes for faster queries on download tracking
CREATE INDEX IF NOT EXISTS idx_resource_downloads_resource_id ON resource_downloads (resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_downloads_downloaded_at ON resource_downloads (downloaded_at);

-- Enable Row Level Security (RLS) on download tracking table
ALTER TABLE resource_downloads ENABLE ROW LEVEL SECURITY;

-- Policy for download tracking: Only admins can access
CREATE POLICY "Admins can access resource download logs"
ON resource_downloads FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON TABLE resources TO authenticated;
GRANT SELECT ON TABLE resources TO anon;
GRANT ALL ON TABLE resources_audit_log TO authenticated;
GRANT ALL ON TABLE resource_downloads TO authenticated;

-- Function to create a resource and log the creation
CREATE OR REPLACE FUNCTION create_resource_and_log(
  p_title TEXT,
  p_description TEXT,
  p_file_url TEXT,
  p_file_name TEXT,
  p_category TEXT,
  p_type TEXT,
  p_file_size INTEGER,
  p_uploaded_by UUID,
  p_is_featured BOOLEAN DEFAULT FALSE,
  p_tags TEXT[] DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_resource_id UUID;
  new_values JSONB;
BEGIN
  INSERT INTO resources (
    title,
    description,
    file_url,
    file_name,
    category,
    type,
    file_size,
    uploaded_by,
    is_featured,
    tags
  ) VALUES (
    p_title,
    p_description,
    p_file_url,
    p_file_name,
    p_category,
    p_type,
    p_file_size,
    p_uploaded_by,
    p_is_featured,
    p_tags
  )
  RETURNING id INTO new_resource_id;

  -- Log the creation
  new_values := jsonb_build_object(
    'id', new_resource_id,
    'title', p_title,
    'description', p_description,
    'file_url', p_file_url,
    'file_name', p_file_name,
    'category', p_category,
    'type', p_type,
    'file_size', p_file_size,
    'uploaded_by', p_uploaded_by,
    'is_featured', p_is_featured,
    'tags', p_tags
  );

  INSERT INTO resources_audit_log (
    resource_id,
    action,
    new_values,
    changed_by
  ) VALUES (
    new_resource_id,
    'INSERT',
    new_values,
    p_uploaded_by
  );

  RETURN new_resource_id;
END;
$$;

-- Function to track a resource download and update the download count
CREATE OR REPLACE FUNCTION track_resource_download(
  p_resource_id UUID,
  p_user_agent TEXT,
  p_ip_address INET,
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert the download record
  INSERT INTO resource_downloads (
    resource_id,
    user_agent,
    ip_address,
    user_id
  ) VALUES (
    p_resource_id,
    p_user_agent,
    p_ip_address,
    p_user_id
  );

  -- Update the download count
  UPDATE resources
  SET download_count = download_count + 1
  WHERE id = p_resource_id;
END;
$$;

