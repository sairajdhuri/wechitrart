"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  MessageCircle,
  Truck,
  ShieldCheck,
  Layers,
  Heart,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Poster } from "@/types";
import { getPosters } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PosterCard } from "@/components/PosterCard";
import { PosterDetailModal } from "@/components/PosterDetailModal";
import { CartDrawer } from "@/components/CartDrawer";

const ALL_CATEGORIES = [
  "All",
  "Anime",
  "Abstract",
  "Cinema",
  "Minimalist",
  "Nature",
  "Vintage",
];

export default function HomePage() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewPoster, setQuickViewPoster] = useState<Poster | null>(null);

  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPosters() {
      try {
        const data = await getPosters();
        setPosters(data);
      } catch (err) {
        console.error("Failed to load posters", err);
      } finally {
        setLoading(false);
      }
    }
    loadPosters();
  }, []);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: posters.length };
    ALL_CATEGORIES.forEach((cat) => {
      if (cat !== "All") {
        counts[cat] = posters.filter(
          (p) => p.category.toLowerCase() === cat.toLowerCase()
        ).length;
      }
    });
    return counts;
  }, [posters]);

  // Filtered posters
  const filteredPosters = useMemo(() => {
    return posters.filter((poster) => {
      const matchesCategory =
        selectedCategory === "All" ||
        poster.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        poster.title.toLowerCase().includes(q) ||
        poster.description.toLowerCase().includes(q) ||
        poster.category.toLowerCase().includes(q) ||
        poster.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [posters, selectedCategory, searchQuery]);

  // Featured posters for highlight row
  const featuredPosters = useMemo(() => {
    return posters.filter((p) => p.is_featured).slice(0, 4);
  }, [posters]);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-gray-100">
      {/* Navigation */}
      <Navbar
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Hero Section */}
      <Hero onExploreClick={scrollToGallery} />

      {/* Main Content Area */}
      <main ref={galleryRef} className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Category Filter Pills */}
        <div className="mb-8">
          <CategoryFilter
            categories={ALL_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categoryCounts={categoryCounts}
          />
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {selectedCategory === "All"
                  ? "Explore All Art Prints"
                  : `${selectedCategory} Collection`}
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                {filteredPosters.length} designs
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Select any size (A4, A3, A2) to calculate instant price and add to cart.
            </p>
          </div>

          {searchQuery && (
            <div className="text-xs text-gray-400 bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800">
              Showing results for: <span className="text-amber-400 font-bold">&quot;{searchQuery}&quot;</span>
              <button
                onClick={() => setSearchQuery("")}
                className="ml-2 text-gray-500 hover:text-white"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Poster Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-gray-900/60 border border-gray-800 p-4 animate-pulse aspect-[3/4]"
              />
            ))}
          </div>
        ) : filteredPosters.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/40 rounded-3xl border border-gray-800 p-8">
            <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No designs found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
              We couldn&apos;t find any art posters matching your current filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 text-gray-950 font-bold text-xs hover:bg-amber-400 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosters.map((poster) => (
              <PosterCard
                key={poster.id}
                poster={poster}
                onQuickView={setQuickViewPoster}
              />
            ))}
          </div>
        )}

        {/* Studio Specs & Quality Banner */}
        <section className="mt-20 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-900/80 to-amber-950/20 border border-gray-800 p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              Archival Standards
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              Crafted to Outlast Ordinary Posters
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed mb-6 font-normal">
              Every print at Wechitrart is produced using 12-color pigment-based giclée inks on heavyweight 300 GSM matte archival paper. Deep velvety blacks, zero glaring reflections, and guaranteed fade resistance.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-800">
              <div>
                <p className="text-base font-black text-white">300 GSM</p>
                <p className="text-[11px] text-gray-400">Archival art card</p>
              </div>
              <div>
                <p className="text-base font-black text-white">Pigment Ink</p>
                <p className="text-[11px] text-gray-400">12-color ultra-vibrant</p>
              </div>
              <div>
                <p className="text-base font-black text-white">0% Plastic</p>
                <p className="text-[11px] text-gray-400">Eco-conscious packaging</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-800 bg-gray-950/80 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-gray-950 font-black text-sm">
                  W
                </div>
                <span className="font-black text-lg text-white tracking-tight">
                  WECHITRART STUDIO
                </span>
              </div>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed mb-4">
                Curated statement art and museum-grade wall decor. Hand-inspected and flat-packed in India. Direct ordering via WhatsApp.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold hover:bg-emerald-500/20 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp: +91 9876543210</span>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Popular Categories
              </h4>
              <ul className="space-y-2 text-xs text-gray-400">
                {ALL_CATEGORIES.slice(1).map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        scrollToGallery();
                      }}
                      className="hover:text-amber-400 transition cursor-pointer"
                    >
                      {cat} Posters
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Store Operations
              </h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>
                  <Link href="/admin" className="hover:text-amber-400 transition flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Design Portal</span>
                  </Link>
                </li>
                <li>Free Safe Delivery across India</li>
                <li>Standard Sizes: A4, A3, A2</li>
                <li>Secure WhatsApp Checkout</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
            <p>© {new Date().getFullYear()} Wechitrart Studio. All rights reserved.</p>
            <p>Built with Next.js, React, TypeScript, Supabase & WhatsApp Direct API.</p>
          </div>
        </div>
      </footer>

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <PosterDetailModal
        poster={quickViewPoster}
        onClose={() => setQuickViewPoster(null)}
      />
    </div>
  );
}
