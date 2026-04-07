import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaPuestos } from '@/lib/db/schema'

// GET /api/debug/check-bloque-field - Verificar nombre correcto del campo
export async function GET(request: NextRequest) {
  try {
    // Hacer una consulta simple para ver los nombres de campo reales
    const result = await db
      .select()
      .from(feriaPuestos)
      .limit(1)
    
    if (result.length > 0) {
      const campos = Object.keys(result[0])
      return NextResponse.json({
        success: true,
        campos: campos,
        mensaje: 'Campos reales en la BD'
      })
    } else {
      return NextResponse.json({
        success: false,
        mensaje: 'No hay puestos para verificar'
      })
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
