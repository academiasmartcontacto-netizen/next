import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id
    const { name } = await request.json()

    console.log('=== ACTUALIZANDO PRODUCTO ===')
    console.log('Product ID:', productId)
    console.log('Nuevo nombre:', name)

    if (!name) {
      return NextResponse.json(
        { error: 'Nombre es requerido' },
        { status: 400 }
      )
    }

    // Usar SQL directo para evitar problemas de Drizzle
    const updateResult = await db.execute(sql`
      UPDATE products 
      SET name = ${name.trim()}, updated_at = NOW()
      WHERE id = ${productId}
      RETURNING id, name, updated_at
    `)

    console.log('Update result:', updateResult)

    if (updateResult.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Producto actualizado:', updateResult[0])
    return NextResponse.json({ product: updateResult[0] })

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
