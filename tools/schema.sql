-- ==============================================================================
-- Wechitrart Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create Posters Table
CREATE TABLE IF NOT EXISTS public.posters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 499.00,
    category TEXT NOT NULL DEFAULT 'Anime',
    image_url TEXT NOT NULL,
    sizes JSONB NOT NULL DEFAULT '[
        {"name": "A4", "dimensions": "8.3 x 11.7 in", "price_multiplier": 1.0},
        {"name": "A3", "dimensions": "11.7 x 16.5 in", "price_multiplier": 1.5},
        {"name": "A2", "dimensions": "16.5 x 23.4 in", "price_multiplier": 2.2}
    ]'::jsonb,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    stock_status TEXT NOT NULL DEFAULT 'in_stock',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for speedy queries
CREATE INDEX IF NOT EXISTS idx_posters_category ON public.posters (category);
CREATE INDEX IF NOT EXISTS idx_posters_featured ON public.posters (is_featured);

-- 2. Create Orders Table (WhatsApp Order Tracking)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'pending_whatsapp',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);

-- 3. Row Level Security (RLS)
ALTER TABLE public.posters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous & authenticated users to view active posters
CREATE POLICY "Public can view posters"
    ON public.posters FOR SELECT
    USING (true);

-- Allow public to insert orders (when initiating WhatsApp checkout)
CREATE POLICY "Public can create orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- Allow public read of their created orders by order number or admin
CREATE POLICY "Public can view orders"
    ON public.orders FOR SELECT
    USING (true);

-- Allow admin inserts/updates/deletions on posters
CREATE POLICY "Allow poster management"
    ON public.posters FOR ALL
    USING (true)
    WITH CHECK (true);

-- 4. Initial Seed Data (Curated high quality art designs)
INSERT INTO public.posters (title, slug, description, base_price, category, image_url, is_featured, stock_status, tags)
VALUES
(
    'Neo Tokyo Cyberpunk 2099',
    'neo-tokyo-cyberpunk-2099',
    'A high-contrast neon dystopia capturing the pulse of holographic skyscrapers, rain-slicked asphalt, and electric violet hues.',
    599.00,
    'Anime',
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80',
    true,
    'in_stock',
    ARRAY['Cyberpunk', 'Neon', 'Futuristic', 'Anime']
),
(
    'Zenith Abstract Geometry',
    'zenith-abstract-geometry',
    'Minimalist mid-century geometric shapes with muted terracotta, deep cobalt, and warm cream textures for refined wall decor.',
    499.00,
    'Abstract',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80',
    true,
    'in_stock',
    ARRAY['Abstract', 'Modern', 'Minimalist', 'Boho']
),
(
    'Interstellar Cosmic Voyage',
    'interstellar-cosmic-voyage',
    'Deep space cinematic voyage poster featuring swirling nebulas, Saturnian rings, and quiet celestial solitude.',
    649.00,
    'Cinema',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80',
    true,
    'in_stock',
    ARRAY['Sci-Fi', 'Space', 'Cinema', 'Astronomy']
),
(
    'Botanical Monstera Flora',
    'botanical-monstera-flora',
    'Lush, organic Monstera Deliciosa leaves bathed in warm golden-hour lighting. Perfect for calming, grounded living spaces.',
    399.00,
    'Nature',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    false,
    'in_stock',
    ARRAY['Nature', 'Botanical', 'Green', 'Aesthetic']
),
(
    'Tokyo Rain Alleyway',
    'tokyo-rain-alleyway',
    'Atmospheric night photograph of an authentic Shinjuku lantern-lit alley reflecting in glistening puddles.',
    549.00,
    'Vintage',
    'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
    true,
    'in_stock',
    ARRAY['Tokyo', 'Street', 'Rain', 'Mood']
),
(
    'Minimalist Bauhaus Form',
    'minimalist-bauhaus-form',
    'Iconic Bauhaus aesthetic featuring bold typographic harmony, primary color circles, and architectural balance.',
    449.00,
    'Minimalist',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    false,
    'in_stock',
    ARRAY['Bauhaus', 'Design', 'Typography', 'Minimal']
)
ON CONFLICT (slug) DO NOTHING;
