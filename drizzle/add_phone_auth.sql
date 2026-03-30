-- Migration: Add phone authentication fields to users table
-- This migration adds phone as the primary authentication method
-- SAFE VERSION - First check for existing data

-- Step 1: Add new columns to users table (safe operation)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verification_code VARCHAR(10);

-- Step 2: Check for existing users and prepare data
-- First, let's see what we're working with
-- SELECT COUNT(*) as total_users, COUNT(phone) as users_with_phone FROM users;

-- Step 3: Update existing users that don't have a phone number
-- Set a temporary phone number for existing users
UPDATE users 
SET phone = 'TEMP' || id || '000'
WHERE phone IS NULL OR phone = '';

-- Step 4: Make phone field NOT NULL (now that all users have one)
ALTER TABLE users 
ALTER COLUMN phone SET NOT NULL;

-- Step 5: Add unique constraint for phone
-- This will fail if there are duplicates, but at least we've set temporary values
ALTER TABLE users 
ADD CONSTRAINT users_phone_unique UNIQUE (phone);

-- Step 6: Make email optional (remove NOT NULL constraint)
-- This is safe because we're making it less restrictive
ALTER TABLE users 
ALTER COLUMN email DROP NOT NULL;

-- Step 7: Add indexes for better performance (safe operation)
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_phone_verified ON users(phone_verified);

-- Step 8: Add comments for documentation (safe operation)
COMMENT ON COLUMN users.phone IS 'Primary authentication method - Bolivian phone number (8 digits starting with 6 or 7)';
COMMENT ON COLUMN users.phone_verified IS 'Whether the phone number has been verified via SMS';
COMMENT ON COLUMN users.phone_verification_code IS 'Temporary SMS verification code';
COMMENT ON COLUMN users.email IS 'Optional email address - no longer primary auth method';

-- Step 9: Create a function to validate phone format (Bolivian format)
CREATE OR REPLACE FUNCTION validate_bolivian_phone(phone_number VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN phone_number ~ '^[67][0-9]{7}$';
END;
$$ LANGUAGE plpgsql;

-- Step 10: Add check constraint for phone format
ALTER TABLE users 
ADD CONSTRAINT valid_bolivian_phone 
CHECK (phone = 'TEMP' OR validate_bolivian_phone(phone));

-- Note: Users with TEMP phone numbers will need to update their profile
-- You can identify them with: SELECT * FROM users WHERE phone LIKE 'TEMP%';
