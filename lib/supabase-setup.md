# Configuración de Tablas en Supabase

## Problema: Las tablas no aparecen en Supabase

Las migraciones SQL que creamos están diseñadas para PostgreSQL directo, pero necesitas ejecutarlas específicamente en tu proyecto Supabase.

## Solución 1: Usar el Editor SQL de Supabase (Recomendado)

### Paso 1: Ir al Editor SQL de Supabase
1. Entra a tu proyecto Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **"SQL Editor"** en el menú izquierdo
4. Haz clic en **"+ New query"**

### Paso 2: Ejecutar las migraciones

Copia y pega este código en el editor SQL:

```sql
-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    link TEXT NOT NULL UNIQUE,
    domain TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    settings TEXT, -- JSON string
    theme TEXT DEFAULT 'default',
    seo_title TEXT,
    seo_description TEXT,
    logo TEXT, -- URL to store logo
    favicon TEXT, -- URL to favicon
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create store_pages table
CREATE TABLE IF NOT EXISTS store_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT, -- JSON string for page content
    is_published BOOLEAN DEFAULT false,
    is_home_page BOOLEAN DEFAULT false,
    order INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create store_sections table
CREATE TABLE IF NOT EXISTS store_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES store_pages(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- header, hero, gallery, text, contact, etc.
    content TEXT NOT NULL, -- JSON string for section content
    order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    settings TEXT, -- JSON string for section-specific settings
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_link ON stores(link);
CREATE INDEX IF NOT EXISTS idx_stores_is_published ON stores(is_published);
CREATE INDEX IF NOT EXISTS idx_store_pages_store_id ON store_pages(store_id);
CREATE INDEX IF NOT EXISTS idx_store_pages_slug ON store_pages(slug);
CREATE INDEX IF NOT EXISTS idx_store_sections_page_id ON store_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_store_sections_order ON store_sections(order);

-- Add unique constraint for store slugs within each store
CREATE UNIQUE INDEX IF NOT EXISTS idx_store_pages_store_slug ON store_pages(store_id, slug);
```

### Paso 3: Ejecutar el SQL
1. Haz clic en **"Run"** (▶️) para ejecutar el código
2. Verifica que no haya errores
3. Las tablas deberían aparecer en **"Table Editor"**

## Solución 2: Usar Drizzle Kit con Supabase

### Paso 1: Instalar Drizzle Kit
```bash
npm install -D drizzle-kit
```

### Paso 2: Configurar drizzle.config.ts
Crea el archivo `drizzle.config.ts`:

```typescript
import { defineConfig } from 'drizzle-kit'
import { env } from './env'

export default defineConfig({
  dialect: 'postgresql',
  schema: './lib/db/schema.ts',
  out: './lib/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
```

### Paso 3: Generar y ejecutar migraciones
```bash
npx drizzle-kit generate
npx drizzle-kit push
```

## Verificación

### Método 1: Ver en Table Editor
Después de ejecutar el SQL, ve a **"Table Editor"** en Supabase y deberías ver:
- ✅ `stores`
- ✅ `store_pages` 
- ✅ `store_sections`

### Método 2: Verificar con API
```bash
curl http://localhost:3000/api/migrate
```

Deberías responder:
```json
{
  "tables": {
    "stores": true,
    "store_pages": true,
    "store_sections": true
  },
  "migration_status": "completed"
}
```

## Notas Importantes

1. **Referencia a auth.users**: En Supabase, la tabla de usuarios es `auth.users`, no `users`
2. **Permisos RLS**: Necesitarás configurar Row Level Security (RLS) para las nuevas tablas
3. **Variables de entorno**: Asegúrate que `DATABASE_URL` apunte a tu base de datos Supabase

## Configurar RLS (Opcional pero Recomendado)

```sql
-- Enable RLS on stores table
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Policy for users to see their own stores
CREATE POLICY "Users can view own stores" ON stores
    FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own stores
CREATE POLICY "Users can insert own stores" ON stores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own stores
CREATE POLICY "Users can update own stores" ON stores
    FOR UPDATE USING (auth.uid() = user_id);
```

**Después de ejecutar el SQL en el editor de Supabase, las tablas deberían aparecer inmediatamente en tu dashboard.**
