# Modern Web App

Una aplicación web moderna construida con las últimas tecnologías:

- **Next.js 15** - Framework de React con renderizado del lado del servidor
- **Supabase** - Backend como servicio con base de datos PostgreSQL y autenticación
- **Tailwind CSS** - Framework de CSS para diseño moderno
- **TypeScript** - Tipado estático para JavaScript
- **Framer Motion** - Animaciones fluidas
- **shadcn/ui** - Componentes UI de alta calidad

## 🚀 Empezar

1. Clona este repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edita `.env.local` con tus credenciales de Supabase.

4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Configuración de Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com)
2. Copia la URL y la clave anónima a tus variables de entorno
3. Ejecuta el siguiente SQL en el editor SQL de Supabase:

```sql
-- Create waitlist table
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy for insertions
CREATE POLICY "Users can insert their own email" ON waitlist
  FOR INSERT WITH CHECK (true);
```

## 🚀 Despliegue en Vercel

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 18, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Animaciones**: Framer Motion
- **Despliegue**: Vercel
- **Desarrollo**: ESLint, Prettier

## 📁 Estructura del Proyecto

```
├── app/                    # App Router de Next.js
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   └── ui/               # Componentes UI reutilizables
├── lib/                   # Utilidades y configuración
│   ├── supabase.ts       # Cliente de Supabase
│   └── utils.ts          # Utilidades generales
├── public/               # Archivos estáticos
└── tailwind.config.js    # Configuración de Tailwind
```

## 🎨 Características

- ✅ Diseño moderno y responsivo
- ✅ Animaciones fluidas con Framer Motion
- ✅ Sistema de diseño con shadcn/ui
- ✅ Tipado completo con TypeScript
- ✅ Optimizado para rendimiento
- ✅ SEO friendly con Next.js
- ✅ Despliegue fácil en Vercel

## 📝 Licencia

MIT License
