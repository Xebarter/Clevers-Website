-- Comprehensive SQL schema for Messages functionality in Supabase
-- This script creates all necessary tables and security policies for messages

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Messages Table
-- Stores information about contact form submissions and other messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  replied BOOLEAN DEFAULT FALSE,
  reply_date TIMESTAMP WITH TIME ZONE,
  category TEXT DEFAULT 'general', -- For categorizing different types of messages
  priority TEXT DEFAULT 'normal', -- low, normal, high, urgent
  tags TEXT[], -- Array of tags for the message
  replied_by UUID REFERENCES auth.users (id) -- User who replied to the message
);

-- Create indexes for faster queries on messages
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read_status ON messages (read_status);
CREATE INDEX IF NOT EXISTS idx_messages_category ON messages (category);
CREATE INDEX IF NOT EXISTS idx_messages_priority ON messages (priority);
CREATE INDEX IF NOT EXISTS idx_messages_email ON messages (email);

-- Enable Row Level Security (RLS) on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages table
-- Policy: Authenticated users (admins) can manage all messages
CREATE POLICY "Admins can manage all messages"
ON messages FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Users can read messages (for admin panel)
CREATE POLICY "Users can read messages"
ON messages FOR SELECT
TO authenticated
USING (true);

-- Messages Audit Log Table
-- Tracks changes to messages for audit purposes
CREATE TABLE IF NOT EXISTS messages_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users (id),
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB
);

-- Create index for faster queries on audit log
CREATE INDEX IF NOT EXISTS idx_messages_audit_log_message_id ON messages_audit_log (message_id);
CREATE INDEX IF NOT EXISTS idx_messages_audit_log_changed_at ON messages_audit_log (changed_at DESC);

-- Enable Row Level Security (RLS) on audit log table
ALTER TABLE messages_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy for audit log: Only admins can access
CREATE POLICY "Admins can access messages audit logs"
ON messages_audit_log FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Function to create a message and log the creation
CREATE OR REPLACE FUNCTION create_message_and_log(
  p_name TEXT,
  p_email TEXT,
  p_subject TEXT,
  p_message TEXT,
  p_category TEXT DEFAULT 'general',
  p_priority TEXT DEFAULT 'normal',
  p_tags TEXT[] DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  new_message_id UUID;
  new_values JSONB;
BEGIN
  INSERT INTO messages (
    name,
    email,
    subject,
    message,
    category,
    priority,
    tags
  ) VALUES (
    p_name,
    p_email,
    p_subject,
    p_message,
    p_category,
    p_priority,
    p_tags
  )
  RETURNING id INTO new_message_id;

  -- Log the creation
  new_values := jsonb_build_object(
    'id', new_message_id,
    'name', p_name,
    'email', p_email,
    'subject', p_subject,
    'message', p_message,
    'category', p_category,
    'priority', p_priority,
    'tags', p_tags
  );

  INSERT INTO messages_audit_log (
    message_id,
    action,
    new_values
  ) VALUES (
    new_message_id,
    'INSERT',
    new_values
  );

  RETURN new_message_id;
END;
$$;

-- Function to update message read status
CREATE OR REPLACE FUNCTION update_message_read_status(
  p_message_id UUID,
  p_read_status BOOLEAN,
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  old_values JSONB;
  new_values JSONB;
BEGIN
  -- Get old values for audit log
  SELECT 
    jsonb_build_object(
      'id', id,
      'read_status', read_status
    )
  INTO old_values
  FROM messages
  WHERE id = p_message_id;

  -- Update the message
  UPDATE messages
  SET 
    read_status = p_read_status,
    read_at = CASE 
      WHEN p_read_status = TRUE THEN NOW()
      ELSE read_at
    END
  WHERE id = p_message_id;

  -- Get new values for audit log
  SELECT 
    jsonb_build_object(
      'id', id,
      'read_status', read_status
    )
  INTO new_values
  FROM messages
  WHERE id = p_message_id;

  -- Log the update
  INSERT INTO messages_audit_log (
    message_id,
    action,
    old_values,
    new_values,
    changed_by
  ) VALUES (
    p_message_id,
    'UPDATE',
    old_values,
    new_values,
    p_user_id
  );
END;
$$;

-- Function to mark message as replied
CREATE OR REPLACE FUNCTION mark_message_as_replied(
  p_message_id UUID,
  p_replied_by UUID
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  old_values JSONB;
  new_values JSONB;
BEGIN
  -- Get old values for audit log
  SELECT 
    jsonb_build_object(
      'id', id,
      'replied', replied,
      'reply_date', reply_date,
      'replied_by', replied_by
    )
  INTO old_values
  FROM messages
  WHERE id = p_message_id;

  -- Update the message
  UPDATE messages
  SET 
    replied = TRUE,
    reply_date = NOW(),
    replied_by = p_replied_by
  WHERE id = p_message_id;

  -- Get new values for audit log
  SELECT 
    jsonb_build_object(
      'id', id,
      'replied', replied,
      'reply_date', reply_date,
      'replied_by', replied_by
    )
  INTO new_values
  FROM messages
  WHERE id = p_message_id;

  -- Log the update
  INSERT INTO messages_audit_log (
    message_id,
    action,
    old_values,
    new_values,
    changed_by
  ) VALUES (
    p_message_id,
    'UPDATE',
    old_values,
    new_values,
    p_replied_by
  );
END;
$$;

-- The message categories were previously referenced here but have been removed since there is no categories table in this schema