-- ==========================================
-- CREAR TABLA FERIA_PUESTOS (VERSION SIMPLE)
-- ==========================================

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

-- 2. Crear índices
CREATE INDEX IF NOT EXISTS idx_feria_puestos_bloque ON feria_puestos(bloque_id);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_ciudad ON feria_puestos(ciudad);
CREATE INDEX IF NOT EXISTS idx_feria_puestos_estado ON feria_puestos(estado);
CREATE UNIQUE INDEX IF NOT EXISTS idx_feria_puestos_unique ON feria_puestos(bloque_id, posicion, ciudad);

-- 3. Insertar puestos directamente (sin NOT EXISTS para evitar errores de tipo)
INSERT INTO feria_puestos (sector_id, bloque_id, posicion, ciudad, estado)
SELECT 
    fb.sector_id,
    fb.id as bloque_id,
    p.posicion,
    c.ciudad,
    'disponible' as estado
FROM feria_bloques fb
CROSS JOIN (SELECT generate_series(1, 12) as posicion) p
CROSS JOIN (VALUES 
    ('LPZ'), ('SCZ'), ('CBA'), ('ORU'), ('PTS'), ('TJA'), ('CHQ'), ('BEN'), ('PND')
) AS c(ciudad);

-- 4. Verificación
SELECT 
    'Resumen de puestos creados' as mensaje,
    COUNT(*) as total_puestos,
    COUNT(DISTINCT sector_id) as sectores_con_puestos,
    COUNT(DISTINCT bloque_id) as bloques_con_puestos,
    COUNT(DISTINCT ciudad) as ciudades_cubiertas
FROM feria_puestos;
