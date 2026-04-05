import { pgTable, text, timestamp, uuid, boolean, integer, decimal } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { relations } from 'drizzle-orm'

// Importar products desde el archivo separado
import { products, productImages, type Product } from './schema-products'

// Users table - Enhanced for complete auth system
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  phone: text('phone').unique(), // Nuevo campo para login por teléfono
  passwordHash: text('password_hash').notNull(),
  emailVerified: boolean('email_verified').default(false),
  emailVerificationToken: text('email_verification_token'),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: timestamp('password_reset_expires'),
  lastLoginAt: timestamp('last_login_at'),
  isActive: boolean('is_active').default(true),
  role: text('role').default('user'), // user, admin, moderator
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// User profiles table
export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  avatar: text('avatar'), // URL to profile image
  bio: text('bio'),
  department: text('department'),
  municipality: text('municipality'),
  timezone: text('timezone').default('America/La_Paz'),
  language: text('language').default('es'),
  preferences: text('preferences'), // JSON string for user preferences
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// User sessions table
export const userSessions = pgTable('user_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
})

// User activity log
export const userActivityLog = pgTable('user_activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // login, logout, register, profile_update, etc.
  metadata: text('metadata'), // JSON string for additional data
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Stores table - Competing with Wix, Site123, etc.
export const stores = pgTable('stores', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  link: text('link').notNull().unique(), // Unique store link like "samsung", "mi-tienda", etc.
  domain: text('domain').notNull(), // Full domain like "dominio.com/store/samsung"
  isActive: boolean('is_active').default(true),
  isPublished: boolean('is_published').default(false),
  
  // Campos adicionales para replicar PHP
  whatsapp: text('whatsapp'), // WhatsApp para contacto
  emailContacto: text('email_contacto'), // Email de contacto
  direccion: text('direccion'), // Dirección física
  googleMapsUrl: text('google_maps_url'), // URL a Google Maps
  descripcion: text('descripcion'), // Descripción de la tienda
  slogan: text('slogan'), // Slogan o tagline
  
  // Campos de apariencia
  colorPrimario: text('color_primario'), // Color primario de la marca
  navbarColor: text('navbar_color'), // Color de la barra de navegación
  logo: text('logo'), // URL del logo
  logoPrincipal: text('logo_principal'), // Logo principal
  logo_feria_url: text('logo_feria_url'), // Logo de feria virtual
  mostrarLogo: boolean('mostrar_logo').default(true),
  mostrarNombre: boolean('mostrar_nombre').default(true),
  
  // Banners
  bannerImagen: text('banner_imagen'), // Banner principal
  bannerImagen2: text('banner_imagen_2'), // Banner secundario 2
  bannerImagen3: text('banner_imagen_3'), // Banner secundario 3
  bannerImagen4: text('banner_imagen_4'), // Banner secundario 4
  mostrarBanner: boolean('mostrar_banner').default(false),
  
  // Redes sociales (JSON)
  redesSociales: text('redes_sociales'), // JSON con URLs de redes sociales
  
  // Campos de sistema
  settings: text('settings'), // JSON string for store settings
  theme: text('theme').default('claro'), // Store theme/template
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  favicon: text('favicon'), // URL to favicon
  
  // Campos de visibilidad de secciones
  mostrarInicio: boolean('mostrar_inicio').default(true),
  mostrarProductos: boolean('mostrar_productos').default(true),
  mostrarContacto: boolean('mostrar_contacto').default(true),
  mostrarAcercaDe: boolean('mostrar_acerca_de').default(true),
  
  // Campo de categoría de la tienda
  categoria_id: integer('categoria_id'), // Referencia a las 8 categorías principales
  
  // Campos de PHP
  estado: text('estado').default('activo'), // activo, suspendido, eliminado
  suspensionFin: timestamp('suspension_fin'), // Fecha fin de suspensión
  visitas: integer('visitas').default(0), // Contador de visitas
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Store navigation sections table - For custom navigation sections
export const storeNavigationSections = pgTable('store_navigation_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  isVisible: boolean('is_visible').default(true),
  isCustom: boolean('is_custom').default(false),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Store pages table - Individual pages within a store
export const storePages = pgTable('store_pages', {
  id: uuid('id').primaryKey().defaultRandom(),
  storeId: uuid('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull(), // URL slug like "about", "contact", "products"
  content: text('content'), // JSON string for page content
  isPublished: boolean('is_published').default(false),
  isHomePage: boolean('is_home_page').default(false),
  order: integer('order').default(0), // Page order in navigation
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Store sections table - Building blocks for pages (like Wix sections)
export const storeSections = pgTable('store_sections', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id').notNull().references(() => storePages.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // header, hero, gallery, text, contact, etc.
  content: text('content').notNull(), // JSON string for section content
  order: integer('order').default(0), // Section order within page
  isVisible: boolean('is_visible').default(true),
  settings: text('settings'), // JSON string for section-specific settings
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Waitlist table
export const waitlist = pgTable('waitlist', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
  sessions: many(userSessions),
  activityLog: many(userActivityLog),
  stores: many(stores),
}))

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}))

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, {
    fields: [userSessions.userId],
    references: [users.id],
  }),
}))

