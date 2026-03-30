-- Añadir campo phone a tabla users para login por teléfono
-- Migration: 003_add_phone_to_users.sql

ALTER TABLE users 
ADD COLUMN phone TEXT UNIQUE;

-- Crear índice para búsquedas rápidas por teléfono
CREATE INDEX idx_users_phone ON users(phone);

-- Comentario: Este campo permitirá login por teléfono mientras mantiene email para recuperación
