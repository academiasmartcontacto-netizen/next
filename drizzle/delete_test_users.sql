-- Eliminar usuarios de prueba y sus datos relacionados
-- Primero eliminar de las tablas hijas (por las foreign keys)

DELETE FROM user_activity_log WHERE user_id IN (
  SELECT id FROM users WHERE email IN ('jpantoja@gmail.com', 'jpantoja2@gmail.com')
);

DELETE FROM user_sessions WHERE user_id IN (
  SELECT id FROM users WHERE email IN ('jpantoja@gmail.com', 'jpantoja2@gmail.com')
);

DELETE FROM user_profiles WHERE user_id IN (
  SELECT id FROM users WHERE email IN ('jpantoja@gmail.com', 'jpantoja2@gmail.com')
);

DELETE FROM stores WHERE user_id IN (
  SELECT id FROM users WHERE email IN ('jpantoja@gmail.com', 'jpantoja2@gmail.com')
);

-- Finalmente eliminar los usuarios
DELETE FROM users WHERE email IN ('jpantoja@gmail.com', 'jpantoja2@gmail.com');

-- Verificar que se eliminaron
SELECT COUNT(*) as usuarios_prueba_eliminados 
FROM users 
WHERE email IN ('jpantoja@gmail.com', 'jpantoja2@gmail.com');