export const userActivityLogRelations = relations(userActivityLog, ({ one }) => ({
  user: one(users, {
    fields: [userActivityLog.userId],
    references: [users.id],
  }),
}))

export const storesRelations = relations(stores, ({ one, many }) => ({
  user: one(users, {
    fields: [stores.userId],
    references: [users.id],
  }),
  pages: many(storePages),
  products: many(products), // Agregar relación con productos
}))

export const storePagesRelations = relations(storePages, ({ one, many }) => ({
  store: one(stores, {
    fields: [storePages.storeId],
    references: [stores.id],
  }),
  sections: many(storeSections),
}))

export const storeSectionsRelations = relations(storeSections, ({ one }) => ({
  page: one(storePages, {
    fields: [storeSections.pageId],
    references: [storePages.id],
  }),
}))

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email.email(),
  passwordHash: (schema) => schema.passwordHash.min(8),
})

export const selectUserSchema = createSelectSchema(users)

export const insertUserProfileSchema = createInsertSchema(userProfiles, {
  firstName: (schema) => schema.firstName.min(2).max(50),
  lastName: (schema) => schema.lastName.min(2).max(50),
  phone: (schema) => schema.phone.regex(/^[67]\d{7}$/),
})

export const selectUserProfileSchema = createSelectSchema(userProfiles)

export const insertUserSessionSchema = createInsertSchema(userSessions)
export const selectUserSessionSchema = createSelectSchema(userSessions)

export const insertUserActivityLogSchema = createInsertSchema(userActivityLog)
export const selectUserActivityLogSchema = createSelectSchema(userActivityLog)

export const insertWaitlistSchema = createInsertSchema(waitlist)
export const selectWaitlistSchema = createSelectSchema(waitlist)

// Store schemas
export const insertStoreSchema = createInsertSchema(stores, {
  name: (schema) => schema.name.min(2).max(100),
  phone: (schema) => schema.phone.regex(/^[67]\d{7}$/),
  link: (schema) => schema.link.min(3).max(50).regex(/^[a-z0-9-]+$/, "El link solo puede contener letras minúsculas, números y guiones"),
})

export const selectStoreSchema = createSelectSchema(stores)

export const insertStorePageSchema = createInsertSchema(storePages, {
  title: (schema) => schema.title.min(2).max(100),
  slug: (schema) => schema.slug.min(2).max(50).regex(/^[a-z0-9-]+$/, "El slug solo puede contener letras minúsculas, números y guiones"),
})

export const selectStorePageSchema = createSelectSchema(storePages)

export const insertStoreSectionSchema = createInsertSchema(storeSections, {
  type: (schema) => schema.type.min(2).max(50),
})

export const selectStoreSectionSchema = createSelectSchema(storeSections)

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UserProfile = typeof userProfiles.$inferSelect
export type NewUserProfile = typeof userProfiles.$inferInsert
export type UserSession = typeof userSessions.$inferSelect
export type NewUserSession = typeof userSessions.$inferInsert
export type UserActivityLog = typeof userActivityLog.$inferSelect
export type NewUserActivityLog = typeof userActivityLog.$inferInsert
export type Waitlist = typeof waitlist.$inferSelect
export type NewWaitlist = typeof waitlist.$inferInsert

// Store types
export type Store = typeof stores.$inferSelect
export type NewStore = typeof stores.$inferInsert
export type StorePage = typeof storePages.$inferSelect
export type NewStorePage = typeof storePages.$inferInsert
export type StoreSection = typeof storeSections.$inferSelect
export type NewStoreSection = typeof storeSections.$inferInsert

// Combined types
export type UserWithProfile = User & {
  profile?: UserProfile | null
}

export type UserProfileWithUser = UserProfile & {
  user: User
}

export type UserWithStore = User & {
  store?: Store | null
}

export type StoreWithUser = Store & {
  user: User
}

export type StoreWithPages = Store & {
  pages: StorePage[]
}

export type StoreWithProducts = Store & {
  products: Product[]
}

export type StorePageWithSections = StorePage & {
  sections: StoreSection[]
}

// Re-exportar products para que esté disponible globalmente
export { products, productImages, type Product }
