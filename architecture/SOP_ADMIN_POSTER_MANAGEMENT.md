# SOP: Admin Poster Management & Design Uploads

## 1. Goal
Empower the store administrator to securely upload new poster designs, set base prices, choose categories, upload preview images, and view all received orders.

---

## 2. Admin Route & Authentication
- **Route:** `/admin`
- **Security:** Protected by an administrative passcode (`NEXT_PUBLIC_ADMIN_PASSCODE` in `.env`, default `wechitrart2026`).
- When accessing `/admin`, if not authenticated, prompt with an elegant glassmorphism passcode screen.
- Once authenticated, store the session token in `sessionStorage`.

---

## 3. Upload Workflow
1. **Form Fields:**
   - Artwork Title (required)
   - Category (Select: Anime, Abstract, Cinema, Vintage, Minimalist, Nature, Custom)
   - Base Price in INR ₹ (for A4 standard size)
   - Description / Artist Note
   - Size Configurations (A4 8.3x11.7", A3 11.7x16.5", A2 16.5x23.4" with multipliers)
   - Featured Badge toggle (shows on homepage hero)
   - Image Upload (Drag-and-drop file upload to Supabase Storage `poster-images`, with instant live image preview, or direct high-res image URL input)
2. **Execution:**
   - Validates all fields against Schema D in `gemini.md`.
   - Generates unique slug (`slugify(title)`).
   - Inserts record into Supabase `posters` table.
   - If in offline demo mode, appends to local storage catalog with instant feedback.
3. **Inventory & Order Management:**
   - Tab 1: **Upload New Design**
   - Tab 2: **Poster Catalog** (view list, edit price/stock, delete)
   - Tab 3: **Incoming WhatsApp Orders** (view customer info, items ordered, status filter)
