-- Comprehensive SQL schema for Application functionality in Supabase
-- This script creates all necessary tables, storage buckets, and security policies for applications

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket for application documents
-- Manual step: Create a bucket named 'application-documents' in the Supabase dashboard
-- The following SQL sets up the policies for that bucket:

-- After creating the 'application-documents' bucket manually in the dashboard, run:
-- Set up storage policies for application documents
DROP POLICY IF EXISTS "Application documents are viewable by authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload application documents" ON storage.objects;

-- Policy: Authenticated users can read application documents (for admin access)
CREATE POLICY "Application documents are viewable by authenticated users"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'application-documents' );

-- Policy: Authenticated users can upload documents (for admin or users during application)
CREATE POLICY "Users can upload application documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'application-documents' );

-- Policy: Authenticated users can update documents
CREATE POLICY "Users can update application documents"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'application-documents' );

-- Policy: Authenticated users can delete documents
CREATE POLICY "Users can delete application documents"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'application-documents' );

-- Applications Table
-- Stores student application information
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  address TEXT,
  grade_level TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  campus TEXT NOT NULL,
  boarding TEXT,
  previous_school TEXT,
  special_needs TEXT,
  how_heard TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  application_file_url TEXT, -- URL to any uploaded application documents
  reviewed_by UUID REFERENCES auth.users (id),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries on applications
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications (email);
CREATE INDEX IF NOT EXISTS idx_applications_campus ON applications (campus);
CREATE INDEX IF NOT EXISTS idx_applications_payment_status ON applications (payment_status);

-- Enable Row Level Security (RLS) on applications table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies for applications table
-- Policy: Authenticated users (admins) can manage applications
CREATE POLICY "Admins can manage all applications"
ON applications FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Users can read applications (for their own applications)
CREATE POLICY "Users can read their own applications"
ON applications FOR SELECT
TO authenticated
USING (
  auth.uid() = reviewed_by 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Policy: Users can create applications
CREATE POLICY "Users can create applications"
ON applications FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Users can update their own applications (only when pending)
CREATE POLICY "Users can update their pending applications"
ON applications FOR UPDATE
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid()) 
  AND status = 'pending'
);

-- Applications Audit Log Table
-- Tracks changes to applications for audit purposes
CREATE TABLE IF NOT EXISTS application_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users (id),
  old_status TEXT,
  new_status TEXT,
  old_payment_status TEXT,
  new_payment_status TEXT,
  notes TEXT
);

-- Create index for faster queries on audit log
CREATE INDEX IF NOT EXISTS idx_application_audit_log_application_id ON application_audit_log (application_id);
CREATE INDEX IF NOT EXISTS idx_application_audit_log_changed_at ON application_audit_log (changed_at DESC);

-- Enable Row Level Security (RLS) on audit log table
ALTER TABLE application_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy for audit log: Only admins can access
CREATE POLICY "Admins can access application audit logs"
ON application_audit_log FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert a sample application category if needed
-- Note: The categories table already exists in the main schema, but we can add application-specific categories if needed

-- Grant necessary permissions
GRANT ALL ON TABLE applications TO authenticated;
GRANT SELECT ON TABLE applications TO anon;
GRANT ALL ON TABLE application_audit_log TO authenticated;

-- Function to create an application and log the creation
CREATE OR REPLACE FUNCTION create_application_and_log(
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_date_of_birth DATE,
  p_gender TEXT,
  p_address TEXT,
  p_grade_level TEXT,
  p_parent_name TEXT,
  p_parent_email TEXT,
  p_parent_phone TEXT,
  p_campus TEXT,
  p_boarding TEXT,
  p_previous_school TEXT,
  p_special_needs TEXT,
  p_how_heard TEXT,
  p_message TEXT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_application_id UUID;
BEGIN
  INSERT INTO applications (
    name,
    email,
    phone,
    date_of_birth,
    gender,
    address,
    grade_level,
    parent_name,
    parent_email,
    parent_phone,
    campus,
    boarding,
    previous_school,
    special_needs,
    how_heard,
    message
  ) VALUES (
    p_name,
    p_email,
    p_phone,
    p_date_of_birth,
    p_gender,
    p_address,
    p_grade_level,
    p_parent_name,
    p_parent_email,
    p_parent_phone,
    p_campus,
    p_boarding,
    p_previous_school,
    p_special_needs,
    p_how_heard,
    p_message
  )
  RETURNING id INTO new_application_id;

  RETURN new_application_id;
END;
$$;

-- Insert default application statuses if needed
-- This would be used by admin interfaces to update application status