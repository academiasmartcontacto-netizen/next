# 🚀 CONFIGURACIÓN DE SUPABASE STORAGE PARA PRODUCTOS

## 📋 PASOS OBLIGATORIOS PARA SOLUCIONAR IMÁGENES ROTAS

### 1. Configurar Variables de Entorno

Asegúrate que tu `.env.local` contenga:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[tu-proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]
```

### 2. Ejecutar Script SQL en Supabase

Ve a tu dashboard de Supabase → SQL Editor y ejecuta:

```sql
-- Crear bucket 'productos'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'productos', 
  'productos', 
  true, 
  5242880, -- 5MB por archivo
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acceso
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'productos');

CREATE POLICY "Users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'productos' AND 
  auth.role() = 'authenticated'
);
```

### 3. Verificar Configuración

En tu dashboard de Supabase:
- Ve a **Storage**
- Deberías ver el bucket **"productos"**
- Debe estar marcado como **"Public"**

### 4. Probar la API

La API ya está modificada para usar Supabase Storage:

```typescript
// ✅ Ahora usa Supabase Storage
const uploadResult = await supabaseStorageService.uploadImage(imagen, producto_id)
const imageUrl = uploadResult.publicUrl // URL de Supabase
```

### 5. URLs Generadas

Las imágenes ahora tendrán URLs como:
```
https://[tu-proyecto].supabase.co/storage/v1/object/public/productos/producto_[id]_[timestamp]_[random].jpg
```

## 🔍 Verificación en Producción

### Para verificar que funciona:

1. **Crea un producto nuevo** en tu editor
2. **Sube imágenes** 
3. **Verifica en la base de datos** que las URLs sean de Supabase
4. **Verifica en tu dashboard** que las imágenes aparezcan en el bucket

### Si las imágenes aún se ven rotas:

1. **Verifica las políticas de acceso** en Supabase Storage
2. **Verifica las variables de entorno**
3. **Revisa la consola del navegador** por errores de CORS
4. **Verifica que el bucket sea público**

## 🎯 Beneficios de Supabase Storage

- ✅ **Escalabilidad ilimitada** para miles de usuarios
- ✅ **CDN integrado** para entrega rápida global
- ✅ **Transformaciones automáticas** de imágenes
- ✅ **Seguridad** con políticas de acceso
- ✅ **Pago por uso** (solo por lo que consumes)
- ✅ **Integración perfecta** con tu stack actual

## 🚨 Importante

- **Elimina las imágenes locales** de `public/uploads/productos/` 
- **No necesitas ningún otro servicio** como Cloudinary
- **Supabase Storage es perfecto** para tu caso de uso
- **Funcionará en producción** (Vercel, Netlify, etc.)

## 📞 Soporte

Si tienes problemas:
1. Revisa el dashboard de Supabase → Storage
2. Verifica las políticas de acceso
3. Revisa las variables de entorno
4. Contacta a soporte de Supabase si es necesario
