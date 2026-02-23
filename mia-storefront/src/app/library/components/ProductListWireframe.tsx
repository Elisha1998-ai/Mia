"use client";

import React, { useState } from 'react';
import { ShoppingBag, Heart, Filter, ChevronDown, Grid, List } from 'lucide-react';

export interface ProductListProps {
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
  }>;
}

export default function ProductListWireframe({ products, storeSettings }: ProductListProps) {
  const getCurrencySymbol = (str?: string) => {
    if (!str) return "₦";
    if (str.includes("₦") || str.toLowerCase().includes("naira")) return "₦";
    const match = str.match(/\(([^)]+)\)/);
    if (match) return match[1];
    return str;
  };

  const currency = getCurrencySymbol(storeSettings?.currency);
  const primaryColor = storeSettings?.primaryColor || "#000000";
  const headingFont = storeSettings?.headingFont || "inherit";
  const bodyFont = storeSettings?.bodyFont || "inherit";

  // Mock Data
  const defaultProducts = [
    {
      id: "1",
      name: "Classic Heavyweight Cotton T-Shirt",
      price: 60.00,
      salePrice: 45.00,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
      category: "T-Shirts"
    },
    {
      id: "2",
      name: "Minimalist Cap",
      price: 25.00,
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800",
      category: "Accessories"
    },
    {
      id: "3",
      name: "Everyday Denim Jacket",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=800",
      category: "Outerwear"
    },
    {
      id: "4",
      name: "Canvas Tote Bag",
      price: 35.00,
      salePrice: 28.00,
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
      category: "Accessories"
    },
    {
      id: "5",
      name: "Slim Fit Chinos",
      price: 75.00,
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800",
      category: "Pants"
    },
    {
      id: "6",
      name: "Oxford Button-Down",
      price: 65.00,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800",
      category: "Shirts"
    }
  ];

  const displayProducts = products && products.length > 0 ? products : defaultProducts;
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="w-full h-full bg-white overflow-y-auto" style={{ fontFamily: bodyFont }}>
      {/* Header / Filter Bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: headingFont }}>
            All Products
            <span className="ml-2 text-sm font-normal text-gray-500">({displayProducts.length})</span>
          </h2>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
              Sort by
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>
            <div className="flex bg-gray-100 rounded-md p-0.5">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-sm transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'flex flex-col gap-4'
          }
        `}>
          {displayProducts.map((product) => (
            <div 
              key={product.id} 
              className={`group bg-white rounded-xl overflow-hidden border border-gray-100 transition-all hover:shadow-lg hover:border-gray-200
                ${viewMode === 'list' ? 'flex flex-row items-center h-32' : 'flex flex-col'}
              `}
            >
              {/* Image Container */}
              <div className={`relative overflow-hidden bg-gray-100 ${viewMode === 'list' ? 'w-32 h-full shrink-0' : 'aspect-[4/5] w-full'}`}>
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}
                
                {/* Badges */}
                {product.salePrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    SALE
                  </div>
                )}

                {/* Quick Actions (Grid Only) */}
                {viewMode === 'grid' && (
                  <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    <button className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className={`flex-1 p-4 flex flex-col ${viewMode === 'list' ? 'justify-between' : ''}`}>
                <div>
                  <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                </div>

                <div className={`flex items-center justify-between mt-auto ${viewMode === 'grid' ? 'pt-4' : ''}`}>
                  <div className="flex items-baseline gap-2">
                    {product.salePrice ? (
                      <>
                        <span className="text-sm font-bold text-red-600">
                          {currency}{product.salePrice.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {currency}{product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-gray-900">
                        {currency}{product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors shadow-sm active:scale-95"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Mock */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center gap-1">
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-900 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 text-sm font-medium bg-black text-white rounded-md" style={{ backgroundColor: primaryColor }}>1</button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">2</button>
            <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 rounded-md">3</button>
            <span className="px-2 text-gray-400">...</span>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-900">Next</button>
          </nav>
        </div>
      </div>
    </div>
  );
}
