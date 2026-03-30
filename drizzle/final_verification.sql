-- Verificación final del estado de la base de datos
SELECT 
  COUNT(*) as total_usuarios,
  COUNT(CASE WHEN phone IS NOT NULL THEN 1 END) as usuarios_con_telefono,
  COUNT(CASE WHEN phone IS NULL THEN 1 END) as usuarios_sin_telefono,
  COUNT(CASE WHEN email IS NOT NULL THEN 1 END) as usuarios_con_email
FROM users;

-- Verificar si hay teléfonos duplicados
SELECT 
  phone, 
  COUNT(*) as count 
FROM users 
WHERE phone IS NOT NULL 
GROUP BY phone 
HAVING COUNT(*) > 1;
