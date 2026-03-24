import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { productImages } from '@/lib/db/schema-products'

export async function GET() {
  try {
    console.log('=== TEST INSERCIÓN MANUAL DE IMAGEN ===')
    
    // Intentar insertar un registro de prueba
    const testProductId = '2d6ef10b-7fd6-40e1-a6bd-3144a1c47217' // ID de un producto existente
    const testImageUrl = '/uploads/productos/producto_2d6ef10b-7fd6-40e1-a6bd-3144a1c47217_1774384149161_bvk1zg.jpeg'
    
    console.log('Producto ID:', testProductId)
    console.log('Image URL:', testImageUrl)
    
    try {
      const result = await db.insert(productImages)
        .values({
          productId: testProductId,
          url: testImageUrl,
          isPrincipal: true,
          order: 0
        })
        .returning()
      
      console.log('✅ INSERCIÓN EXITOSA:', result)
      
      return NextResponse.json({
        success: true,
        message: 'Imagen insertada exitosamente',
        result: result
      })
    } catch (insertError) {
      console.error('❌ ERROR EN INSERCIÓN:', insertError)
      console.error('❌ DETALLES:', JSON.stringify(insertError, null, 2))
      
      return NextResponse.json({
        success: false,
        error: 'Error al insertar imagen',
        details: insertError.message,
        fullError: insertError.toString()
      }, { status: 500 })
    }

  } catch (error) {
    console.error('ERROR GENERAL:', error)
    return NextResponse.json({ 
      error: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}
