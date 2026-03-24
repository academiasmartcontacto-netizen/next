CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"original_price" numeric(10, 2),
	"category" text,
	"image" text,
	"images" text,
	"is_active" boolean DEFAULT true,
	"featured" boolean DEFAULT false,
	"stock" integer DEFAULT 0,
	"sku" text,
	"tags" text,
	"metadata" text,
	"titulo" text,
	"descripcion" text,
	"precio" numeric(10, 2),
	"precio_original" numeric(10, 2),
	"imagen" text,
	"imagenes" text,
	"activo" boolean DEFAULT true,
	"destacado" boolean DEFAULT false,
	"categoria" text,
	"categoria_tienda" text,
	"visitas" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"fecha_publicacion" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "store_navigation_sections" (
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
--> statement-breakpoint
CREATE TABLE "store_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_id" uuid NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text,
	"is_published" boolean DEFAULT false,
	"is_home_page" boolean DEFAULT false,
	"order" integer DEFAULT 0,
	"seo_title" text,
	"seo_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "store_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" uuid NOT NULL,
	"type" text NOT NULL,
	"content" text NOT NULL,
	"order" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"settings" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"link" text NOT NULL,
	"domain" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"is_published" boolean DEFAULT false,
	"whatsapp" text,
	"email_contacto" text,
	"direccion" text,
	"google_maps_url" text,
	"descripcion" text,
	"slogan" text,
	"color_primario" text,
	"navbar_color" text,
	"logo" text,
	"logo_url" text,
	"navbar_position" text,
	"logo_principal" text,
	"mostrar_logo" boolean DEFAULT true,
	"mostrar_nombre" boolean DEFAULT true,
	"banner_imagen" text,
	"banner_imagen_2" text,
	"banner_imagen_3" text,
	"banner_imagen_4" text,
	"mostrar_banner" boolean DEFAULT false,
	"redes_sociales" text,
	"settings" text,
	"theme" text DEFAULT 'claro',
	"seo_title" text,
	"seo_description" text,
	"favicon" text,
	"estado" text DEFAULT 'activo',
	"suspension_fin" timestamp,
	"visitas" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "stores_link_unique" UNIQUE("link")
);
--> statement-breakpoint
CREATE TABLE "user_activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"metadata" text,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"first_name" text,
	"last_name" text,
	"phone" text,
	"avatar" text,
	"bio" text,
	"department" text,
	"municipality" text,
	"timezone" text DEFAULT 'America/La_Paz',
	"language" text DEFAULT 'es',
	"preferences" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"email_verified" boolean DEFAULT false,
	"email_verification_token" text,
	"password_reset_token" text,
	"password_reset_expires" timestamp,
	"last_login_at" timestamp,
	"is_active" boolean DEFAULT true,
	"role" text DEFAULT 'user',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "store_navigation_sections" ADD CONSTRAINT "store_navigation_sections_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_pages" ADD CONSTRAINT "store_pages_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store_sections" ADD CONSTRAINT "store_sections_page_id_store_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."store_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_activity_log" ADD CONSTRAINT "user_activity_log_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;