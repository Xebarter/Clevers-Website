-- Comprehensive SQL schema for Hall of Fame functionality in Supabase
-- This script creates all necessary tables, storage buckets, and security policies for Hall of Fame entries

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage bucket for hall of fame images
-- Manual step: Create a bucket named 'hall-of-fame-images' in the Supabase dashboard
-- The following SQL sets up the policies for that bucket:

-- After creating the 'hall-of-fame-images' bucket manually in the dashboard, run:
-- Set up storage policies for hall of fame images
DROP POLICY IF EXISTS "Hall of fame images are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload hall of fame images" ON storage.objects;

-- Policy: Anyone can read hall of fame images (for public display)
CREATE POLICY "Hall of fame images are viewable by everyone"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'hall-of-fame-images' );

-- Policy: Authenticated users can upload images (for admin)
CREATE POLICY "Users can upload hall of fame images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'hall-of-fame-images' );

-- Policy: Authenticated users can update images
CREATE POLICY "Users can update hall of fame images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'hall-of-fame-images' );

-- Policy: Authenticated users can delete images
CREATE POLICY "Users can delete hall of fame images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'hall-of-fame-images' );

-- Hall of Fame Table
-- Stores information about learners or groups with significant achievements
CREATE TABLE IF NOT EXISTS hall_of_fame (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Entry details (SIMPLIFIED - only 4 required fields)
  title TEXT NOT NULL, -- Auto-generated from learner_names
  learner_names TEXT NOT NULL, -- Single learner or group of learners
  achievement TEXT NOT NULL, -- Description of the achievement
  achievement_date DATE NOT NULL, -- When the achievement was accomplished
  
  -- Media
  image_url TEXT NOT NULL, -- Main image URL from storage
  image_alt_text TEXT, -- Alt text for accessibility (optional)
  
  -- Display settings
  is_featured BOOLEAN DEFAULT FALSE, -- Whether to highlight this entry
  is_published BOOLEAN DEFAULT TRUE, -- Whether to show on public site
  
  -- Optional fields (kept for backward compatibility but not required in form)
  category TEXT, -- Optional: "Academic", "Sports", "Arts", etc.
  grade_level TEXT, -- Optional: Grade level at time of achievement
  campus TEXT, -- Optional: "Kitintale", "Kasokoso", "Maganjo", "All Campuses"
  description TEXT, -- Optional: Longer description
  recognition_details TEXT, -- Optional: Awards details
  display_order INTEGER DEFAULT 0, -- Optional: Custom ordering
  tags TEXT[], -- Optional: Tags for filtering
  
  -- Metadata
  created_by UUID REFERENCES auth.users (id) -- Admin who created the entry
);

-- Create indexes for faster queries on hall of fame
CREATE INDEX IF NOT EXISTS idx_hall_of_fame_created_at ON hall_of_fame (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hall_of_fame_achievement_date ON hall_of_fame (achievement_date DESC);
CREATE INDEX IF NOT EXISTS idx_hall_of_fame_category ON hall_of_fame (category);
CREATE INDEX IF NOT EXISTS idx_hall_of_fame_campus ON hall_of_fame (campus);
CREATE INDEX IF NOT EXISTS idx_hall_of_fame_is_featured ON hall_of_fame (is_featured);
CREATE INDEX IF NOT EXISTS idx_hall_of_fame_is_published ON hall_of_fame (is_published);
CREATE INDEX IF NOT EXISTS idx_hall_of_fame_display_order ON hall_of_fame (display_order ASC);

-- Enable Row Level Security (RLS) on hall of fame table
ALTER TABLE hall_of_fame ENABLE ROW LEVEL SECURITY;

-- Create policies for hall of fame table
-- Policy: Authenticated users (admins) can manage all hall of fame entries
CREATE POLICY "Admins can manage all hall of fame entries"
ON hall_of_fame FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Anyone can read published hall of fame entries (for public display)
CREATE POLICY "Anyone can read published hall of fame entries"
ON hall_of_fame FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Hall of Fame Audit Log Table
-- Tracks changes to hall of fame entries for audit purposes
CREATE TABLE IF NOT EXISTS hall_of_fame_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hall_of_fame_id UUID NOT NULL REFERENCES hall_of_fame(id) ON DELETE CASCADE,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users (id),
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB
);

