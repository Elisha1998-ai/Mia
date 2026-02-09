"use client";

import React from 'react';
import { Star, Heart, Share2, Facebook, Twitter, Mail, Minus, Plus, Search, ShoppingBag } from 'lucide-react';

export const ProductDetailTemplate1 = () => {
  const [quantity, setQuantity] = React.useState(1);
  const [selectedColor, setSelectedColor] = React.useState('Natural');
  const [selectedSize, setSelectedSize] = React.useState('M');
  const [isWishlisted, setIsWishlisted] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 2000);
  };

  return (
    <div className="bg-white text-gray-900 w-full font-sans antialiased pb-12 sm:pb-24">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <div className="flex flex-col gap-3 sm:gap-4 order-1">
          <div className="aspect-[4/5] sm:aspect-[3/4] bg-gray-100 relative overflow-hidden group rounded-sm">
            {/* Empty Image Frame */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 italic text-sm">
              Main Product Image
            </div>
          </div>
          
          {/* Thumbnails - Horizontal scroll on mobile, grid on desktop */}
          <div className="flex sm:grid sm:grid-cols-4 gap-3 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[80px] sm:min-w-0 aspect-[3/4] bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all rounded-sm flex items-center justify-center text-[10px] text-gray-300 shrink-0">
                View {i}
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col order-2">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3 sm:mb-4 flex items-center gap-2 cursor-pointer hover:text-gray-600 transition-colors">
            <span className="text-xs">←</span> Back to Collection
          </div>
          
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-medium tracking-tight mb-2 sm:mb-4 leading-tight">
            The Atelier Tailored Coat
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4].map((i) => <Star key={i} className="w-3 h-3 fill-gray-900 text-gray-900" />)}
              <Star className="w-3 h-3 text-gray-300" />
            </div>
            <div className="flex items-center gap-4 text-[10px] sm:text-[11px]">
              <span className="text-gray-400 uppercase tracking-widest border-r border-gray-200 pr-4">2 Reviews</span>
              <span className="text-gray-900 uppercase tracking-widest cursor-pointer hover:underline underline-offset-4 decoration-1 font-medium">Add a Review</span>
            </div>
          </div>

          <div className="text-lg sm:text-2xl font-light mb-6 sm:mb-8 text-gray-900">$499.00</div>

          <div className="space-y-3 mb-6 sm:mb-8 text-[11px] sm:text-[12px] border-y border-gray-100 py-5 sm:py-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 uppercase tracking-widest w-24 sm:w-28 shrink-0">Availability:</span>
              <span className="text-emerald-600 font-medium">In stock</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 uppercase tracking-widest w-24 sm:w-28 shrink-0">Code:</span>
              <span className="text-gray-600">#411-L7</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 uppercase tracking-widest w-24 sm:w-28 shrink-0">Tags:</span>
              <span className="text-gray-600 italic">Fashion, Wool, Classic</span>
            </div>
          </div>

          <div className="text-gray-600 text-[13px] sm:text-[14px] leading-relaxed mb-6 sm:mb-8">
            <p className="mb-3 sm:mb-4">
              Sleek, polished, and boasting an impeccable, modern fit, this blue, 2-button Lana suit features a notch lapel, flap pockets, and accompanying flat-front trousers all in pure wool.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 sm:space-y-2 text-gray-500 text-[12px] sm:text-[13px]">
              <li>Dark blue suit for a tone-on-tone look</li>
              <li>Regular fit tailored silhouette</li>
              <li>100% Premium Wool fabric</li>
              <li>Free shipping with express delivery</li>
            </ul>
          </div>

          {/* Selectors */}
          <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-6 mb-8">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Color</label>
              <div className="relative">
                <select 
                  className="w-full bg-white border border-gray-200 py-3 sm:py-3 px-4 text-[12px] appearance-none cursor-pointer focus:outline-none focus:border-gray-900 transition-all rounded-sm hover:border-gray-300 h-[46px] sm:h-[42px]"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  <option>Natural</option>
                  <option>Black</option>
                  <option>Navy</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-gray-400">▼</div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Size</label>
              <div className="relative">
                <select 
                  className="w-full bg-white border border-gray-200 py-3 sm:py-3 px-4 text-[12px] appearance-none cursor-pointer focus:outline-none focus:border-gray-900 transition-all rounded-sm hover:border-gray-300 h-[46px] sm:h-[42px]"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] text-gray-400">▼</div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <label className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Qty</label>
              <div className="flex border border-gray-200 rounded-sm h-[46px] sm:h-[42px]">
                <button 
                  className="w-12 sm:w-10 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <input 
                  type="text" 
                  className="w-full text-center text-[12px] focus:outline-none bg-transparent font-medium" 
                  value={quantity}
                  readOnly
                />
                <button 
                  className="w-12 sm:w-10 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors border-l border-gray-100"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full sm:flex-1 py-4.5 sm:py-4 text-[11px] uppercase tracking-[0.2em] transition-all duration-500 rounded-sm font-semibold flex items-center justify-center gap-2 h-[54px] sm:h-auto ${
                isAdding ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200'
              }`}
            >
              {isAdding ? (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Added to Cart
                </>
              ) : 'Add to Cart'}
            </button>
            <button 
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="w-full sm:w-auto px-8 py-4.5 sm:py-4 border border-gray-200 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] hover:bg-gray-50 active:bg-gray-100 transition-all rounded-sm font-semibold group h-[54px] sm:h-auto"
            >
              <Heart className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400 group-hover:text-gray-900'}`} />
              {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
          </div>

          {/* Share */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-6 sm:pt-8 border-t border-gray-100">
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Share This Piece:</span>
            <div className="flex items-center gap-6 sm:gap-4">
              <button className="flex items-center gap-2 text-gray-400 hover:text-[#3b5998] transition-colors group" title="Share on Facebook">
                <Facebook className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">Facebook</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-[#1da1f2] transition-colors group" title="Share on Twitter">
                <Twitter className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">Twitter</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors group" title="Share via Email">
                <Mail className="w-5 h-5 sm:w-4 sm:h-4" />
                <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
