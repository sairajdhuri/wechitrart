# SOP: WhatsApp Checkout & Order Dispatch

## 1. Goal
Provide a frictionless, high-converting checkout workflow without external payment gateway friction. The customer reviews their cart, inputs delivery information, and is redirected to WhatsApp with an itemized, beautifully structured order message sent to the Wechitrart store owner.

---

## 2. Process Flow
1. **User Action:** Customer browses posters, selects size (A4, A3, A2) which dynamically adjusts the unit price, and adds items to their shopping cart.
2. **Checkout Modal / Drawer:** Customer clicks "Checkout via WhatsApp".
3. **Customer Details Capture:** A clean, minimal dialog captures:
   - Full Name
   - Phone Number (WhatsApp number for tracking/communication)
   - Delivery Address + City + Pincode
4. **Order ID Generation:** A deterministic, unique order ID is created: `WCH-XXXXX` (prefix + random 5 alphanumeric digits).
5. **Persistence Attempt:** An asynchronous attempt is made to insert the order record into the Supabase `orders` table with status `pending_whatsapp`.
6. **URL Construction:** The frontend invokes the WhatsApp formatter:
   `https://wa.me/{target_phone}?text={encoded_order_summary}`
7. **Redirection / Dispatch:** Opens WhatsApp Web (on desktop) or WhatsApp mobile app directly.
8. **Cart Reset:** Cart is gracefully cleared or preserved with an "Order Initiated" confirmation toast.

---

## 3. Formatting Standards
- Emojis: 🛒, 🎨, 🚀, ✨, •
- Bold headers using WhatsApp markdown (`*Item Name*`)
- Clean itemization of quantity, size variant, and unit price
- Clear delivery details section
- Total payable and call-to-action requesting payment details (e.g. UPI QR code)
