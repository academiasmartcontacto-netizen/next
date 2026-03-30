-- Encontrar usuarios con phone NULL pero que tienen teléfono en user_profiles
SELECT 
  u.id,
  u.email,
  u.phone as user_phone,
  up.phone as profile_phone,
  up.first_name,
  up.last_name,
  u.created_at
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.phone IS NULL 
AND up.phone IS NOT NULL
AND up.phone != '';
