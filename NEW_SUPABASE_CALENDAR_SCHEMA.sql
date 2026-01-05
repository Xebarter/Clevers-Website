-- Comprehensive SQL schema for Calendar functionality in Supabase
-- This script creates all necessary tables and security policies for calendar management

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Academic Calendar Table
-- Stores academic calendar information and special dates
CREATE TABLE IF NOT EXISTS academic_calendar (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE, -- NULL if it's a single day event
  category TEXT DEFAULT 'academic', -- academic, exam, event, holiday, deadline, break
  is_recurring BOOLEAN DEFAULT FALSE, -- If this calendar item repeats annually
  recurrence_pattern TEXT, -- 'yearly', 'monthly', etc. (only if is_recurring is true)
  created_by UUID REFERENCES auth.users (id), -- User who created the calendar entry
  tags TEXT[], -- Array of tags for the calendar entry
  is_public BOOLEAN DEFAULT TRUE, -- Whether the calendar entry is visible to public
  location TEXT, -- Location if applicable
  priority INTEGER DEFAULT 1, -- 1: low, 2: normal, 3: high priority
  additional_details JSONB -- For storing any additional calendar-specific data
);

-- Create indexes for faster queries on academic calendar
CREATE INDEX IF NOT EXISTS idx_academic_calendar_start_date ON academic_calendar (start_date);
CREATE INDEX IF NOT EXISTS idx_academic_calendar_end_date ON academic_calendar (end_date);
CREATE INDEX IF NOT EXISTS idx_academic_calendar_created_at ON academic_calendar (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_academic_calendar_category ON academic_calendar (category);
CREATE INDEX IF NOT EXISTS idx_academic_calendar_is_public ON academic_calendar (is_public);
CREATE INDEX IF NOT EXISTS idx_academic_calendar_priority ON academic_calendar (priority);

-- Enable Row Level Security (RLS) on academic calendar table
ALTER TABLE academic_calendar ENABLE ROW LEVEL SECURITY;

-- Create policies for academic calendar table
-- Policy: Authenticated users (admins) can manage all calendar entries
CREATE POLICY "Admins can manage all calendar entries"
ON academic_calendar FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Anyone can read public calendar entries (for public display)
CREATE POLICY "Anyone can read public calendar entries"
ON academic_calendar FOR SELECT
TO anon, authenticated
USING (is_public = true);

-- Calendar Categories Table
-- Stores predefined categories for calendar events
CREATE TABLE IF NOT EXISTS calendar_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- academic, exam, event, holiday, deadline, break
  display_name TEXT NOT NULL,
  description TEXT,
  color_code TEXT DEFAULT '#000000', -- Color to display events of this category
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default calendar categories
INSERT INTO calendar_categories (name, display_name, description, color_code) VALUES 
  ('academic', 'Academic', 'Regular academic activities', '#3B82F6'),
  ('exam', 'Examinations', 'Examination periods', '#EF4444'),
  ('event', 'Events', 'Special events and activities', '#10B981'),
  ('holiday', 'Holidays', 'School holidays and breaks', '#8B5CF6'),
  ('deadline', 'Deadlines', 'Important deadlines', '#F59E0B'),
  ('break', 'School Break', 'School breaks and vacations', '#EC4899')
ON CONFLICT (name) DO NOTHING;

-- Calendar Audit Log Table
-- Tracks changes to calendar entries for audit purposes
CREATE TABLE IF NOT EXISTS calendar_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  calendar_id UUID NOT NULL REFERENCES academic_calendar(id) ON DELETE CASCADE,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users (id),
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB
);

-- Create index for faster queries on calendar audit log
CREATE INDEX IF NOT EXISTS idx_calendar_audit_log_calendar_id ON calendar_audit_log (calendar_id);
CREATE INDEX IF NOT EXISTS idx_calendar_audit_log_changed_at ON calendar_audit_log (changed_at DESC);

-- Enable Row Level Security (RLS) on audit log table
ALTER TABLE calendar_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy for calendar audit log: Only admins can access
CREATE POLICY "Admins can access calendar audit logs"
ON calendar_audit_log FOR ALL
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

-- Trigger to automatically update updated_at when calendar records are modified
DROP TRIGGER IF EXISTS update_academic_calendar_updated_at ON academic_calendar;
CREATE TRIGGER update_academic_calendar_updated_at 
    BEFORE UPDATE ON academic_calendar 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create a calendar entry and log the creation
CREATE OR REPLACE FUNCTION create_calendar_entry_and_log(
  p_title TEXT,
  p_description TEXT DEFAULT NULL,
  p_start_date DATE DEFAULT NULL,
  p_end_date DATE DEFAULT NULL,
  p_category TEXT DEFAULT 'academic',
  p_is_recurring BOOLEAN DEFAULT FALSE,
  p_recurrence_pattern TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL,
  p_tags TEXT[] DEFAULT '{}',
  p_is_public BOOLEAN DEFAULT TRUE,
  p_location TEXT DEFAULT NULL,
  p_priority INTEGER DEFAULT 1,
  p_additional_details JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_calendar_id UUID;
  new_values JSONB;
BEGIN
  INSERT INTO academic_calendar (
    title,
    description,
    start_date,
    end_date,
    category,
    is_recurring,
    recurrence_pattern,
    created_by,
    tags,
    is_public,
    location,
    priority,
    additional_details
  ) VALUES (
    p_title,
    p_description,
    p_start_date,
    p_end_date,
    p_category,
    p_is_recurring,
    p_recurrence_pattern,
    p_created_by,
    p_tags,
    p_is_public,
    p_location,
    p_priority,
    p_additional_details
  )
  RETURNING id INTO new_calendar_id;

  -- Log the creation
  new_values := jsonb_build_object(
    'id', new_calendar_id,
    'title', p_title,
    'description', p_description,
    'start_date', p_start_date,
    'end_date', p_end_date,
    'category', p_category,
    'is_recurring', p_is_recurring,
    'recurrence_pattern', p_recurrence_pattern,
    'created_by', p_created_by,
    'tags', p_tags,
    'is_public', p_is_public,
    'location', p_location,
    'priority', p_priority,
    'additional_details', p_additional_details
  );

  INSERT INTO calendar_audit_log (
    calendar_id,
    action,
    new_values,
    changed_by
  ) VALUES (
    new_calendar_id,
    'INSERT',
    new_values,
    p_created_by
  );

  RETURN new_calendar_id;
END;
$$;

-- The calendar categories were previously referenced here but have been removed since there is no categories table in this schema