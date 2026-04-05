import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stores } from '@/lib/db/schema'
import { products, productImages } from '@/lib/db/schema-products'
import { eq, and } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ link: string }> }
) {
  try {
    console.log('=== API UNIFICADA - INICIO ===')
    const { link } = await params
    console.log('Link recibido:', link)

    if (!link) {
      console.log('❌ Error: Link no proporcionado')
      return NextResponse.json({ error: 'Store link is required' }, { status: 400 })
    }

    // QUERY SIMPLE - OBTENER TIENDA PRIMERO
    console.log('🔍 Obteniendo datos de la tienda...')
    const storeData = await db
      .select()
      .from(stores)
      .where(eq(stores.link, link))
      .limit(1)

    if (!storeData || storeData.length === 0) {
      console.log('❌ Error: Tienda no encontrada')
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    const store = storeData[0]
    console.log('✅ Tienda encontrada:', store.name)

    // QUERY SIMPLE - OBTENER PRODUCTOS
    console.log('🔍 Obteniendo productos...')
    const productsData = await db
      .select()
      .from(products)
      .where(and(eq(products.storeId, store.id), eq(products.isActive, true)))
      .orderBy(products.createdAt)

    console.log('✅ Productos obtenidos:', productsData.length)

    // QUERY SIMPLE - OBTENER IMÁGENES PARA CADA PRODUCTO
    const productsWithImages = await Promise.all(
      productsData.map(async (product) => {
        const images = await db
          .select()
          .from(productImages)
          .where(eq(productImages.productId, product.id))
          .orderBy(productImages.order)

        const principalImage = images.find(img => img.isPrincipal) || images[0]

        // Asegurar que allImages siempre tenga al menos la imagen principal
        const allImages = images.length > 0 ? images : (principalImage ? [principalImage] : [])

        return {
          ...product,
          name: product.titulo || product.name,
          price: product.precio || product.price || 0,
          originalPrice: product.precio_original || product.originalPrice,
          image: principalImage?.url || product.imagen || product.image,
          allImages: allImages || [],
          onSale: (product.precio_original || product.originalPrice) && 
                   (product.precio_original || product.originalPrice) > 
                   (product.precio || product.price)
        }
      })
    )

    console.log('✅ Productos con imágenes procesados:', productsWithImages.length)

    const result = {
      store: {
        ...store,
        mostrarInicio: true,
        mostrarContacto: true,
        mostrarAcercaDe: true
      },
      products: productsWithImages,
      sections: []
    }

    console.log('✅ API DRY - Respuesta lista')
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Error en API unificada:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
