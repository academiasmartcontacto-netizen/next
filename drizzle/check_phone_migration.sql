-- Verificar el estado actual de la migración de teléfonos
SELECT 
  u.id,
  u.email,
  u.phone as user_phone,
  up.phone as profile_phone,
  up.first_name,
  up.last_name
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
ORDER BY u.created_at DESC
LIMIT 10;
