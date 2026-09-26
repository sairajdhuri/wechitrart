"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Poster } from "@/types";
import { getPosters } from "@/lib/supabase";
import { PosterCard } from "@/components/PosterCard";
import { PosterDetailModal } from "@/components/PosterDetailModal";
import { CartDrawer } from "@/components/CartDrawer";
import { Navbar } from "@/components/Navbar";

const CATEGORIES = ["Movies", "Sports", "Music", "Quotes", "Superhero"];

function PostersContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "Movies";

  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [quickViewPoster, setQuickViewPoster] = useState<Poster | null>(null);

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

  const filteredPosters = useMemo(() => {
    return posters.filter((poster) => {
      const matchesCategory = selectedCategory
        ? poster.category.toLowerCase() === selectedCategory.toLowerCase()
        : true;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        poster.title.toLowerCase().includes(q) ||
        poster.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [posters, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <Navbar />

      {/* ============================== */}
      {/*        SHOP SECTION            */}
      {/* ============================== */}
      <div className="pt-12 pb-6 text-center bg-[#f8f8f8]">
        <h2 className="text-3xl font-[900] uppercase tracking-[-0.02em] text-[#111]">Our Collection</h2>
        <p className="text-[#666] mt-2 text-[14px]">Explore premium prints selected for you.</p>
      </div>

      <main className="flex-1 max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-24 py-12 flex gap-12">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-[240px] shrink-0">
          <div className="mb-6">
            <h3 className="font-bold text-[11px] tracking-[0.1em] uppercase text-[#111] mb-5">Categories</h3>
            <div className="text-[14px]">
              <div className="font-semibold mb-3 text-[#111]">Posters</div>
              <div className="pl-4 space-y-2 text-[#666]">
                {CATEGORIES.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer hover:text-[#111] transition-colors ${
                      selectedCategory.toLowerCase() === cat.toLowerCase() ? "text-[#111] font-semibold" : ""
                    }`}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 w-full min-w-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[12px] text-[#888] mb-8">
            <Link href="/" className="hover:text-[#111] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#111] font-medium">{selectedCategory}</span>
          </div>

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <h1 className="text-[24px] font-bold uppercase tracking-[-0.01em] text-[#111]">{selectedCategory}</h1>
            <div className="flex items-center gap-2 cursor-pointer hover:text-[#111] transition-colors text-[13px] text-[#666] mt-4 sm:mt-0 font-medium">
              <span>Best selling</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Poster Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-gray-100 aspect-[3/4] animate-pulse rounded-sm" />
              ))}
            </div>
          ) : filteredPosters.length === 0 ? (
            <div className="text-center py-24 text-[#666]">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filteredPosters.map((poster) => (
                <PosterCard key={poster.id} poster={poster} onQuickView={setQuickViewPoster} />
              ))}
            </div>
          )}
        </section>
      </main>

      <CartDrawer />
      <PosterDetailModal poster={quickViewPoster} onClose={() => setQuickViewPoster(null)} />
    </div>
  );
}

export default function PostersPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Loading...</div>}>
      <PostersContent />
    </Suspense>
  );
}
