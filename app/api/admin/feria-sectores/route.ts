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

    console.log('➕ [POST] Creando nuevo sector:', { titulo, slug })
    console.log('➕ [POST] Datos recibidos:', {
      titulo,
      slug,
      descripcion: descripcion?.substring(0, 50) + '...',
      colorHex,
      categoriaDefaultId
    })

    if (!titulo || !slug) {
      console.log('❌ [POST] Validación fallida: título o slug vacíos')
      return NextResponse.json(
        { error: 'Título y slug son obligatorios' },
        { status: 400 }
      )
    }

    // Verificar si ya existe un sector con el mismo slug
    const existingSector = await db
      .select()
      .from(feriaSectores)
      .where(eq(feriaSectores.slug, slug))

    if (existingSector.length > 0) {
      console.log('❌ [POST] Ya existe un sector con el slug:', slug)
      return NextResponse.json(
        { error: 'Ya existe un sector con este slug' },
        { status: 400 }
      )
    }

    console.log('📋 [POST] Verificando último orden para asignar nuevo')

    // Obtener el último orden
    const lastSector = await db
      .select({ orden: feriaSectores.orden })
      .from(feriaSectores)
      .orderBy(desc(feriaSectores.orden))
      .limit(1)

    const nuevoOrden = (lastSector[0]?.orden || 0) + 1
    console.log('📊 [POST] Orden asignado:', nuevoOrden)

    console.log('💾 [POST] Insertando nuevo sector en base de datos')

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

    console.log('✅ [POST] Sector creado exitosamente:', newSector[0]?.titulo)
    console.log('🆔 [POST] ID del nuevo sector:', newSector[0]?.id)

    return NextResponse.json(newSector[0])
  } catch (error: unknown) {
    console.error('❌ [POST] Error al crear sector:', error)
    console.error('❌ [POST] Stack trace:', (error as Error).stack)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: (error as Error).message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
