import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaBloques } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/admin/feria-bloques/[id] - Actualizar bloque
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id
    const body = await request.json()
    const { nombre } = body

    if (!nombre) {
      return NextResponse.json(
        { error: 'Nombre es requerido' },
        { status: 400 }
      )
    }

    console.log('✏️ [BLOQUES PUT] Actualizando bloque:', { id, nombre })

    const updatedBloque = await db
      .update(feriaBloques)
      .set({ 
        nombre,
        updatedAt: new Date()
      })
      .where(eq(feriaBloques.id, id))
      .returning()

    if (updatedBloque.length === 0) {
      return NextResponse.json(
        { error: 'Bloque no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ [BLOQUES PUT] Bloque actualizado:', updatedBloque[0])

    return NextResponse.json({
      success: true,
      message: 'Bloque actualizado correctamente',
      bloque: updatedBloque[0]
    })

  } catch (error: any) {
    console.error('❌ [BLOQUES PUT] Error:', error)
    return NextResponse.json(
      { error: 'Error al actualizar bloque', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/feria-bloques/[id] - Eliminar bloque
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = resolvedParams.id

    console.log('🗑️ [BLOQUES DELETE] Eliminando bloque:', id)

    // Primero obtener el bloque para mostrar info
    const bloque = await db
      .select()
      .from(feriaBloques)
      .where(eq(feriaBloques.id, id))
      .limit(1)

    if (bloque.length === 0) {
      return NextResponse.json(
        { error: 'Bloque no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar el bloque (cascade eliminará los puestos asociados)
    const deletedBloque = await db
      .delete(feriaBloques)
      .where(eq(feriaBloques.id, id))
      .returning()

    console.log('✅ [BLOQUES DELETE] Bloque eliminado:', deletedBloque[0])

    return NextResponse.json({
      success: true,
      message: 'Bloque eliminado correctamente',
      bloque: deletedBloque[0]
    })

  } catch (error: any) {
    console.error('❌ [BLOQUES DELETE] Error:', error)
    return NextResponse.json(
      { error: 'Error al eliminar bloque', details: error.message },
      { status: 500 }
    )
  }
}
