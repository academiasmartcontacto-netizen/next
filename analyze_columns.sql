-- Analizar las columnas que Drizzle quiere eliminar
-- Ver qué datos contienen realmente

-- 1. Ver si navbar_style tiene datos útiles
SELECT 
    'navbar_style' as columna,
    COUNT(*) as total_registros,
    COUNT(DISTINCT navbar_style) as valores_unicos,
    ARRAY_AGG(DISTINCT navbar_style) as valores
FROM stores 
WHERE navbar_style IS NOT NULL;

-- 2. Ver si section_position tiene datos útiles  
SELECT 
    'section_position' as columna,
    COUNT(*) as total_registros,
    COUNT(DISTINCT section_position) as valores_unicos,
    ARRAY_AGG(DISTINCT section_position) as valores
FROM stores 
WHERE section_position IS NOT NULL;

-- 3. Ver si estilo_bordes tiene datos útiles
SELECT 
    'estilo_bordes' as columna,
    COUNT(*) as total_registros,
    COUNT(DISTINCT estilo_bordes) as valores_unicos,
    ARRAY_AGG(DISTINCT estilo_bordes) as valores
FROM stores 
WHERE estilo_bordes IS NOT NULL;

-- 4. Ver si estilo_fondo tiene datos útiles
SELECT 
    'estilo_fondo' as columna,
    COUNT(*) as total_registros,
    COUNT(DISTINCT estilo_fondo) as valores_unicos,
    ARRAY_AGG(DISTINCT estilo_fondo) as valores
FROM stores 
WHERE estilo_fondo IS NOT NULL;

-- 5. Ver si tipografia tiene datos útiles
SELECT 
    'tipografia' as columna,
    COUNT(*) as total_registros,
    COUNT(DISTINCT tipografia) as valores_unicos,
    ARRAY_AGG(DISTINCT tipografia) as valores
FROM stores 
WHERE tipografia IS NOT NULL;

-- 6. Ver si tamano_texto tiene datos útiles
SELECT 
    'tamano_texto' as columna,
    COUNT(*) as total_registros,
    COUNT(DISTINCT tamano_texto) as valores_unicos,
    ARRAY_AGG(DISTINCT tamano_texto) as valores
FROM stores 
WHERE tamano_texto IS NOT NULL;

-- 7. Ver si estilo_tarjetas tiene datos útiles
SELECT 
    'estilo_tarjetas' as columna,
    COUNT(*) as total_registros,
    COUNT(DISTINCT estilo_tarjetas) as valores_unicos,
    ARRAY_AGG(DISTINCT estilo_tarjetas) as valores
FROM stores 
WHERE estilo_tarjetas IS NOT NULL;

-- 8. Ver si estilo_fotos tiene datos útiles
SELECT 
    'estilo_fotos' as columna,
    COUNT(*) as total_registros,
    COUNT(DISTINCT estilo_fotos) as valores_unicos,
    ARRAY_AGG(DISTINCT estilo_fotos) as valores
FROM stores 
WHERE estilo_fotos IS NOT NULL;

-- 9. Ver si grid_density tiene datos útiles
SELECT 
    'grid_density' as columna,
    COUNT(*) as total_registros,
    COUNT(DISTINCT grid_density) as valores_unicos,
    ARRAY_AGG(DISTINCT grid_density) as valores
FROM stores 
WHERE grid_density IS NOT NULL;

-- 10. Ver si menu_items tiene datos útiles
SELECT 
    'menu_items' as columna,
    COUNT(*) as total_registros,
    COUNT(DISTINCT menu_items) as valores_unicos,
    ARRAY_AGG(DISTINCT menu_items) as valores
FROM stores 
WHERE menu_items IS NOT NULL;

-- Resumen final
SELECT 
    'ANÁLISIS COMPLETO' as estado,
    'Ejecuta todas las consultas para decidir qué columnas eliminar' as instruccion;
