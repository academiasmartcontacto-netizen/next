-- SOLUCIÓN DIRECTA - Solo crear la tabla sin migraciones complejas
CREATE TABLE IF NOT EXISTS "store_navigation_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"is_visible" boolean DEFAULT true,
	"order" integer DEFAULT 0,
	"is_custom" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

-- Agregar la relación solo si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'store_navigation_sections_store_id_stores_id_fk'
    ) THEN
        ALTER TABLE "store_navigation_sections" 
        ADD CONSTRAINT "store_navigation_sections_store_id_stores_id_fk" 
        FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") 
        ON DELETE cascade ON UPDATE no action;
    END IF;
END $$;

-- Confirmar que la tabla fue creada
SELECT 'Tabla store_navigation_sections creada exitosamente' as resultado;
