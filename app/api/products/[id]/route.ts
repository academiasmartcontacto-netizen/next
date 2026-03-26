import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

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
