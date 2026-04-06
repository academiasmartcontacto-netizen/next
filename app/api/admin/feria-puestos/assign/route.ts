import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaPuestos, feriaBloques, users, stores } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// POST /api/admin/feria-puestos/assign - Asignar tienda a puesto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bloqueId, posicion, ciudad, tiendaSlug } = body

    if (!bloqueId || !posicion || !ciudad || !tiendaSlug) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos: bloqueId, posicion, ciudad, tiendaSlug' },
        { status: 400 }
      )
    }

    console.log('🎯 [PUESTOS ASSIGN] Asignando tienda:', { bloqueId, posicion, ciudad, tiendaSlug })

    // 1. Verificar que el bloque existe
    const bloque = await db
      .select()
      .from(feriaBloques)
      .where(eq(feriaBloques.id, bloqueId))
      .limit(1)

    if (bloque.length === 0) {
      return NextResponse.json(
        { error: 'Bloque no encontrado' },
        { status: 404 }
      )
    }

    // 2. Buscar la tienda por link
    const tienda = await db
      .select({
        id: stores.id,
        userId: stores.userId,
        nombre: stores.name,
        link: stores.link,
        logo: stores.logo
      })
      .from(stores)
      .where(eq(stores.link, tiendaSlug))
      .limit(1)

    if (tienda.length === 0) {
      return NextResponse.json(
        { error: 'Tienda no encontrada' },
        { status: 404 }
      )
    }

    // 3. Verificar que el puesto esté disponible
    const puestoExistente = await db
      .select()
      .from(feriaPuestos)
      .where(
        and(
          eq(feriaPuestos.bloqueId, bloqueId),
          eq(feriaPuestos.posicion, posicion),
          eq(feriaPuestos.ciudad, ciudad)
        )
      )
      .limit(1)

    if (puestoExistente.length > 0) {
      return NextResponse.json(
        { error: 'El puesto ya está ocupado' },
        { status: 400 }
      )
    }

    // 4. Crear el puesto asignado
    const nuevoPuesto = await db
      .insert(feriaPuestos)
      .values({
        sectorId: bloque[0].sectorId,
        bloqueId,
        posicion,
        usuarioId: tienda[0].userId,
        ciudad,
        estado: 'ocupado',
        fechaOcupacion: new Date()
      })
      .returning()

    console.log('✅ [PUESTOS ASSIGN] Puesto asignado:', nuevoPuesto[0])

    return NextResponse.json({
      success: true,
      message: 'Tienda asignada correctamente',
      puesto: nuevoPuesto[0],
      tienda: tienda[0]
    })

  } catch (error: any) {
    console.error('❌ [PUESTOS ASSIGN] Error:', error)
    return NextResponse.json(
      { error: 'Error al asignar tienda', details: error.message },
      { status: 500 }
    )
  }
}
