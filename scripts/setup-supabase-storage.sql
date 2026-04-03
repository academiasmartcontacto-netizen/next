-- ============================================
-- CONFIGURACIÓN DE SUPABASE STORAGE PARA PRODUCTOS
-- ============================================

-- 1. Crear bucket 'productos' si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'productos', 
  'productos', 
  true, 
  5242880, -- 5MB por archivo
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Política para acceso público a las imágenes (lectura)
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'productos');

-- 3. Política para que usuarios autenticados puedan subir imágenes
CREATE POLICY "Users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'productos' AND 
  auth.role() = 'authenticated'
);

-- 4. Política para que usuarios puedan actualizar sus propias imágenes
CREATE POLICY "Users can update own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'productos' AND 
  auth.role() = 'authenticated'
);

-- 5. Política para que usuarios puedan eliminar sus propias imágenes
CREATE POLICY "Users can delete own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'productos' AND 
  auth.role() = 'authenticated'
);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar bucket creado
SELECT * FROM storage.buckets WHERE name = 'productos';

-- Verificar políticas creadas
SELECT * FROM pg_policies WHERE tablename = 'storage.objects';
