-- ==========================================
-- CREAR TABLA FERIA_PUESTOS (POSICIONES)
-- ==========================================
-- Tabla intermedia entre bloques y tiendas
-- Cada bloque tiene 12 posiciones (puestos)
-- Cada posición puede estar ocupada por una tienda diferente según la ciudad

-- 1. Crear tabla feria_puestos
CREATE TABLE IF NOT EXISTS feria_puestos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sector_id UUID NOT NULL REFERENCES feria_sectores(id) ON DELETE CASCADE,
    bloque_id UUID NOT NULL REFERENCES feria_bloques(id) ON DELETE CASCADE,
    posicion INTEGER NOT NULL, -- Posición dentro del bloque (1-12)
    usuario_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Dueño de la tienda (null si está libre)
    ciudad TEXT NOT NULL DEFAULT 'LPZ', -- Código de departamento: LPZ, SCZ, CBA, etc.
    estado TEXT NOT NULL DEFAULT 'disponible', -- Estados: disponible, ocupado, reservado
    fecha_ocupacion TIMESTAMP, -- Cuándo se ocupó el puesto
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_feria_puestos_bloque ON feria_puestos(bloque_id);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_ciudad ON feria_puestos(ciudad);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_estado ON feria_puestos(estado);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_usuario ON feria_puestos(usuario_id);

-- 3. Índice único para evitar duplicados
-- Un puesto (posición) solo puede existir una vez por bloque y ciudad
CREATE UNIQUE INDEX IF NOT EXISTS idx_feria_puestos_unique ON feria_puestos(bloque_id, posicion, ciudad);

-- 4. Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_feria_puestos_updated_at 
    BEFORE UPDATE ON feria_puestos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 5. Insertar puestos por defecto para todos los bloques existentes
-- Cada bloque tendrá 12 puestos disponibles en todas las ciudades principales
INSERT INTO feria_puestos (sector_id, bloque_id, posicion, ciudad, estado)
SELECT 
    fb.sector_id,
    fb.id as bloque_id,
    gen.posicion,
    dept.codigo as ciudad,
    'disponible' as estado
FROM feria_bloques fb
CROSS JOIN (VALUES 
    ('LPZ', 'La Paz'),
    ('SCZ', 'Santa Cruz'), 
    ('CBA', 'Cochabamba'),
    ('ORU', 'Oruro'),
    ('PTS', 'Potosí'),
    ('TJA', 'Tarija'),
    ('CHQ', 'Chuquisaca'),
    ('BEN', 'Beni'),
    ('PND', 'Pando')
) AS dept(codigo, nombre)
CROSS JOIN (SELECT generate_series(1, 12) as posicion) gen
WHERE NOT EXISTS (
    SELECT 1 FROM feria_puestos fp 
    WHERE fp.bloque_id = fb.id 
    AND fp.posicion = gen.posicion
    AND fp.ciudad = dept.codigo
);

-- 6. Verificación - Mostrar resultados
SELECT 
    'Resumen de puestos creados' as mensaje,
    COUNT(*) as total_puestos,
    COUNT(DISTINCT sector_id) as sectores_con_puestos,
    COUNT(DISTINCT bloque_id) as bloques_con_puestos,
    COUNT(DISTINCT ciudad) as ciudades_cubiertas
FROM feria_puestos;

-- 7. Mostrar ejemplo de puestos creados
SELECT 
    fp.id,
    fs.titulo as sector,
    fb.nombre as bloque,
    fp.posicion,
    fp.ciudad,
    fp.estado,
    fp.usuario_id is not null as tiene_dueno
FROM feria_puestos fp
JOIN feria_bloques fb ON fp.bloque_id = fb.id
JOIN feria_sectores fs ON fp.sector_id = fs.id
ORDER BY fs.titulo, fb.orden, fp.posicion, fp.ciudad
LIMIT 20;

-- ==========================================
-- INSTRUCCIONES:
-- 1. Copiar y pegar este SQL en el editor SQL de Supabase
-- 2. Ejecutar todo el script
-- 3. Verificar que no haya errores
-- 4. Los resultados mostrarán cuántos puestos se crearon
-- ==========================================
