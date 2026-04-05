import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaPuestos, feriaSectores, stores, users } from '@/lib/db/schema'
import { eq, and, desc, asc } from 'drizzle-orm'

// GET /api/admin/feria-puestos - Obtener todos los puestos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sectorId = searchParams.get('sectorId')
    
    let puestos

    if (sectorId) {
      puestos = await db
        .select({
          id: feriaPuestos.id,
          sectorId: feriaPuestos.sectorId,
          bloqueId: feriaPuestos.bloqueId,
          posicion: feriaPuestos.posicion,
          usuarioId: feriaPuestos.usuarioId,
          ciudad: feriaPuestos.ciudad,
          estado: feriaPuestos.estado,
          fechaOcupacion: feriaPuestos.fechaOcupacion,
          createdAt: feriaPuestos.createdAt,
          updatedAt: feriaPuestos.updatedAt,
          sector: {
            id: feriaSectores.id,
            slug: feriaSectores.slug,
            titulo: feriaSectores.titulo,
            colorHex: feriaSectores.colorHex
          }
        })
        .from(feriaPuestos)
        .leftJoin(feriaSectores, eq(feriaPuestos.sectorId, feriaSectores.id))
        .where(eq(feriaPuestos.sectorId, sectorId))
        .orderBy(asc(feriaPuestos.bloqueId), asc(feriaPuestos.posicion))
    } else {
      puestos = await db
        .select({
          id: feriaPuestos.id,
          sectorId: feriaPuestos.sectorId,
          bloqueId: feriaPuestos.bloqueId,
          posicion: feriaPuestos.posicion,
          usuarioId: feriaPuestos.usuarioId,
          ciudad: feriaPuestos.ciudad,
          estado: feriaPuestos.estado,
          fechaOcupacion: feriaPuestos.fechaOcupacion,
          createdAt: feriaPuestos.createdAt,
          updatedAt: feriaPuestos.updatedAt,
          sector: {
            id: feriaSectores.id,
            slug: feriaSectores.slug,
            titulo: feriaSectores.titulo,
            colorHex: feriaSectores.colorHex
          }
        })
        .from(feriaPuestos)
        .leftJoin(feriaSectores, eq(feriaPuestos.sectorId, feriaSectores.id))
        .orderBy(asc(feriaPuestos.bloqueId), asc(feriaPuestos.posicion))
    }

    return NextResponse.json(puestos)
  } catch (error) {
    console.error('Error al obtener puestos:', error)
    return NextResponse.json(
      { error: 'Error al obtener puestos' },
      { status: 500 }
    )
  }
}

// POST /api/admin/feria-puestos - Crear nuevo puesto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sectorId, bloqueId, posicion, usuarioId, ciudad } = body

    if (!sectorId || !bloqueId || !posicion) {
      return NextResponse.json(
        { error: 'sectorId, bloqueId y posicion son obligatorios' },
        { status: 400 }
      )
    }

    // Verificar que el sector exista
    const sector = await db
      .select()
      .from(feriaSectores)
      .where(eq(feriaSectores.id, sectorId))

    if (sector.length === 0) {
      return NextResponse.json(
        { error: 'Sector no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que la posición no esté ocupada
    const existingPuesto = await db
      .select()
      .from(feriaPuestos)
      .where(
        and(
          eq(feriaPuestos.sectorId, sectorId),
          eq(feriaPuestos.bloqueId, bloqueId),
          eq(feriaPuestos.posicion, posicion)
        )
      )

    if (existingPuesto.length > 0) {
      return NextResponse.json(
        { error: 'Esta posición ya está ocupada' },
        { status: 400 }
      )
    }

    const newPuesto = await db
      .insert(feriaPuestos)
      .values({
        sectorId,
        bloqueId,
        posicion,
        usuarioId: usuarioId || null,
        ciudad: ciudad || 'LPZ',
        estado: 'disponible'
      })
      .returning()

    return NextResponse.json(newPuesto[0])
  } catch (error) {
    console.error('Error al crear puesto:', error)
    return NextResponse.json(
      { error: 'Error al crear puesto' },
      { status: 500 }
    )
  }
}
