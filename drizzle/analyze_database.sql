-- Database Analysis Script
-- Run this in Supabase SQL Editor to give me complete visibility

-- 1. List all tables
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check stores table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'stores' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check store_pages table structure  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'store_pages' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Check store_sections table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'store_sections' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Check foreign key constraints
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 6. Check if stores table has data
SELECT COUNT(*) as store_count FROM stores;

-- 7. Check if store_pages has data
SELECT COUNT(*) as pages_count FROM store_pages;

-- 8. Check if store_sections has data
SELECT COUNT(*) as sections_count FROM store_sections;

-- 9. Show sample data from stores (if any)
SELECT id, name, link, user_id, is_published, created_at 
FROM stores 
LIMIT 3;

-- 10. Check problematic tables (users, waitlist, etc.)
SELECT table_name, column_name, data_type
FROM information_schema.columns 
WHERE table_name IN ('users', 'waitlist', 'user_profiles', 'user_sessions', 'user_activity_log')
AND table_schema = 'public'
AND column_name = 'id'
ORDER BY table_name;
