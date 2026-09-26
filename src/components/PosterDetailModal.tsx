"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Check, ShoppingCart, MessageCircle, Sparkles, Shield, Truck } from "lucide-react";
import { Poster, PosterSize } from "@/types";
import { useCart } from "@/context/CartContext";
import { generateWhatsAppOrderUrl } from "@/utils/whatsapp";

interface PosterDetailModalProps {
  poster: Poster | null;
  onClose: () => void;
  onOpenCheckoutDirect?: (orderPayload: any) => void;
}

export const PosterDetailModal: React.FC<PosterDetailModalProps> = ({
  poster,
  onClose,
}) => {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedSize, setSelectedSize] = useState<PosterSize>(
    poster?.sizes[0] || { name: "A4", dimensions: "8.3 x 11.7 in", priceMultiplier: 1.0 }
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!poster) return null;

  const unitPrice = Math.round(poster.base_price * selectedSize.priceMultiplier);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(
      {
        posterId: poster.id,
        title: poster.title,
        size: selectedSize.name,
        dimensions: selectedSize.dimensions,
        unitPrice: unitPrice,
        imageUrl: poster.image_url,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 800);
  };

  const handleDirectWhatsAppBuy = () => {
    const singleItemOrder = {
      orderNumber: `WCH-DIR-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: {
        name: "Customer",
        phone: "N/A",
        address: "Please specify delivery address in chat",
        city: "",
        pincode: "",
      },
      items: [
        {
          posterId: poster.id,
          title: poster.title,
          size: selectedSize.name,
          dimensions: selectedSize.dimensions,
          unitPrice: unitPrice,
          quantity: quantity,
          imageUrl: poster.image_url,
        },
      ],
      subtotal: totalPrice,
      shippingCost: 0,
      totalAmount: totalPrice,
      status: "pending_whatsapp" as const,
    };

    const { url } = generateWhatsAppOrderUrl(singleItemOrder);
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Poster Showcase Preview */}
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-950 shadow-2xl border-4 border-gray-800/40">
            <Image
              src={poster.image_url}
              alt={poster.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-3 left-3 right-3 py-1.5 px-3 rounded-lg bg-gray-950/80 backdrop-blur-md border border-white/10 text-[11px] text-gray-300 text-center font-medium">
              300 GSM Heavyweight Matte Finish • Archival Quality
            </div>
          </div>

          {/* Details & Customization Column */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Featured */}
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                  {poster.category}
                </span>
                {poster.is_featured && (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Bestseller
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                {poster.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-300 leading-relaxed mb-6 font-normal">
                {poster.description}
              </p>

              {/* Size Configuration */}
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                  Select Size & Dimensions:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {poster.sizes.map((sz) => {
                    const isSelected = selectedSize.name === sz.name;
                    const price = Math.round(poster.base_price * sz.priceMultiplier);
                    return (
                      <button
                        key={sz.name}
                        onClick={() => setSelectedSize(sz)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500 text-white shadow-sm ring-1 ring-amber-500"
                            : "bg-gray-800/50 border-gray-700/80 text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-white">{sz.name}</span>
                          <span className="text-xs font-bold text-amber-400">₹{price}</span>
                        </div>
                        <span className="text-[11px] text-gray-400 block mt-0.5">
                          {sz.dimensions}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-gray-700 transition cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-gray-300 hover:text-white hover:bg-gray-700 transition cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 mb-6 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Total Amount</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">₹{totalPrice}</span>
                    <span className="text-xs text-emerald-400 font-semibold">• Free Shipping</span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-gray-400">
                  <span>₹{unitPrice} × {quantity} {selectedSize.name} Print</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  added
                    ? "bg-emerald-500 text-gray-950"
                    : "bg-amber-500 hover:bg-amber-400 text-gray-950 shadow-lg shadow-amber-500/20"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDirectWhatsAppBuy}
                className="w-full py-3 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant Checkout on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
