import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaSectores } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PATCH /api/admin/feria-sectores/[id]/toggle - Cambiar estado activo/inactivo
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    // Obtener sector actual
    const currentSector = await db
      .select()
      .from(feriaSectores)
      .where(eq(feriaSectores.id, id))

    if (currentSector.length === 0) {
      return NextResponse.json(
        { error: 'Sector no encontrado' },
        { status: 404 }
      )
    }

    // Cambiar estado
    const updatedSector = await db
      .update(feriaSectores)
      .set({
        activo: !currentSector[0].activo,
        updatedAt: new Date()
      })
      .where(eq(feriaSectores.id, id))
      .returning()

    return NextResponse.json(updatedSector[0])
  } catch (error) {
    console.error('Error al cambiar estado:', error)
    return NextResponse.json(
      { error: 'Error al cambiar estado' },
      { status: 500 }
    )
  }
}
