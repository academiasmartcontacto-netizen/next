import { pgTable, text, timestamp, uuid, boolean, integer, decimal } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'

// Products table - Para las tiendas
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull(), // Temporalmente sin referencia para evitar circular
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 }), // Precio original para ofertas
  category: text('category'),
  image: text('image'), // URL de la imagen principal
  images: text('images'), // JSON array con URLs de imágenes adicionales
  isActive: boolean('is_active').default(true),
  featured: boolean('featured').default(false), // Producto destacado
  stock: integer('stock').default(0),
  sku: text('sku'), // Código de producto
  tags: text('tags'), // JSON array con etiquetas
  metadata: text('metadata'), // JSON con metadatos adicionales
  
  // Campos de PHP
  titulo: text('titulo'), // Título (puede ser diferente de name)
  descripcion: text('descripcion'), // Descripción detallada
  precio: decimal('precio', { precision: 10, scale: 2 }), // Precio (campo PHP)
  precio_original: decimal('precio_original', { precision: 10, scale: 2 }), // Precio original PHP
  imagen: text('imagen'), // Imagen principal (campo PHP)
  imagenes: text('imagenes'), // JSON con imágenes adicionales (campo PHP)
  activo: boolean('activo').default(true), // Activo (campo PHP)
  destacado: boolean('destacado').default(false), // Destacado (campo PHP)
  categoria: text('categoria'), // Categoría (campo PHP)
  categoria_tienda: text('categoria_tienda'), // Categoría dentro de la tienda
  visitas: integer('visitas').default(0), // Contador de visitas
  likes: integer('likes').default(0), // Contador de likes
  fecha_publicacion: timestamp('fecha_publicacion').defaultNow(), // Fecha de publicación
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Product images table - Imágenes adicionales de productos
export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(), // URL de la imagen
  alt: text('alt'), // Texto alternativo
  order: integer('order').default(0), // Orden de visualización
  isPrincipal: boolean('is_principal').default(false), // Es imagen principal
  
  createdAt: timestamp('created_at').defaultNow(),
})

// Product badges table - Badges de productos (nuevo, oferta, etc.)
export const productBadges = pgTable('product_badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  badgeId: uuid('badge_id').notNull().references(() => badges.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
})

// Badges table - Tipos de badges
export const badges = pgTable('badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type').notNull(), // oferta, novedad, popular, etc.
  color: text('color'), // Color del badge
  icon: text('icon'), // Icono del badge
  isActive: boolean('is_active').default(true),
  
  createdAt: timestamp('created_at').defaultNow(),
})

// Relations
export const productsRelations = relations(products, ({ one, many }) => ({
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
  images: many(productImages),
  badges: many(productBadges),
}))

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}))

export const productBadgesRelations = relations(productBadges, ({ one }) => ({
  product: one(products, {
    fields: [productBadges.productId],
    references: [products.id],
  }),
  badge: one(badges, {
    fields: [productBadges.badgeId],
    references: [badges.id],
  }),
}))

export const badgesRelations = relations(badges, ({ many }) => ({
  products: many(productBadges),
}))

// Zod schemas
export const insertProductSchema = createInsertSchema(products, {
  name: (schema) => schema.name.min(2).max(200),
  price: (schema) => schema.price.min(0),
})

export const selectProductSchema = createSelectSchema(products)

export const insertProductImageSchema = createInsertSchema(productImages)
export const selectProductImageSchema = createSelectSchema(productImages)

export const insertProductBadgeSchema = createInsertSchema(productBadges)
export const selectProductBadgeSchema = createSelectSchema(productBadges)

export const insertBadgeSchema = createInsertSchema(badges)
export const selectBadgeSchema = createSelectSchema(badges)

// Types
export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
export type ProductImage = typeof productImages.$inferSelect
export type NewProductImage = typeof productImages.$inferInsert
export type ProductBadge = typeof productBadges.$inferSelect
export type NewProductBadge = typeof productBadges.$inferInsert
export type Badge = typeof badges.$inferSelect
export type NewBadge = typeof badges.$inferInsert

// Combined types
export type ProductWithImages = Product & {
  images: ProductImage[]
}

export type ProductWithBadges = Product & {
  badges: Badge[]
}

export type ProductWithRelations = Product & {
  images: ProductImage[]
  badges: Badge[]
  store: any // Usar any para evitar import circular
}
