-- PASO 3: Aplicar restricciones (MODERADAMENTE SEGURO)
-- Ejecuta esto después del paso 2
-- Hace que phone sea obligatorio y único
ALTER TABLE users 
ALTER COLUMN phone SET NOT NULL;

ALTER TABLE users 
ADD CONSTRAINT users_phone_unique UNIQUE (phone);

-- Hace email opcional
ALTER TABLE users 
ALTER COLUMN email DROP NOT NULL;
