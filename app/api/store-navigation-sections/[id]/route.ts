import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { storeNavigationSections } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// PUT - Actualizar sección de navegación
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, slug, isVisible, order } = body
    const sectionId = params.id

    if (!sectionId) {
      return NextResponse.json({ error: 'ID de sección requerido' }, { status: 400 })
    }

    // Si se actualiza el slug, verificar que sea único
    if (slug) {
      const existingSection = await db
        .select()
        .from(storeNavigationSections)
        .where(and(
          eq(storeNavigationSections.slug, slug),
          eq(storeNavigationSections.id, sectionId) // Solo verificar si no es la misma sección
        ))
        .limit(1)

      if (existingSection.length > 0) {
        return NextResponse.json({ error: 'El slug ya existe' }, { status: 400 })
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (isVisible !== undefined) updateData.isVisible = isVisible
    if (order !== undefined) updateData.order = order

    const updatedSection = await db
      .update(storeNavigationSections)
      .set(updateData)
      .where(eq(storeNavigationSections.id, sectionId))
      .returning()

    if (updatedSection.length === 0) {
      return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ section: updatedSection[0] })
  } catch (error) {
    console.error('Error al actualizar sección de navegación:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// DELETE - Eliminar sección de navegación
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const sectionId = params.id

    if (!storeId || !sectionId) {
      return NextResponse.json({ error: 'Store ID y Section ID requeridos' }, { status: 400 })
    }

    // Verificar que la sección pertenezca a la tienda
    const existingSection = await db
      .select()
      .from(storeNavigationSections)
      .where(and(
        eq(storeNavigationSections.storeId, storeId),
        eq(storeNavigationSections.slug, sectionId)
      ))
      .limit(1)

    if (existingSection.length === 0) {
      return NextResponse.json({ error: 'Sección no encontrada' }, { status: 404 })
    }

    // Eliminar la sección
    const deletedSection = await db
      .delete(storeNavigationSections)
      .where(and(
        eq(storeNavigationSections.storeId, storeId),
        eq(storeNavigationSections.slug, sectionId)
      ))
      .returning()

    return NextResponse.json({ message: 'Sección eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar sección de navegación:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
