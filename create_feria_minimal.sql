-- ========================================
-- SISTEMA FERIA VIRTUAL - SOLO CATEGORÍAS
-- ========================================
-- Ejecutar en Supabase SQL Editor
-- SIN SUBCATEGORÍAS - NO ROMPE NADA EXISTENTE

-- 1. Tabla de Categorías (solo para Feria Virtual)
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activa BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Feria Sectores (con relación real a categorías)
CREATE TABLE IF NOT EXISTS feria_sectores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) NOT NULL UNIQUE, -- tech, fashion, home, etc.
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color_hex VARCHAR(7) DEFAULT '#FF6B35', -- Color del tema
    imagen_banner TEXT, -- URL del banner en Supabase Storage
    orden INTEGER NOT NULL DEFAULT 1, -- Orden de visualización
    capacidad INTEGER NOT NULL DEFAULT 12, -- Cantidad de puestos (ej: 12)
    categoria_default_id INTEGER REFERENCES categories(id) ON DELETE SET NULL, -- Relación REAL
    activo BOOLEAN DEFAULT true, -- Para activar/desactivar sectores
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Feria Puestos
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

-- ========================================
-- DATOS INICIALES (SÓLO CATEGORÍAS)
-- ========================================

-- Insertar categorías principales (basado en tu sistema actual)
INSERT INTO categories (id, nombre, descripcion, orden) VALUES
(1, 'Vehículos', 'Automóviles, motocicletas y vehículos comerciales', 1),
(2, 'Dispositivos', 'Celulares, tablets y dispositivos electrónicos', 2),
(3, 'Electrodomésticos', 'Artículos para el hogar y cocina', 3),
(4, 'Herramientas', 'Herramientas manuales y eléctricas', 4),
(5, 'Inmuebles', 'Propiedades inmobiliarias', 5),
(6, 'Juguetes', 'Juguetes y juegos para todas las edades', 6),
(7, 'Muebles', 'Muebles y decoración para el hogar', 7),
(8, 'Prendas', 'Ropa, calzado y accesorios', 8)
ON CONFLICT (id) DO NOTHING;

-- Insertar sector inicial (Celulares) con relación a categoría
INSERT INTO feria_sectores (slug, titulo, descripcion, color_hex, orden, capacidad, categoria_default_id, activo) 
VALUES (
    'tech',
    'Celulares',
    'Las mejores tiendas y marcas de celulares',
    '#FF6B35',
    1,
    12,
    2, -- ID de categoría "Dispositivos"
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

-- ========================================
-- ÍNDICES PARA RENDIMIENTO
-- ========================================

-- Índices de categorías
CREATE INDEX IF NOT EXISTS idx_categories_nombre ON categories(nombre);
CREATE INDEX IF NOT EXISTS idx_categories_activa ON categories(activa);
CREATE INDEX IF NOT EXISTS idx_categories_orden ON categories(orden);

-- Índices de feria
CREATE INDEX IF NOT EXISTS idx_feria_sectores_orden ON feria_sectores(orden);
CREATE INDEX IF NOT EXISTS idx_feria_sectores_activo ON feria_sectores(activo);
CREATE INDEX IF NOT EXISTS idx_feria_sectores_slug ON feria_sectores(slug);
CREATE INDEX IF NOT EXISTS idx_feria_sectores_categoria ON feria_sectores(categoria_default_id);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_sector ON feria_puestos(sector_id);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_usuario ON feria_puestos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_estado ON feria_puestos(estado);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_ciudad ON feria_puestos(ciudad);

-- ========================================
-- COMENTARIOS
-- ========================================
-- Sistema mínimo y seguro para Feria Virtual:
-- 1. Solo categorías (sin subcategorías)
-- 2. No rompe nada existente
-- 3. Relación simple y robusta
-- 4. Escalable para 1000+ tiendas
