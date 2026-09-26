# Project Constitution: wechitrart

## 1. System Identity & Mission
- **Role:** System Pilot
- **Mission:** Build deterministic, self-healing, high-converting e-commerce web application for **wechitrart** poster store.
- **Architecture:** A.N.T. 3-Layer Architecture
  - Layer 1: Architecture (`architecture/` SOPs)
  - Layer 2: Navigation (Decision Making & Routing)
  - Layer 3: Tools (`tools/` Deterministic Python Scripts)
- **Protocol:** B.L.A.S.T. (Blueprint, Link, Architect, Stylize, Trigger)
- **Primary Directive:** Reliability over speed. Never guess at business logic.

---

## 2. Architectural Invariants
1. **The Data-First Rule:** JSON Data Schemas defined in this document are binding. Any structural changes require prior amendment to this file.
2. **SOP-First Rule:** Before altering logic or code, update or create the relevant SOP in `architecture/`.
3. **Deterministic Execution:**
   - Layer 3 Python tools perform atomic, verifiable steps (database seed, API verification, health handshakes).
   - Frontend components strictly adhere to standard TypeScript interfaces matching the schemas below.
4. **Ephemeral Workbench:** All intermediate scraping, export dumps, or test logs stay inside `.tmp/`.
5. **Self-Annealing Loop:**
   - Read stack traces precisely.
   - Patch the specific tool or component.
   - Test and verify.
   - Document any new environmental or API constraint in `architecture/`.
6. **Delivery Invariant:** Orders must simultaneously construct a validated WhatsApp payload and attempt to persist in Supabase `orders` table.

---

## 3. Confirmed Data Schemas

### A. Poster / Product Entity Schema (`posters` table)
```json
{
  "id": "uuid (string)",
  "title": "string (e.g. 'Neo-Tokyo Cyberpunk')",
  "slug": "string (e.g. 'neo-tokyo-cyberpunk')",
  "description": "string",
  "base_price": "number (in INR ₹)",
  "category": "string ('Anime' | 'Abstract' | 'Cinema' | 'Vintage' | 'Minimalist' | 'Nature')",
  "image_url": "string (Supabase storage URL or high-res image link)",
  "sizes": [
    {
      "name": "string ('A4' | 'A3' | 'A2')",
      "dimensions": "string ('8.3 x 11.7 in' | '11.7 x 16.5 in' | '16.5 x 23.4 in')",
      "price_multiplier": "number (e.g. 1.0, 1.5, 2.2)"
    }
  ],
  "is_featured": "boolean",
  "stock_status": "string ('in_stock' | 'limited' | 'sold_out')",
  "tags": ["string"],
  "created_at": "ISO8601 string"
}
```

### B. Cart Item & Order Payload Schema (`orders` table)
```json
{
  "order_id": "string (e.g. 'WCH-83921')",
  "customer": {
    "name": "string",
    "phone": "string",
    "email": "string | null",
    "delivery_address": "string",
    "city": "string",
    "pincode": "string"
  },
  "items": [
    {
      "poster_id": "string",
      "title": "string",
      "size": "string",
      "quantity": "integer (>= 1)",
      "unit_price": "number",
      "total_price": "number",
      "image_url": "string"
    }
  ],
  "subtotal": "number",
  "shipping_cost": 0,
  "total_amount": "number",
  "status": "string ('pending_whatsapp' | 'confirmed' | 'dispatched' | 'cancelled')",
  "whatsapp_message_encoded": "string",
  "created_at": "ISO8601 string"
}
```

### C. WhatsApp Click-to-Chat Payload
```json
{
  "target_phone": "string (E.164 without +, e.g. '919876543210')",
  "raw_message": "string (Formatted markdown with emojis)",
  "encoded_url": "https://wa.me/{target_phone}?text={raw_message_url_encoded}"
}
```

### D. Admin Design Upload Payload
```json
{
  "title": "string",
  "description": "string",
  "base_price": "number",
  "category": "string",
  "sizes": [
    { "name": "A4", "dimensions": "8.3 x 11.7 in", "price_multiplier": 1.0 },
    { "name": "A3", "dimensions": "11.7 x 16.5 in", "price_multiplier": 1.6 },
    { "name": "A2", "dimensions": "16.5 x 23.4 in", "price_multiplier": 2.4 }
  ],
  "image_file": "File | string (base64 or URL)",
  "is_featured": "boolean",
  "stock_status": "in_stock",
  "tags": ["string"]
}
```

---

## 4. Maintenance & Change Log
- **2026-09-26 (Initialization):** Constitution established.
- **2026-09-26 (Phase 1 Blueprint):** Discovery captured: Next.js + React + TypeScript, Supabase DB & Storage, WhatsApp checkout payload. Schemas locked.
