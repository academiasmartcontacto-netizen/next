import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products, stores } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    
    if (!storeId) {
      return NextResponse.json(
        { success: false, error: 'Store ID is required' },
        { status: 400 }
      )
    }

    console.log('Fetching products for store:', storeId)
    
    // Obtener productos de la tienda
    const productsData = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        price: products.price,
        category: products.category,
        image: products.image,
        images: products.images,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt
      })
      .from(products)
      .where(eq(products.storeId, storeId))
      .orderBy(desc(products.createdAt))

    console.log('Products fetched:', productsData.length)

    // Formatear productos para el frontend
    const formattedProducts = productsData.map(product => {
      let imagesArray = []
      try {
        if (product.images) {
          imagesArray = JSON.parse(product.images)
        }
      } catch (e) {
        console.error('Error parsing images JSON:', e)
      }
      
      return {
        id: product.id,
        name: product.name || 'Sin nombre',
        description: product.description || '',
        price: product.price ? parseFloat(product.price.toString()) : 0,
        category: product.category || 'general',
        image: product.image || (imagesArray.length > 0 ? imagesArray[0] : null),
        visible: product.isActive !== false,
        active: product.isActive !== false,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }
    })

    return NextResponse.json({
      success: true,
      products: formattedProducts
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al obtener los productos' 
      },
      { status: 500 }
    )
  }
}
