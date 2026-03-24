-- Create store_navigation_sections table for custom navigation sections
CREATE TABLE IF NOT EXISTS store_navigation_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT true,
    is_custom BOOLEAN DEFAULT false,
    order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_store_navigation_sections_store_id ON store_navigation_sections(store_id);
CREATE INDEX IF NOT EXISTS idx_store_navigation_sections_slug ON store_navigation_sections(slug);
CREATE INDEX IF NOT EXISTS idx_store_navigation_sections_order ON store_navigation_sections(order);

-- Add unique constraint for store_id + slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_store_navigation_sections_store_slug ON store_navigation_sections(store_id, slug);
