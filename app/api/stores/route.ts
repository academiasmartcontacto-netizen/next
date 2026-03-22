import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stores, users, storePages, userActivityLog, userSessions } from '@/lib/db/schema'
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

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Iniciando POST /api/stores')
    
    const session = await getUserSession(request)
    console.log('🔍 DEBUG: Session obtenida:', session ? '✅' : '❌')
    console.log('🔍 DEBUG: Session completa:', JSON.stringify(session, null, 2))
    
    if (!session?.id) {
      console.log('🔍 DEBUG: Sin session.id - Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 DEBUG: Usuario ID:', session.id)

    const body = await request.json()
    console.log('🔍 DEBUG: Body recibido:', JSON.stringify(body, null, 2))
    
    const { nombre, slug, whatsapp, feria_sector, feria_city, feria_pos } = body

    // Validar campos requeridos del PHP original
    if (!nombre || !slug || !whatsapp) {
      console.log('🔍 DEBUG: Campos faltantes:', { nombre, slug, whatsapp })
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
    }

    // Validaciones específicas como el PHP
    if (nombre.length < 3) {
      console.log('🔍 DEBUG: Nombre muy corto:', nombre.length)
      return NextResponse.json({ error: 'El nombre debe tener al menos 3 caracteres' }, { status: 400 })
    }

    if (!/^[a-z0-9\-]+$/.test(slug)) {
      console.log('🔍 DEBUG: Slug inválido:', slug)
      return NextResponse.json({ error: 'La URL solo puede contener letras minúsculas, números y guiones' }, { status: 400 })
    }

    if (!/^[0-9]{8}$/.test(whatsapp)) {
      console.log('🔍 DEBUG: WhatsApp inválido:', whatsapp)
      return NextResponse.json({ error: 'El número debe tener 8 dígitos válidos' }, { status: 400 })
    }

    console.log('🔍 DEBUG: Validaciones pasadas, verificando tienda existente')

    // Check if user already has a store
    const existingStore = await db
      .select()
      .from(stores)
      .where(eq(stores.userId, session.id))
      .limit(1)

    console.log('🔍 DEBUG: Tienda existente:', existingStore.length > 0 ? 'SÍ' : 'NO')

    if (existingStore.length > 0) {
      return NextResponse.json({ error: 'Ya tienes una tienda' }, { status: 400 })
    }

    console.log('🔍 DEBUG: Verificando slug existente')

    // Check if slug already exists
    const existingSlug = await db
      .select()
      .from(stores)
      .where(eq(stores.link, slug))
      .limit(1)

    console.log('🔍 DEBUG: Slug existente:', existingSlug.length > 0 ? 'SÍ' : 'NO')

    if (existingSlug.length > 0) {
      return NextResponse.json({ error: 'Esa URL ya está en uso. Por favor elige otra.' }, { status: 400 })
    }

    console.log('🔍 DEBUG: Creando tienda con datos:', {
      userId: session.id,
      name: nombre,
      link: slug,
      domain: `donebolivia.com/tienda/${slug}`,
      phone: whatsapp,
      isActive: true,
      isPublished: false,
      theme: 'claro'
    })

    // Create store con los campos del PHP original
    const [newStore] = await db
      .insert(stores)
      .values({
        userId: session.id,
        name: nombre,
        link: slug,
        domain: `donebolivia.com/tienda/${slug}`,
        phone: whatsapp, // WhatsApp como teléfono
        whatsapp: whatsapp, // También guardar en campo específico
        isActive: true,
        isPublished: false,
        theme: 'claro', // Tema por defecto del PHP
        settings: JSON.stringify({
          feria_sector: feria_sector || null,
          feria_city: feria_city || null,
          feria_pos: feria_pos || null
        }),
        seoTitle: `${nombre} - Done!`,
        seoDescription: `Tienda virtual de ${nombre} en Done! Bolivia`,
      })
      .returning()

    console.log('🔍 DEBUG: Tienda creada exitosamente:', JSON.stringify(newStore, null, 2))

    // Log activity
    console.log('🔍 DEBUG: Registrando actividad...')
    await db.insert(userActivityLog).values({
      userId: session.id,
      action: 'store_created',
      metadata: JSON.stringify({ 
        storeId: newStore.id, 
        storeName: nombre,
        storeSlug: slug,
        whatsapp: whatsapp,
        feria_sector,
        feria_city,
        feria_pos
      }),
    })

    console.log('🔍 DEBUG: Actividad registrada')

    // Notificación a Telegram (como el PHP)
    console.log(`🏪 Nueva Tienda Creada\n\n🛒 Nombre: ${nombre}\n🔗 Slug: /tienda/${slug}\n📱 WhatsApp: ${whatsapp}\n👤 Usuario ID: ${session.id}`)

    // Redirección según contexto (como el PHP)
    let redirectUrl = '/mi/tienda-editor?success=created'
    if (feria_sector && feria_city && feria_pos) {
      redirectUrl = `/feria?dept=${feria_city}&success=created_and_assigned`
    }

    console.log('🔍 DEBUG: Respuesta exitosa, redirectUrl:', redirectUrl)

    return NextResponse.json({ 
      success: true,
      store: newStore,
      redirect: redirectUrl
    })

  } catch (error) {
    console.error('🔍 DEBUG: Error completo:', error)
    console.error('🔍 DEBUG: Error stack:', error instanceof Error ? error.stack : 'No stack available')
    console.error('🔍 DEBUG: Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('🔍 DEBUG: Error type:', typeof error)
    
    // Manejar errores específicos de base de datos
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        console.log('🔍 DEBUG: Error de llave duplicada')
        return NextResponse.json({ error: 'La URL ya está en uso' }, { status: 400 })
      }
      
      if (error.message.includes('violates foreign key')) {
        console.log('🔍 DEBUG: Error de llave foránea')
        return NextResponse.json({ error: 'Error de referencia de usuario' }, { status: 400 })
      }
      
      if (error.message.includes('not-null')) {
        console.log('🔍 DEBUG: Error de campo nulo')
        return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Error del servidor',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getUserSession(request)
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userStore = searchParams.get('user-store')

    if (userStore === 'true') {
      // Get user's store from database
      const userStores = await db
        .select({
          id: stores.id,
          name: stores.name,
          phone: stores.phone,
          link: stores.link,
          domain: stores.domain,
          isPublished: stores.isPublished,
          theme: stores.theme,
          logo: stores.logo,
          navbarColor: stores.navbarColor,
          createdAt: stores.createdAt,
        })
        .from(stores)
        .where(eq(stores.userId, session.id))
        .limit(1)

      return NextResponse.json({ 
        store: userStores[0] || null
      })
    }

    // Get all published stores for explore/marketplace
    const allStores = await db
      .select({
        id: stores.id,
        name: stores.name,
        link: stores.link,
        domain: stores.domain,
        isPublished: stores.isPublished,
        theme: stores.theme,
        logo: stores.logo,
        createdAt: stores.createdAt,
      })
      .from(stores)
      .where(eq(stores.isPublished, true))
      .orderBy(stores.createdAt)

    return NextResponse.json({ stores: allStores })
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
