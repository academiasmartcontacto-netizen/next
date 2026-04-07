import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaPuestos, feriaBloques } from '@/lib/db/schema'

// GET /api/debug/create-puestos - Crear puestos en producción
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Creando puestos en producción...')
    
    // 1. Obtener todos los bloques
    const bloques = await db.select().from(feriaBloques)
    console.log(`📊 [DEBUG] ${bloques.length} bloques encontrados`)
    
    // 2. Crear puestos para cada bloque y ciudad
    const ciudades = ['LPZ', 'SCZ', 'CBA', 'ORU', 'PTS', 'TJA', 'CHQ', 'BEN', 'PND']
    let creados = 0
    
    for (const bloque of bloques) {
      for (const ciudad of ciudades) {
        for (let posicion = 1; posicion <= 12; posicion++) {
          try {
            await db.insert(feriaPuestos).values({
              sectorId: bloque.sectorId,
              bloqueId: bloque.id,
              posicion,
              ciudad,
              estado: 'disponible'
            })
            creados++
          } catch (e) {
            // Ignorar duplicados
            console.log(`⚠️ Puesto ya existe: bloque ${bloque.id}, ciudad ${ciudad}, pos ${posicion}`)
          }
        }
      }
    }
    
    console.log(`✅ [DEBUG] ${creados} puestos creados`)
    
    return NextResponse.json({
      success: true,
      mensaje: `${creados} puestos creados correctamente`,
      bloques: bloques.length,
      ciudades: ciudades.length,
      totalEsperado: bloques.length * ciudades.length * 12
    })

  } catch (error: any) {
    console.error('❌ [DEBUG] Error:', error)
    return NextResponse.json(
      { error: 'Error al crear puestos', details: error.message },
      { status: 500 }
    )
  }
}
