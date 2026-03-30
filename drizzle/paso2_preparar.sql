-- PASO 2: Preparar datos existentes (SEGURO)
-- Ejecuta esto después del paso 1
-- Asigna teléfonos temporales a usuarios que no tienen
UPDATE users 
SET phone = 'TEMP' || id || '000'
WHERE phone IS NULL OR phone = '';

-- Verifica los resultados:
-- SELECT id, email, phone FROM users WHERE phone LIKE 'TEMP%';
