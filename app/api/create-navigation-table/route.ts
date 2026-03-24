import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Crear tabla store_navigation_sections manualmente
    await db.execute(`
      CREATE TABLE IF NOT EXISTS store_navigation_sections (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        slug TEXT NOT NULL,
        is_visible BOOLEAN DEFAULT true,
        is_custom BOOLEAN DEFAULT false,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `)

    // Crear índices
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_store_navigation_sections_store_id ON store_navigation_sections(store_id);
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_store_navigation_sections_order ON store_navigation_sections("order");
    `)

    // Constraint único
    await db.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_store_navigation_sections_store_slug ON store_navigation_sections(store_id, slug);
    `)

    return NextResponse.json({ success: true, message: 'Tabla creada exitosamente' })
  } catch (error) {
    console.error('Error al crear tabla:', error)
    return NextResponse.json({ error: 'Error al crear tabla' }, { status: 500 })
  }
}
