// Script para verificar conexión y tablas de Supabase
import { db } from './index'
import { stores, users, products, userSessions } from './schema'

export async function checkDatabaseConnection() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...')
    
    // 1. Verificar conexión básica
    const result = await db.execute('SELECT 1 as test')
    console.log('✅ Conexión a BD exitosa:', result)
    
    // 2. Verificar si existen las tablas
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    
    const tables = await db.execute(tablesQuery)
    console.log('📋 Tablas encontradas:', tables)
    
    // 3. Verificar estructura de tabla stores
    try {
      const storesStructure = await db.execute(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'stores' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `)
      console.log('🏪 Estructura de tabla stores:', storesStructure)
    } catch (error) {
      console.error('❌ Error al verificar estructura de stores:', error)
    }
    
    // 4. Intentar consulta simple a stores
    try {
      const storesCount = await db.select({ count: stores.id }).from(stores)
      console.log('🏪 Total tiendas:', storesCount)
    } catch (error) {
      console.error('❌ Error al consultar stores:', error)
      console.error('❌ Detalles del error:', {
        message: error.message,
        code: error.code,
        hint: error.hint
      })
    }
    
    // 5. Verificar usuarios
    try {
      const usersCount = await db.select({ count: users.id }).from(users)
      console.log('👥 Total usuarios:', usersCount)
    } catch (error) {
      console.error('❌ Error al consultar users:', error)
    }
    
    return {
      success: true,
      tables: tables,
      connection: 'ok'
    }
    
  } catch (error) {
    console.error('❌ Error general de conexión:', error)
    return {
      success: false,
      error: error.message,
      connection: 'failed'
    }
  }
}

// Función para ejecutar diagnóstico completo
export async function runFullDiagnosis() {
  console.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO DE BASE DE DATOS')
  
  const results = {
    connection: null,
    tables: null,
    storesStructure: null,
    testQuery: null,
    errors: []
  }
  
  try {
    // Test 1: Conexión básica
    results.testQuery = await db.execute('SELECT NOW() as current_time')
    console.log('✅ Test query exitoso:', results.testQuery)
    
    // Test 2: Listar tablas
    results.tables = await db.execute(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)
    console.log('📋 Tablas:', results.tables)
    
    // Test 3: Verificar tabla stores específicamente
    try {
      results.storesStructure = await db.execute(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'stores' AND table_schema = 'public'
      `)
      console.log('🏪 Estructura stores:', results.storesStructure)
    } catch (error) {
      results.errors.push(`Stores structure error: ${error.message}`)
    }
    
    // Test 4: Intentar SELECT simple
    try {
      const simpleSelect = await db.execute('SELECT COUNT(*) as total FROM stores')
      console.log('🏪 COUNT stores:', simpleSelect)
    } catch (error) {
      results.errors.push(`Simple SELECT error: ${error.message}`)
    }
    
  } catch (error) {
    results.errors.push(`General error: ${error.message}`)
  }
  
  return results
}

// Para usar en página de diagnóstico
export const diagnosticResults = await runFullDiagnosis()
