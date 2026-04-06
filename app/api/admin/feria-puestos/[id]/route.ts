import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaPuestos } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// DELETE /api/admin/feria-puestos/[id] - Liberar puesto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id

    console.log('🗑️ [PUESTOS DELETE] Liberando puesto:', id)

    // Eliminar el puesto (esto libera el espacio)
    const deletedPuesto = await db
      .delete(feriaPuestos)
      .where(eq(feriaPuestos.id, id))
      .returning()

    if (deletedPuesto.length === 0) {
      return NextResponse.json(
        { error: 'Puesto no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ [PUESTOS DELETE] Puesto liberado:', deletedPuesto[0])

    return NextResponse.json({
      success: true,
      message: 'Puesto liberado correctamente',
      puesto: deletedPuesto[0]
    })

  } catch (error: any) {
    console.error('❌ [PUESTOS DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Error al liberar puesto', details: error.message },
      { status: 500 }
    )
  }
}
