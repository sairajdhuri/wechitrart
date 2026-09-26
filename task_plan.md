# Task Plan: wechitrart

## Phase 0: Initialization (Mandatory)
- [x] Create project memory: `gemini.md`, `task_plan.md`, `findings.md`, `progress.md`
- [x] Establish architectural invariants and constitution in `gemini.md`
- [x] Discovery & protocol alignment complete

---

## Phase 1: B - Blueprint (Vision & Logic)
- [x] Discovery captured:
  - North Star: High-converting Next.js + React + TS poster store with WhatsApp direct checkout and admin design uploads
  - Integrations: Supabase (PostgreSQL database & Storage) + WhatsApp Click-to-Chat API
  - Source of Truth: Supabase + Git repo
  - Delivery Payload: Responsive web application
- [x] Researched GitHub templates and WhatsApp cart integration patterns (documented in `findings.md`)
- [x] JSON Data Schemas defined and locked in `gemini.md`
- [x] Blueprint approved

---

## Phase 2: L - Link (Connectivity)
- [ ] Create `.env.example` and `.env` template for Supabase credentials & WhatsApp business number
- [ ] Write connection validation script in `tools/test_supabase_connection.py`
- [ ] Write WhatsApp message generator & validator in `tools/generate_whatsapp_payload.py`
- [ ] Write Supabase SQL schema generator in `tools/generate_supabase_schema.sql`
- [ ] Test & verify links and provide graceful fallback for offline/preview mode

---

## Phase 3: A - Architect (The 3-Layer Build)
- [ ] **Layer 1: Architecture (`architecture/`)**
  - [ ] `SOP_SUPABASE_SETUP.md`: Database tables, policies, and storage bucket configuration
  - [ ] `SOP_WHATSAPP_CHECKOUT.md`: Cart state management, order formatting, and direct redirection
  - [ ] `SOP_ADMIN_POSTER_MANAGEMENT.md`: Admin upload, image storage, price configuration, and order management
- [ ] **Layer 2: Navigation**
  - [ ] Next.js app initialization (App Router, TypeScript, React)
  - [ ] Component architecture: Header, Hero, Category Filter, Poster Grid, Poster Modal/Detail, Cart Drawer, WhatsApp Checkout Modal, Admin Dashboard
- [ ] **Layer 3: Tools (`tools/`)**
  - [ ] Deterministic Python verification scripts
  - [ ] Mock data seeder (`tools/seed_posters.py` or `.ts` seeder)

---

## Phase 4: S - Stylize (Refinement & UI)
- [ ] Modern, aesthetic dark/vibrant design with glassmorphism and smooth micro-animations
- [ ] High-impact poster card visuals, hover effects, size selectors (A4, A3, A2) with dynamic price calculation
- [ ] Elegant slide-over cart drawer with order breakdown and one-click WhatsApp action
- [ ] Sleek admin portal with drag-and-drop image upload preview and poster inventory table
- [ ] Mobile-responsive layout optimized for shopping on smartphones

---

## Phase 5: T - Trigger (Deployment & Verification)
- [ ] Build verification (`npm run build`)
- [ ] Git commit and preparation for GitHub remote
- [ ] Finalize Maintenance Log in `gemini.md`
