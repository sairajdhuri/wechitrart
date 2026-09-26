"use client";

import React from "react";
import { Sparkles, Palette, Film, Compass, Leaf, Clock, LayoutGrid } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categoryCounts: Record<string, number>;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <LayoutGrid className="w-3.5 h-3.5" />,
  Anime: <Sparkles className="w-3.5 h-3.5" />,
  Abstract: <Palette className="w-3.5 h-3.5" />,
  Cinema: <Film className="w-3.5 h-3.5" />,
  Minimalist: <Compass className="w-3.5 h-3.5" />,
  Nature: <Leaf className="w-3.5 h-3.5" />,
  Vintage: <Clock className="w-3.5 h-3.5" />,
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="w-full flex items-center justify-start md:justify-center overflow-x-auto py-2 px-1 scrollbar-none gap-2">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        const icon = CATEGORY_ICONS[cat] || <Sparkles className="w-3.5 h-3.5" />;
        const count = categoryCounts[cat] || 0;

        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              isSelected
                ? "bg-amber-500 text-gray-950 shadow-md shadow-amber-500/25 scale-[1.02]"
                : "bg-gray-900/80 text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-800"
            }`}
          >
            <span>{icon}</span>
            <span>{cat}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected
                  ? "bg-gray-950/20 text-gray-950 font-black"
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
