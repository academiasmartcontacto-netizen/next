import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Connection for queries
const connectionString = process.env.DATABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL + '?pgbouncer=true'

const client = postgres(connectionString, { 
  prepare: false,
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false
})

export const db = drizzle(client, { schema })

// Connection for migrations
const migrationClient = postgres(connectionString, { 
  prepare: false,
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false
})

export const migrationDb = drizzle(migrationClient, { schema })

export { schema }
