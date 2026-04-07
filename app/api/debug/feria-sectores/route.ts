import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaSectores, feriaBloques } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/debug/feria-sectores - Debug de sectores y bloques
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG] Obteniendo sectores y bloques...')

    // 1. Obtener todos los sectores
    const sectores = await db
      .select({
        id: feriaSectores.id,
        titulo: feriaSectores.titulo,
        slug: feriaSectores.slug,
        activo: feriaSectores.activo
      })
      .from(feriaSectores)
      .orderBy(feriaSectores.orden)

    console.log(`📊 [DEBUG] ${sectores.length} sectores encontrados`)

    // 2. Para cada sector, obtener sus bloques
    const sectoresConBloques = await Promise.all(
      sectores.map(async (sector) => {
        const bloques = await db
          .select({
            id: feriaBloques.id,
            nombre: feriaBloques.nombre,
            orden: feriaBloques.orden,
            capacidad: feriaBloques.capacidad,
            activo: feriaBloques.activo
          })
          .from(feriaBloques)
          .where(eq(feriaBloques.sectorId, sector.id))
          .orderBy(feriaBloques.orden)

        return {
          sector: {
            id: sector.id,
            titulo: sector.titulo,
            slug: sector.slug,
            activo: sector.activo
          },
          bloques: bloques,
          cantidadBloques: bloques.length
        }
      })
    )

    // 3. Resumen
    const totalBloques = sectoresConBloques.reduce((sum, s) => sum + s.cantidadBloques, 0)
    const sectoresSinBloques = sectoresConBloques.filter(s => s.cantidadBloques === 0)

    console.log(`📊 [DEBUG] Total bloques: ${totalBloques}`)
    console.log(`⚠️ [DEBUG] Sectores sin bloques: ${sectoresSinBloques.length}`)

    return NextResponse.json({
      success: true,
      resumen: {
        totalSectores: sectores.length,
        totalBloques: totalBloques,
        sectoresSinBloques: sectoresSinBloques.length
      },
      detalle: sectoresConBloques
    })

  } catch (error: any) {
    console.error('❌ [DEBUG] Error:', error)
    return NextResponse.json(
      { error: 'Error en debug', details: error.message },
      { status: 500 }
    )
  }
}
