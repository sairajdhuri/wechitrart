# SOP: Supabase Integration & Database Architecture

## 1. Goal
Provide secure, persistent storage for poster designs, inventory metadata, and customer WhatsApp checkout orders, with automatic fallback to mock catalog when Supabase environment keys are not configured.

---

## 2. Table Specifications
- **`posters` Table:**
  - `id` (UUID, Primary Key)
  - `title` (TEXT, unique name of artwork)
  - `slug` (TEXT, URL-friendly unique identifier)
  - `description` (TEXT, detailed artist notes)
  - `base_price` (NUMERIC, base price in INR ₹ for standard size e.g. A4)
  - `category` (TEXT, e.g. 'Anime', 'Abstract', 'Cinema', 'Vintage', 'Minimalist', 'Nature')
  - `image_url` (TEXT, public URL from Supabase Storage or CDN)
  - `sizes` (JSONB, array of `{ name, dimensions, price_multiplier }`)
  - `is_featured` (BOOLEAN, displays in hero or curated highlight section)
  - `stock_status` (TEXT, 'in_stock' | 'limited' | 'sold_out')
  - `tags` (TEXT[], searchable keywords)
  - `created_at` (TIMESTAMP WITH TIME ZONE)

- **`orders` Table:**
  - `id` (UUID, Primary Key)
  - `order_number` (TEXT, e.g. 'WCH-94821')
  - `customer` (JSONB: name, phone, address, city, pincode)
  - `items` (JSONB: list of ordered poster items, chosen size, unit price, quantity)
  - `subtotal` (NUMERIC)
  - `shipping_cost` (NUMERIC)
  - `total_amount` (NUMERIC)
  - `status` (TEXT: 'pending_whatsapp', 'confirmed', 'dispatched', 'delivered')
  - `created_at` (TIMESTAMP WITH TIME ZONE)

---

## 3. Storage Bucket
- **Bucket Name:** `poster-images`
- **Access Level:** Public read access.
- Upload endpoint in Next.js receives admin image file, uploads to `poster-images/${Date.now()}-${filename}`, and retrieves public URL.

---

## 4. Resilience & Fallback Invariant
If `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set or fail to connect, the application must **NOT** crash. It must automatically fall back to an internal seed dataset (`data/initialPosters.ts`), allowing seamless local browsing, cart building, and WhatsApp checkout generation.
