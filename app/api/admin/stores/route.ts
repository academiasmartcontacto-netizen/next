import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stores, users, userProfiles, storePages, storeSections } from '@/lib/db/schema'
import { products } from '@/lib/db/schema-products'
import { eq, desc, inArray } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching admin stores...')
    
    // Obtener tiendas con información de usuarios
    const storesData = await db
      .select({
        id: stores.id,
        name: stores.name,
        link: stores.link,
        domain: stores.domain,
        isActive: stores.isActive,
        isPublished: stores.isPublished,
        createdAt: stores.createdAt,
        phone: stores.phone,
        whatsapp: stores.whatsapp,
        emailContacto: stores.emailContacto,
        direccion: stores.direccion,
        descripcion: stores.descripcion,
        slogan: stores.slogan,
        colorPrimario: stores.colorPrimario,
        navbarColor: stores.navbarColor,
        logo: stores.logo,
        mostrarLogo: stores.mostrarLogo,
        mostrarNombre: stores.mostrarNombre,
        bannerImagen: stores.bannerImagen,
        mostrarBanner: stores.mostrarBanner,
        userId: stores.userId,
        userEmail: users.email,
        userFirstName: userProfiles.firstName,
        userLastName: userProfiles.lastName,
        userPhone: userProfiles.phone
      })
      .from(stores)
      .leftJoin(users, eq(stores.userId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .orderBy(desc(stores.createdAt))

    console.log('Stores fetched:', storesData.length)

    // Formatear datos para el frontend
    const formattedStores = storesData.map(store => ({
      id: store.id,
      name: store.name,
      slug: store.link,
      owner: store.userFirstName && store.userLastName 
        ? `${store.userFirstName} ${store.userLastName}` 
        : store.userEmail?.split('@')[0] || 'Usuario desconocido',
      ownerEmail: store.userEmail || 'N/A',
      status: store.isActive ? 'active' : 'inactive',
      productsCount: 0, // TODO: Implementar conteo de productos
      views: Math.floor(Math.random() * 2000) + 100, // TODO: Implementar conteo de views reales
      rating: (Math.random() * 2 + 3).toFixed(1), // TODO: Implementar rating real
      createdAt: store.createdAt ? new Date(store.createdAt).toISOString().split('T')[0] : 'N/A',
      lastActivity: store.createdAt ? new Date(store.createdAt).toLocaleString() : 'N/A',
      reports: 0, // TODO: Implementar conteo de reportes
      hasLogo: !!store.logo,
      domain: store.domain || 'donebolivia.com/tienda/' + store.link,
      isPublished: store.isPublished,
      phone: store.phone,
      whatsapp: store.whatsapp,
      emailContacto: store.emailContacto,
      direccion: store.direccion,
      descripcion: store.descripcion,
      slogan: store.slogan,
      colorPrimario: store.colorPrimario,
      navbarColor: store.navbarColor,
      mostrarLogo: store.mostrarLogo,
      mostrarNombre: store.mostrarNombre,
      bannerImagen: store.bannerImagen,
      mostrarBanner: store.mostrarBanner
    }))

    console.log('Formatted stores:', formattedStores.length)

    return NextResponse.json({
      success: true,
      stores: formattedStores
    })

  } catch (error) {
    console.error('Error fetching admin stores:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al obtener las tiendas' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('id')

    if (!storeId) {
      return NextResponse.json(
        { success: false, error: 'ID de tienda es requerido' },
        { status: 400 }
      )
    }

    console.log('Deleting store:', storeId)

    // Verificar que la tienda existe
    const existingStore = await db
      .select()
      .from(stores)
      .where(eq(stores.id, storeId))
      .limit(1)

    if (existingStore.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tienda no encontrada' },
        { status: 404 }
      )
    }

    // Eliminar en cascada correcta:
    // 1. Primero eliminar storeSections (que dependen de storePages)
    const storePagesToDelete = await db
      .select({ id: storePages.id })
      .from(storePages)
      .where(eq(storePages.storeId, storeId))

    if (storePagesToDelete.length > 0) {
      const pageIds = storePagesToDelete.map(page => page.id)
      for (const pageId of pageIds) {
        await db.delete(storeSections).where(eq(storeSections.pageId, pageId))
      }
    }

    // 2. Eliminar storePages
    await db.delete(storePages).where(eq(storePages.storeId, storeId))

    // 3. Eliminar productos de la tienda
    await db.delete(products).where(eq(products.storeId, storeId))

    // 4. Eliminar la tienda
    await db.delete(stores).where(eq(stores.id, storeId))

    console.log('Store deleted successfully:', storeId)

    return NextResponse.json({
      success: true,
      message: 'Tienda eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting store:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al eliminar la tienda' 
      },
      { status: 500 }
    )
  }
}
