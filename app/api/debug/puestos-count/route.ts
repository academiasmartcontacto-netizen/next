import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaPuestos } from '@/lib/db/schema'

// GET /api/debug/puestos-count - Contar puestos existentes
export async function GET(request: NextRequest) {
  try {
    const totalPuestos = await db.select().from(feriaPuestos)
    
    return NextResponse.json({
      success: true,
      total: totalPuestos.length,
      mensaje: totalPuestos.length === 0 ? 'NO HAY PUESTOS - PROBLEMA' : 'PUESTOS EXISTEN'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
