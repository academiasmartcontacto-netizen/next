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
    
    // Obtener productos de la tienda - Traer TODOS los campos para debug
    const productsData = await db
      .select()
      .from(products)
      .where(eq(products.storeId, storeId))
      .orderBy(desc(products.createdAt))

    console.log('Products fetched:', productsData.length)

    // Formatear productos para el frontend
    const formattedProducts = productsData.map(product => {
      // Mostrar TODOS los campos para encontrar la imagen
      console.log(`=== TODOS LOS CAMPOS DEL PRODUCTO ${product.name} ===`)
      console.log('Producto completo:', product)
      
      // Buscar en todos los campos posibles que contengan "imagen" o "image"
      const imageFields = Object.keys(product).filter(key => 
        key.toLowerCase().includes('image') || key.toLowerCase().includes('imagen')
      )
      console.log('Campos de imagen encontrados:', imageFields)
      
      // Mostrar valores de todos los campos de imagen
      imageFields.forEach((field: string) => {
        console.log(`${field}:`, (product as any)[field])
      })
      
      let imagesArray = []
      try {
        // Intentar parsear ambos campos de imágenes
        const imagesField = product.images || product.imagenes
        if (imagesField) {
          imagesArray = JSON.parse(imagesField)
        }
      } catch (e) {
        console.error('Error parsing images JSON:', e)
      }
      
      // Buscar la imagen en todos los campos posibles
      let finalImage = null
      for (const field of imageFields) {
        const fieldValue = (product as any)[field]
        if (fieldValue) {
          finalImage = fieldValue
          console.log(`Imagen encontrada en campo ${field}:`, finalImage)
          break
        }
      }
      
      // Si no hay en campos específicos, intentar con arrays
      if (!finalImage && imagesArray.length > 0) {
        finalImage = imagesArray[0]
        console.log('Imagen encontrada en imagesArray[0]:', finalImage)
      }
      
      // AÑADIR /uploads/products/ si la imagen no tiene ruta completa
      if (finalImage && !finalImage.startsWith('http') && !finalImage.startsWith('/')) {
        finalImage = `/uploads/products/${finalImage}`
        console.log('URL corregida con /uploads/products/:', finalImage)
      }
      
      console.log('Imagen final:', finalImage)
      
      return {
        id: product.id,
        name: product.name || 'Sin nombre',
        description: product.description || '',
        price: product.price ? parseFloat(product.price.toString()) : 0,
        category: product.category || 'general',
        image: finalImage,
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

  } catch (error: any) {
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')
    
    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    console.log('Deleting product:', productId)

    // Eliminar el producto de la base de datos
    const deleteResult = await db
      .delete(products)
      .where(eq(products.id, productId))
      .returning({ id: products.id, name: products.name })

    console.log('Delete result:', deleteResult)

    if (deleteResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      deletedProduct: deleteResult[0]
    })

  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al eliminar el producto' 
      },
      { status: 500 }
    )
  }
}
