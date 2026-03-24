-- Ver todas las columnas de la tabla stores
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'stores' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ver si existe la tabla store_navigation_sections
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name = 'store_navigation_sections';

-- Ver estructura de store_navigation_sections si existe
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'store_navigation_sections' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Contar registros en stores
SELECT COUNT(*) as total_stores FROM stores;

-- Ver algunas filas para entender los datos
SELECT 
    id,
    name,
    link,
    logo,
    navbar_color,
    -- Columnas que Drizzle quiere eliminar
    navbar_style,
    section_position,
    estilo_bordes,
    estilo_fondo,
    tipografia,
    tamano_texto,
    estilo_tarjetas,
    estilo_fotos,
    grid_density,
    menu_items
FROM stores 
LIMIT 3;
