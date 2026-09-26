"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, ShieldCheck, Search, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchChange,
}) => {
  const { totalItemsCount, setIsCartOpen, subtotal } = useCart();
  const [searchVal, setSearchVal] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearchChange?.(e.target.value);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-gray-950 fill-gray-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  WECHITRART
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide">
                Archival Wall Art & Prints
              </p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchVal}
                onChange={handleSearch}
                placeholder="Search cyberpunk, botanical, abstract, anime..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-900/80 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all"
              />
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Admin Dashboard Link */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800 transition-all"
              title="Admin Design Portal"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Admin Portal</span>
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 cursor-pointer"
              aria-label="View shopping cart"
            >
              <ShoppingCart className="w-4 h-4 text-gray-950" />
              <span className="hidden sm:inline">Cart</span>
              {totalItemsCount > 0 && (
                <span className="flex items-center justify-center bg-gray-950 text-amber-400 text-xs font-black px-2 py-0.5 rounded-full shadow-inner">
                  {totalItemsCount}
                </span>
              )}
              {totalItemsCount > 0 && (
                <span className="hidden lg:inline text-xs opacity-90 pl-1 border-l border-gray-950/20">
                  ₹{subtotal.toFixed(0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchVal}
              onChange={handleSearch}
              placeholder="Search poster designs..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900/90 border border-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
