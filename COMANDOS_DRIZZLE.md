# 🚀 Comandos Drizzle - Guía Rápida

## ⚠️ Importante: Política de Ejecución PowerShell

**SIEMPRE ejecutar este comando primero en PowerShell:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

*Esto permite ejecutar scripts temporalmente solo en esta sesión.*

---

## 📋 Comandos Esenciales Drizzle

### 🔥 Generar Migraciones
```powershell
npx drizzle-kit generate
```
*Lee tu schema.ts y genera archivos SQL de migración*

### 🚀 Aplicar Cambios a Base de Datos
```powershell
npx drizzle-kit push
```
*Compara schema con BD y aplica las diferencias*

### 📊 Ver Estado de la Base de Datos
```powershell
npx drizzle-kit studio
```
*Abre interfaz visual para ver tu base de datos*

---

## 🛠️ Flujo de Trabajo Típico

### Paso 1: Cambiar Schema
- Edita `lib/db/schema.ts`
- Agrega tablas, columnas, etc.

### Paso 2: Generar Migración
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
npx drizzle-kit generate
```

### Paso 3: Aplicar Cambios
```powershell
npx drizzle-kit push
```

### Paso 4: Verificar
```powershell
curl http://localhost:3000/api/migrate
```

---

## 🚨 Problemas Comunes y Soluciones

### ❌ Error: "bash no reconocido"
**Solución:** No uses "bash" en PowerShell
```powershell
# ❌ Incorrecto
bash npx drizzle-kit push

# ✅ Correcto  
npx drizzle-kit push
```

### ❌ Error: "scripts deshabilitados"
**Solución:** Siempre ejecutar primero:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

### ❌ Error: "SSL Certificate"
**Solución:** Usar `uselibpqcompat=true` en DATABASE_URL
```env
DATABASE_URL="postgresql://...?sslmode=require&uselibpqcompat=true"
```

### ❌ Error: "cannot cast type integer to uuid"
**Solución:** Eliminar y recrear tablas problemáticas
```sql
DROP TABLE IF EXISTS nombre_tabla CASCADE;
```

---

## 📁 Archivos Importantes

### 🗂️ Estructura de Archivos
```
d:\next\
├── lib\
│   ├── db\
│   │   ├── schema.ts        # Definición de tablas
│   │   └── index.ts         # Conexión a BD
│   └── migrations\          # Migraciones SQL (opcional)
├── drizzle\
│   └── *.sql               # Migraciones generadas
├── drizzle.config.ts       # Configuración Drizzle
└── .env                    # Variables de entorno
```

### 📝 Configuración Drizzle
```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: 'require',
  },
});
```

---

## 🎯 Comandos del Proyecto de Tiendas

### 🏪 Crear Tienda
```powershell
# Iniciar servidor
npm run dev

# Ir a: http://localhost:3000/create-store
```

### 📊 Verificar API
```powershell
curl http://localhost:3000/api/migrate
```

### 🔍 Ver Tablas en Supabase
1. Ve a Supabase Dashboard
2. Table Editor
3. Deberías ver: stores, store_pages, store_sections

---

## 🔄 Flujo Completo del Proyecto

### 1. Nueva Funcionalidad
```typescript
// Editar schema.ts
export const nuevaTabla = pgTable('nueva_tabla', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: text('nombre').notNull(),
});
```

### 2. Generar y Aplicar
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
npx drizzle-kit generate
npx drizzle-kit push
```

### 3. Probar
```powershell
npm run dev
# Testear la nueva funcionalidad
```

---

## 💡 Tips Importantes

### ✅ Buenas Prácticas
- **SIEMPRE** ejecutar `Set-ExecutionPolicy` primero
- **VERIFICAR** que estés en la carpeta `d:\next>`
- **GUARDAR** cambios antes de generar migraciones
- **PROBAR** en desarrollo antes de producción

### 🚫 Errores a Evitar
- No usar `bash` en PowerShell
- No olvidar el `Set-ExecutionPolicy`
- No ejecutar `drizzle-kit push` sin generar primero

---

## 🎉 Checklist de Verificación

- [ ] PowerShell abierto en `d:\next>`
- [ ] `Set-ExecutionPolicy` ejecutado
- [ ] Schema.ts modificado
- [ ] `npx drizzle-kit generate` ejecutado
- [ ] `npx drizzle-kit push` ejecutado
- [ ] Servidor Next.js corriendo
- [ ] Funcionalidad probada

---

**📝 Nota: Copia este archivo y guárdalo como referencia rápida para futuros cambios en la base de datos.**
