-- ==========================================
-- VERIFICAR TODAS LAS TABLAS DE LA BASE DE DATOS
-- ==========================================

-- 1. Listar todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Buscar tablas que puedan ser 'feria' con otros nombres
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (
    table_name LIKE '%feria%' OR 
    table_name LIKE '%sector%' OR 
    table_name LIKE '%bloque%' OR 
    table_name LIKE '%puesto%'
)
ORDER BY table_name;

-- 3. Verificar estructura de tablas potenciales
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default
FROM information_schema.tables t
JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' 
AND t.table_type = 'BASE TABLE'
AND (
    t.table_name LIKE '%feria%' OR 
    t.table_name LIKE '%sector%' OR 
    t.table_name LIKE '%bloque%' OR 
    t.table_name LIKE '%puesto%'
)
ORDER BY t.table_name, c.ordinal_position;
