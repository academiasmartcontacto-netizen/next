# 🐛 Guía de Debug - Admin Feria Virtual

## 📋 Problemas Corregidos

### 1. ✅ **Upload de Banners con IDs Únicos**
- **Problema**: Todos los banners se guardaban como `banner.avif` sin identificación única
- **Solución**: Ahora usa formato `{slug}-{timestamp}.avif` para cada archivo
- **Logs**: Verás logs detallados en consola del proceso de upload

### 2. ✅ **Error al Eliminar Sector** 
- **Problema**: Sin logs para identificar la causa del error
- **Solución**: Logs detallados para verificar existencia del sector y operación de eliminación
- **Logs**: Busca `🗑️ [DELETE]` en la consola

### 3. ✅ **Error al Guardar Sector**
- **Problema**: Sin validación de slug duplicado ni logs del proceso
- **Solución**: Validación de slug único + logs completos del proceso de creación
- **Logs**: Busca `➕ [POST]` en la consola

## 🔍 Cómo Probar y Ver Logs

### **Paso 1: Iniciar el Servidor**
```bash
npm run dev
```

### **Paso 2: Abrir la Consola del Navegador**
1. Presiona `F12` o click derecho → Inspeccionar
2. Ve a la pestaña **Console**
3. Mantén la consola abierta mientras pruebas

### **Paso 3: Probar Cada Funcionalidad**

#### **📤 Probar Upload de Banners:**
1. Ve a `/admin/feria-virtual`
2. Click en "Nuevo Sector" o edita uno existente
3. Sube una imagen
4. **Busca estos logs en consola:**
   ```
   📤 [UPLOAD] Iniciando upload de banner
   📤 [UPLOAD] Datos recibidos: { sectorId, slug, fileName, fileSize, fileType }
   ✅ [UPLOAD] Validaciones pasadas, procesando imagen
   📁 [UPLOAD] Path del archivo: banners/sector-{sectorId}/{slug}-{timestamp}.avif
   ✅ [UPLOAD] Archivo subido exitosamente a Supabase
   🔗 [UPLOAD] URL pública generada: https://...
   ```

#### **➕ Probar Crear Sector:**
1. En `/admin/feria-virtual`, click "Nuevo Sector"
2. Llena el formulario y envía
3. **Busca estos logs en consola:**
   ```
   ➕ [POST] Creando nuevo sector: { titulo, slug }
   ➕ [POST] Datos recibidos: { titulo, slug, descripcion, colorHex, categoriaDefaultId }
   📋 [POST] Verificando último orden para asignar nuevo
   📊 [POST] Orden asignado: X
   💾 [POST] Insertando nuevo sector en base de datos
   ✅ [POST] Sector creado exitosamente: Título del sector
   🆔 [POST] ID del nuevo sector: uuid-del-sector
   ```

#### **🗑️ Probar Eliminar Sector:**
1. En `/admin/feria-virtual`, click el ícono de basura en un sector
2. Confirma la eliminación
3. **Busca estos logs en consola:**
   ```
   🗑️ [DELETE] Intentando eliminar sector con ID: uuid-del-sector
   📋 [DELETE] Sector encontrado: SÍ/NO
   📋 [DELETE] Datos del sector: { id, titulo, slug }
   ✅ [DELETE] Sector eliminado: SÍ/NO
   📊 [DELETE] Registros afectados: X
   🎉 [DELETE] Eliminación exitosa del sector: Título del sector
   ```

#### **📝 Probar Actualizar Sector:**
1. En `/admin/feria-virtual`, click el ícono de editar en un sector
2. Modifica los datos y guarda
3. **Busca estos logs en consola:**
   ```
   📝 [PUT] Actualizando sector: { id, titulo, slug }
   📝 [PUT] Datos recibidos: { titulo, slug, descripcion, colorHex, categoriaDefaultId, imagenBanner }
   📋 [PUT] Sector encontrado, procediendo con actualización
   ✅ [PUT] Sector actualizado: SÍ/NO
   📊 [PUT] Registros afectados: X
   🎉 [PUT] Actualización exitosa: Título del sector
   ```

## 🚨 Mensajes de Error Comunes

### **Si ves estos errores en consola:**

#### **❌ Upload de Imagen:**
```
❌ [UPLOAD] Faltan datos requeridos
❌ [UPLOAD] Tipo de archivo no permitido: image/gif
❌ [UPLOAD] Archivo demasiado grande: 6000000 bytes
❌ [UPLOAD] Error al subir a Supabase: {error details}
```

#### **❌ Crear Sector:**
```
❌ [POST] Validación fallida: título o slug vacíos
❌ [POST] Ya existe un sector con el slug: tech
❌ [POST] Error al crear sector: {error details}
```

#### **❌ Eliminar Sector:**
```
❌ [DELETE] No se encontró el sector para eliminar
❌ [DELETE] Error al eliminar sector: {error details}
```

#### **❌ Actualizar Sector:**
```
❌ [PUT] Sector no encontrado para actualizar
❌ [PUT] No se pudo actualizar el sector
❌ [PUT] Error al actualizar sector: {error details}
```

## 🛠️ Soluciones a Problemas Comunes

### **Problema: "Error al subir la imagen"**
- **Causa**: Archivo demasiado grande o formato no soportado
- **Solución**: Usa JPG/PNG/WebP máximo 5MB

### **Problema: "Ya existe un sector con este slug"**
- **Causa**: El slug debe ser único
- **Solución**: Usa un slug diferente como "tech-2" o "celulares-2024"

### **Problema: "Sector no encontrado"**
- **Causa**: El sector fue eliminado o hay un problema con la BD
- **Solución**: Recarga la página y vuelve a intentar

### **Problema: "Error interno del servidor"**
- **Causa**: Problema de conexión con la base de datos
- **Solución**: Revisa las variables de entorno de Supabase

## 📁 Estructura de Archivos en Supabase Storage

Después de corregir el upload, los archivos se guardarán con esta estructura:

```
feria/
├── banners/
│   ├── sector-uuid-1/
│   │   ├── tech-1712345678901.avif
│   │   └── tech-1712345678902.avif (si se actualiza)
│   ├── sector-uuid-2/
│   │   ├── fashion-1712345678903.avif
│   │   └── fashion-1712345678904.avif
│   └── ...
```

## ✅ Checklist de Verificación

- [ ] Los logs aparecen en la consola del navegador
- [ ] Los banners se suben con nombres únicos
- [ ] Los sectores se crean sin errores
- [ ] Los sectores se eliminan correctamente
- [ ] Los sectores se actualizan sin problemas
- [ ] La vista pública muestra los sectores activos

## 🆘 Si Sigue Habiendo Problemas

1. **Captura de pantalla**: Toma una captura de los logs en la consola
2. **Detalles del error**: Anota el mensaje exacto del error
3. **Pasos reproducibles**: Describe exactamente qué hiciste
4. **Datos de prueba**: Qué datos intentaste guardar

Con esta información, podré identificar y solucionar cualquier problema restante.
