-- Agregar las columnas faltantes para visibilidad de secciones
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS mostrar_inicio BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS mostrar_contacto BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS mostrar_acerca_de BOOLEAN DEFAULT false;

-- Actualizar valores existentes para todas las tiendas
UPDATE stores 
SET 
    mostrar_inicio = COALESCE(mostrar_inicio, true),
    mostrar_contacto = COALESCE(mostrar_contacto, true),
    mostrar_acerca_de = COALESCE(mostrar_acerca_de, false)
WHERE mostrar_inicio IS NULL 
   OR mostrar_contacto IS NULL 
   OR mostrar_acerca_de IS NULL;

-- Verificar que se agregaron correctamente
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'stores' 
    AND table_schema = 'public'
    AND column_name IN ('mostrar_inicio', 'mostrar_contacto', 'mostrar_acerca_de')
ORDER BY column_name;

-- Ver los valores actualizados
SELECT 
    id, 
    name, 
    mostrar_inicio, 
    mostrar_contacto, 
    mostrar_acerca_de 
FROM stores 
LIMIT 3;
