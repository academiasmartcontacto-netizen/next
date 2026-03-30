-- Agregar constraint para asegurar que phone no sea NULL en nuevos registros
ALTER TABLE users 
ADD CONSTRAINT users_phone_not_null 
CHECK (phone IS NOT NULL);
