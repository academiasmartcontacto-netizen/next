-- Si los teléfonos no se migraron, ejecutar esta migración de emergencia
UPDATE users 
SET phone = user_profiles.phone
FROM user_profiles 
WHERE users.id = user_profiles.user_id 
AND user_profiles.phone IS NOT NULL 
AND user_profiles.phone != ''
AND users.phone IS NULL;

-- Verificar cuántos se actualizaron
SELECT COUNT(*) as updated_users FROM users WHERE phone IS NOT NULL;
