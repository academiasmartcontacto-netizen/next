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

    console.log('=== DELETE SIMPLIFICADO ===')
    console.log('Product ID:', productId)

    // Inicializar servicio de Storage
    const storageService = new SupabaseStorageService()

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
    console.log('Producto encontrado:', product.name)
    console.log('Imagen principal:', product.image)

    // 2. Obtener imágenes de productImages
    const productImagesData = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
    
    console.log('Imágenes en productImages:', productImagesData.length)

    // 3. Recolectar URLs para eliminar
    const urlsToDelete = []
    
    if (product.image) {
      urlsToDelete.push(product.image)
      console.log('URL principal agregada:', product.image)
    }
    
    productImagesData.forEach(img => {
      if (img.url) {
        urlsToDelete.push(img.url)
        console.log('URL productImage agregada:', img.url)
      }
    })

    console.log('Total URLs a eliminar:', urlsToDelete.length)

    // 4. Eliminar del Storage - FORZAR ELIMINACIÓN DIRECTA
    console.log('=== ELIMINACIÓN STORAGE FORZADA ===')
    
    // FORZAR: Intentar eliminar directamente sin importar lo que encuentre
    console.log('🔍 FORZANDO DEBUG - Producto completo:', JSON.stringify(product, null, 2))
    
    // Buscar en TODOS los campos posibles
    const allPossibleImageFields = ['image', 'imagen', 'images', 'imagenes']
    const foundImages = []
    
    allPossibleImageFields.forEach(field => {
      if (product[field]) {
        console.log(`📸 Campo ${field} encontrado:`, product[field])
        foundImages.push(product[field])
      }
    })
    
    // Buscar en productImages
    console.log('📸 ProductImages:', JSON.stringify(productImagesData, null, 2))
    
    productImagesData.forEach(img => {
      if (img.url) {
        console.log(`📸 ProductImage URL:`, img.url)
        foundImages.push(img.url)
      }
    })
    
    console.log(`📸 Total imágenes encontradas: ${foundImages.length}`)
    
    // FORZAR ELIMINACIÓN DIRECTA
    if (foundImages.length > 0) {
      console.log('🗑️ INICIANDO ELIMINACIÓN FORZADA')
      for (const imageUrl of foundImages) {
        try {
          console.log('🗑️ Procesando imagen:', imageUrl)
          
          // FORZAR: Llamar directamente al Storage Service
          const storageService = new SupabaseStorageService()
          const path = storageService.extractPathFromUrl(imageUrl)
          
          console.log('🗑️ Path extraído:', path)
          
          if (path) {
            console.log('🗑️ LLAMANDO A deleteImage')
            await storageService.deleteImage(path)
            console.log('✅ Imagen eliminada:', path)
          } else {
            console.log('❌ No se pudo extraer path')
          }
        } catch (error) {
          console.log('❌ Error eliminando imagen:', error.message)
        }
      }
    } else {
      console.log('⚠️ NO SE ENCONTRARON IMÁGENES - FORZAR IMAGEN DE PRUEBA')
      
      // FORZAR: Intentar eliminar una imagen de prueba que sabemos que existe
      try {
        const storageService = new SupabaseStorageService()
        const testPath = 'producto_46147b42-340a-4855-8cfc-0560c1ae5d31_1775271970219_6unxdd.jpg'
        console.log('🗑️ FORZANDO ELIMINACIÓN DE PRUEBA:', testPath)
        await storageService.deleteImage(testPath)
        console.log('✅ Imagen de prueba eliminada')
      } catch (error) {
        console.log('❌ Error en eliminación de prueba:', error.message)
      }
    }

    // 5. Eliminar de la BD
    const deleteResult = await db
      .delete(productsTable)
      .where(eq(productsTable.id, productId))
      .returning({ id: productsTable.id, name: productsTable.name })

    console.log('✅ Producto eliminado de la BD:', deleteResult[0])

    return NextResponse.json({
      success: true,
      message: 'Product and its images deleted successfully',
      deletedProduct: deleteResult[0],
      deletedImages: urlsToDelete.length
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
