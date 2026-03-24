CREATE TABLE "store_navigation_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"is_visible" boolean DEFAULT true,
	"is_custom" boolean DEFAULT false,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "store_navigation_sections" ADD CONSTRAINT "store_navigation_sections_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "navbar_style";--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "section_position";--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "estilo_bordes";--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "estilo_fondo";--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "tipografia";--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "tamano_texto";--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "estilo_tarjetas";--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "estilo_fotos";--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "grid_density";--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "menu_items";