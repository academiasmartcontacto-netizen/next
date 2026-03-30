-- PASO 1: Solo agregar columnas (SEGURÍSIMO)
-- Ejecuta esto primero
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS phone_verification_code VARCHAR(10);

-- Después de ejecutar el paso 1, verifica que todo esté bien con:
-- SELECT * FROM users LIMIT 5;
