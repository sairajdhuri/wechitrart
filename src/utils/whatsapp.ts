import { Order } from "@/types";

/**
 * Format order details into a clean, markdown-stylized WhatsApp message
 * and return the direct Click-to-Chat URL.
 */
export function generateWhatsAppOrderUrl(order: Order, phoneOverride?: string): { url: string; message: string } {
  const storePhone =
    phoneOverride ||
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE ||
    "919867241008";

  const cleanPhone = storePhone.replace(/\D/g, "");

  const lines: string[] = [
    "🛒 *NEW ORDER - WECHITRART* 🎨",
    `*Order ID:* #${order.orderNumber}`,
    "---------------------------------",
    "*Items Ordered:*",
  ];

  order.items.forEach((item, index) => {
    lines.push(`${index + 1}. *${item.title}*`);
    lines.push(`   • Size: ${item.size} (${item.dimensions})`);
    lines.push(`   • Qty: ${item.quantity} × ₹${item.unitPrice.toFixed(0)} = ₹${(item.unitPrice * item.quantity).toFixed(0)}`);
  });

  lines.push("---------------------------------");
  lines.push(`*Subtotal:* ₹${order.subtotal.toFixed(0)}`);
  if (order.shippingCost === 0) {
    lines.push("*Shipping:* FREE 🚀");
  } else {
    lines.push(`*Shipping:* ₹${order.shippingCost.toFixed(0)}`);
  }
  lines.push(`*Total Payable:* ₹${order.totalAmount.toFixed(0)}`);
  lines.push("---------------------------------");
  lines.push("*Delivery Details:*");
  lines.push(`• *Name:* ${order.customer.name}`);
  lines.push(`• *Phone:* ${order.customer.phone}`);
  if (order.customer.email) {
    lines.push(`• *Email:* ${order.customer.email}`);
  }
  const addressParts = [order.customer.address, order.customer.city, order.customer.pincode].filter(Boolean);
  lines.push(`• *Address:* ${addressParts.join(", ")}`);
  lines.push("---------------------------------");
  lines.push("Please confirm this order and share UPI / payment QR details! ✨");

  const message = lines.join("\n");
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

  return { url, message };
}
