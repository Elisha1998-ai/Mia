"use client";

import React, { useState } from 'react';
import { ShoppingBag, Heart, Filter, ChevronDown, Grid, List, Leaf, Zap, Moon, Sun } from 'lucide-react';

export interface ProductListProps {
  isSection?: boolean;
  storeSettings?: {
    primaryColor?: string;
    headingFont?: string;
    bodyFont?: string;
    currency?: string;
    storeName?: string;
  };
  products?: Array<{
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    image?: string;
    category?: string;
    attributes?: string[];
    caffeine?: 'None' | 'Low' | 'Medium' | 'High';
  }>;
}

export default function ProductListWireframeVariant2({ products, storeSettings, isSection = false }: ProductListProps) {
  const getCurrencySymbol = (str?: string) => {
    if (!str) return "£";
    if (str.includes("₦") || str.toLowerCase().includes("naira")) return "₦";
    const match = str.match(/\(([^)]+)\)/);
    if (match) return match[1];
    return str;
  };

  const currency = getCurrencySymbol(storeSettings?.currency);
  const primaryColor = storeSettings?.primaryColor || "#1a365d"; // Premium deep blue/teal default
  const headingFont = storeSettings?.headingFont || "inherit";
  const bodyFont = storeSettings?.bodyFont || "inherit";

  // Mock Data for Premium Beverages
  const defaultProducts = [
    {
      id: "1",
      name: "The Tea Club",
      price: 29.92,
      salePrice: 29.92,
      image: "https://images.unsplash.com/photo-1544787210-2211d7c309c7?auto=format&fit=crop&q=80&w=800",
      category: "Tea Blends",
      attributes: ["Bespoke", "Hand-crafted"],
      caffeine: "Medium" as const
    },
    {
      id: "2",
      name: "Chocolate Chip",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1594631252845-29fc458695d7?auto=format&fit=crop&q=80&w=800",
      category: "Black Tea",
      attributes: ["Sugar Free", "Natural"],
      caffeine: "Medium" as const
    },
    {
      id: "3",
      name: "Gingerbread Vanilla Chai",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1563911892149-178adfc3e672?auto=format&fit=crop&q=80&w=800",
      category: "Rooibos Tea",
      attributes: ["Warming", "Spiced"],
      caffeine: "None" as const
    },
    {
      id: "4",
      name: "Chamomile Sweet Dreams",
      price: 9.99,
      image: "https://images.unsplash.com/photo-1594631252845-29fc458695d7?auto=format&fit=crop&q=80&w=800",
      category: "Herbal Tea",
      attributes: ["Calming", "Sleep-aid"],
      caffeine: "None" as const
    },
    {
      id: "5",
      name: "Japanese Sencha Green",
      price: 11.99,
      image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=800",
      category: "Green Tea",
      attributes: ["Antioxidant", "Pure"],
      caffeine: "Medium" as const
    },
    {
      id: "6",
      name: "Darjeeling Black",
      price: 8.99,
      image: "https://images.unsplash.com/photo-1594631252845-29fc458695d7?auto=format&fit=crop&q=80&w=800",
      category: "Black Tea",
      attributes: ["Floral", "Classic"],
      caffeine: "High" as const
    }
  ];

  const displayProducts = products && products.length > 0 ? products : defaultProducts;
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Focus & Energy', 'Sleep & Relax', 'Wellness & Mood'];

  const getCaffeineIcon = (level?: string) => {
    switch (level) {
      case 'High': return <Zap className="w-3 h-3" />;
      case 'Medium': return <Sun className="w-3 h-3" />;
      case 'Low': return <Sun className="w-3 h-3 opacity-50" />;
      case 'None': return <Moon className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className={`w-full ${isSection ? '' : 'min-h-full no-scrollbar'} bg-[#fcfcf9]`} style={{ fontFamily: bodyFont }}>
      {/* Premium Header */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-light tracking-tight text-[#1a1a1a] mb-4" style={{ fontFamily: headingFont }}>
            Tea Blends
          </h1>
          <p className="text-[#666666] text-sm leading-relaxed mb-8">
            Exceptional loose-leaf blends, created for flavour. Designed around how you drink tea, with something for every moment.
          </p>
          
          {/* Collection Tabs */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-[#1a1a1a] text-white shadow-md' 
                    : 'bg-white text-[#666666] hover:bg-gray-50 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {displayProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative aspect-square mb-6 overflow-hidden bg-[#f3f3f1] rounded-sm">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Leaf className="w-12 h-12 stroke-[1]" />
                  </div>
                )}
                
                {/* Subtle Hover Action */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white text-black text-xs font-bold px-6 py-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    QUICK ADD
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-[15px] font-medium text-[#1a1a1a] group-hover:text-gray-600 transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex flex-col items-end">
                    <span className="text-[15px] font-medium text-[#1a1a1a]">
                      {currency}{product.price.toFixed(2)}
                    </span>
                    {product.salePrice && product.salePrice < product.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {currency}{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Category Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    {product.category}
                  </span>
                </div>

                {/* Attributes & Caffeine Info */}
                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#888888]">
                    <span className="font-medium">Caffeine:</span>
                    <span className="text-[#1a1a1a] flex items-center gap-1">
                      {product.caffeine || 'None'}
                      {getCaffeineIcon(product.caffeine)}
                    </span>
                  </div>
                </div>

                {/* Health/Premium Callouts */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.attributes?.map((attr, idx) => (
                    <span key={idx} className="text-[10px] text-[#aaaaaa] flex items-center gap-1 italic">
                      • {attr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal Footer CTA */}
        <div className="mt-20 border-t border-gray-100 pt-12 flex flex-col items-center text-center">
          <p className="text-sm text-gray-400 mb-6 italic">Looking for something specific?</p>
          <button className="text-xs font-bold tracking-[0.2em] uppercase border-b-2 border-[#1a1a1a] pb-1 hover:text-gray-500 hover:border-gray-300 transition-all">
            Browse All Collections
          </button>
        </div>
      </div>
    </div>
  );
}