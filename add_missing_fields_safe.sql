-- Migración segura para agregar campos faltantes a products
-- SIN BORRAR TABLAS EXISTENTES

-- Agregar campos faltantes a la tabla products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS categoria_id TEXT,
ADD COLUMN IF NOT EXISTS subcategoria_id TEXT,
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'nuevo',
ADD COLUMN IF NOT EXISTS departamento TEXT,
ADD COLUMN IF NOT EXISTS municipio TEXT;

-- Confirmación
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
ORDER BY ordinal_position;
