import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/debug/tables-structure - Verificar estructura real de tablas
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Verificando estructura de tablas...')

    // Verificar estructura de feria_bloques
    const bloquesQuery = `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'feria_bloques' 
      ORDER BY ordinal_position
    `
    const bloquesStructure = await db.execute(bloquesQuery)

    // Verificar estructura de feria_puestos (si existe)
    let puestosStructure = null
    try {
      const puestosQuery = `
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'feria_puestos' 
        ORDER BY ordinal_position
      `
      puestosStructure = await db.execute(puestosQuery)
    } catch (e) {
      console.log('Tabla feria_puestos no existe')
    }

    // Verificar estructura de feria_sectores
    const sectoresQuery = `
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'feria_sectores' 
      ORDER BY ordinal_position
    `
    const sectoresStructure = await db.execute(sectoresQuery)

    return NextResponse.json({
      success: true,
      tablas: {
        feria_bloques: bloquesStructure.rows || [],
        feria_puestos: puestosStructure?.rows || null,
        feria_sectores: sectoresStructure.rows || []
      }
    })

  } catch (error: any) {
    console.error('❌ [DEBUG] Error:', error)
    return NextResponse.json(
      { error: 'Error al verificar tablas', details: error.message },
      { status: 500 }
    )
  }
}
