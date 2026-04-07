import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaSectores } from '@/lib/db/schema'
import { eq, desc, asc, lt, gt } from 'drizzle-orm'
import { FeriaStorageService } from '@/lib/services/FeriaStorageService'

// GET /api/admin/feria-sectores/[id] - Obtener sector por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15+ requiere await para params
    const resolvedParams = await params
    const id = resolvedParams.id

    console.log('🔍 [GET] Buscando sector:', id)

    const sector = await db
      .select()
      .from(feriaSectores)
      .where(eq(feriaSectores.id, id))
      .limit(1)

    if (sector.length === 0) {
      console.log('❌ [GET] Sector no encontrado:', id)
      return NextResponse.json(
        { error: 'Sector no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ [GET] Sector encontrado:', sector[0].titulo)
    return NextResponse.json(sector[0])

  } catch (error: any) {
    console.error('❌ [GET] Error al obtener sector:', error)
    return NextResponse.json(
      { error: 'Error al obtener sector', details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/admin/feria-sectores/[id] - Actualizar sector
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15+ requiere await para params
    const resolvedParams = await params
    const id = resolvedParams.id
    
    const body = await request.json()
    const { titulo, slug, descripcion, colorHex, categoriaDefaultId, imagenBanner } = body

    console.log('📝 [PUT] Actualizando sector:', { id, titulo, slug })
    console.log('📝 [PUT] Datos recibidos:', {
      titulo,
      slug,
      descripcion: descripcion?.substring(0, 50) + '...',
      colorHex,
      categoriaDefaultId,
      imagenBanner: imagenBanner ? 'SÍ' : 'NO'
    })

    if (!titulo || !slug) {
      console.log('❌ [PUT] Validación fallida: título o slug vacíos')
      return NextResponse.json(
        { error: 'Título y slug son obligatorios' },
        { status: 400 }
      )
    }

    // Verificar si el sector existe antes de actualizar
    const existingSector = await db
      .select()
      .from(feriaSectores)
      .where(eq(feriaSectores.id, id))

    if (existingSector.length === 0) {
      console.log('❌ [PUT] Sector no encontrado para actualizar')
      return NextResponse.json(
        { error: 'Sector no encontrado' },
        { status: 404 }
      )
    }

    console.log('📋 [PUT] Sector encontrado, procediendo con actualización')

    const updatedSector = await db
      .update(feriaSectores)
      .set({
        titulo,
        slug,
        descripcion,
        colorHex: colorHex || '#FF6B35',
        categoriaDefaultId: categoriaDefaultId || null,
        imagenBanner: imagenBanner || null,
        updatedAt: new Date()
      })
      .where(eq(feriaSectores.id, id))
      .returning()

    console.log('✅ [PUT] Sector actualizado:', updatedSector.length > 0 ? 'SÍ' : 'NO')
    console.log('📊 [PUT] Registros afectados:', updatedSector.length)

    if (updatedSector.length === 0) {
      console.log('❌ [PUT] No se pudo actualizar el sector')
      return NextResponse.json(
        { error: 'No se pudo actualizar el sector' },
        { status: 500 }
      )
    }

    console.log('🎉 [PUT] Actualización exitosa:', updatedSector[0].titulo)
    return NextResponse.json(updatedSector[0])
  } catch (error) {
    console.error('❌ [PUT] Error al actualizar sector:', error)
    console.error('❌ [PUT] Stack trace:', error.stack)
    return NextResponse.json(
      { 
        error: 'Error al actualizar sector',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/feria-sectores/[id] - Eliminar sector
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15+ requiere await para params
    const resolvedParams = await params
    const id = resolvedParams.id
    
    console.log('🗑️ [DELETE] Intentando eliminar sector con ID:', id)

    if (!id) {
      console.error('❌ [DELETE] ID no proporcionado en params')
      return NextResponse.json(
        { error: 'ID no proporcionado' },
        { status: 400 }
      )
    }

    // Primero verificar si el sector existe
    const existingSector = await db
      .select()
      .from(feriaSectores)
      .where(eq(feriaSectores.id, id))

    console.log('📋 [DELETE] Sector encontrado:', existingSector.length > 0 ? 'SÍ' : 'NO')
    if (existingSector.length > 0) {
      console.log('📋 [DELETE] Datos del sector:', {
        id: existingSector[0].id,
        titulo: existingSector[0].titulo,
        slug: existingSector[0].slug,
        imagenBanner: existingSector[0].imagenBanner
      })

      // Eliminar la imagen del storage si existe
      if (existingSector[0].imagenBanner) {
        console.log('🗑️ [DELETE] Eliminando imagen del storage...')
        const storageService = new FeriaStorageService()
        
        try {
          await storageService.deleteFileByUrl(existingSector[0].imagenBanner)
          console.log('✅ [DELETE] Imagen eliminada del storage')
        } catch (error) {
          console.error('❌ [DELETE] Error eliminando imagen del storage:', error)
          // Continuar con la eliminación del sector aunque falle la imagen
        }
      } else {
        console.log('ℹ️ [DELETE] El sector no tiene imagen para eliminar')
      }
    }

    const deletedSector = await db
      .delete(feriaSectores)
      .where(eq(feriaSectores.id, id))
      .returning()

    console.log('✅ [DELETE] Sector eliminado:', deletedSector.length > 0 ? 'SÍ' : 'NO')
    console.log('📊 [DELETE] Registros afectados:', deletedSector.length)

    if (deletedSector.length === 0) {
      console.log('❌ [DELETE] No se encontró el sector para eliminar')
      return NextResponse.json(
        { error: 'Sector no encontrado' },
        { status: 404 }
      )
    }

    console.log('🎉 [DELETE] Eliminación exitosa del sector:', deletedSector[0].titulo)
    return NextResponse.json({ 
      success: true,
      message: 'Sector eliminado correctamente',
      deletedSector: deletedSector[0]
    })
  } catch (error) {
    console.error('❌ [DELETE] Error al eliminar sector:', error)
    console.error('❌ [DELETE] Stack trace:', error.stack)
    return NextResponse.json(
      { 
        error: 'Error al eliminar sector',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/feria-sectores/[id]/toggle - Cambiar estado activo/inactivo
export async function PATCH1(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15+ requiere await para params
    const resolvedParams = await params
    const id = resolvedParams.id

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

// PATCH /api/admin/feria-sectores/[id]/reorder - Reordenar sectores
export async function REORDER(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15+ requiere await para params
    const resolvedParams = await params
    const id = resolvedParams.id
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

// PATCH /api/admin/feria-sectores/[id] - Toggle y Reorder
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const url = new URL(request.url)
  const action = url.pathname.split('/').pop()
  
  if (action === 'toggle') {
    return PATCH1(request, { params: Promise.resolve(resolvedParams) })
  } else if (url.pathname.includes('/reorder')) {
    return REORDER(request, { params: Promise.resolve(resolvedParams) })
  }
  
  return NextResponse.json(
    { error: 'Endpoint no encontrado' },
    { status: 404 }
  )
}
