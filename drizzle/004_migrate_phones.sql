-- Migrar teléfonos de user_profiles a users
-- Migration: 004_migrate_phones.sql

-- Actualizar users.phone con los teléfonos de user_profiles
UPDATE users 
SET phone = user_profiles.phone
FROM user_profiles 
WHERE users.id = user_profiles.user_id 
AND user_profiles.phone IS NOT NULL 
AND user_profiles.phone != '';

-- Verificar cuántos usuarios se actualizaron
-- SELECT COUNT(*) FROM users WHERE phone IS NOT NULL;

-- Opcional: Eliminar duplicados si hay algún teléfono repetido
-- DELETE FROM users WHERE id IN (
--   SELECT id FROM (
--     SELECT id, ROW_NUMBER() OVER (PARTITION BY phone ORDER BY created_at) as row_num
--     FROM users WHERE phone IS NOT NULL
--   ) t WHERE row_num > 1
-- );
