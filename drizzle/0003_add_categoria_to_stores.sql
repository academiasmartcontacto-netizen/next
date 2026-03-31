-- Agregar campo categoria_id a la tabla stores
-- Esta migración añade la categoría de tienda para clasificación

ALTER TABLE stores 
ADD COLUMN categoria_id INTEGER;

-- Crear índice para mejor rendimiento en consultas por categoría
CREATE INDEX idx_stores_categoria_id ON stores(categoria_id);

-- Comentario sobre el campo
COMMENT ON COLUMN stores.categoria_id IS 'ID de categoría de la tienda (1-8: Vehículos, Dispositivos, Electrodomésticos, Herramientas, Inmuebles, Juguetes, Muebles, Prendas)';
