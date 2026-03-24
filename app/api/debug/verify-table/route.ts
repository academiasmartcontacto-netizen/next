import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Verificar si la tabla existe y mostrar su estructura
    const result = await db.execute(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_name = 'product_images' 
        AND table_schema = 'public';
    `)

    console.log('Resultado de consulta tabla:', result)

    // Si existe, mostrar las columnas
    let columns = []
    const tableExists = result.rows && result.rows.length > 0
    
    if (tableExists) {
      const columnsResult = await db.execute(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'product_images'
          AND table_schema = 'public'
        ORDER BY ordinal_position;
      `)
      columns = columnsResult.rows || []
    }

    return NextResponse.json({
      success: true,
      tableExists: tableExists,
      tableName: 'product_images',
      tableInfo: result.rows || [],
      columns: columns
    })
  } catch (error) {
    console.error('Error en verify-table:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.toString()
    }, { status: 500 })
  }
}
