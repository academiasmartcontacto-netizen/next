import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaSectores } from '@/lib/db/schema'
import { eq, desc, asc, lt, gt } from 'drizzle-orm'

// PATCH /api/admin/feria-sectores/[id]/reorder - Reordenar sectores
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    const { direction } = body

    if (!direction || !['up', 'down'].includes(direction)) {
      return NextResponse.json(
        { error: 'Dirección inválida' },
        { status: 400 }
      )
    }

    // Obtener sector actual
    const currentSector = await db
      .select({ id: feriaSectores.id, orden: feriaSectores.orden })
      .from(feriaSectores)
      .where(eq(feriaSectores.id, id))

    if (currentSector.length === 0) {
      return NextResponse.json(
        { error: 'Sector no encontrado' },
        { status: 404 }
      )
    }

    const currentOrder = currentSector[0].orden

    // Buscar vecino para intercambiar
    let neighborQuery
    if (direction === 'up') {
      neighborQuery = db
        .select({ id: feriaSectores.id, orden: feriaSectores.orden })
        .from(feriaSectores)
        .where(lt(feriaSectores.orden, currentOrder))
        .orderBy(desc(feriaSectores.orden))
        .limit(1)
    } else {
      neighborQuery = db
        .select({ id: feriaSectores.id, orden: feriaSectores.orden })
        .from(feriaSectores)
        .where(gt(feriaSectores.orden, currentOrder))
        .orderBy(asc(feriaSectores.orden))
        .limit(1)
    }

    const neighbor = await neighborQuery

    if (neighbor.length === 0) {
      return NextResponse.json(
        { error: 'No hay sector para intercambiar' },
        { status: 400 }
      )
    }

    // Intercambiar órdenes
    await db.transaction(async (tx) => {
      await tx
        .update(feriaSectores)
        .set({ orden: neighbor[0].orden })
        .where(eq(feriaSectores.id, id))

      await tx
        .update(feriaSectores)
        .set({ orden: currentOrder })
        .where(eq(feriaSectores.id, neighbor[0].id))
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al reordenar:', error)
    return NextResponse.json(
      { error: 'Error al reordenar' },
      { status: 500 }
    )
  }
}
