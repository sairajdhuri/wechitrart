"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Upload,
  Plus,
  Trash2,
  Package,
  Layers,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Database,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { Poster, Order } from "@/types";
import { DEFAULT_SIZES } from "@/data/initialPosters";
import {
  getPosters,
  createPoster,
  deletePoster,
  getOrders,
  isSupabaseConfigured,
} from "@/lib/supabase";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"upload" | "catalog" | "orders">("upload");
  const [posters, setPosters] = useState<Poster[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Upload Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState(499);
  const [category, setCategory] = useState("Anime");
  const [customCategory, setCustomCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const expectedPasscode = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "wechitrart2026";
  const supabaseActive = isSupabaseConfigured();

  // Check session storage
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("wechitrart_admin_auth");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch posters and orders once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedPosters, fetchedOrders] = await Promise.all([
        getPosters(),
        getOrders(),
      ]);
      setPosters(fetchedPosters);
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === expectedPasscode) {
      setIsAuthenticated(true);
      sessionStorage.setItem("wechitrart_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect admin passcode. Default is 'wechitrart2026'");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("wechitrart_admin_auth");
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePoster = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalImageUrl = imageUrl || imagePreview;

    if (!title.trim()) {
      alert("Please provide a title");
      return;
    }
    if (!finalImageUrl) {
      alert("Please provide an image URL or upload an image file");
      return;
    }

    const finalCategory = category === "Custom" ? customCategory.trim() : category;
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setLoading(true);
    try {
      const created = await createPoster({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description: description || "Exclusive archival art poster printed on 300 GSM matte stock.",
        base_price: Number(basePrice),
        category: finalCategory || "Art",
        image_url: finalImageUrl,
        sizes: DEFAULT_SIZES,
        is_featured: isFeatured,
        stock_status: "in_stock",
        tags: tagArray.length > 0 ? tagArray : [finalCategory],
      });

      setPosters((prev) => [created, ...prev]);
      setSuccessMessage(`Poster "${title}" uploaded successfully!`);

      // Reset form
      setTitle("");
      setDescription("");
      setBasePrice(499);
      setImageUrl("");
      setImagePreview("");
      setTags("");
      setIsFeatured(false);

      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error("Poster creation error", err);
      alert("Failed to upload poster.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoster = async (id: string, posterTitle: string) => {
    if (confirm(`Are you sure you want to delete "${posterTitle}"?`)) {
      await deletePoster(id);
      setPosters((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // 1. Passcode Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#090d16]">
        <div className="w-full max-w-md p-8 rounded-3xl bg-gray-900 border border-gray-800 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight mb-1">
            Wechitrart Studio Admin
          </h1>
          <p className="text-xs text-gray-400 mb-6">
            Enter your management passcode to upload designs and view WhatsApp orders.
          </p>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode (Default: wechitrart2026)"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-center tracking-widest"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              Access Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Admin Dashboard
  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 glass-nav border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Storefront</span>
            </Link>
            <span className="text-gray-700">|</span>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm tracking-wide">
                WECHITRART ADMIN
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  supabaseActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                <Database className="w-3 h-3" />
                {supabaseActive ? "Supabase Connected" : "Local Demo Mode"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 gap-4 mb-8">
          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 transition cursor-pointer border-b-2 ${
              activeTab === "upload"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Design</span>
          </button>

          <button
            onClick={() => setActiveTab("catalog")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 transition cursor-pointer border-b-2 ${
              activeTab === "catalog"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Poster Catalog ({posters.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 text-sm font-bold flex items-center gap-2 transition cursor-pointer border-b-2 ${
              activeTab === "orders"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp Orders ({orders.length})</span>
          </button>
        </div>

        {/* Tab 1: Upload New Design */}
        {activeTab === "upload" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 rounded-3xl bg-gray-900 border border-gray-800 p-6 sm:p-8">
              <h2 className="text-xl font-black text-white mb-1">
                Upload Poster Design
              </h2>
              <p className="text-xs text-gray-400 mb-6">
                Publish a new art print. Designs immediately appear in the customer catalog with A4, A3, and A2 size calculations.
              </p>

              <form onSubmit={handleCreatePoster} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Poster Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Cyberpunk Shinjuku Nights"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Anime">Anime & Cyberpunk</option>
                      <option value="Abstract">Abstract & Contemporary</option>
                      <option value="Cinema">Cinema & Sci-Fi</option>
                      <option value="Minimalist">Minimalist & Bauhaus</option>
                      <option value="Nature">Nature & Botanical</option>
                      <option value="Vintage">Vintage & Retro</option>
                      <option value="Custom">Custom Category...</option>
                    </select>
                  </div>

                  {category === "Custom" && (
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">
                        Custom Category Name
                      </label>
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g. Gaming"
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-gray-300 block mb-1">
                      Base Price (INR ₹ for A4 standard) *
                    </label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      min="99"
                      step="10"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Poster Image (Direct High-Res URL or File Upload) *
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/... or paste image URL"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white focus:outline-none focus:border-amber-500 mb-2"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">Or upload image file:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-amber-400 hover:file:bg-gray-700 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Artwork Description / Story
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe color palettes, mood, and printing details..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Cyberpunk, Neon, Wall Decor, Dark Aesthetic"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-gray-800 border-gray-700 cursor-pointer"
                  />
                  <label htmlFor="isFeatured" className="text-xs font-bold text-white cursor-pointer flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Feature this poster in store highlights & hero
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{loading ? "Publishing Design..." : "Publish Poster Design"}</span>
                </button>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="rounded-3xl bg-gray-900 border border-gray-800 p-6 flex flex-col items-center justify-start text-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block">
                Live Card Preview
              </span>

              <div className="w-full max-w-[260px] aspect-[3/4] rounded-2xl bg-gray-950 border border-gray-800 overflow-hidden relative shadow-2xl mb-4">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 p-4">
                    <Layers className="w-12 h-12 mb-2 stroke-1" />
                    <span className="text-xs">No image provided yet</span>
                  </div>
                )}
                {isFeatured && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-amber-500 text-[10px] font-black text-gray-950 uppercase">
                    Featured
                  </div>
                )}
              </div>

              <h4 className="font-bold text-white text-base mb-1">
                {title || "Untitled Poster"}
              </h4>
              <p className="text-xs text-amber-400 font-bold mb-3">
                Starts at ₹{basePrice} (A4)
              </p>
              <div className="w-full pt-3 border-t border-gray-800 text-[11px] text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>A4 (8.3 x 11.7 in):</span>
                  <span className="font-bold text-white">₹{basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>A3 (11.7 x 16.5 in):</span>
                  <span className="font-bold text-white">₹{Math.round(basePrice * 1.5)}</span>
                </div>
                <div className="flex justify-between">
                  <span>A2 (16.5 x 23.4 in):</span>
                  <span className="font-bold text-white">₹{Math.round(basePrice * 2.2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Poster Catalog */}
        {activeTab === "catalog" && (
          <div className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">Active Designs</h2>
                <p className="text-xs text-gray-400">Total {posters.length} posters published</p>
              </div>
              <button
                onClick={() => setActiveTab("upload")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 text-gray-950 font-bold text-xs hover:bg-amber-400 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Design</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-800/60 text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800">
                  <tr>
                    <th className="py-3 px-4">Poster</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Base Price</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-200">
                  {posters.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-800/30 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-gray-950 flex-shrink-0">
                          <Image
                            src={p.image_url}
                            alt={p.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white">{p.title}</p>
                          <p className="text-[10px] text-gray-400 line-clamp-1">{p.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-gray-800 text-[11px] font-semibold text-gray-300">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-amber-400 text-sm">
                        ₹{p.base_price}
                      </td>
                      <td className="py-3 px-4">
                        {p.is_featured ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                            Featured
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-500">Standard</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeletePoster(p.id, p.title)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete poster"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Incoming WhatsApp Orders */}
        {activeTab === "orders" && (
          <div className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-lg font-black text-white">WhatsApp Orders</h2>
              <p className="text-xs text-gray-400">
                Customer checkout orders recorded and dispatched to WhatsApp
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16">
                <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="font-bold text-white">No orders yet</p>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  When a customer adds items to cart and clicks checkout, their order record will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-800/60 text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Delivery Address</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-gray-200">
                    {orders.map((o) => (
                      <tr key={o.orderNumber} className="hover:bg-gray-800/30 transition">
                        <td className="py-3 px-4 font-black text-amber-400">
                          #{o.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-white">{o.customer.name}</p>
                          <a
                            href={`https://wa.me/${o.customer.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            {o.customer.phone}
                          </a>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-gray-300">
                          {o.customer.address}, {o.customer.city} - {o.customer.pincode}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="text-[11px] text-gray-300">
                                • {item.quantity}× {item.title} ({item.size})
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-black text-white text-sm">
                          ₹{o.totalAmount}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                            {o.status.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
