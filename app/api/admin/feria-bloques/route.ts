import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaBloques, feriaSectores, feriaPuestos, users, stores } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'

// GET /api/admin/feria-bloques?sectorId=xxx&ciudad=LPZ
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectorId = searchParams.get('sectorId')
    const ciudad = searchParams.get('ciudad') || 'LPZ'

    if (!sectorId) {
      return NextResponse.json(
        { error: 'Sector ID is required' },
        { status: 400 }
      )
    }

    console.log('📋 [BLOQUES GET] Obteniendo bloques:', { sectorId, ciudad })

    // Obtener bloques del sector
    const bloques = await db
      .select({
        id: feriaBloques.id,
        nombre: feriaBloques.nombre,
        orden: feriaBloques.orden,
        capacidad: feriaBloques.capacidad,
        activo: feriaBloques.activo,
        createdAt: feriaBloques.createdAt,
        updatedAt: feriaBloques.updatedAt
      })
      .from(feriaBloques)
      .where(and(
        eq(feriaBloques.sectorId, sectorId),
        eq(feriaBloques.activo, true)
      ))
      .orderBy(asc(feriaBloques.orden))

    console.log(`📋 [BLOQUES GET] ${bloques.length} bloques encontrados`)

    // Para cada bloque, obtener sus puestos
    const bloquesConPuestos = await Promise.all(
      bloques.map(async (bloque) => {
        // Obtener puestos ocupados de este bloque (con datos de tiendas)
        const puestosResult = await db
          .select({
            id: feriaPuestos.id,
            posicion: feriaPuestos.posicion,
            usuarioId: feriaPuestos.usuarioId,
            estado: feriaPuestos.estado,
            ciudad: feriaPuestos.ciudad,
            tiendaNombre: stores.name,
            tiendaSlug: stores.link,
            tiendaLogo: stores.logo
          })
          .from(feriaPuestos)
          .leftJoin(users, eq(feriaPuestos.usuarioId, users.id))
          .leftJoin(stores, eq(users.id, stores.userId))
          .where(
            and(
              eq(feriaPuestos.bloqueId, bloque.id),
              eq(feriaPuestos.ciudad, ciudad),
              eq(feriaPuestos.estado, 'ocupado')
            )
          )
          .orderBy(feriaPuestos.posicion)

        const puestos = puestosResult || []

        console.log(`📋 [BLOQUES GET] Bloque ${bloque.nombre}: ${puestos.length} puestos ocupados`)

        return {
          ...bloque,
          puestos: puestos.map((puesto: any) => ({
            id: puesto.id,
            posicion: puesto.posicion,
            usuarioId: puesto.usuarioId,
            estado: puesto.estado,
            ciudad: puesto.ciudad,
            tiendaNombre: puesto.tiendaNombre,
            tiendaSlug: puesto.tiendaSlug,
            tiendaLogo: puesto.tiendaLogo
          }))
        }
      })
    )

    return NextResponse.json(bloquesConPuestos)

  } catch (error: any) {
    console.error('❌ [BLOQUES GET] Error:', error)
    return NextResponse.json(
      { error: 'Error al obtener bloques', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/feria-bloques
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sectorId, nombre, orden, capacidad = 12 } = body

    if (!sectorId || !nombre) {
      return NextResponse.json(
        { error: 'Sector ID y nombre son requeridos' },
        { status: 400 }
      )
    }

    console.log('➕ [BLOQUES POST] Creando bloque:', { sectorId, nombre, orden, capacidad })

    // Verificar que el sector existe
    const sector = await db
      .select()
      .from(feriaSectores)
      .where(eq(feriaSectores.id, sectorId))
      .limit(1)

    if (sector.length === 0) {
      return NextResponse.json(
        { error: 'Sector no encontrado' },
        { status: 404 }
      )
    }

    // Crear el bloque
    const nuevoBloque = await db
      .insert(feriaBloques)
      .values({
        sectorId,
        nombre,
        orden: orden || 1,
        capacidad,
        activo: true
      })
      .returning()

    console.log('✅ [BLOQUES POST] Bloque creado:', nuevoBloque[0])

    return NextResponse.json({
      success: true,
      message: 'Bloque creado correctamente',
      bloque: nuevoBloque[0]
    })

  } catch (error: any) {
    console.error('❌ [BLOQUES POST] Error:', error)
    return NextResponse.json(
      { error: 'Error al crear bloque', details: error.message },
      { status: 500 }
    )
  }
}
