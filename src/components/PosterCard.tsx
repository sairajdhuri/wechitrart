"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Poster, PosterSize } from "@/types";
import { useCart } from "@/context/CartContext";

interface PosterCardProps {
  poster: Poster;
  onQuickView: (poster: Poster) => void;
}

export const PosterCard: React.FC<PosterCardProps> = ({ poster, onQuickView }) => {
  const { addToCart } = useCart();
  const [selectedSize] = useState<PosterSize>(
    poster.sizes[0] || { name: "A4", dimensions: "8.3 x 11.7 in", priceMultiplier: 1.0 }
  );

  const calculatedPrice = Math.round(poster.base_price * selectedSize.priceMultiplier);

  const handleCardClick = () => {
    onQuickView(poster);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col items-center cursor-pointer mb-8"
    >
      {/* Visual Poster Frame Container */}
      <div className="relative aspect-[3/4] w-full rounded shadow-sm overflow-hidden bg-white border border-gray-100 mb-4 transition-transform duration-300 group-hover:shadow-md">
        <Image
          src={poster.image_url}
          alt={poster.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
        
        {/* Quick Add overlay */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
           <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(
                {
                  posterId: poster.id,
                  title: poster.title,
                  size: selectedSize.name,
                  dimensions: selectedSize.dimensions,
                  unitPrice: calculatedPrice,
                  imageUrl: poster.image_url,
                },
                1
              );
            }}
            className="px-6 py-2 bg-black text-white text-xs font-semibold rounded-full shadow-lg hover:bg-gray-800 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="text-center w-full px-2">
        <h3 className="text-[13px] font-medium text-gray-900 mb-1 line-clamp-2">
          {poster.title}
        </h3>
        <p className="text-[13px] font-semibold text-gray-700">
          Rs. {calculatedPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

