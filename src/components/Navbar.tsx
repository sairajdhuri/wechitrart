"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Heart, ShoppingCart, ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-[#111111] text-white relative z-50">
        <div className="max-w-[1600px] w-full mx-auto px-5 sm:px-12 lg:px-24 h-[70px] sm:h-[85px] flex items-center justify-between relative">
          
          {/* Logo — overlapping the navbar bottom edge */}
          {/* Scaled down on mobile to prevent taking too much vertical space */}
          <Link href="/" className="absolute left-5 sm:left-12 lg:left-24 top-2 sm:top-2 z-50">
            <div className="relative w-[90px] h-[90px] sm:w-[130px] sm:h-[130px] rounded-full overflow-hidden bg-black shadow-lg">
              <Image
                src="/logo1.png"
                alt="Wechitrart"
                fill
                className="object-cover scale-[1.05]"
                priority
              />
            </div>
          </Link>

          {/* Spacer for absolute logo */}
          <div className="w-[90px] sm:w-[130px] shrink-0"></div>

          {/* Center Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-10 text-[11px] font-bold tracking-[0.15em] uppercase ml-12">
            <Link href="/" className="hover:opacity-70 transition">Home</Link>
            <button 
              onClick={() => router.push("/posters")} 
              className="flex items-center gap-1.5 hover:opacity-70 transition cursor-pointer bg-transparent border-none text-[11px] font-bold tracking-[0.15em] uppercase text-white p-0"
            >
              Posters <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            <Link href="/" className="hover:opacity-70 transition">Custom Products</Link>
            <Link href="/" className="hover:opacity-70 transition">Reviews</Link>
            <button className="flex items-center gap-1.5 hover:opacity-70 transition cursor-pointer bg-transparent border-none text-[11px] font-bold tracking-[0.15em] uppercase text-white p-0">
              Customer Support <ChevronDown className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-5 sm:gap-7 ml-auto">
            <Search className="w-5 h-5 stroke-[1.5] cursor-pointer hover:opacity-70 transition hidden sm:block" />
            <Heart className="w-5 h-5 stroke-[1.5] cursor-pointer hover:opacity-70 transition hidden sm:block" />
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative cursor-pointer hover:opacity-70 transition bg-transparent border-none p-0 text-white"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-5 h-5 stroke-[1.5]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-white text-black text-[9px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden ml-2 text-white bg-transparent border-none p-0"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black text-white flex flex-col pt-6 px-6">
          <div className="flex justify-end mb-10">
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white bg-transparent border-none p-2"
            >
              <X className="w-8 h-8 stroke-[1.5]" />
            </button>
          </div>
          <nav className="flex flex-col gap-8 text-[16px] font-bold tracking-[0.15em] uppercase">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <button 
              onClick={() => { setMobileMenuOpen(false); router.push("/posters"); }}
              className="text-left bg-transparent border-none text-[16px] font-bold tracking-[0.15em] uppercase text-white p-0"
            >
              Posters
            </button>
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Custom Products</Link>
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Reviews</Link>
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Customer Support</Link>
          </nav>
        </div>
      )}
    </>
  );
};
