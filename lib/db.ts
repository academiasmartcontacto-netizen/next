import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './db/schema'

// Create postgres client
const client = postgres(process.env.DATABASE_URL!, {
  ssl: 'require',
  prepare: false,
})

// Create drizzle instance
export const db = drizzle(client, { schema })

export default db
