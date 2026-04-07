import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { feriaSectores } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/admin/feria-sectores/slug/[slug] - Obtener sector por slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Next.js 15+ requiere await para params
    const resolvedParams = await params
    const slug = resolvedParams.slug

    console.log('🔍 [GET SLUG] Buscando sector por slug:', slug)

    const sector = await db
      .select()
      .from(feriaSectores)
      .where(eq(feriaSectores.slug, slug))
      .limit(1)

    if (sector.length === 0) {
      console.log('❌ [GET SLUG] Sector no encontrado por slug:', slug)
      return NextResponse.json(
        { error: 'Sector no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ [GET SLUG] Sector encontrado:', sector[0].titulo)
    return NextResponse.json(sector[0])

  } catch (error: any) {
    console.error('❌ [GET SLUG] Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
