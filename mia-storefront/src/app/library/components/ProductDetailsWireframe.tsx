"use client";

import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, Heart, Share2, Star, Check } from 'lucide-react';

export interface ProductDetailsProps {
  storeSettings?: {
    primaryColor?: string;
    headingFont?: string;
    bodyFont?: string;
    currency?: string;
    storeName?: string;
  };
  product?: {
    name?: string;
    price?: number;
    salePrice?: number;
    description?: string;
    images?: string[];
    rating?: number;
    reviewCount?: number;
    variants?: {
      colors?: { name: string; value: string }[];
      sizes?: string[];
    };
    policies?: {
      description?: string;
      fabricCare?: string;
      shippingReturns?: string;
    };
    category?: string;
    breadcrumbs?: string[];
  };
}

export default function ProductDetailsWireframe({ product, storeSettings }: ProductDetailsProps) {
  // Helper to extract currency symbol from string like "Nigerian Naira (₦)"
  const getCurrencySymbol = (str?: string) => {
    if (!str) return "₦";
    // If it contains Naira symbol or word, return ₦
    if (str.includes("₦") || str.toLowerCase().includes("naira")) return "₦";
    // If it has a symbol in parentheses like "US Dollar ($)", extract it
    const match = str.match(/\(([^)]+)\)/);
    if (match) return match[1];
    // Otherwise return the string itself (assuming it's a symbol like "$" or "USD")
    return str;
  };

  const currency = getCurrencySymbol(storeSettings?.currency);
  const primaryColor = storeSettings?.primaryColor || "#000000";
  const headingFont = storeSettings?.headingFont || "inherit";
  const bodyFont = storeSettings?.bodyFont || "inherit";
  const storeName = storeSettings?.storeName || "STORE BRAND";

  // Default/Placeholder Data
  const defaultProduct = {
    name: "Classic Heavyweight Cotton T-Shirt",
    price: 60.00,
    salePrice: 45.00,
    description: "Crafted from premium 100% heavyweight cotton, this t-shirt features a relaxed fit and durable construction. Perfect for everyday wear, it combines timeless style with modern comfort.",
    images: ["Product Image 1", "Product Image 2", "Product Image 3", "Product Image 4"],
    rating: 4.8,
    reviewCount: 128,
    variants: {
      colors: [
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#f0f0f0' },
        { name: 'Navy', value: '#1a2b4b' }
      ],
      sizes: ['S', 'M', 'L', 'XL']
    },
    policies: {
      description: "Detailed product description goes here.",
      fabricCare: "Machine wash cold, tumble dry low.",
      shippingReturns: "Free shipping on orders over $100."
    },
    category: "T-Shirts",
    breadcrumbs: ["Home", "Men", "T-Shirts"]
  };

  // Merge provided product with defaults (for demo purposes, in real app we'd rely on props)
  // But to support "missing data" testing, we'll use the prop directly if provided, or default if completely undefined
  const data = product || defaultProduct;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(1); // Default to M (index 1) if available
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const isValidUrl = (str?: string) => {
    if (!str) return false;
    return str.startsWith('http') || str.startsWith('/') || str.startsWith('data:');
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 800);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  // Helper to determine active price
  const currentPrice = data.salePrice || data.price || 0;
  const hasSale = !!data.salePrice && data.salePrice < (data.price || 0);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white min-h-screen font-sans text-gray-900" style={{ fontFamily: bodyFont }}>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 p-4 lg:p-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square w-full bg-gray-100 flex items-center justify-center relative overflow-hidden group">
            {data.images && data.images.length > 0 && isValidUrl(data.images[activeImage]) ? (
              <img 
                src={data.images[activeImage]} 
                alt={data.name || "Product Image"} 
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                <ShoppingBag className="w-12 h-12 opacity-20 mb-2" />
                <span className="text-sm font-medium opacity-50">
                  {data.images?.[activeImage] || "Product Image"}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               {/* Hover overlay effect */}
            </div>
          </div>
          
          {/* Thumbnail Gallery - Only show if more than 1 image */}
          {data.images && data.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {data.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square bg-gray-50 cursor-pointer transition-all border-2 ${activeImage === i ? 'border-black' : 'border-transparent hover:border-gray-200'} flex items-center justify-center overflow-hidden`}
                >
                  {isValidUrl(img) ? (
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover object-center" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ShoppingBag className="w-4 h-4 text-gray-300 opacity-50" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col pt-4">
          {/* Breadcrumbs */}
          {data.breadcrumbs && (
            <div className="flex gap-2 mb-6 text-xs text-gray-500 font-medium uppercase tracking-wide">
              {data.breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  <span className="cursor-pointer hover:text-black">{crumb}</span>
                  {i < data.breadcrumbs!.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Title & Price */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 leading-tight" style={{ fontFamily: headingFont }}>
              {data.name || "Product Name"}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-medium text-gray-900">{currency}{currentPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
              {hasSale && (
                <>
                  <span className="text-lg text-gray-400 line-through">{currency}{data.price?.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  <div 
                    className="px-2 py-1 text-white text-xs font-bold uppercase tracking-wider"
                    style={{ backgroundColor: primaryColor }}
                  >
                    SALE
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Rating - Only show if rating exists */}
          {data.rating !== undefined && (
            <div className="flex items-center gap-2 mb-8 cursor-pointer group">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i <= Math.round(data.rating || 0) ? 'text-black fill-black' : 'text-gray-300 fill-current'}`} 
                  />
                ))}
              </div>
              {data.reviewCount && (
                <span className="text-sm text-gray-500 group-hover:text-black underline-offset-4 group-hover:underline transition-all">
                  {data.reviewCount} Reviews
                </span>
              )}
            </div>
          )}

          {/* Description */}
          {data.description && (
            <div className="space-y-4 mb-8 text-gray-600 leading-relaxed">
              <p>{data.description}</p>
            </div>
          )}

          {/* Variants (Color/Size) */}
          {(data.variants?.colors?.length || 0) > 0 || (data.variants?.sizes?.length || 0) > 0 ? (
            <div className="space-y-8 mb-8">
              {/* Colors */}
              {data.variants?.colors && data.variants.colors.length > 0 && (
                <div className="space-y-3">
                  <span className="text-sm font-bold uppercase tracking-wide text-gray-900">
                    Color: <span className="font-normal text-gray-600">{data.variants.colors[selectedColor]?.name || 'Select'}</span>
                  </span>
                  <div className="flex gap-3">
                    {data.variants.colors.map((color, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedColor(i)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedColor === i ? 'ring-2 ring-offset-2' : 'hover:scale-110'}`}
                        style={{ 
                          backgroundColor: color.value,
                          '--tw-ring-color': primaryColor,
                          boxShadow: selectedColor === i ? `0 0 0 2px white, 0 0 0 4px ${primaryColor}` : 'none'
                        } as React.CSSProperties}
                      >
                        {selectedColor === i && <Check className={`w-4 h-4 ${color.name.toLowerCase() === 'white' ? 'text-black' : 'text-white'}`} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Sizes */}
              {data.variants?.sizes && data.variants.sizes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold uppercase tracking-wide text-gray-900" style={{ fontFamily: headingFont }}>
                      Size: <span className="font-normal text-gray-600" style={{ fontFamily: bodyFont }}>{data.variants.sizes[selectedSize]}</span>
                    </span>
                    <span className="text-xs font-medium text-gray-500 underline cursor-pointer hover:text-black">Size Guide</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {data.variants.sizes.map((size, index) => (
                      <button 
                        key={size} 
                        onClick={() => setSelectedSize(index)}
                        className={`h-12 border transition-all font-medium text-sm flex items-center justify-center
                          ${selectedSize === index 
                            ? 'text-white' 
                            : 'bg-white text-gray-900 hover:border-gray-900'
                          }
                        `}
                        style={{
                          backgroundColor: selectedSize === index ? primaryColor : 'white',
                          borderColor: selectedSize === index ? primaryColor : '#e5e7eb',
                          fontFamily: headingFont
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Quantity */}
            <div className="flex items-center border border-gray-200 w-fit h-14">
              <button 
                onClick={() => handleQuantityChange(-1)}
                className="w-14 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors disabled:opacity-50"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-14 text-center text-gray-900 font-bold text-lg">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(1)}
                className="w-14 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Add to Cart */}
            <button 
              onClick={handleAddToCart}
              disabled={isAdding || added}
              className={`flex-1 min-h-[3.5rem] py-4 sm:py-0 sm:h-14 font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 text-white
                ${added ? 'cursor-default' : 'hover:opacity-90'}
              `}
              style={{ 
                backgroundColor: added ? '#16a34a' : primaryColor,
                fontFamily: headingFont 
              }}
            >
              {isAdding ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : added ? (
                <>
                  <Check className="w-5 h-5" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart - {currency}{(currentPrice * quantity).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </>
              )}
            </button>
            
            {/* Wishlist */}
            <button className="h-14 w-14 border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-900 transition-colors group">
              <Heart className="w-5 h-5 group-hover:fill-black transition-colors" />
            </button>
          </div>

          {/* Additional Info Accordions - Only render if content exists */}
          <div className="border-t border-gray-200 divide-y divide-gray-200">
            {[
              { title: "Description", content: data.policies?.description },
              { title: "Fabric & Care", content: data.policies?.fabricCare },
              { title: "Shipping & Returns", content: data.policies?.shippingReturns }
            ]
              .filter(item => item.content) // Only show accordions with content
              .map((item, i) => (
                <details key={i} className="group cursor-pointer">
                  <summary className="py-6 flex items-center justify-between font-bold text-sm uppercase tracking-wide list-none hover:text-gray-600 transition-colors">
                    {item.title}
                    <span className="transition-transform group-open:rotate-45">
                      <Plus className="w-4 h-4" />
                    </span>
                  </summary>
                  <div className="pb-6 text-gray-600 text-sm leading-relaxed animate-in slide-in-from-top-2 duration-200">
                    {item.content}
                  </div>
                </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
