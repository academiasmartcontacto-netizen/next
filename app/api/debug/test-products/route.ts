import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { stores } from '@/lib/db/schema'
import { products } from '@/lib/db/schema-products'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    console.log('=== TEST DIRECTO DE PRODUCTOS ===')
    
    // 1. Obtener tienda benedeto
    const [store] = await db
      .select({ id: stores.id, isActive: stores.isActive, isPublished: stores.isPublished })
      .from(stores)
      .where(eq(stores.link, 'benedeto'))
      .limit(1)

    console.log('Store encontrada:', store)

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // 2. Obtener productos de la tienda
    const storeProducts = await db
      .select({
        id: products.id,
        titulo: products.titulo,
        precio: products.precio,
        activo: products.activo,
        createdAt: products.createdAt,
      })
      .from(products)
      .where(eq(products.storeId, store.id))

    console.log('Productos encontrados:', storeProducts.length)
    console.log('Productos:', storeProducts)

    return NextResponse.json({
      success: true,
      store,
      products: storeProducts,
      count: storeProducts.length
    })

  } catch (error) {
    console.error('Error en test productos:', error)
    return NextResponse.json({ 
      error: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}
