-- ==========================================
-- CORREGIR TIPO DE DATO EN feria_puestos.bloque_id (VERSION CORREGIDA)
-- ==========================================

-- 1. Primero, eliminar el índice único si existe
DROP INDEX IF EXISTS idx_feria_puestos_unique;

-- 2. Eliminar la constraint de foreign key si existe
ALTER TABLE feria_puestos DROP CONSTRAINT IF EXISTS feria_puestos_bloque_id_fkey;

-- 3. Corregir el tipo de dato de bloque_id de integer a uuid
-- Esto requiere recrear la columna
ALTER TABLE feria_puestos RENAME COLUMN bloque_id TO bloque_id_old;

ALTER TABLE feria_puestos ADD COLUMN bloque_id UUID;

-- 4. Migrar los datos (si hay datos) - CORREGIDO
UPDATE feria_puestos 
SET bloque_id = fb.id 
FROM feria_bloques fb 
WHERE feria_puestos.bloque_id_old = fb.id::text::integer;

-- 5. Eliminar la columna vieja
ALTER TABLE feria_puestos DROP COLUMN bloque_id_old;

-- 6. Recrear la foreign key correctamente
ALTER TABLE feria_puestos 
ADD CONSTRAINT feria_puestos_bloque_id_fkey 
FOREIGN KEY (bloque_id) REFERENCES feria_bloques(id) ON DELETE CASCADE;

-- 7. Recrear el índice único
CREATE UNIQUE INDEX idx_feria_puestos_unique 
ON feria_puestos(bloque_id, posicion, ciudad);

-- 8. Verificación
SELECT 
    'Estructura corregida exitosamente' as mensaje,
    COUNT(*) as total_puestos
FROM feria_puestos;

-- 9. Mostrar estructura corregida
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'feria_puestos' 
AND column_name = 'bloque_id';
