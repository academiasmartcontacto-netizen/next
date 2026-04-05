import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stores } from '@/lib/db/schema'
import { products, productImages } from '@/lib/db/schema-products'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ link: string }> }
) {
  try {
    console.log('=== INICIO GET STORE PRODUCTS ===')
    const { link } = await params
    console.log('Link recibido:', link)

    if (!link) {
      console.log('❌ Error: Link no proporcionado')
      return NextResponse.json({ error: 'Store link is required' }, { status: 400 })
    }

    // Primero obtener la tienda para validar que existe
    const [store] = await db
      .select({ id: stores.id, userId: stores.userId })
      .from(stores)
      .where(eq(stores.link, link))
      .limit(1)

    if (!store) {
      console.log('❌ Error: Tienda no encontrada')
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    console.log('✅ Tienda encontrada:', store.id)

    // Verificar que esté activa (temporalmente permitir no publicadas para desarrollo)
    const [storeStatus] = await db
      .select({ isActive: stores.isActive, isPublished: stores.isPublished })
      .from(stores)
      .where(eq(stores.id, store.id))
      .limit(1)

    // Temporalmente: Solo verificar que esté activa, no si está publicada
    if (!storeStatus?.isActive) {
      console.log('❌ Error: Tienda no activa')
      return NextResponse.json({ error: 'Store not active' }, { status: 404 })
    }

    console.log('✅ Tienda activa:', storeStatus?.isActive)
    console.log('📋 Tienda publicada:', storeStatus?.isPublished)

    // Obtener productos de la tienda con sus imágenes (agrupados)
    console.log('=== DEBUG STORE PRODUCTS ===')
    console.log('Store ID:', store.id)
    console.log('Store isActive:', storeStatus?.isActive)
    console.log('Store isPublished:', storeStatus?.isPublished)
    
    const storeProducts = await db
      .select({
        id: products.id,
        name: products.name,
        titulo: products.titulo,
        description: products.description,
        precio: products.precio,
        price: products.price,
        precio_original: products.precio_original,
        originalPrice: products.originalPrice,
        imagen: products.imagen,
        image: products.image,
        category: products.category,
        categoria_tienda: products.categoria_tienda,
        isActive: products.isActive,
        activo: products.activo,
        visitas: products.visitas,
        likes: products.likes,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt
      })
      .from(products)
      .where(eq(products.storeId, store.id))
      .orderBy(products.createdAt)

    console.log('Productos encontrados (agrupados):', storeProducts.length)
    console.log('Productos activos:', storeProducts.filter(p => p.isActive || p.activo).length)

    // Para cada producto, obtener sus imágenes por separado
    const productsWithImages = await Promise.all(
      storeProducts.map(async (product) => {
        const images = await db
          .select({
            id: productImages.id,
            url: productImages.url,
            alt: productImages.alt,
            order: productImages.order,
            isPrincipal: productImages.isPrincipal
          })
          .from(productImages)
          .where(eq(productImages.productId, product.id))
          .orderBy(productImages.order)

        const principalImage = images.find(img => img.isPrincipal) || images[0]

        // Asegurar que allImages siempre tenga al menos la imagen principal
        const allImages = images.length > 0 ? images : (principalImage ? [principalImage] : [])
        
        return {
          ...product,
          productImages: principalImage || null,
          allImages: allImages
        }
      })
    )

    // Formatear productos
    const formattedProducts = productsWithImages.map(product => ({
      ...product,
      name: product.titulo || product.name,
      price: Number(product.precio || product.price) || 0,
      originalPrice: Number(product.precio_original || product.originalPrice) || 0,
      image: product.productImages?.url || product.imagen || product.image,
      visible: (product.isActive ?? true) || (product.activo ?? true), // ✅ Campo para frontend con nullish coalescing
      allImages: product.allImages || [], // Incluir todas las imágenes
      onSale: (Number(product.precio_original || product.originalPrice) || 0) > (Number(product.precio || product.price) || 0),
      visits: product.visitas || 0,
      likes: product.likes || 0,
    }))

    console.log('✅ Productos formateados:', formattedProducts.length)
    console.log('🚀 Enviando respuesta exitosa')

    return NextResponse.json({ products: formattedProducts })

  } catch (error) {
    console.error('Error fetching store products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
