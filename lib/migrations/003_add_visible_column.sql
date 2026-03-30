-- Agregar campo visible a la tabla de productos
ALTER TABLE products ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;

-- Actualizar productos existentes para que sean visibles por defecto
UPDATE products SET visible = true WHERE visible IS NULL;

-- Crear índice para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_products_visible ON products(visible);

-- Agregar comentario
COMMENT ON COLUMN products.visible IS 'Determina si el producto es visible en la tienda pública';
