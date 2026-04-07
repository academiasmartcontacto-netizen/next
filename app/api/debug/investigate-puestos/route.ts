import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaPuestos } from '@/lib/db/schema'

// GET /api/debug/investigate-puestos - Investigar qué pasó con los puestos
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [INVESTIGATE] Analizando creación de puestos...')
    
    // 1. Contar todos los puestos
    const totalPuestos = await db.select().from(feriaPuestos)
    
    // 2. Analizar por ciudad
    const puestosPorCiudad = await db
      .select({
        ciudad: feriaPuestos.ciudad,
        cantidad: db.raw('COUNT(*)').as('cantidad')
      })
      .from(feriaPuestos)
      .groupBy(feriaPuestos.ciudad)
      .orderBy(feriaPuestos.ciudad)
    
    // 3. Analizar por bloque
    const puestosPorBloque = await db
      .select({
        bloqueId: feriaPuestos.bloqueId,
        cantidad: db.raw('COUNT(*)').as('cantidad')
      })
      .from(feriaPuestos)
      .groupBy(feriaPuestos.bloqueId)
      .orderBy(feriaPuestos.bloqueId)
    
    // 4. Verificar timestamps
    const timestamps = await db
      .select({
        minDate: db.raw('MIN(created_at)').as('min_date'),
        maxDate: db.raw('MAX(created_at)').as('max_date')
      })
      .from(feriaPuestos)
    
    return NextResponse.json({
      success: true,
      investigacion: {
        total_puestos: totalPuestos.length,
        por_ciudad: puestosPorCiudad,
        por_bloque: puestosPorBloque,
        timestamps: timestamps[0] || null,
        conclusion: totalPuestos.length === 972 ? '972 puestos - CORRECTO' : 'Diferente de 972'
      }
    })

  } catch (error: any) {
    console.error('❌ [INVESTIGATE] Error:', error)
    return NextResponse.json(
      { error: 'Error en investigación', details: error.message },
      { status: 500 }
    )
  }
}
