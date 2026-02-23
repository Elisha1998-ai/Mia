"use client";

import React, { useState } from 'react';
import { ShoppingBag, X, Trash2, ArrowRight } from 'lucide-react';

export interface WishlistProps {
  storeSettings?: {
    primaryColor?: string;
    headingFont?: string;
    bodyFont?: string;
    currency?: string;
    storeName?: string;
  };
  wishlistItems?: Array<{
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    image?: string;
    variant?: string;
    inStock: boolean;
  }>;
}

export default function WishlistWireframe({ wishlistItems, storeSettings }: WishlistProps) {
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
  const defaultItems = [
    {
      id: "1",
      name: "Classic Heavyweight Cotton T-Shirt",
      price: 60.00,
      salePrice: 45.00,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
      variant: "L / Black",
      inStock: true
    },
    {
      id: "2",
      name: "Minimalist Cap",
      price: 25.00,
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800",
      variant: "One Size",
      inStock: true
    },
    {
      id: "3",
      name: "Limited Edition Sneakers",
      price: 150.00,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800",
      variant: "US 10",
      inStock: false
    }
  ];

  const [items, setItems] = useState(wishlistItems || defaultItems);

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="w-full h-full bg-white overflow-y-auto" style={{ fontFamily: bodyFont }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: headingFont }}>My Wishlist</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <HeartBroken className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8">Save items you love to revisit later.</p>
            <button 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow relative group"
              >
                {/* Remove Button (Absolute) */}
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Remove item"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Image */}
                <div className="w-full sm:w-32 aspect-square rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 pr-12">{item.name}</h3>
                    {item.variant && (
                      <p className="text-sm text-gray-500 mt-1">{item.variant}</p>
                    )}
                    <div className="mt-2 flex items-baseline gap-2">
                      {item.salePrice ? (
                        <>
                          <span className="text-lg font-bold text-red-600">
                            {currency}{item.salePrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {currency}{item.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">
                          {currency}{item.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-start gap-4">
                    {item.inStock ? (
                      <button 
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </button>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 rounded-md bg-gray-100 text-gray-500 text-sm font-medium">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HeartBroken({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <line x1="12" y1="13" x2="12" y2="21" />
      <line x1="2" y1="8.5" x2="22" y2="8.5" />
    </svg>
  );
}
