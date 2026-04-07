import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/debug/all-tables - Verificar todas las tablas que existen
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Listando todas las tablas...')

    // Obtener todas las tablas que contienen 'feria'
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%feria%'
      ORDER BY table_name
    `
    
    const result = await db.execute(query)
    const tables = result.rows || []

    console.log(`📊 [DEBUG] ${tables.length} tablas feria encontradas`)

    return NextResponse.json({
      success: true,
      cantidad: tables.length,
      tablas: tables.map(t => t.table_name)
    })

  } catch (error: any) {
    console.error('❌ [DEBUG] Error:', error)
    return NextResponse.json(
      { error: 'Error al listar tablas', details: error.message },
      { status: 500 }
    )
  }
}
