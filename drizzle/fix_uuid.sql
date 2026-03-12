-- Fix UUID casting issues in existing tables
-- This SQL should be run manually in Supabase SQL Editor

-- Fix waitlist table if it exists
ALTER TABLE IF EXISTS waitlist 
ALTER COLUMN id TYPE uuid USING id::uuid;

-- Fix users table if it exists  
ALTER TABLE IF EXISTS users
ALTER COLUMN id TYPE uuid USING id::uuid;

-- Fix user_profiles table if it exists
ALTER TABLE IF EXISTS user_profiles
ALTER COLUMN id TYPE uuid USING id::uuid,
ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Fix user_sessions table if it exists
ALTER TABLE IF EXISTS user_sessions
ALTER COLUMN id TYPE uuid USING id::uuid,
ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

-- Fix user_activity_log table if it exists
ALTER TABLE IF EXISTS user_activity_log
ALTER COLUMN id TYPE uuid USING id::uuid,
ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
