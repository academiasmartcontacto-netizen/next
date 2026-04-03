-- === SOLUCIÓN DEFINITIVA - PERMISOS SUPABASE STORAGE ===
-- Ejecutar estos SQL en Supabase SQL Editor

-- 1. Verificar políticas actuales
SELECT * FROM pg_policies WHERE tablename = 'storage.objects';

-- 2. Eliminar políticas existentes que puedan bloquear
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated select" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;

-- 3. Crear políticas CORRECTAS para el bucket 'productos'
-- Permitir SELECT a autenticados
CREATE POLICY "Allow authenticated select productos" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'productos');

-- Permitir INSERT a autenticados  
CREATE POLICY "Allow authenticated insert productos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'productos');

-- Permitir UPDATE a autenticados
CREATE POLICY "Allow authenticated update productos" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'productos')
WITH CHECK (bucket_id = 'productos');

-- Permitir DELETE a autenticados
CREATE POLICY "Allow authenticated delete productos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'productos');

-- 4. Verificar que las políticas se crearon correctamente
SELECT * FROM pg_policies WHERE tablename = 'storage.objects' AND bucket_id = 'productos';

-- 5. Opcional: Permitir acceso total con service role (para bypass RLS)
-- Esto debería funcionar automáticamente con SUPABASE_SERVICE_ROLE_KEY

-- 6. Verificar permisos del bucket
SELECT * FROM storage.buckets WHERE name = 'productos';
