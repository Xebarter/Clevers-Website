-- Add application_status column to applications table
-- This column is needed to track the status of applications separate from payment status

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS application_status TEXT DEFAULT 'SUBMITTED';

-- Add an index for the new column to improve query performance
CREATE INDEX IF NOT EXISTS idx_applications_application_status ON applications (application_status);

-- Update the RLS policies if needed to include the new column
-- (These are already in the main schema file, so we don't need to add them again)

-- Refresh the schema cache to include the new column
NOTIFY pgrst, 'reload schema';