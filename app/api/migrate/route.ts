import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import fs from 'fs'
import path from 'path'

// POST /api/migrate - Run database migrations
export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Migrations not allowed in production' }, { status: 403 })
    }

    const migrationFiles = [
      '001_create_stores.sql',
      '002_add_store_to_users.sql'
    ]

    const results = []

    for (const file of migrationFiles) {
      try {
        const migrationPath = path.join(process.cwd(), 'lib', 'migrations', file)
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')
        
        // Execute migration
        await db.execute(migrationSQL)
        
        results.push({
          file,
          status: 'success',
          message: 'Migration completed successfully'
        })
      } catch (error) {
        console.error(`Error running migration ${file}:`, error)
        results.push({
          file,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({ 
      message: 'Migrations completed',
      results 
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ 
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET /api/migrate - Check migration status
export async function GET(request: NextRequest) {
  try {
    // Check if stores table exists
    const storesTableCheck = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'stores'
      );
    `)

    const storePagesTableCheck = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'store_pages'
      );
    `)

    const storeSectionsTableCheck = await db.execute(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'store_sections'
      );
    `)

    const storesCount = await db.execute('SELECT COUNT(*) as count FROM stores')

    return NextResponse.json({
      tables: {
        stores: storesTableCheck[0]?.exists,
        store_pages: storePagesTableCheck[0]?.exists,
        store_sections: storeSectionsTableCheck[0]?.exists
      },
      stores_count: storesCount[0]?.count,
      migration_status: storesTableCheck[0]?.exists ? 'completed' : 'pending'
    })
  } catch (error) {
    console.error('Error checking migration status:', error)
    return NextResponse.json({ 
      error: 'Failed to check migration status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
