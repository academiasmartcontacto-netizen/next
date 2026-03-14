import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stores, users, userSessions } from '@/lib/db/schema'
import { products } from '@/lib/db/schema-products'
import { eq } from 'drizzle-orm'
import { AuthService } from '@/lib/auth'

// Get real user session from cookies
const getUserSession = async (request: NextRequest) => {
  const sessionToken = request.cookies.get('session_token')?.value
  
  if (!sessionToken) {
    return null
  }

  const [session] = await db.select()
    .from(userSessions)
    .where(eq(userSessions.token, sessionToken))
    .limit(1)

  if (!session || !session.isActive || session.expiresAt < new Date()) {
    return null
  }

  return await AuthService.getUserById(session.userId)
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ link: string }> }
) {
  try {
    const resolvedParams = await params
    const { link } = resolvedParams

    if (!link) {
      return NextResponse.json({ error: 'Link is required' }, { status: 400 })
    }

    // Obtener tienda por link
    const [store] = await db
      .select({
        id: stores.id,
        name: stores.name,
        link: stores.link,
        domain: stores.domain,
        phone: stores.phone,
        whatsapp: stores.whatsapp,
        emailContacto: stores.emailContacto,
        logo: stores.logo,
        logoPrincipal: stores.logoPrincipal,
        mostrarLogo: stores.mostrarLogo,
        mostrarNombre: stores.mostrarNombre,
        bannerImagen: stores.bannerImagen,
        bannerImagen2: stores.bannerImagen2,
        bannerImagen3: stores.bannerImagen3,
        bannerImagen4: stores.bannerImagen4,
        mostrarBanner: stores.mostrarBanner,
        descripcion: stores.descripcion,
        slogan: stores.slogan,
        colorPrimario: stores.colorPrimario,
        direccion: stores.direccion,
        googleMapsUrl: stores.googleMapsUrl,
        redesSociales: stores.redesSociales,
        isActive: stores.isActive,
        isPublished: stores.isPublished,
        estado: stores.estado,
        visitas: stores.visitas,
        createdAt: stores.createdAt,
        seoTitle: stores.seoTitle,
        seoDescription: stores.seoDescription,
      })
      .from(stores)
      .where(eq(stores.link, link))
      .limit(1)

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Verificar si está activa (las tiendas recién creadas pueden no estar publicadas pero deben ser visibles para el dueño)
    if (!store.isActive) {
      return NextResponse.json({ error: 'Store not available' }, { status: 404 })
    }

    // Formatear respuesta
    const formattedStore = {
      ...store,
      socialMedia: store.redesSociales ? JSON.parse(store.redesSociales) : null,
      phone: store.whatsapp || store.phone || null,
      email: store.emailContacto || null,
      logo: store.logo || store.logoPrincipal ? `/uploads/logos/${store.logo || store.logoPrincipal}` : null,
      bannerImage: store.bannerImagen ? `/uploads/${store.bannerImagen}` : null,
      address: store.direccion || null,
    }

    return NextResponse.json({ store: formattedStore })

  } catch (error) {
    console.error('Error fetching store:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ link: string }> }
) {
  try {
    const resolvedParams = await params
    const { link } = resolvedParams
    const session = await getUserSession(request)
    
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Verificar que la tienda pertenezca al usuario
    const [store] = await db
      .select({ id: stores.id, userId: stores.userId })
      .from(stores)
      .where(eq(stores.link, link))
      .limit(1)

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    if (store.userId !== session.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Actualizar tienda
    const updatedStore = await db
      .update(stores)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, store.id))
      .returning()

    return NextResponse.json({ store: updatedStore[0] })

  } catch (error) {
    console.error('Error updating store:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
