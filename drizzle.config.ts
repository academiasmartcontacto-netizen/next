import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: 'postgresql://postgres.sfbsplymrielpfkoalsd@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
  },
  verbose: true,
  strict: true,
} satisfies Config
