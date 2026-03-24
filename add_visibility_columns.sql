-- Agregar campos de visibilidad de secciones a la tabla stores
ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS mostrar_inicio BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS mostrar_productos BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS mostrar_contacto BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS mostrar_acerca_de BOOLEAN DEFAULT TRUE;

-- Actualizar registros existentes para que tengan valores por defecto
UPDATE stores 
SET mostrar_inicio = TRUE, 
    mostrar_productos = TRUE, 
    mostrar_contacto = TRUE, 
    mostrar_acerca_de = TRUE
WHERE mostrar_inicio IS NULL 
   OR mostrar_productos IS NULL 
   OR mostrar_contacto IS NULL 
   OR mostrar_acerca_de IS NULL;
