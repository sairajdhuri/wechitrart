"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown, ArrowRight,
  Search, Heart, ShoppingCart,
  Film, Trophy, Music2, Quote, Shield,
  ShieldCheck, Truck, Star, Lock
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  const navigateToShop = (category?: string) => {
    if (category) {
      router.push(`/posters?category=${encodeURIComponent(category)}`);
    } else {
      router.push("/posters");
    }
  };

  const CATEGORIES = [
    { name: "Movies", icon: Film },
    { name: "Sports", icon: Trophy },
    { name: "Music", icon: Music2 },
    { name: "Quotes", icon: Quote },
    { name: "Superhero", icon: Shield },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      
      <Navbar />

      {/* ============================== */}
      {/*   HERO SECTION                 */}
      {/* ============================== */}
      <section className="relative w-full min-h-[75vh] flex bg-[#f2efe9] overflow-hidden">
        
        {/* Right side background image */}
        <div className="absolute top-0 right-0 bottom-0 w-full md:w-[65%] lg:w-[60%] z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Poster collection display"
            fill
            className="object-cover object-right"
            priority
          />
          {/* Gradient to smoothly blend the image into the solid background color on the left.
              On mobile, the gradient covers more of the image to keep text readable. */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f2efe9] via-[#f2efe9]/90 to-[#f2efe9]/40 sm:to-transparent w-full sm:w-[50%]" />
        </div>

        {/* Hero Text Content — left side */}
        <div className="relative z-10 max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-24 flex items-center pt-24 pb-16">
          <div className="max-w-[500px]">
            {/* Overline */}
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[1px] bg-gray-500" />
              <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase">
                Premium Posters for Every Passion
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-[clamp(3rem,6vw,5.5rem)] font-[900] uppercase leading-[0.95] tracking-[-0.03em] text-[#111111] mb-6">
              Posters That<br />
              Speak Your<br />
              Language.
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] text-[#444] mb-10 leading-[1.6] max-w-[400px]">
              Movies, Music, Sports, Quotes and more.<br />
              Find the perfect poster for your vibe.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => navigateToShop()}
              className="inline-flex items-center gap-4 bg-[#111] text-white px-8 py-[18px] text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#333] transition-colors cursor-pointer border-none"
            >
              Shop Posters
              <ArrowRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/*      CATEGORIES BAR            */}
      {/* ============================== */}
      <section className="w-full bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-2 md:grid-cols-5">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => navigateToShop(cat.name)}
                className={`flex items-center justify-between py-6 px-6 sm:py-7 sm:px-8 cursor-pointer group hover:bg-gray-50 transition-colors bg-transparent border-none text-[#111] 
                  border-b sm:border-b-0 border-gray-150
                  ${i % 2 !== 0 ? "border-l border-gray-150 sm:border-l-0" : ""}
                  ${i < CATEGORIES.length - 1 ? "md:border-r md:border-gray-150" : ""} 
                  ${i === 0 ? "sm:pl-0" : ""}
                  ${i === CATEGORIES.length - 1 ? "col-span-2 md:col-span-1 border-b-0" : ""}`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <cat.icon className="w-5 h-5 sm:w-[26px] sm:h-[26px] stroke-[1.5]" />
                  <span className="font-semibold text-[14px] sm:text-[15px]">{cat.name}</span>
                </div>
                <ArrowRight className="w-4 h-4 stroke-[1.5] text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/*        FEATURES BAR            */}
      {/* ============================== */}
      <section className="w-full bg-[#f8f8f8] border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "High Quality Prints", desc: "Vibrant colours. Long lasting.", icon: ShieldCheck },
              { title: "Pan India Delivery", desc: "Fast & reliable shipping.", icon: Truck },
              { title: "Loved by 10,000+ Customers", desc: "Real reviews. Real people.", icon: Star },
              { title: "Secure Checkout", desc: "100% safe & trusted.", icon: Lock },
            ].map((f, i) => (
              <div
                key={f.title}
                className={`flex items-center gap-4 ${
                  i < 3 ? "lg:border-r lg:border-gray-200 lg:pr-8" : ""
                }`}
              >
                <f.icon className="w-[28px] h-[28px] stroke-[1.2] text-[#111] shrink-0" />
                <div>
                  <div className="font-bold text-[13px] text-[#111] mb-0.5">{f.title}</div>
                  <div className="text-[12px] text-[#666]">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Icon */}
      <a
        href="https://wa.me/919867241008"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>

      {/* Global Interactive Overlays */}
      <CartDrawer />
    </div>
  );
}
