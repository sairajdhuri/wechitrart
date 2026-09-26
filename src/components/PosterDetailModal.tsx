"use client";

import React, { useState, useEffect } from "react";
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
  const [selectedSize, setSelectedSize] = useState<PosterSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (poster && poster.sizes.length > 0) {
      setSelectedSize(poster.sizes[0]);
      setQuantity(1);
      setAdded(false);
    }
  }, [poster]);

  if (!poster || !selectedSize) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded bg-white shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Poster Showcase Preview */}
          <div className="relative aspect-[3/4] w-full rounded overflow-hidden bg-gray-50 shadow-sm border border-gray-200">
            <Image
              src={poster.image_url}
              alt={poster.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Details & Customization Column */}
          <div className="flex flex-col justify-between text-black">
            <div>
              {/* Category */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  {poster.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                {poster.title}
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-6 font-normal">
                {poster.description}
              </p>

              <div className="text-3xl font-semibold mb-6">
                Rs. {unitPrice.toFixed(2)}
              </div>

              {/* Size Configuration */}
              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider block mb-2">
                  Size:
                </label>
                <div className="flex flex-col gap-2.5">
                  {poster.sizes.map((sz) => {
                    const isSelected = selectedSize.name === sz.name;
                    return (
                      <button
                        key={sz.name}
                        onClick={() => setSelectedSize(sz)}
                        className={`p-3 rounded border text-left transition-all cursor-pointer flex justify-between items-center ${
                          isSelected
                            ? "border-black bg-black text-white"
                            : "bg-white border-gray-300 text-gray-700 hover:border-black"
                        }`}
                      >
                        <span className="text-sm font-semibold">{sz.name}</span>
                        {/* <span className="text-sm opacity-80">{sz.dimensions}</span> */}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Quantity:
                </span>
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-200 transition cursor-pointer font-bold text-lg"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2 text-gray-600 hover:text-black hover:bg-gray-200 transition cursor-pointer font-bold text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded font-bold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  added
                    ? "bg-green-600 text-white"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDirectWhatsAppBuy}
                className="w-full py-3.5 rounded bg-white hover:bg-gray-50 text-black border border-black font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-green-600" />
                <span>Buy Now on WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

