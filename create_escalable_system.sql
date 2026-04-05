-- ========================================
-- SISTEMA ESCALABLE PARA 1000+ TIENDAS
-- ========================================
-- Ejecutar en Supabase SQL Editor

-- 1. Tabla de Categorías (escalable y profesional)
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activa BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Subcategorías
CREATE TABLE IF NOT EXISTS subcategories (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    descripcion TEXT,
    activa BOOLEAN DEFAULT true,
    orden INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Feria Sectores (con relación real a categorías)
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

-- 4. Tabla de Feria Puestos
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
-- DATOS INICIALES (MIGRACIÓN DESDE HARDCODE)
-- ========================================

-- Insertar categorías principales
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

-- Insertar subcategorías (basado en tu sistema actual)
INSERT INTO subcategories (id, nombre, category_id, orden) VALUES
-- Vehículos (ID: 1)
(11, 'Motocicletas', 1, 1),
(12, 'Buses/Micros', 1, 2),
(13, 'Automóviles', 1, 3),
(14, 'Bicicletas', 1, 4),
(15, 'Camionetas', 1, 5),
(16, 'Vagonetas', 1, 6),
(17, 'Camiones', 1, 7),
(18, 'Otros', 1, 8),

-- Dispositivos (ID: 2)
(21, 'Celulares', 2, 1),
(22, 'Tablets', 2, 2),
(23, 'Relojes', 2, 3),
(24, 'Consolas', 2, 4),
(25, 'Laptops', 2, 5),
(26, 'PCs de escritorio', 2, 6),
(27, 'Otros', 2, 7),

-- Electrodomésticos (ID: 3)
(31, 'Aspiradoras', 3, 1),
(32, 'Cocinas', 3, 2),
(33, 'Lavadoras', 3, 3),
(34, 'Microondas', 3, 4),
(35, 'Refrigeradores', 3, 5),
(36, 'Televisores', 3, 6),
(37, 'Otros', 3, 7),

-- Herramientas (ID: 4)
(41, 'Herramientas Manuales', 4, 1),
(42, 'Herramientas Eléctricas', 4, 2),
(43, 'Herramientas Inalámbricas', 4, 3),
(44, 'Herramientas Neumáticas', 4, 4),
(45, 'Otros', 4, 5),

-- Inmuebles (ID: 5)
(51, 'Casas', 5, 1),
(52, 'Departamentos', 5, 2),
(53, 'Oficinas', 5, 3),
(54, 'Terrenos', 5, 4),
(55, 'Otros', 5, 5),

-- Juguetes (ID: 6)
(61, 'Juguetes Educativos', 6, 1),
(62, 'Juguetes Electrónicos', 6, 2),
(63, 'Juegos de Mesa', 6, 3),
(64, 'Otros', 6, 4),

-- Muebles (ID: 7)
(71, 'Sillas', 7, 1),
(72, 'Mesas', 7, 2),
(73, 'Sofás', 7, 3),
(74, 'Camas', 7, 4),
(75, 'Otros', 7, 5),

-- Prendas (ID: 8)
(81, 'Ropa Hombre', 8, 1),
(82, 'Ropa Mujer', 8, 2),
(83, 'Ropa Niños', 8, 3),
(84, 'Calzado', 8, 4),
(85, 'Otros', 8, 5)
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
-- ÍNDICES PARA MÁXIMO RENDIMIENTO
-- ========================================

-- Índices de categorías
CREATE INDEX IF NOT EXISTS idx_categories_nombre ON categories(nombre);
CREATE INDEX IF NOT EXISTS idx_categories_activa ON categories(activa);
CREATE INDEX IF NOT EXISTS idx_categories_orden ON categories(orden);

-- Índices de subcategorías
CREATE INDEX IF NOT EXISTS idx_subcategories_categoria_id ON subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_nombre ON subcategories(nombre);
CREATE INDEX IF NOT EXISTS idx_subcategories_activa ON subcategories(activa);

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
-- Este sistema está diseñado para escalar a 1000+ tiendas:
-- 1. Categorías centralizadas en base de datos
-- 2. Relaciones robustas con integridad referencial
-- 3. Índices optimizados para consultas rápidas
-- 4. Estructura normalizada y escalable
-- 5. Migración desde sistema hardcoded a base de datos
