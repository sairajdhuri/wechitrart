# 🎨 Wechitrart Studio — Archival Wall Art & Statement Posters

A modern, high-converting e-commerce web application for **Wechitrart**, an archival art print studio. Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Supabase (PostgreSQL & Storage)**, and a **Direct WhatsApp Order Checkout System**.

---

## ⚡ Core Features

- 🖼️ **Curated Art Catalog:** Browse museum-grade poster prints across Anime, Cyberpunk, Abstract, Cinema, Minimalist, Nature, and Vintage collections.
- 📐 **Dynamic Sizing & Instant Pricing:** Live price recalculation for standard frame sizes:
  - **A4 (8.3 × 11.7 in)** — 1.0× multiplier
  - **A3 (11.7 × 16.5 in)** — 1.5× multiplier
  - **A2 (16.5 × 23.4 in)** — 2.2× multiplier
- 🛒 **Interactive Slide-over Cart:** Persistent local cart drawer with quantity adjustment and free shipping calculations.
- 💬 **Frictionless WhatsApp Direct Checkout:** No payment gateways needed. Generates a markdown-formatted, itemized order receipt and redirects directly to WhatsApp Web/App for fulfillment and payment QR confirmation.
- 🛡️ **Passcode-Protected Admin Portal (`/admin`):**
  - **Upload New Designs:** Upload artwork files or image URLs, set base prices, categories, tags, and featured status with a live card preview.
  - **Poster Inventory:** View, manage, and delete published designs.
  - **Incoming WhatsApp Orders:** Track orders placed via WhatsApp with customer delivery details and item summaries.
- 🗄️ **Supabase Integration & Offline Fallback:** Connects to Supabase PostgreSQL for live catalog and order tracking; gracefully falls back to an internal seed dataset if offline or demo mode is active.

---

## 🏗️ Architecture & Protocols

Built strictly according to the **B.L.A.S.T.** protocol and **A.N.T. 3-Layer Architecture**:

```
├── gemini.md            # Project Constitution & Data Schemas
├── task_plan.md         # B.L.A.S.T. Phase Tracker & Checklist
├── findings.md          # Research, Benchmarks & Patterns
├── progress.md          # Execution Log & Self-Annealing Audits
├── architecture/        # Layer 1: SOPs (How-To Guides)
│   ├── SOP_SUPABASE_INTEGRATION.md
│   ├── SOP_WHATSAPP_CHECKOUT.md
│   └── SOP_ADMIN_POSTER_MANAGEMENT.md
├── src/                 # Layer 2: Next.js Frontend & Navigation
│   ├── app/             # App Router pages (/ and /admin)
│   ├── components/      # UI Components (Navbar, Hero, Cards, Cart, Modal)
│   ├── context/         # Cart Context & State
│   ├── data/            # Initial Poster Catalog Seed
│   ├── lib/             # Supabase Client & Resilient Data Layer
│   └── utils/           # WhatsApp URI Generator
└── tools/               # Layer 3: Deterministic Python Engines
    ├── generate_whatsapp_payload.py
    ├── test_supabase_connection.py
    └── schema.sql
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node v25.4.0)
- Python 3.10+ (for validation scripts)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd wechitrart

# Install dependencies
npm install
```

### 3. Environment Setup
Copy the template `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your parameters in `.env`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# WhatsApp Store Configuration
NEXT_PUBLIC_WHATSAPP_PHONE=919876543210
NEXT_PUBLIC_STORE_NAME=Wechitrart
NEXT_PUBLIC_CURRENCY_SYMBOL=₹

# Admin Authentication Passcode
NEXT_PUBLIC_ADMIN_PASSCODE=wechitrart2026
```

### 4. Database Setup (Supabase)
1. Go to your [Supabase Dashboard](https://supabase.com).
2. Open the **SQL Editor**.
3. Copy and run the entire content of [`tools/schema.sql`](file:///c:/my%20stuff/Vibe%20Coding/wechitrart/tools/schema.sql).
4. Run `python tools/test_supabase_connection.py` to verify the connection.

### 5. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin Management Portal.

### 6. Build for Production
```bash
npm run build
npm run start
```
