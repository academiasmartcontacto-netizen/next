import { NextRequest, NextResponse } from 'next/server'

// GET /api/admin/categories - Obtener todas las categorías (hardcoded)
export async function GET(request: NextRequest) {
  try {
    // Categorías hardcoded (como en tu sistema actual)
    const categories = [
      { id: '1', nombre: 'Vehículos' },
      { id: '2', nombre: 'Dispositivos' },
      { id: '3', nombre: 'Electrodomésticos' },
      { id: '4', nombre: 'Herramientas' },
      { id: '5', nombre: 'Inmuebles' },
      { id: '6', nombre: 'Juguetes' },
      { id: '7', nombre: 'Muebles' },
      { id: '8', nombre: 'Prendas' }
    ]

    return NextResponse.json(categories)
    
  } catch (error) {
    console.error('Error al obtener categorías:', error)
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    )
  }
}
