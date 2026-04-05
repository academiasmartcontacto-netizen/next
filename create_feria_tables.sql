-- ========================================
-- FERIA VIRTUAL - CREACIÓN DE TABLAS
-- ========================================
-- Ejecutar en Supabase SQL Editor

-- Tabla 1: Sectores de la Feria
CREATE TABLE IF NOT EXISTS feria_sectores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) NOT NULL UNIQUE, -- tech, fashion, home, etc.
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color_hex VARCHAR(7) DEFAULT '#FF6B35', -- Color del tema
    imagen_banner TEXT, -- URL del banner en Supabase Storage
    orden INTEGER NOT NULL DEFAULT 1, -- Orden de visualización
    capacidad INTEGER NOT NULL DEFAULT 12, -- Cantidad de puestos (ej: 12)
    categoria_default_id UUID REFERENCES categories(id) ON DELETE SET NULL, -- Categoría de productos asociada
    activo BOOLEAN DEFAULT true, -- Para activar/desactivar sectores
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 2: Puestos/Ocupaciones de la Feria
CREATE TABLE IF NOT EXISTS feria_puestos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID NOT NULL REFERENCES feria_sectores(id) ON DELETE CASCADE,
    bloque_id INTEGER NOT NULL DEFAULT 1, -- Número de bloque (1-N)
    posicion INTEGER NOT NULL, -- Posición dentro del bloque (1-12)
    usuario_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Dueño de la tienda
    ciudad VARCHAR(10) NOT NULL DEFAULT 'LPZ', -- Código de departamento
    estado VARCHAR(20) NOT NULL DEFAULT 'disponible', -- disponible, ocupado, reservado
    fecha_ocupacion TIMESTAMP WITH TIME ZONE, -- Cuándo se ocupó
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_feria_sectores_orden ON feria_sectores(orden);
CREATE INDEX IF NOT EXISTS idx_feria_sectores_activo ON feria_sectores(activo);
CREATE INDEX IF NOT EXISTS idx_feria_sectores_slug ON feria_sectores(slug);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_sector ON feria_puestos(sector_id);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_usuario ON feria_puestos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_estado ON feria_puestos(estado);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_ciudad ON feria_puestos(ciudad);

-- Insertar sector inicial (Celulares)
INSERT INTO feria_sectores (slug, titulo, descripcion, color_hex, orden, capacidad, activo) 
VALUES (
    'tech',
    'Celulares',
    'Las mejores tiendas y marcas de celulares',
    '#FF6B35',
    1,
    12,
    true
) ON CONFLICT DO NOTHING;

-- Insertar 12 puestos disponibles para el sector Celulares
INSERT INTO feria_puestos (sector_id, bloque_id, posicion, ciudad, estado)
SELECT 
    fs.id,
    1,
    generate_series(1, 12),
    'LPZ',
    'disponible'
FROM feria_sectores fs 
WHERE fs.slug = 'tech'
ON CONFLICT DO NOTHING;

-- Comentario sobre la estructura:
-- Cada sector puede tener múltiples bloques (bloque_id 1, 2, 3...)
-- Cada bloque tiene 12 posiciones (1-12 como un reloj)
-- Total: Bloque 1 con 12 puestos = 12 espacios disponibles
-- Cuando una tienda ocupa un puesto: estado cambia a 'ocupado' y se registra usuario_id
