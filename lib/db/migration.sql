-- Migration para crear tablas completas de tiendas y productos
-- Ejecutar en Supabase SQL Editor

-- 1. Tabla users (si no existe)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    email_verification_token TEXT,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMP,
    last_login_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Tabla user_profiles (si No existe)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    avatar TEXT,
    bio TEXT,
    department TEXT,
    municipality TEXT,
    timezone TEXT DEFAULT 'America/La_Paz',
    language TEXT DEFAULT 'es',
    preferences TEXT, -- JSON
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tabla user_sessions (si No existe)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Tabla stores (LA MÁS IMPORTANTE)
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    link TEXT NOT NULL UNIQUE,
    domain TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    
    -- Campos adicionales para replicar PHP
    whatsapp TEXT,
    email_contacto TEXT,
    direccion TEXT,
    google_maps_url TEXT,
    descripcion TEXT,
    slogan TEXT,
    color_primario TEXT,
    logo TEXT,
    logo_principal TEXT,
    mostrar_logo BOOLEAN DEFAULT true,
    mostrar_nombre BOOLEAN DEFAULT true,
    banner_imagen TEXT,
    banner_imagen_2 TEXT,
    banner_imagen_3 TEXT,
    banner_imagen_4 TEXT,
    mostrar_banner BOOLEAN DEFAULT false,
    redes_sociales TEXT, -- JSON
    settings TEXT, -- JSON
    theme TEXT DEFAULT 'claro',
    seo_title TEXT,
    seo_description TEXT,
    favicon TEXT,
    
    -- Campos de PHP
    estado TEXT DEFAULT 'activo',
    suspension_fin TIMESTAMP,
    visitas INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Tabla products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category TEXT,
    image TEXT,
    images TEXT, -- JSON array
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 0,
    sku TEXT,
    tags TEXT, -- JSON array
    metadata TEXT, -- JSON
    
    -- Campos PHP adicionales
    titulo TEXT,
    precio DECIMAL(10,2),
    precio_original DECIMAL(10,2),
    imagen TEXT,
    imagenes TEXT, -- JSON
    activo BOOLEAN DEFAULT true,
    destacado BOOLEAN DEFAULT false,
    categoria_tienda TEXT,
    visitas INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    fecha_publicacion TIMESTAMP DEFAULT NOW(),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. Tabla user_activity_log
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    metadata TEXT, -- JSON
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_link ON stores(link);
CREATE INDEX IF NOT EXISTS idx_stores_is_active ON stores(is_active);
CREATE INDEX IF NOT EXISTS idx_stores_is_published ON stores(is_published);

CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);

-- 8. Insertar usuario de prueba si no existe
INSERT INTO users (id, email, password_hash, email_verified, is_active, role)
SELECT 
    gen_random_uuid(),
    'test@donebolivia.com',
    '$2b$10$abcdefghijklmnopqrstuvwx', -- Hash de 'password123'
    true,
    true,
    'user'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'test@donebolivia.com');

-- 9. Verificar tablas creadas
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
    AND table_name IN ('users', 'user_profiles', 'user_sessions', 'stores', 'products', 'user_activity_log')
ORDER BY table_name;
