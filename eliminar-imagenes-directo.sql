-- === ELIMINACIÓN DIRECTA DE IMÁGENES HUÉRFANAS ===
-- Ejecutar esto en Supabase SQL Editor para eliminar imágenes huérfanas

-- 1. Ver imágenes que están en Storage pero no en BD
SELECT 
  so.name as archivo_storage,
  so.created_at as fecha_subida,
  p.id as producto_id,
  p.name as nombre_producto
FROM storage.objects so
LEFT JOIN products p ON 
  p.image LIKE '%' || so.name || '%' OR
  p.imagen LIKE '%' || so.name || '%' OR
  p.images LIKE '%' || so.name || '%' OR
  p.imagenes LIKE '%' || so.name || '%'
WHERE so.bucket_id = 'productos' 
  AND p.id IS NULL
ORDER BY so.created_at DESC;

-- 2. Eliminar imágenes huérfanas (descomentar cuando estés seguro)
-- DELETE FROM storage.objects 
-- WHERE bucket_id = 'productos' 
-- AND id IN (
--   SELECT so.id 
--   FROM storage.objects so
--   LEFT JOIN products p ON 
--     p.image LIKE '%' || so.name || '%' OR
--     p.imagen LIKE '%' || so.name || '%' OR
--     p.images LIKE '%' || so.name || '%' OR
--     p.imagenes LIKE '%' || so.name || '%'
--   WHERE so.bucket_id = 'productos' 
--     AND p.id IS NULL
-- );

-- 3. Contar imágenes huérfanas después de eliminar
SELECT COUNT(*) as imagenes_huerfanas_restantes
FROM storage.objects 
WHERE bucket_id = 'productos' 
  AND id NOT IN (
    SELECT DISTINCT 
      CASE 
        WHEN p.image LIKE '%' || so.name || '%' THEN REPLACE(p.image, 'https://sfbsplymrielpfkoalsd.supabase.co/storage/v1/object/public/productos/', '')
        WHEN p.imagen LIKE '%' || so.name || '%' THEN REPLACE(p.imagen, 'https://sfbsplymrielpfkoalsd.supabase.co/storage/v1/object/public/productos/', '')
        WHEN p.images LIKE '%' || so.name || '%' THEN REPLACE(p.images, 'https://sfbsplymrielpfkoalsd.supabase.co/storage/v1/object/public/productos/', '')
        WHEN p.imagenes LIKE '%' || so.name || '%' THEN REPLACE(p.imagenes, 'https://sfbsplymrielpfkoalsd.supabase.co/storage/v1/object/public/productos/', '')
      END
    FROM storage.objects so
    JOIN products p ON (
      p.image LIKE '%' || so.name || '%' OR
      p.imagen LIKE '%' || so.name || '%' OR
      p.images LIKE '%' || so.name || '%' OR
      p.imagenes LIKE '%' || so.name || '%'
    )
    WHERE so.bucket_id = 'productos'
      AND p.id IS NOT NULL
  );
