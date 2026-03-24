import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Para verificar si el endpoint funciona
export async function GET() {
  return NextResponse.json({ 
    message: 'Endpoint para agregar campos de visibilidad. Usa POST para ejecutar la migración.',
    method: 'POST'
  })
}

// POST - Para ejecutar la migración
export async function POST(request: NextRequest) {
  try {
    // Agregar campos de visibilidad a la tabla stores
    await db.execute(`
      ALTER TABLE stores 
      ADD COLUMN IF NOT EXISTS mostrar_inicio BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS mostrar_productos BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS mostrar_contacto BOOLEAN DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS mostrar_acerca_de BOOLEAN DEFAULT TRUE
    `)

    // Actualizar registros existentes
    await db.execute(`
      UPDATE stores 
      SET mostrar_inicio = TRUE, 
          mostrar_productos = TRUE, 
          mostrar_contacto = TRUE, 
          mostrar_acerca_de = TRUE
      WHERE mostrar_inicio IS NULL 
         OR mostrar_productos IS NULL 
         OR mostrar_contacto IS NULL 
         OR mostrar_acerca_de IS NULL
    `)

    return NextResponse.json({ 
      success: true, 
      message: 'Campos de visibilidad agregados correctamente' 
    })
  } catch (error) {
    console.error('Error al agregar campos de visibilidad:', error)
    return NextResponse.json({ 
      error: 'Error al agregar campos de visibilidad',
      details: String(error)
    }, { status: 500 })
  }
}
