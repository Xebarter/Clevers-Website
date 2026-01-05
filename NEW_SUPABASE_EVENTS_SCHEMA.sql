-- Comprehensive SQL schema for Events functionality in Supabase
-- This script creates all necessary tables and security policies for events

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events Table
-- Stores information about school events
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  category TEXT DEFAULT 'academic', -- academic, sports, cultural, holiday, community
  is_all_day BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE, -- Whether this event should be featured
  created_by UUID REFERENCES auth.users (id), -- User who created the event
  tags TEXT[], -- Array of tags for the event
  registration_required BOOLEAN DEFAULT FALSE, -- Whether registration is required
  registration_link TEXT, -- Link for registration if required
  max_attendees INTEGER, -- Maximum number of attendees if limited
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries on events
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events (start_date);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON events (end_date);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_category ON events (category);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON events (is_featured);
CREATE INDEX IF NOT EXISTS idx_events_location ON events (location);

-- Enable Row Level Security (RLS) on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for events table
-- Policy: Authenticated users (admins) can manage all events
CREATE POLICY "Admins can manage all events"
ON events FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Anyone can read events (for public display)
CREATE POLICY "Anyone can read events"
ON events FOR SELECT
TO anon, authenticated
USING (true);

-- Events Audit Log Table
-- Tracks changes to events for audit purposes
CREATE TABLE IF NOT EXISTS events_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users (id),
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB
);

-- Create index for faster queries on audit log
CREATE INDEX IF NOT EXISTS idx_events_audit_log_event_id ON events_audit_log (event_id);
CREATE INDEX IF NOT EXISTS idx_events_audit_log_changed_at ON events_audit_log (changed_at DESC);

-- Enable Row Level Security (RLS) on audit log table
ALTER TABLE events_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy for audit log: Only admins can access
CREATE POLICY "Admins can access events audit logs"
ON events_audit_log FOR ALL
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

-- Trigger to automatically update updated_at when event records are modified
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create an event and log the creation
CREATE OR REPLACE FUNCTION create_event_and_log(
  p_title TEXT,
  p_description TEXT,
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE,
  p_location TEXT DEFAULT NULL,
  p_category TEXT DEFAULT 'academic',
  p_is_all_day BOOLEAN DEFAULT FALSE,
  p_is_featured BOOLEAN DEFAULT FALSE,
  p_created_by UUID DEFAULT NULL,
  p_tags TEXT[] DEFAULT '{}',
  p_registration_required BOOLEAN DEFAULT FALSE,
  p_registration_link TEXT DEFAULT NULL,
  p_max_attendees INTEGER DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_event_id UUID;
  new_values JSONB;
BEGIN
  INSERT INTO events (
    title,
    description,
    start_date,
    end_date,
    location,
    category,
    is_all_day,
    is_featured,
    created_by,
    tags,
    registration_required,
    registration_link,
    max_attendees
  ) VALUES (
    p_title,
    p_description,
    p_start_date,
    p_end_date,
    p_location,
    p_category,
    p_is_all_day,
    p_is_featured,
    p_created_by,
    p_tags,
    p_registration_required,
    p_registration_link,
    p_max_attendees
  )
  RETURNING id INTO new_event_id;

  -- Log the creation
  new_values := jsonb_build_object(
    'id', new_event_id,
    'title', p_title,
    'description', p_description,
    'start_date', p_start_date,
    'end_date', p_end_date,
    'location', p_location,
    'category', p_category,
    'is_all_day', p_is_all_day,
    'is_featured', p_is_featured,
    'created_by', p_created_by,
    'tags', p_tags,
    'registration_required', p_registration_required,
    'registration_link', p_registration_link,
    'max_attendees', p_max_attendees
  );

  INSERT INTO events_audit_log (
    event_id,
    action,
    new_values,
    changed_by
  ) VALUES (
    new_event_id,
    'INSERT',
    new_values,
    p_created_by
  );

  RETURN new_event_id;
END;
$$;

-- The event categories were previously referenced here but have been removed since there is no categories table in this schema