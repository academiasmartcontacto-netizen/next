import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    console.log('=== VERIFICANDO SI EXISTE TABLA product_images ===')
    
    // Intentar consultar directamente la tabla
    try {
      const result = await db.execute(`
        SELECT COUNT(*) as count FROM product_images
      `)
      
      console.log('Consulta directa exitosa:', result)
      
      const count = result.rows && result.rows[0] ? result.rows[0].count : 0
      
      return NextResponse.json({
        success: true,
        tableExists: true,
        message: 'La tabla product_images existe y es accesible',
        count: count
      })
    } catch (error) {
      console.log('Error consultando directamente:', error.message)
      
      // Si falla, verificar con information_schema
      const schemaResult = await db.execute(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_name = 'product_images' 
          AND table_schema = 'public'
      `)
      
      const schemaCount = schemaResult.rows && schemaResult.rows[0] ? schemaResult.rows[0].count : 0
      const tableExists = schemaCount > 0
      
      return NextResponse.json({
        success: true,
        tableExists: tableExists,
        message: tableExists ? 
          'La tabla existe según information_schema pero no es accesible' : 
          'La tabla no existe en information_schema',
        schemaCount: schemaResult.rows[0]?.count || 0,
        error: error.message
      })
    }

  } catch (error) {
    console.error('Error general:', error)
    return NextResponse.json({ 
      error: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}
