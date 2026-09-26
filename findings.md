# Project Findings & Research

## 1. Project Overview: Wechitrart
- **Domain:** E-commerce Poster Brand ("wechitrart").
- **Core Tech Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS / Vanilla CSS, Supabase (PostgreSQL & Storage), WhatsApp Click-to-Chat API.
- **Workflow:**
  1. Users browse curated poster designs (categories, size variants, frame selections).
  2. Users add designs to cart and proceed to checkout.
  3. No payment gateway needed; checkout initiates a WhatsApp order message formatted with itemized summary, total, and customer info, while persisting the order record in Supabase.
  4. Admins have a dedicated management interface to upload new designs (with images, prices, sizes, categories) and monitor orders.

---

## 2. Research & Best Practices for WhatsApp Poster Checkout
- **WhatsApp Click-to-Chat URI Scheme:**
  `https://wa.me/<PHONE_NUMBER>?text=<URL_ENCODED_MESSAGE>`
- **Optimal Order Message Structure:**
  ```text
  🛒 *NEW ORDER - WECHITRART* 🎨
  Order ID: #WCH-XXXX
  ---------------------------------
  *Items:*
  1. Neon Cyberpunk City
     • Size: A3 (12x18 in)
     • Qty: 2 × ₹499 = ₹998
  2. Minimalist Botanical
     • Size: A4 (8x12 in)
     • Qty: 1 × ₹299 = ₹299
  ---------------------------------
  *Subtotal:* ₹1,297
  *Shipping:* FREE
  *Total Payable:* ₹1,297
  ---------------------------------
  *Customer Details:*
  • Name: Sairaj
  • Contact: +91 9876543210
  • Address: Pune, Maharashtra
  ---------------------------------
  Please confirm the order and share UPI / payment details!
  ```
- **Supabase Storage Pattern:**
  - Create a public bucket `poster-images` for high-resolution designs with optimized thumbnail display.
- **Admin Security Pattern:**
  - Supabase Auth or secure admin passcode / session validation for the `/admin` route.
- **Resilience Pattern:**
  - Even if Supabase is temporarily unconfigured or offline during initial setup, provide graceful offline fallback with mock/seed data so the storefront remains testable immediately, then seamlessly switch to live Supabase once keys are configured.
