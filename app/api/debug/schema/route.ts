import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Obtener información de la tabla product_images
    const result = await db.execute(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'product_images'
        AND table_schema = 'public'
      ORDER BY ordinal_position;
    `)

    console.log('=== RESULTADO DE CONSULTA ===')
    console.log('Filas obtenidas:', result.rows.length)
    console.log('Datos:', JSON.stringify(result.rows, null, 2))

    return NextResponse.json({
      success: true,
      table: 'product_images',
      rowCount: result.rows.length,
      columns: result.rows
    })
  } catch (error) {
    console.error('Error en consulta de schema:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}
