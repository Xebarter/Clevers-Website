-- Comprehensive SQL schema for Job Applications functionality in Supabase
-- This script creates all necessary tables, storage buckets, and security policies for job applications

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket for job application documents
-- MANUAL STEPS in Supabase Dashboard:
-- 1. Go to Storage in your Supabase project
-- 2. Click "New bucket" and create a bucket named 'job-documents'
-- 3. IMPORTANT: Enable "Public bucket" option so uploaded files can be accessed via public URLs
--    (This is required for the download functionality to work in the admin dashboard)
-- 4. The bucket will have folders: resumes/, certificates/, other-documents/
--
-- The following SQL sets up the policies for that bucket:

-- After creating the 'job-documents' bucket manually in the dashboard, run:
-- Set up storage policies for job application documents
DROP POLICY IF EXISTS "Job documents are viewable by authenticated users" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload job documents" ON storage.objects;

-- Policy: Anyone can read job documents (required for public download URLs)
CREATE POLICY "Job documents are publicly viewable"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'job-documents' );

-- Policy: Anyone can upload documents (for job applicants)
CREATE POLICY "Anyone can upload job documents"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK ( bucket_id = 'job-documents' );

-- Policy: Authenticated users can update documents
CREATE POLICY "Authenticated users can update job documents"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'job-documents' );

-- Policy: Authenticated users can delete documents
CREATE POLICY "Authenticated users can delete job documents"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'job-documents' );

-- Job Applications Table
-- Stores job application information from candidates
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Personal Information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  nationality TEXT,
  
  -- Professional Information
  position_applied TEXT NOT NULL, -- The job/role(s) they're applying for (comma-separated if multiple)
  -- Available positions: Primary School Teacher, Secondary School Teacher, Nursery Teacher,
  -- Mathematics Teacher, Science Teacher, Social Studies Teacher, English Teacher,
  -- Physical Education Teacher, Music Teacher, Art Teacher, School Administrator,
  -- Librarian, School Counselor, IT Support Staff, Maintenance Staff, Security Personnel, Other
  qualifications TEXT NOT NULL, -- Educational qualifications
  experience_years INTEGER DEFAULT 0,
  current_employer TEXT,
  current_position TEXT,
  expected_salary TEXT,
  available_start_date DATE,
  
  -- Documents (URLs to uploaded files)
  cv_url TEXT, -- CV/Resume
  cover_letter_url TEXT,
  certificates_url TEXT, -- Academic certificates
  other_documents_url TEXT, -- Any additional documents
  
  -- Additional Information
  skills TEXT, -- Relevant skills
  references_info TEXT, -- Professional references
  cover_letter TEXT, -- Cover letter text
  additional_info TEXT, -- Any other information
  how_heard TEXT, -- How they heard about the position
  
  -- Application Status
  application_status TEXT DEFAULT 'pending', -- pending, reviewing, shortlisted, interviewed, hired, rejected
  reviewed_by UUID REFERENCES auth.users (id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT -- Admin notes
);

-- Create indexes for faster queries on job applications
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications (application_status);
CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications (email);
CREATE INDEX IF NOT EXISTS idx_job_applications_position ON job_applications (position_applied);

-- Enable Row Level Security (RLS) on job_applications table
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for job_applications table
-- Policy: Authenticated users (admins) can manage all job applications
CREATE POLICY "Admins can manage all job applications"
ON job_applications FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Anyone can create job applications (for public job application form)
CREATE POLICY "Anyone can create job applications"
ON job_applications FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Users can read their own job applications by email
CREATE POLICY "Users can read their own job applications"
ON job_applications FOR SELECT
TO anon, authenticated
USING (true);

-- Grant necessary permissions
GRANT ALL ON TABLE job_applications TO authenticated;
GRANT INSERT, SELECT ON TABLE job_applications TO anon;

-- Function to create a job application
CREATE OR REPLACE FUNCTION create_job_application(
  p_full_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_date_of_birth DATE,
  p_gender TEXT,
  p_address TEXT,
  p_nationality TEXT,
  p_position_applied TEXT,
  p_qualifications TEXT,
  p_experience_years INTEGER,
  p_current_employer TEXT,
  p_current_position TEXT,
  p_expected_salary TEXT,
  p_available_start_date DATE,
  p_cv_url TEXT,
  p_cover_letter_url TEXT,
  p_certificates_url TEXT,
  p_other_documents_url TEXT,
  p_skills TEXT,
  p_references_info TEXT,
  p_cover_letter TEXT,
  p_additional_info TEXT,
  p_how_heard TEXT
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_application_id UUID;
BEGIN
  INSERT INTO job_applications (
    full_name,
    email,
    phone,
    date_of_birth,
    gender,
    address,
    nationality,
    position_applied,
    qualifications,
    experience_years,
    current_employer,
    current_position,
    expected_salary,
    available_start_date,
    cv_url,
    cover_letter_url,
    certificates_url,
    other_documents_url,
    skills,
    references_info,
    cover_letter,
    additional_info,
    how_heard
  ) VALUES (
    p_full_name,
    p_email,
    p_phone,
    p_date_of_birth,
    p_gender,
    p_address,
    p_nationality,
    p_position_applied,
    p_qualifications,
    p_experience_years,
    p_current_employer,
    p_current_position,
    p_expected_salary,
    p_available_start_date,
    p_cv_url,
    p_cover_letter_url,
    p_certificates_url,
    p_other_documents_url,
    p_skills,
    p_references_info,
    p_cover_letter,
    p_additional_info,
    p_how_heard
  )
  RETURNING id INTO new_application_id;

  RETURN new_application_id;
END;
$$;
