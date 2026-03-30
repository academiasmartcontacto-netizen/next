-- MIGRACIÓN SEGURA SIN BORRAR DATOS
-- Ejecutar esto directamente en Supabase SQL Editor

-- Paso 1: Agregar columna phone sin restricción UNIQUE primero
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;

-- Paso 2: Migrar datos desde user_profiles
UPDATE users 
SET phone = user_profiles.phone
FROM user_profiles 
WHERE users.id = user_profiles.user_id 
AND user_profiles.phone IS NOT NULL 
AND user_profiles.phone != ''
AND users.phone IS NULL;

-- Paso 3: Verificar duplicados antes de agregar UNIQUE
SELECT phone, COUNT(*) as count 
FROM users 
WHERE phone IS NOT NULL 
GROUP BY phone 
HAVING COUNT(*) > 1;

-- Si no hay duplicados, ejecutar esto:
-- ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone);
