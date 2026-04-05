import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaSectores } from '@/lib/db/schema'
import { eq, desc, asc } from 'drizzle-orm'

// GET /api/admin/feria-sectores - Obtener todos los sectores
export async function GET() {
  try {
    const sectores = await db
      .select()
      .from(feriaSectores)
      .orderBy(asc(feriaSectores.orden))

    return NextResponse.json(sectores)
  } catch (error) {
    console.error('Error al obtener sectores:', error)
    return NextResponse.json(
      { error: 'Error al obtener sectores' },
      { status: 500 }
    )
  }
}

// POST /api/admin/feria-sectores - Crear nuevo sector
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { titulo, slug, descripcion, colorHex, categoriaDefaultId } = body

    if (!titulo || !slug) {
      return NextResponse.json(
        { error: 'Título y slug son obligatorios' },
        { status: 400 }
      )
    }

    // Obtener el último orden
    const lastSector = await db
      .select({ orden: feriaSectores.orden })
      .from(feriaSectores)
      .orderBy(desc(feriaSectores.orden))
      .limit(1)

    const nuevoOrden = (lastSector[0]?.orden || 0) + 1

    const newSector = await db
      .insert(feriaSectores)
      .values({
        titulo,
        slug,
        descripcion,
        colorHex: colorHex || '#FF6B35',
        categoriaDefaultId: categoriaDefaultId || null,
        orden: nuevoOrden,
        capacidad: 12,
        activo: true
      })
      .returning()

    return NextResponse.json(newSector[0])
  } catch (error) {
    console.error('Error al crear sector:', error)
    return NextResponse.json(
      { error: 'Error al crear sector' },
      { status: 500 }
    )
  }
}
