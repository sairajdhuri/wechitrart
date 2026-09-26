"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { X, MessageCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CustomerInfo, Order } from "@/types";
import { generateWhatsAppOrderUrl } from "@/utils/whatsapp";
import { recordOrder } from "@/lib/supabase";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, subtotal, shippingCost, totalAmount, clearCart, setIsCartOpen } = useCart();

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg("");
  };

  const handleTriggerCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!customer.phone.trim() || customer.phone.replace(/\D/g, "").length < 10) {
      setErrorMsg("Please provide a valid 10-digit WhatsApp phone number.");
      return;
    }
    if (!customer.address.trim()) {
      setErrorMsg("Please provide your delivery address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const generatedOrderNum = `WCH-${Math.floor(10000 + Math.random() * 90000)}`;
      setOrderNumber(generatedOrderNum);

      const orderPayload: Order = {
        orderNumber: generatedOrderNum,
        customer,
        items: cart,
        subtotal,
        shippingCost,
        totalAmount,
        status: "pending_whatsapp",
        createdAt: new Date().toISOString(),
      };

      // 1. Record order in Supabase / Local Storage
      await recordOrder(orderPayload);

      // 2. Generate WhatsApp URL
      const { url } = generateWhatsAppOrderUrl(orderPayload);
      setGeneratedUrl(url);

      // 3. Trigger confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10b981", "#3b82f6", "#ec4899", "#facc15"],
        });
      } catch (err) {
        // Confetti is an enhancement, non-blocking
      }

      setOrderCompleted(true);

      // Open WhatsApp automatically
      window.open(url, "_blank");

      // Clear the cart
      clearCart();
      setIsCartOpen(false);
    } catch (err) {
      console.error("Order processing error", err);
      setErrorMsg("Failed to initiate order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded bg-white shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!orderCompleted ? (
          <div className="text-black">
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-semibold uppercase tracking-wider mb-2">
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Direct Checkout
              </div>
              <h2 className="text-2xl font-bold tracking-tight">
                Delivery & Order Details
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Enter your delivery address. We will format a clean WhatsApp message and direct you to our studio for order confirmation.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleTriggerCheckout} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customer.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    required
                    className="w-full px-3.5 py-2.5 rounded bg-gray-50 border border-gray-200 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customer.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9867241008"
                    required
                    className="w-full px-3.5 py-2.5 rounded bg-gray-50 border border-gray-200 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={customer.address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="House/Flat number, Street name, Landmark"
                  required
                  className="w-full px-3.5 py-2.5 rounded bg-gray-50 border border-gray-200 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={customer.city}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3.5 py-2.5 rounded bg-gray-50 border border-gray-200 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={customer.pincode}
                    onChange={handleChange}
                    placeholder="e.g. 400001"
                    className="w-full px-3.5 py-2.5 rounded bg-gray-50 border border-gray-200 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="p-4 rounded bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Cart Items ({cart.length})</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>Standard Packaging & Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-black pt-2 border-t border-gray-200">
                  <span>Total Amount Payable</span>
                  <span className="text-base">₹{totalAmount.toFixed(0)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 rounded bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Order...</span>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 text-white" />
                    <span>Proceed & Open in WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Order Complete State */
          <div className="text-center py-6 text-black">
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">
              Order Initiated
            </span>
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              Order #{orderNumber} Generated!
            </h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
              WhatsApp was opened in a new tab with your pre-filled cart receipt.
              If it didn&apos;t open automatically, click the button below:
            </p>

            {generatedUrl && (
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition cursor-pointer mb-4"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Open WhatsApp Chat Again</span>
              </a>
            )}

            <div className="pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black text-xs font-semibold transition cursor-pointer"
              >
                Continue Browsing Posters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
