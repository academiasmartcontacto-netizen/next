-- Corregir usuarios con phone NULL migrando desde user_profiles
UPDATE users 
SET phone = user_profiles.phone
FROM user_profiles 
WHERE users.id = user_profiles.user_id 
AND users.phone IS NULL 
AND user_profiles.phone IS NOT NULL 
AND user_profiles.phone != '';

-- Verificar cuántos se corrigieron
SELECT COUNT(*) as fixed_users 
FROM users 
WHERE phone IS NOT NULL;
