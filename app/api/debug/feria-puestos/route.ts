import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaPuestos } from '@/lib/db/schema'

// GET /api/debug/feria-puestos - Debug de tabla feria_puestos
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Verificando tabla feria_puestos...')

    // Intentar obtener todos los puestos
    const puestos = await db
      .select()
      .from(feriaPuestos)
      .limit(5)

    console.log(`📊 [DEBUG] ${puestos.length} puestos encontrados`)

    // Verificar estructura de la tabla
    const firstPuesto = puestos[0]
    if (firstPuesto) {
      console.log('📋 [DEBUG] Estructura de primer puesto:', Object.keys(firstPuesto))
    }

    return NextResponse.json({
      success: true,
      cantidad: puestos.length,
      estructura: firstPuesto ? Object.keys(firstPuesto) : [],
      ejemplo: firstPuesto || null,
      todos: puestos
    })

  } catch (error: any) {
    console.error('❌ [DEBUG] Error:', error)
    return NextResponse.json(
      { 
        error: 'Error al verificar feria_puestos', 
        details: error.message,
        stack: error.stack 
      },
      { status: 500 }
    )
  }
}
