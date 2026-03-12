import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: 'postgresql://postgres.sfbsplymrielpfkoalsd:Yhefri123Chipana@aws-1-sa-east-1.pooler.supabase.com:6543/postgres',
  },
  verbose: true,
  strict: true,
} satisfies Config
