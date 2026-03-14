ALTER TABLE "stores" ALTER COLUMN "theme" SET DEFAULT 'claro';--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "whatsapp" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "email_contacto" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "direccion" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "google_maps_url" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "descripcion" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "slogan" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "color_primario" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "logo_principal" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "mostrar_logo" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "mostrar_nombre" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "banner_imagen" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "banner_imagen_2" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "banner_imagen_3" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "banner_imagen_4" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "mostrar_banner" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "redes_sociales" text;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "estado" text DEFAULT 'activo';--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "suspension_fin" timestamp;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "visitas" integer DEFAULT 0;