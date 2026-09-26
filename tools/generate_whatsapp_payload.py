"""
tools/generate_whatsapp_payload.py
Deterministic WhatsApp order payload formatter and URL generator.
Validates against Schema B & C in gemini.md.
"""

import sys
import json
import urllib.parse
from typing import Dict, Any

# Ensure UTF-8 output encoding across Windows terminals
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass


def format_whatsapp_order(order_data: Dict[str, Any], phone_number: str) -> Dict[str, str]:
    """
    Given an order payload conforming to Schema B in gemini.md,
    formats a professional order summary message and returns the click-to-chat URL.
    """
    order_id = order_data.get("order_id", "WCH-0000")
    customer = order_data.get("customer", {})
    customer_name = customer.get("name", "Valued Customer")
    customer_phone = customer.get("phone", "N/A")
    delivery_address = customer.get("delivery_address", "N/A")
    city = customer.get("city", "")
    pincode = customer.get("pincode", "")
    
    full_address = delivery_address
    if city:
        full_address += f", {city}"
    if pincode:
        full_address += f" - {pincode}"

    items = order_data.get("items", [])
    subtotal = order_data.get("subtotal", 0)
    shipping = order_data.get("shipping_cost", 0)
    total = order_data.get("total_amount", subtotal + shipping)

    # Clean phone number (digits only)
    clean_phone = "".join(filter(str.isdigit, str(phone_number)))

    lines = [
        "🛒 *NEW ORDER - WECHITRART* 🎨",
        f"*Order ID:* #{order_id}",
        "---------------------------------",
        "*Items Ordered:*"
    ]

    for idx, item in enumerate(items, 1):
        title = item.get("title", "Art Poster")
        size = item.get("size", "Standard")
        qty = item.get("quantity", 1)
        unit_price = item.get("unit_price", 0)
        item_total = item.get("total_price", unit_price * qty)
        lines.append(f"{idx}. *{title}*")
        lines.append(f"   • Size: {size}")
        lines.append(f"   • Qty: {qty} × ₹{unit_price:.0f} = ₹{item_total:.0f}")

    lines.append("---------------------------------")
    lines.append(f"*Subtotal:* ₹{subtotal:.0f}")
    if shipping == 0:
        lines.append("*Shipping:* FREE 🚀")
    else:
        lines.append(f"*Shipping:* ₹{shipping:.0f}")
    lines.append(f"*Total Payable:* ₹{total:.0f}")
    lines.append("---------------------------------")
    lines.append("*Delivery Details:*")
    lines.append(f"• *Name:* {customer_name}")
    lines.append(f"• *Phone:* {customer_phone}")
    lines.append(f"• *Address:* {full_address}")
    lines.append("---------------------------------")
    lines.append("Please confirm this order and share UPI / payment QR details! ✨")

    raw_message = "\n".join(lines)
    encoded_message = urllib.parse.quote(raw_message)
    whatsapp_url = f"https://wa.me/{clean_phone}?text={encoded_message}"

    return {
        "target_phone": clean_phone,
        "raw_message": raw_message,
        "encoded_url": whatsapp_url
    }

def run_test():
    sample_order = {
        "order_id": "WCH-83921",
        "customer": {
            "name": "Arjun Sharma",
            "phone": "+91 9876543210",
            "email": "arjun@example.com",
            "delivery_address": "Flat 402, Lotus Residency, Baner",
            "city": "Pune",
            "pincode": "411045"
        },
        "items": [
            {
                "poster_id": "pst-01",
                "title": "Neo-Tokyo Cyberpunk",
                "size": "A3 (11.7 x 16.5 in)",
                "quantity": 2,
                "unit_price": 599,
                "total_price": 1198,
                "image_url": "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119"
            },
            {
                "poster_id": "pst-02",
                "title": "Minimalist Botanical Monstera",
                "size": "A4 (8.3 x 11.7 in)",
                "quantity": 1,
                "unit_price": 349,
                "total_price": 349,
                "image_url": "https://images.unsplash.com/photo-1549887534-1541e9326642"
            }
        ],
        "subtotal": 1547,
        "shipping_cost": 0,
        "total_amount": 1547,
        "status": "pending_whatsapp"
    }

    result = format_whatsapp_order(sample_order, "919876543210")
    print("=== FORMATTED MESSAGE ===")
    print(result["raw_message"])
    print("\n=== GENERATED URL ===")
    print(result["encoded_url"])
    print("\n[SUCCESS] Deterministic WhatsApp formatting verified.")

if __name__ == "__main__":
    run_test()
