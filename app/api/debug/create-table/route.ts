import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Crear la tabla product_images
    const result = await db.execute(`
      CREATE TABLE IF NOT EXISTS product_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        url TEXT NOT NULL,
        alt TEXT,
        "order" INTEGER DEFAULT 0,
        is_principal BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    console.log('Tabla product_images creada:', result)

    // Verificar que se creó
    const verifyResult = await db.execute(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'product_images'
        AND table_schema = 'public'
      ORDER BY ordinal_position;
    `)

    return NextResponse.json({
      success: true,
      message: 'Tabla product_images creada exitosamente',
      tableCreated: true,
      columns: verifyResult.rows
    })
  } catch (error) {
    console.error('Error creando tabla:', error)
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
