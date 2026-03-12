# Database Migrations

This directory contains SQL migration files for the stores system.

## Migration Files

### 001_create_stores.sql
Creates the core tables for the stores system:
- `stores` - Main store information
- `store_pages` - Individual pages within stores  
- `store_sections` - Content blocks for pages (like Wix sections)

### 002_add_store_to_users.sql
Adds store relationship to user profiles for easier queries.

## How to Run Migrations

### Using PostgreSQL CLI
```bash
psql -U your_username -d your_database -f lib/migrations/001_create_stores.sql
psql -U your_username -d your_database -f lib/migrations/002_add_store_to_users.sql
```

### Using Drizzle Kit (Recommended)
```bash
npx drizzle-kit push
```

### Using Next.js API (Development)
```bash
curl -X POST http://localhost:3000/api/migrate
```

## Schema Overview

### Stores Table
- `id` - UUID primary key
- `user_id` - Foreign key to users table
- `name` - Store name
- `phone` - Contact phone
- `link` - Unique store link (e.g., "samsung")
- `domain` - Full domain (e.g., "dominio.com/store/samsung")
- `is_active` - Store status
- `is_published` - Publication status
- `settings` - JSON store settings
- `theme` - Store theme/template
- `seo_title` - SEO title
- `seo_description` - SEO description
- `logo` - Store logo URL
- `favicon` - Favicon URL
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Store Pages Table
- `id` - UUID primary key
- `store_id` - Foreign key to stores
- `title` - Page title
- `slug` - URL slug (e.g., "home", "about")
- `content` - JSON page content
- `is_published` - Page publication status
- `is_home_page` - Home page flag
- `order` - Page order in navigation
- `seo_title` - Page SEO title
- `seo_description` - Page SEO description
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Store Sections Table
- `id` - UUID primary key
- `page_id` - Foreign key to store_pages
- `type` - Section type (header, hero, gallery, text, contact, etc.)
- `content` - JSON section content
- `order` - Section order within page
- `is_visible` - Visibility flag
- `settings` - JSON section settings
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Sample Data

The migrations include sample data for testing:
- Store "Samsung" with link "samsung"
- Store "Mi Tienda Online" with link "mi-tienda"
- Sample pages for each store

## Indexes

The migrations create indexes for optimal performance:
- Store lookups by user_id and link
- Page lookups by store_id and slug
- Section ordering within pages
- Publication status queries
