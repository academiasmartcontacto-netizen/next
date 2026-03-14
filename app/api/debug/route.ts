import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stores, users, userSessions } from '@/lib/db/schema'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DIAGNÓSTICO: Iniciando verificación completa')
    
    const results = {
      connection: 'unknown',
      tables: [],
      storesStructure: null,
      userCount: null,
      storeCount: null,
      errors: []
    }
    
    // 1. Test de conexión básica
    try {
      const connectionTest = await db.execute('SELECT NOW() as current_time, 1 as test')
      results.connection = 'success'
      console.log('✅ Conexión BD OK:', connectionTest)
    } catch (error) {
      results.connection = 'failed'
      results.errors.push(`Connection: ${error.message}`)
      console.error('❌ Conexión BD fallida:', error)
    }
    
    // 2. Listar tablas existentes
    try {
      const tables = await db.execute(`
        SELECT table_name, table_type 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `)
      results.tables = tables
      console.log('📋 Tablas encontradas:', tables)
    } catch (error) {
      results.errors.push(`Tables query: ${error.message}`)
      console.error('❌ Error al listar tablas:', error)
    }
    
    // 3. Verificar estructura de stores
    try {
      const storesStructure = await db.execute(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'stores' AND table_schema = 'public'
        ORDER BY ordinal_position
      `)
      results.storesStructure = storesStructure
      console.log('🏪 Estructura stores:', storesStructure)
    } catch (error) {
      results.errors.push(`Stores structure: ${error.message}`)
      console.error('❌ Error al verificar estructura stores:', error)
    }
    
    // 4. Contar usuarios
    try {
      const userCount = await db.select({ count: users.id }).from(users)
      results.userCount = userCount
      console.log('👥 Total usuarios:', userCount)
    } catch (error) {
      results.errors.push(`User count: ${error.message}`)
      console.error('❌ Error al contar usuarios:', error)
    }
    
    // 5. Contar tiendas
    try {
      const storeCount = await db.select({ count: stores.id }).from(stores)
      results.storeCount = storeCount
      console.log('🏪 Total tiendas:', storeCount)
    } catch (error) {
      results.errors.push(`Store count: ${error.message}`)
      console.error('❌ Error al contar tiendas:', error)
    }
    
    // 6. Test de inserción simple
    try {
      console.log('🔍 DIAGNÓSTICO: Intentando inserción de prueba...')
      
      // Primero verificar si existe tabla
      const tableExists = await db.execute(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'stores'
        ) as exists
      `)
      
      console.log('🏪 ¿Existe tabla stores?', tableExists)
      
      if (tableExists[0]?.exists) {
        // Intentar consulta SELECT simple
        const simpleSelect = await db.execute(`
          SELECT COUNT(*) as total 
          FROM stores
        `)
        console.log('🏪 SELECT simple exitoso:', simpleSelect)
      }
      
    } catch (error) {
      results.errors.push(`Test operations: ${error.message}`)
      console.error('❌ Error en operaciones de prueba:', error)
    }
    
    return NextResponse.json({
      success: results.errors.length === 0,
      results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('🔍 DIAGNÓSTICO: Error general:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
