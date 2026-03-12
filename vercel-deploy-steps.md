# Pasos para Desplegar en Vercel

## 🎯 Método 1: Importar desde GitHub (Recomendado)

1. **Ve a [Vercel](https://vercel.com)**
2. **Inicia sesión** con tu cuenta GitHub
3. **Dashboard > Add New > Project**
4. **Importa tu repositorio**: `academiasmartcontacto-netizen/next`
5. **Configura variables de entorno**:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://sfbsplymrielpfkoalsd.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   DATABASE_URL=postgresql://postgres.sfbsplymrielpfkoalsd:Yhefri123Chipana@aws-1-sa-east-1.pooler.supabase.com:6543/postgres
   ```
6. **Haz clic en "Deploy"**

## 🎯 Método 2: Usar Vercel CLI

1. **Instala Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Inicia sesión**:
   ```bash
   vercel login
   ```

3. **Despliega**:
   ```bash
   vercel --prod
   ```

## 📋 Después del Despliegue:

1. **Copia la URL** que te da Vercel
2. **Configura los secrets en GitHub**:
   - `VERCEL_TOKEN` (desde Vercel Dashboard > Settings > Tokens)
   - `ORG_ID` (desde Vercel Dashboard > Settings > General)
   - `PROJECT_ID` (desde Vercel Dashboard > Settings > General)

## 🎯 Ventajas del Método 1:

- ✅ **Despliegue automático** en cada push
- ✅ **Preview deployments** para PRs
- ✅ **Integración perfecta** con GitHub Actions
- ✅ **Rollbacks** fáciles

## 🔧 Para GitHub Actions:

Una vez desplegado, ve a:
1. **Vercel Dashboard > Settings > Tokens** → Crear token
2. **Vercel Dashboard > Settings > General** → Copiar ORG_ID y PROJECT_ID
3. **GitHub Repository > Settings > Secrets** → Agregar los 3 secrets
