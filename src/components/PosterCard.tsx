"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Check, Eye, Sparkles } from "lucide-react";
import { Poster, PosterSize } from "@/types";
import { useCart } from "@/context/CartContext";

interface PosterCardProps {
  poster: Poster;
  onQuickView: (poster: Poster) => void;
}

export const PosterCard: React.FC<PosterCardProps> = ({ poster, onQuickView }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<PosterSize>(
    poster.sizes[0] || { name: "A4", dimensions: "8.3 x 11.7 in", priceMultiplier: 1.0 }
  );
  const [added, setAdded] = useState(false);

  const calculatedPrice = Math.round(poster.base_price * selectedSize.priceMultiplier);

  const handleAddToCart = (e: React.MouseEvent) => {
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

    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div
      onClick={() => onQuickView(poster)}
      className="group relative rounded-2xl bg-gray-900/60 border border-gray-800/80 hover:border-amber-500/40 p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer overflow-hidden"
    >
      {/* Visual Poster Frame Container */}
      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gray-950 shadow-inner mb-4">
        {/* Poster Image */}
        <Image
          src={poster.image_url}
          alt={poster.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(poster);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-gray-950 text-xs font-bold shadow-lg hover:bg-white transition-all transform scale-90 group-hover:scale-100"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-md bg-gray-950/80 backdrop-blur-md text-[10px] font-bold text-gray-200 border border-white/10 uppercase tracking-wider">
            {poster.category}
          </span>
          {poster.is_featured && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-[10px] font-black text-gray-950 shadow-sm flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5 fill-gray-950" />
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Details & Controls */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-1">
            {poster.title}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-2 mb-3">
            {poster.description}
          </p>
        </div>

        {/* Size Selector Pills */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Select Size
            </span>
            <span className="text-[10px] text-gray-400">
              {selectedSize.dimensions}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {poster.sizes.map((sz) => (
              <button
                key={sz.name}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(sz);
                }}
                className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedSize.name === sz.name
                    ? "bg-amber-500 text-gray-950 shadow-sm"
                    : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 border border-gray-700"
                }`}
              >
                {sz.name}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <div>
            <span className="text-[10px] text-gray-400 block">Price</span>
            <span className="text-lg font-black text-white">
              ₹{calculatedPrice}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              added
                ? "bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20"
                : "bg-amber-500 hover:bg-amber-400 text-gray-950 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
