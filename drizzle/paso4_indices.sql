-- PASO 4: Índices y validación (SEGURO)
-- Ejecuta esto al final
-- Agrega índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_phone_verified ON users(phone_verified);

-- Agrega comentarios
COMMENT ON COLUMN users.phone IS 'Primary authentication method - Bolivian phone number (8 digits starting with 6 or 7)';
COMMENT ON COLUMN users.phone_verified IS 'Whether the phone number has been verified via SMS';
COMMENT ON COLUMN users.email IS 'Optional email address - no longer primary auth method';
