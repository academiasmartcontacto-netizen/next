import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stores } from '@/lib/db/schema'
import { products } from '@/lib/db/schema-products'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { link: string } }
) {
  try {
    const { link } = params

    if (!link) {
      return NextResponse.json({ error: 'Store link is required' }, { status: 400 })
    }

    // Primero obtener la tienda para validar que existe
    const [store] = await db
      .select({ id: stores.id, userId: stores.userId })
      .from(stores)
      .where(eq(stores.link, link))
      .limit(1)

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Verificar que esté activa y publicada
    const [storeStatus] = await db
      .select({ isActive: stores.isActive, isPublished: stores.isPublished })
      .from(stores)
      .where(eq(stores.id, store.id))
      .limit(1)

    if (!storeStatus?.isActive || !storeStatus?.isPublished) {
      return NextResponse.json({ error: 'Store not available' }, { status: 404 })
    }

    // Obtener productos de la tienda
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
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(eq(products.storeId, store.id) && eq(products.isActive, true))
      .orderBy(products.createdAt)

    // Formatear productos
    const formattedProducts = storeProducts.map(product => ({
      ...product,
      name: product.titulo || product.name,
      price: product.precio || product.price,
      originalPrice: product.precio_original || product.originalPrice,
      image: product.imagen || product.image ? `/uploads/products/${product.imagen || product.image}` : null,
      onSale: (product.precio_original || product.originalPrice) && (product.precio_original || product.originalPrice) > (product.precio || product.price),
      visits: product.visitas || 0,
      likes: product.likes || 0,
    }))

    return NextResponse.json({ products: formattedProducts })

  } catch (error) {
    console.error('Error fetching store products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
