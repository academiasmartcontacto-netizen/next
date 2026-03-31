import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Datos INE 2024 - Estructura oficial
    const departments = [
      { value: 'ch', label: 'Chuquisaca' },
      { value: 'lp', label: 'La Paz' },
      { value: 'cb', label: 'Cochabamba' },
      { value: 'or', label: 'Oruro' },
      { value: 'pt', label: 'Potosí' },
      { value: 'tj', label: 'Tarija' },
      { value: 'sc', label: 'Santa Cruz' },
      { value: 'bn', label: 'Beni' },
      { value: 'pd', label: 'Pando' }
    ]

    return NextResponse.json(departments)
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}
