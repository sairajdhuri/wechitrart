"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CheckoutModal } from "./CheckoutModal";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalItemsCount,
    subtotal,
    totalAmount,
  } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-black" />
                <h2 className="text-lg font-bold text-black">Your Cart</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-base font-bold text-black mb-1">Your cart is empty</p>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
                    Browse our curated poster collection and find the perfect artwork for your room.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 rounded bg-black hover:bg-gray-800 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Browse Posters
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.posterId}-${item.size}`}
                    className="flex gap-4 p-3.5 rounded border border-gray-200 items-center justify-between bg-white"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-20 rounded overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-black truncate mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mb-2">
                        Size: <span className="font-semibold">{item.size}</span> ({item.dimensions})
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Counter */}
                        <div className="flex items-center bg-gray-50 rounded border border-gray-200">
                          <button
                            onClick={() =>
                              updateQuantity(item.posterId, item.size, item.quantity - 1)
                            }
                            className="px-2 py-1 text-gray-600 hover:text-black transition cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-black">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.posterId, item.size, item.quantity + 1)
                            }
                            className="px-2 py-1 text-gray-600 hover:text-black transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-bold text-black">
                          ₹{(item.unitPrice * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => removeFromCart(item.posterId, item.size)}
                      className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & WhatsApp Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-black">₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-black pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{totalAmount.toFixed(0)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 rounded bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Checkout via WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-gray-500">
                  Instant order confirmation with our studio on WhatsApp.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout details modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};

