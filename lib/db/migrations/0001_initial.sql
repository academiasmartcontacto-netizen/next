-- Initial migration for Drizzle schema
-- This will be generated automatically by drizzle-kit

-- Profiles table
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"username" text,
	"full_name" text,
	"avatar_url" text,
	"website" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Users table (for auth.users reference)
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Waitlist table
CREATE TABLE IF NOT EXISTS "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "profiles_username_unique" ON "profiles" ("username");
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "waitlist_email_unique" ON "waitlist" ("email");

-- Create foreign key constraint
DO $$ 
BEGIN
   IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_id_users_id_fk') THEN
      ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
   END IF;
END $$;
