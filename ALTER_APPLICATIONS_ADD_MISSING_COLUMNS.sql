-- Add missing columns to applications table
-- These columns are needed for the application form and proper data handling

-- Add relationship column
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS relationship TEXT;

-- Add student_name column (for the actual student name)
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS student_name TEXT;

-- Add date_of_birth column (already referenced in API but may be missing)
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Add grade_level column (already referenced in API but may be missing)
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS grade_level TEXT;

-- Add previous_school column
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS previous_school TEXT;

-- Add special_needs column
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS special_needs TEXT;

-- Add how_heard column
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS how_heard TEXT;

-- Add application_status column (if not already added)
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS application_status TEXT DEFAULT 'SUBMITTED';

-- Add payment_confirmation_code column
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS payment_confirmation_code TEXT;

-- Add payment_amount column
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS payment_amount DECIMAL;

-- Add payment_currency column
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS payment_currency TEXT DEFAULT 'UGX';

-- Add payment_date column
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP WITH TIME ZONE;

-- Create or update the index for application_status
CREATE INDEX IF NOT EXISTS idx_applications_application_status ON applications (application_status);

-- Refresh the schema cache to include the new columns
NOTIFY pgrst, 'reload schema';