-- Ver TODAS las tablas en public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Ver TODAS las columnas de stores (solo las que existen)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'stores' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ver si store_navigation_sections existe
SELECT COUNT(*) as table_exists 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name = 'store_navigation_sections';
