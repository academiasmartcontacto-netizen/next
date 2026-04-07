import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaPuestos, feriaBloques } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/debug/check-puestos-production - Verificar puestos en producción
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Verificando puestos en producción...')
    
    // 1. Verificar cuántos puestos existen
    const totalPuestos = await db.select().from(feriaPuestos)
    console.log(`📊 [DEBUG] Total puestos: ${totalPuestos.length}`)
    
    // 2. Verificar puestos por ciudad
    const puestosPorCiudad = await db
      .select({
        ciudad: feriaPuestos.ciudad,
        cantidad: db.raw('COUNT(*)').as('cantidad')
      })
      .from(feriaPuestos)
      .groupBy(feriaPuestos.ciudad)
    
    console.log(`🏙️ [DEBUG] Puestos por ciudad:`, puestosPorCiudad)
    
    // 3. Verificar si hay puestos para un bloque específico
    const bloqueId = 'f2beea25-905a-4956-a257-7079a95184a5' // Primer bloque
    const puestosBloqueLPZ = await db
      .select()
      .from(feriaPuestos)
      .where(
        eq(feriaPuestos.bloqueId, bloqueId)
      )
      .limit(5)
    
    console.log(`📋 [DEBUG] Puestos bloque LPZ: ${puestosBloqueLPZ.length}`)
    
    // 4. Si no hay puestos, crearlos
    if (totalPuestos.length === 0) {
      console.log('⚠️ [DEBUG] No hay puestos, creando...')
      
      // Obtener todos los bloques
      const bloques = await db.select().from(feriaBloques)
      
      // Crear puestos para cada bloque y ciudad
      const ciudades = ['LPZ', 'SCZ', 'CBA', 'ORU', 'PTS', 'TJA', 'CHQ', 'BEN', 'PND']
      
      for (const bloque of bloques) {
        for (const ciudad of ciudades) {
          for (let posicion = 1; posicion <= 12; posicion++) {
            await db.insert(feriaPuestos).values({
              sectorId: bloque.sectorId,
              bloqueId: bloque.id,
              posicion,
              ciudad,
              estado: 'disponible'
            })
          }
        }
      }
      
      console.log('✅ [DEBUG] Puestos creados correctamente')
    }
    
    return NextResponse.json({
      success: true,
      totalPuestos: totalPuestos.length,
      puestosPorCiudad,
      puestosBloqueLPZ: puestosBloqueLPZ.length,
      mensaje: totalPuestos.length === 0 ? 'Puestos creados' : 'Puestos ya existían'
    })

  } catch (error: any) {
    console.error('❌ [DEBUG] Error:', error)
    return NextResponse.json(
      { error: 'Error en debug', details: error.message },
      { status: 500 }
    )
  }
}
