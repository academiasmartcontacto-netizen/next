-- ========================================
-- MIGRAR CATEGORÍAS Y SUBCATEGORÍAS DESDE PHP
-- ========================================
-- Ejecutar en Supabase SQL Editor

-- Tabla 1: Categorías (basada en PHP)
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla 2: Subcategorías (basada en PHP)
CREATE TABLE IF NOT EXISTS subcategorias (
    id INTEGER PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar categorías principales (basado en ProductosDrawer.tsx)
INSERT INTO categorias (id, nombre) VALUES
(1, 'Vehículos'),
(2, 'Dispositivos'), 
(3, 'Electrodomésticos'),
(4, 'Herramientas'),
(5, 'Inmuebles'),
(6, 'Juguetes'),
(7, 'Muebles'),
(8, 'Prendas')
ON CONFLICT (id) DO NOTHING;

-- Insertar subcategorías (basado en ProductosDrawer.tsx y subcategorias.php)
INSERT INTO subcategorias (id, nombre, categoria_id) VALUES
-- Vehículos (ID: 1)
(11, 'Motocicletas', 1),
(12, 'Buses/Micros', 1),
(13, 'Automóviles', 1),
(14, 'Bicicletas', 1),
(15, 'Camionetas', 1),
(16, 'Vagonetas', 1),
(17, 'Camiones', 1),
(18, 'Otros', 1),

-- Dispositivos (ID: 2)
(21, 'Celulares', 2),
(22, 'Tablets', 2),
(23, 'Relojes', 2),
(24, 'Consolas', 2),
(25, 'Laptops', 2),
(26, 'PCs de escritorio', 2),
(27, 'Otros', 2),

-- Electrodomésticos (ID: 3)
(31, 'Aspiradoras', 3),
(32, 'Cocinas', 3),
(33, 'Lavadoras', 3),
(34, 'Microondas', 3),
(35, 'Refrigeradores', 3),
(36, 'Televisores', 3),
(37, 'Otros', 3),

-- Herramientas (ID: 4)
(41, 'Herramientas Manuales', 4),
(42, 'Herramientas Eléctricas', 4),
(43, 'Herramientas Inalámbricas', 4),
(44, 'Herramientas Neumáticas', 4),
(45, 'Otros', 4),

-- Inmuebles (ID: 5)
(51, 'Casas', 5),
(52, 'Departamentos', 5),
(53, 'Oficinas', 5),
(54, 'Terrenos', 5),
(55, 'Otros', 5),

-- Juguetes (ID: 6)
(61, 'Juguetes Educativos', 6),
(62, 'Juguetes Electrónicos', 6),
(63, 'Juegos de Mesa', 6),
(64, 'Otros', 6),

-- Muebles (ID: 7)
(71, 'Sillas', 7),
(72, 'Mesas', 7),
(73, 'Sofás', 7),
(74, 'Camas', 7),
(75, 'Otros', 7),

-- Prendas (ID: 8)
(81, 'Ropa Hombre', 8),
(82, 'Ropa Mujer', 8),
(83, 'Ropa Niños', 8),
(84, 'Calzado', 8),
(85, 'Otros', 8)
ON CONFLICT (id) DO NOTHING;

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_categorias_nombre ON categorias(nombre);
CREATE INDEX IF NOT EXISTS idx_subcategorias_categoria_id ON subcategorias(categoria_id);
CREATE INDEX IF NOT EXISTS idx_subcategorias_nombre ON subcategorias(nombre);

-- Comentario: Ahora puedes relacionar feria_sectores.categoria_default_id con categorias.id
