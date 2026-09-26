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
    shippingCost,
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
          className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col justify-between">
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-black text-white">Your Cart</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-gray-800/80 flex items-center justify-center mx-auto mb-4 text-gray-500">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-base font-bold text-white mb-1">Your cart is empty</p>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto mb-6">
                    Browse our curated poster collection and find the perfect artwork for your room.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold transition cursor-pointer"
                  >
                    Browse Posters
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.posterId}-${item.size}`}
                    className="flex gap-4 p-3.5 rounded-2xl bg-gray-800/40 border border-gray-800 items-center justify-between"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-gray-950 flex-shrink-0 border border-gray-700/60">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate mb-0.5">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mb-2">
                        Size: <span className="text-amber-400 font-semibold">{item.size}</span> ({item.dimensions})
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Counter */}
                        <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700">
                          <button
                            onClick={() =>
                              updateQuantity(item.posterId, item.size, item.quantity - 1)
                            }
                            className="px-2 py-1 text-gray-400 hover:text-white transition cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.posterId, item.size, item.quantity + 1)
                            }
                            className="px-2 py-1 text-gray-400 hover:text-white transition cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-black text-white">
                          ₹{(item.unitPrice * item.quantity).toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => removeFromCart(item.posterId, item.size)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
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
              <div className="p-6 border-t border-gray-800 bg-gray-900/90 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-gray-800">
                    <span>Total</span>
                    <span className="text-amber-400">₹{totalAmount.toFixed(0)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-gray-950" />
                  <span>Checkout via WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-center text-gray-400">
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
