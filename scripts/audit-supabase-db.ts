import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../lib/db/schema'

// Conexión a tu base de datos Supabase
const connectionString = "postgresql://postgres.sfbsplymrielpfkoalsd:Yhefri123Chipana@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"

const client = postgres(connectionString, { 
  prepare: false,
  ssl: 'require'
})

const db = drizzle(client, { schema })

async function auditSupabaseDB() {
  console.log('🔍 AUDITORÍA COMPLETA DE SUPABASE DATABASE')
  console.log('==========================================')
  
  try {
    // 1. Listar todas las tablas
    console.log('\n📋 TABLAS EN LA BASE DE DATOS:')
    const tables = await client`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    
    tables.forEach(table => {
      console.log(`  ✅ ${table.table_name} (schema: ${table.table_schema})`)
    })
    
    // 2. Verificar tablas principales del proyecto
    console.log('\n🏪 TABLAS PRINCIPALES DEL PROYECTO:')
    
    const mainTables = ['users', 'stores', 'products', 'product_images', 'user_profiles', 'user_sessions']
    
    for (const tableName of mainTables) {
      try {
        const result = await client`SELECT COUNT(*) as count FROM ${client(tableName)}`
        console.log(`  ✅ ${tableName}: ${result[0].count} registros`)
      } catch (error) {
        console.log(`  ❌ ${tableName}: No existe o error de acceso`)
      }
    }
    
    // 3. Verificar tablas de storage de Supabase
    console.log('\n📦 TABLAS DE STORAGE DE SUPABASE:')
    
    const storageTables = ['storage.buckets', 'storage.objects', 'storage.migrations']
    
    for (const tableName of storageTables) {
      try {
        const result = await client`SELECT COUNT(*) as count FROM ${client(tableName)}`
        console.log(`  ✅ ${tableName}: ${result[0].count} registros`)
      } catch (error) {
        console.log(`  ❌ ${tableName}: No existe o error de acceso`)
      }
    }
    
    // 4. Verificar políticas de acceso (RLS)
    console.log('\n🔒 POLÍTICAS DE ACCESO (RLS):')
    
    try {
      const policies = await client`
        SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
        FROM pg_policies 
        WHERE tablename IN ('storage.objects', 'products', 'stores', 'users')
        ORDER BY tablename, policyname
      `
      
      if (policies.length === 0) {
        console.log('  ⚠️  No se encontraron políticas de acceso')
      } else {
        policies.forEach(policy => {
          console.log(`  ✅ ${policy.tablename}.${policy.policyname}`)
          console.log(`     - Roles: ${policy.roles || 'ALL'}`)
          console.log(`     - Comando: ${policy.cmd}`)
        })
      }
    } catch (error) {
      console.log('  ❌ Error consultando políticas de acceso')
    }
    
    // 5. Verificar buckets de storage
    console.log('\n📦 BUCKETS DE STORAGE:')
    
    try {
      const buckets = await client`
        SELECT id, name, public, file_size_limit, allowed_mime_types 
        FROM storage.buckets 
        ORDER BY name
      `
      
      if (buckets.length === 0) {
        console.log('  ⚠️  No se encontraron buckets de storage')
      } else {
        buckets.forEach(bucket => {
          console.log(`  ✅ ${bucket.name} (ID: ${bucket.id})`)
          console.log(`     - Público: ${bucket.public}`)
          console.log(`     - Límite: ${bucket.file_size_limit} bytes`)
          console.log(`     - MIME types: ${bucket.allowed_mime_types}`)
        })
      }
    } catch (error) {
      console.log('  ❌ Error consultando buckets de storage')
    }
    
    // 6. Verificar configuración de extensiones
    console.log('\n🔧 EXTENSIONES INSTALADAS:')
    
    try {
      const extensions = await client`
        SELECT extname, extversion, extnamespace::regnamespace as schema 
        FROM pg_extension 
        ORDER BY extname
      `
      
      extensions.forEach(ext => {
        console.log(`  ✅ ${ext.extname} v${ext.extversion} (schema: ${ext.schema})`)
      })
    } catch (error) {
      console.log('  ❌ Error consultando extensiones')
    }
    
    // 7. Estado de la base de datos
    console.log('\n📊 ESTADO DE LA BASE DE DATOS:')
    
    try {
      const stats = await client`
        SELECT 
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM stores) as total_stores,
          (SELECT COUNT(*) FROM products) as total_products,
          (SELECT COUNT(*) FROM product_images) as total_images,
          (SELECT COUNT(*) FROM storage.objects) as storage_objects
      `
      
      const s = stats[0]
      console.log(`  👥 Usuarios: ${s.total_users}`)
      console.log(`  🏪 Tiendas: ${s.total_stores}`)
      console.log(`  📦 Productos: ${s.total_products}`)
      console.log(`  🖼️  Imágenes de productos: ${s.total_images}`)
      console.log(`  📁 Objetos en storage: ${s.storage_objects}`)
      
    } catch (error) {
      console.log('  ❌ Error obteniendo estadísticas')
    }
    
    console.log('\n🎯 AUDITORÍA COMPLETADA')
    console.log('==========================================')
    
  } catch (error) {
    console.error('❌ ERROR GENERAL EN AUDITORÍA:', error)
  } finally {
    await client.end()
  }
}

// Ejecutar auditoría
auditSupabaseDB().catch(console.error)
