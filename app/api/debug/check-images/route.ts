import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema-products'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    console.log('=== VERIFICANDO IMÁGENES DE PRODUCTOS ===')
    
    // 1. Obtener productos con imágenes
    const productsWithImages = await db
      .select({
        id: products.id,
        titulo: products.titulo,
        imagen: products.imagen,
        image: products.image,
      })
      .from(products)
      .limit(5)

    console.log('Productos con campo imagen/image:', productsWithImages.length)
    
    // 2. Verificar si hay imágenes en la tabla product_images
    try {
      const productImages = await db.execute(`
        SELECT product_id, url, alt, "order", is_principal
        FROM product_images
        LIMIT 5
      `)
      
      console.log('Imágenes en product_images:', productImages.rows.length)
      
      return NextResponse.json({
        success: true,
        productsWithImages: productsWithImages,
        productImages: productImages.rows,
        hasImages: productsWithImages.some(p => p.imagen || p.image) || productImages.rows.length > 0
      })
    } catch (error) {
      console.log('Error consultando product_images:', error.message)
      
      return NextResponse.json({
        success: true,
        productsWithImages,
        productImages: [],
        hasImages: productsWithImages.some(p => p.imagen || p.image),
        error: 'Tabla product_images no existe o no se puede consultar'
      })
    }

  } catch (error) {
    console.error('Error verificando imágenes:', error)
    return NextResponse.json({ 
      error: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}