-- Create index for faster queries on audit log
CREATE INDEX IF NOT EXISTS idx_hall_of_fame_audit_log_hall_of_fame_id ON hall_of_fame_audit_log (hall_of_fame_id);
CREATE INDEX IF NOT EXISTS idx_hall_of_fame_audit_log_changed_at ON hall_of_fame_audit_log (changed_at DESC);

-- Enable Row Level Security (RLS) on audit log table
ALTER TABLE hall_of_fame_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy for audit log: Only admins can access
CREATE POLICY "Admins can access hall of fame audit logs"
ON hall_of_fame_audit_log FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON TABLE hall_of_fame TO authenticated;
GRANT SELECT ON TABLE hall_of_fame TO anon;
GRANT ALL ON TABLE hall_of_fame_audit_log TO authenticated;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_hall_of_fame_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_hall_of_fame_timestamp
BEFORE UPDATE ON hall_of_fame
FOR EACH ROW
EXECUTE FUNCTION update_hall_of_fame_updated_at();

-- Function to create a hall of fame entry and log the creation
CREATE OR REPLACE FUNCTION create_hall_of_fame_and_log(
  p_title TEXT,
  p_learner_names TEXT,
  p_achievement TEXT,
  p_achievement_date DATE,
  p_image_url TEXT,
  p_image_alt_text TEXT,
  p_category TEXT,
  p_grade_level TEXT,
  p_campus TEXT,
  p_description TEXT,
  p_recognition_details TEXT,
  p_is_featured BOOLEAN,
  p_display_order INTEGER,
  p_is_published BOOLEAN,
  p_created_by UUID,
  p_tags TEXT[]
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_hall_of_fame_id UUID;
  new_values JSONB;
BEGIN
  INSERT INTO hall_of_fame (
    title,
    learner_names,
    achievement,
    achievement_date,
    image_url,
    image_alt_text,
    category,
    grade_level,
    campus,
    description,
    recognition_details,
    is_featured,
    display_order,
    is_published,
    created_by,
    tags
  ) VALUES (
    p_title,
    p_learner_names,
    p_achievement,
    p_achievement_date,
    p_image_url,
    p_image_alt_text,
    p_category,
    p_grade_level,
    p_campus,
    p_description,
    p_recognition_details,
    p_is_featured,
    p_display_order,
    p_is_published,
    p_created_by,
    p_tags
  )
  RETURNING id INTO new_hall_of_fame_id;

  -- Log the creation
  new_values := jsonb_build_object(
    'id', new_hall_of_fame_id,
    'title', p_title,
    'learner_names', p_learner_names,
    'achievement', p_achievement,
    'achievement_date', p_achievement_date,
    'image_url', p_image_url,
    'image_alt_text', p_image_alt_text,
    'category', p_category,
    'grade_level', p_grade_level,
    'campus', p_campus,
    'description', p_description,
    'recognition_details', p_recognition_details,
    'is_featured', p_is_featured,
    'display_order', p_display_order,
    'is_published', p_is_published,
    'created_by', p_created_by,
    'tags', p_tags
  );

  INSERT INTO hall_of_fame_audit_log (
    hall_of_fame_id,
    action,
    new_values,
    changed_by
  ) VALUES (
    new_hall_of_fame_id,
    'INSERT',
    new_values,
    p_created_by
  );

  RETURN new_hall_of_fame_id;
END;
$$;

-- Sample data (optional - uncomment to insert sample entries)
-- SIMPLIFIED VERSION - Only 4 required fields + image
/*
INSERT INTO hall_of_fame (
  title,
  learner_names,
  achievement,
  achievement_date,
  image_url,
  is_featured,
  is_published
) VALUES
(
  'Sarah Nakato',
  'Sarah Nakato',
  'First Place in National Spelling Bee Competition',
  '2024-06-15',
  '/placeholder-image.jpg',
  true,
  true
),
(
  'John Doe',
  'John Doe',
  'Gold Medal in International Mathematics Olympiad',
  '2024-07-20',
  '/placeholder-image.jpg',
  false,
  true
);
*/
