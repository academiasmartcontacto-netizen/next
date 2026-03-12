-- Fix existing tables with wrong data types
-- Run this in Supabase SQL Editor

-- Drop and recreate waitlist table (it has integer id)
DROP TABLE IF EXISTS waitlist CASCADE;

-- Recreate waitlist with proper UUID
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Check if other tables need similar fixes
-- For tables that might have integer IDs, we need to recreate them

-- Check users table structure first
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;
