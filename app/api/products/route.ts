import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products, stores } from '@/lib/db/schema'
import { products as productsTable, productImages } from '@/lib/db/schema-products'
import { eq, desc } from 'drizzle-orm'
import { SupabaseStorageService } from '@/lib/services/SupabaseStorageService'

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
      .from(productsTable)
      .where(eq(productsTable.storeId, storeId))
      .orderBy(desc(productsTable.createdAt))

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

export async function POST(request: NextRequest) {
  try {
    const { name, storeId } = await request.json()

    console.log('=== CREANDO NUEVO PRODUCTO ===')
    console.log('Nombre:', name)
    console.log('StoreId:', storeId)

    if (!name) {
      return NextResponse.json(
        { error: 'Nombre es requerido' },
        { status: 400 }
      )
    }

    if (!storeId) {
      return NextResponse.json(
        { error: 'Store ID es requerido' },
        { status: 400 }
      )
    }

    // Crear nuevo producto
    const insertResult = await db
      .insert(productsTable)
      .values({
        name: name.trim(),
        storeId: storeId,
        price: '0.00', // Precio por defecto
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    console.log('✅ Producto creado:', insertResult[0])
    return NextResponse.json({ product: insertResult[0] })

  } catch (error: any) {
    console.error('Error en POST /api/products:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
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

    console.log('=== DELETE SIMPLE Y DIRECTO ===')
    console.log('Product ID:', productId)

    // 1. Obtener el producto
    const productData = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, productId))
      .limit(1)

    if (productData.length === 0) {
      console.log('❌ Producto no encontrado')
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = productData[0]
    
    // DEBUG: Mostrar TODOS los campos del producto
    console.log('=== PRODUCTO COMPLETO DEBUG ===')
    console.log('ID:', product.id)
    console.log('Nombre:', product.name)
    console.log('Image:', product.image)
    console.log('Imagen (PHP):', product.imagen)
    console.log('Images (JSON):', product.images)
    console.log('Imagenes (PHP JSON):', product.imagenes)
    console.log('=== TODOS LOS CAMPOS ===')
    Object.keys(product).forEach(key => {
      console.log(`${key}:`, (product as any)[key])
    })
    console.log('=== FIN DEBUG ===')
    
    console.log('Producto encontrado:', product.name)

    // 2. Eliminar CUALQUIER imagen que exista
    const imagenesAEliminar = []
    
    if (product.image) {
      imagenesAEliminar.push(product.image)
      console.log('✅ Imagen encontrada en campo image:', product.image)
    }
    
    if (product.imagen) {
      imagenesAEliminar.push(product.imagen)
      console.log('✅ Imagen encontrada en campo imagen:', product.imagen)
    }
    
    if (product.images) {
      try {
        const parsedImages = JSON.parse(product.images)
        if (Array.isArray(parsedImages)) {
          parsedImages.forEach(url => {
            if (url) {
              imagenesAEliminar.push(url)
              console.log('✅ Imagen encontrada en campo images:', url)
            }
          })
        }
      } catch (e) {
        console.log('❌ Error parseando campo images:', e)
      }
    }
    
    if (product.imagenes) {
      try {
        const parsedImagenes = JSON.parse(product.imagenes)
        if (Array.isArray(parsedImagenes)) {
          parsedImagenes.forEach(url => {
            if (url) {
              imagenesAEliminar.push(url)
              console.log('✅ Imagen encontrada en campo imagenes:', url)
            }
          })
        }
      } catch (e) {
        console.log('❌ Error parseando campo imagenes:', e)
      }
    }
    
    console.log(`📸 Total imágenes a eliminar: ${imagenesAEliminar.length}`)

    // 3. Eliminar TODAS las imágenes encontradas
    if (imagenesAEliminar.length > 0) {
      console.log('🗑️ INICIANDO ELIMINACIÓN DE IMÁGENES')
      
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      for (const imageUrl of imagenesAEliminar) {
        try {
          console.log('🗑️ Procesando imagen:', imageUrl)
          
          // Extraer path después de /public/productos/
          const pathParts = imageUrl.split('/storage/v1/object/public/productos/')
          const imagePath = pathParts[pathParts.length - 1]
          
          console.log('🗑️ Path a eliminar:', imagePath)
          
          const { error } = await supabase.storage
            .from('productos')
            .remove([imagePath])
            
          if (error) {
            console.log('❌ Error eliminando:', error.message)
          } else {
            console.log('✅ Imagen eliminada:', imagePath)
          }
        } catch (error: any) {
          console.log('❌ Error procesando imagen:', error.message)
        }
      }
      
      console.log('🏁 Eliminación de imágenes completada')
    } else {
      console.log('⚠️ No se encontraron imágenes para eliminar')
    }

    // 3. Eliminar de la BD
    const deleteResult = await db
      .delete(productsTable)
      .where(eq(productsTable.id, productId))
      .returning({ id: productsTable.id, name: productsTable.name })

    console.log('✅ Producto eliminado de la BD:', deleteResult[0])

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      deletedProduct: deleteResult[0]
    })

  } catch (error: any) {
    console.error('❌ Error general en DELETE:', error.message)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error al eliminar el producto' 
      },
      { status: 500 }
    )
  }
}
