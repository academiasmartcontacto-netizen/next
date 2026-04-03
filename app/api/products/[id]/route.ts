import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products, productImages } from '@/lib/db/schema-products'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 16+ requiere await para params
    const resolvedParams = await params
    const productId = resolvedParams.id

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Obtener el producto completo con todos los campos
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Obtener imágenes del producto
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(productImages.order)

    const productData = product[0]
    
    // Encontrar la imagen principal
    const imagenPrincipal = images.find(img => img.isPrincipal)?.url || images[0]?.url || ''
    
    // Logging detallado para debugging
    console.log('=== DATOS COMPLETOS DEL PRODUCTO DESDE BD ===')
    console.log('1. ProductData completo:', productData)
    console.log('2. Keys disponibles:', Object.keys(productData))
    console.log('3. categoria_id:', (productData as any).categoria_id)
    console.log('4. subcategoria_id:', (productData as any).subcategoria_id)
    console.log('5. departamento:', (productData as any).departamento)
    console.log('6. municipio:', (productData as any).municipio)
    console.log('7. estado:', (productData as any).estado)
    console.log('8. categoria_tienda:', (productData as any).categoria_tienda)
    console.log('9. Imágenes encontradas:', images)
    console.log('10. Imagen principal:', imagenPrincipal)
    
    // Mapear todos los campos para el frontend
    const mappedProduct = {
      id: productData.id,
      name: productData.name || productData.titulo || '',
      titulo: productData.titulo || productData.name || '',
      description: productData.description || productData.descripcion || '',
      descripcion: productData.descripcion || productData.description || '',
      price: productData.price || productData.precio || 0,
      precio: productData.precio || productData.price || 0,
      category: productData.category || productData.categoria || '',
      categoria: productData.categoria || productData.category || '',
      categoria_tienda: (productData as any).categoria_tienda || '',
      image: imagenPrincipal, // ✅ Usar imagen de la tabla productImages
      imagen: imagenPrincipal, // ✅ Usar imagen de la tabla productImages
      images: productData.images || productData.imagenes || '[]',
      imagenes: productData.imagenes || productData.images || '[]',
      visible: productData.isActive || productData.activo || true, // ✅ Campo para frontend
      
      // Campos adicionales que faltaban
      isActive: productData.isActive || productData.activo || true,
      activo: productData.activo || productData.isActive || true,
      featured: productData.destacado || false,
      stock: productData.stock || 0,
      sku: productData.sku || '',
      tags: productData.tags || '[]',
      storeId: productData.storeId,
      
      // IDs de categoría y subcategoría
      categoria_id: (productData as any).categoria_id || '',
      subcategoria_id: (productData as any).subcategoria_id || '',
      
      // Campos de ubicación y estado
      estado: (productData as any).estado || 'nuevo',
      departamento: (productData as any).departamento || '',
      municipio: (productData as any).municipio || '',
      
      // Badges (asumir que está en metadata o tags)
      badges: [],
      
      // Timestamps
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
      fecha_publicacion: productData.fecha_publicacion || productData.createdAt,
      
      // Galería completa
      allImages: images
    }

    console.log('=== PRODUCTO MAPEADO PARA FRONTEND ===')
    console.log('1. categoria_id:', mappedProduct.categoria_id)
    console.log('2. subcategoria_id:', mappedProduct.subcategoria_id)
    console.log('3. departamento:', mappedProduct.departamento)
    console.log('4. municipio:', mappedProduct.municipio)
    console.log('5. estado:', mappedProduct.estado)
    console.log('6. categoria_tienda:', mappedProduct.categoria_tienda)

    return NextResponse.json({ product: mappedProduct })

  } catch (error: any) {
    console.error('Error en GET /api/products/[id]:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 16+ requiere await para params
    const resolvedParams = await params
    const productId = resolvedParams.id
    const updateData = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    if (!updateData) {
      return NextResponse.json(
        { error: 'Update data is required' },
        { status: 400 }
      )
    }

    // Construir objeto de actualización con todos los campos
    const updateFields: any = {
      updatedAt: new Date()
    }

    // Mapear campos del frontend a la base de datos
    if (updateData.categoria_id !== undefined) {
      (updateFields as any).categoria_id = updateData.categoria_id
    }
    if (updateData.subcategoria_id !== undefined) {
      (updateFields as any).subcategoria_id = updateData.subcategoria_id
    }
    if (updateData.titulo !== undefined) {
      updateFields.name = updateData.titulo
      updateFields.titulo = updateData.titulo
    }
    if (updateData.descripcion !== undefined) {
      updateFields.description = updateData.descripcion
      updateFields.descripcion = updateData.descripcion
    }
    if (updateData.precio !== undefined) {
      updateFields.price = parseFloat(updateData.precio) || 0
      updateFields.precio = parseFloat(updateData.precio) || 0
    }
    if (updateData.categoria !== undefined) {
      updateFields.category = updateData.categoria
      updateFields.categoria = updateData.categoria
    }
    if (updateData.categoria_tienda !== undefined) {
      updateFields.categoria_tienda = updateData.categoria_tienda
    }
    if (updateData.estado !== undefined) {
      updateFields.estado = updateData.estado
    }
    if (updateData.departamento !== undefined) {
      (updateFields as any).departamento = updateData.departamento
    }
    if (updateData.municipio !== undefined) {
      (updateFields as any).municipio = updateData.municipio
    }
    if (updateData.imagen !== undefined) {
      updateFields.image = updateData.imagen
      updateFields.imagen = updateData.imagen
    }
    if (updateData.imagenes !== undefined) {
      updateFields.images = JSON.stringify(updateData.imagenes)
      updateFields.imagenes = JSON.stringify(updateData.imagenes)
    }
    if (updateData.badges !== undefined) {
      updateFields.tags = JSON.stringify(updateData.badges)
    }
    
    // Mapear campo de visibilidad (como en Secciones)
    if (updateData.visible !== undefined) {
      updateFields.isActive = updateData.visible
      updateFields.activo = updateData.visible
    }

    // Actualizar el producto
    const updatedProduct = await db
      .update(products)
      .set(updateFields)
      .where(eq(products.id, productId))
      .returning()

    if (updatedProduct.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    // Mapear respuesta igual que en GET
    const productData = updatedProduct[0]
    
    // Obtener imágenes actualizadas si es necesario, o usar las existentes
    const images = await db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(productImages.order)
    
    const imagenPrincipal = images.find(img => img.isPrincipal)?.url || images[0]?.url || productData.image || productData.imagen || ''

    const mappedProduct = {
      id: productData.id,
      name: productData.name || productData.titulo || '',
      titulo: productData.titulo || productData.name || '',
      description: productData.description || productData.descripcion || '',
      descripcion: productData.descripcion || productData.description || '',
      price: productData.price || productData.precio || 0,
      precio: productData.precio || productData.price || 0,
      category: productData.category || productData.categoria || '',
      categoria: productData.categoria || productData.category || '',
      categoria_tienda: (productData as any).categoria_tienda || '',
      image: imagenPrincipal,
      imagen: imagenPrincipal,
      allImages: images,
      visible: productData.isActive || productData.activo || true, // ✅ Campo para frontend
      estado: (productData as any).estado || 'nuevo',
      departamento: (productData as any).departamento || '',
      municipio: (productData as any).municipio || '',
      badges: updateData.badges || [],
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt
    }

    return NextResponse.json({ 
      success: true, 
      product: mappedProduct 
    })

  } catch (error: any) {
    console.error('Error en PUT /api/products/[id]:', error)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id
    
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
