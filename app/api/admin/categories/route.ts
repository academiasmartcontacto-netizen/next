import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'

// GET /api/admin/categories - Obtener todas las categorías
export async function GET() {
  try {
    const categoriesList = await db
      .select()
      .from(categories)
      .where(eq(categories.activa, true))
      .orderBy(asc(categories.orden))

    return NextResponse.json(categoriesList)
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    )
  }
}
