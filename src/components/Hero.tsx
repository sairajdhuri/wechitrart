"use client";

import React from "react";
import { MessageCircle, ShieldCheck, Sparkles, Truck, Layers, CheckCircle2 } from "lucide-react";

interface HeroProps {
  onExploreClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20">
      {/* Ambient gradient backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-purple-600/10 to-cyan-500/10 blur-[130px] rounded-full pointer-events-none glow-ambient" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Banner Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide uppercase mb-6 shadow-sm">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Direct WhatsApp Checkout • Zero Payment Gateway Friction</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Curated Statement Art for{" "}
          <span className="text-gradient-amber">Elevated Spaces</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
          Explore museum-grade archival prints crafted on heavy 300 GSM matte paper.
          Choose your size, add to cart, and chat directly with our studio on WhatsApp to complete your order.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={onExploreClick}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Designs</span>
          </button>

          <a
            href="https://wa.me/919867241008?text=Hi%20Wechitrart!%20I%20would%20like%20to%20inquire%20about%20a%20custom%20poster%20design%20or%20framing."
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-700/80 hover:border-gray-600 text-white font-semibold text-sm transition-all duration-200 flex items-center gap-2.5"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Chat Custom Order</span>
          </a>
        </div>

        {/* Value Propositions / Trust Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 border-t border-gray-800/80">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800/60 text-left">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">300 GSM Archival</p>
              <p className="text-[11px] text-gray-400">Ultra-vibrant matte</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800/60 text-left">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Instant WhatsApp</p>
              <p className="text-[11px] text-gray-400">Personalized checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800/60 text-left">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Free Safe Shipping</p>
              <p className="text-[11px] text-gray-400">Reinforced flat tube</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800/60 text-left">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Ready-to-Frame</p>
              <p className="text-[11px] text-gray-400">Standard A4, A3, A2</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
