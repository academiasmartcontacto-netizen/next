import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { storeNavigationSections, stores } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { AuthService } from '@/lib/auth'

// GET - Obtener secciones de navegación de una tienda
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID requerido' }, { status: 400 })
    }

    const sections = await db
      .select()
      .from(storeNavigationSections)
      .where(eq(storeNavigationSections.storeId, storeId))
      .orderBy(storeNavigationSections.order)

    return NextResponse.json({ sections })
  } catch (error) {
    console.error('Error al obtener secciones de navegación:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// POST - Crear nueva sección de navegación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { storeId, name, slug, isVisible = true } = body

    if (!storeId || !name || !slug) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Verificar que el slug sea único para esta tienda
    const existingSection = await db
      .select()
      .from(storeNavigationSections)
      .where(and(
        eq(storeNavigationSections.storeId, storeId),
        eq(storeNavigationSections.slug, slug)
      ))
      .limit(1)

    if (existingSection.length > 0) {
      return NextResponse.json({ error: 'El slug ya existe' }, { status: 400 })
    }

    // Obtener el orden máximo para colocarlo al final
    const maxOrderResult = await db
      .select({ order: storeNavigationSections.order })
      .from(storeNavigationSections)
      .where(eq(storeNavigationSections.storeId, storeId))
      .orderBy(storeNavigationSections.order)
      .limit(1)

    const newOrder = maxOrderResult.length > 0 ? maxOrderResult[0].order + 1 : 0

    const newSection = await db
      .insert(storeNavigationSections)
      .values({
        storeId,
        name,
        slug,
        isVisible,
        order: newOrder,
        isCustom: true,
      })
      .returning()

    return NextResponse.json({ section: newSection[0] })
  } catch (error) {
    console.error('Error al crear sección de navegación:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
