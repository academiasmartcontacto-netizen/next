-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    link TEXT NOT NULL UNIQUE,
    domain TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT false,
    settings TEXT, -- JSON string
    theme TEXT DEFAULT 'default',
    seo_title TEXT,
    seo_description TEXT,
    logo TEXT, -- URL to store logo
    favicon TEXT, -- URL to favicon
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create store_pages table
CREATE TABLE IF NOT EXISTS store_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT, -- JSON string for page content
    is_published BOOLEAN DEFAULT false,
    is_home_page BOOLEAN DEFAULT false,
    order INTEGER DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create store_sections table
CREATE TABLE IF NOT EXISTS store_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES store_pages(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- header, hero, gallery, text, contact, etc.
    content TEXT NOT NULL, -- JSON string for section content
    order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    settings TEXT, -- JSON string for section-specific settings
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_link ON stores(link);
CREATE INDEX IF NOT EXISTS idx_stores_is_published ON stores(is_published);
CREATE INDEX IF NOT EXISTS idx_store_pages_store_id ON store_pages(store_id);
CREATE INDEX IF NOT EXISTS idx_store_pages_slug ON store_pages(slug);
CREATE INDEX IF NOT EXISTS idx_store_sections_page_id ON store_sections(page_id);
CREATE INDEX IF NOT EXISTS idx_store_sections_order ON store_sections(order);

-- Add unique constraint for store slugs within each store
CREATE UNIQUE INDEX IF NOT EXISTS idx_store_pages_store_slug ON store_pages(store_id, slug);

-- Insert sample data for testing
INSERT INTO stores (user_id, name, phone, link, domain, theme) VALUES
('mock-user-id-1', 'Tienda Samsung', '60000000', 'samsung', 'dominio.com/store/samsung', 'default'),
('mock-user-id-2', 'Mi Tienda Online', '70000000', 'mi-tienda', 'dominio.com/store/mi-tienda', 'modern')
ON CONFLICT (link) DO NOTHING;

-- Insert sample pages
INSERT INTO store_pages (store_id, title, slug, content, is_home_page, order) VALUES
((SELECT id FROM stores WHERE link = 'samsung'), 'Inicio', 'home', '{"sections": []}', true, 0),
((SELECT id FROM stores WHERE link = 'samsung'), 'Productos', 'productos', '{"sections": []}', false, 1),
((SELECT id FROM stores WHERE link = 'mi-tienda'), 'Inicio', 'home', '{"sections": []}', true, 0)
ON CONFLICT (store_id, slug) DO NOTHING;
