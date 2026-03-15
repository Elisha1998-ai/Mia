"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/useData';
import { ShoppingBag, X, ArrowRight, Trash2, Plus, Minus, MoreHorizontal, ChevronRight, Star, Heart, Check, ShoppingCart } from 'lucide-react';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  image?: string;
  category?: string;
  sku?: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = React.useState<WishlistItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { settings, fetchSettings } = useSettings();
  const router = useRouter();

  React.useEffect(() => {
    fetchSettings();
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(saved);
    setLoading(false);
  }, []);

  const removeItem = (id: string) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const addToCart = (item: WishlistItem) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.findIndex((i: any) => i.id === item.id);
    if (existing > -1) {
      cart[existing].quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    router.push('/cart');
  };

  const primaryColor = settings?.primaryColor || '#6366f1';

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 px-6 animate-pulse">
        <div className="max-w-3xl mx-auto space-y-8">
           <div className="h-12 bg-gray-50 rounded-xl w-1/4" />
           <div className="space-y-4">
              {[1,2].map(i => <div key={i} className="h-32 bg-gray-50 rounded-[2rem]" />)}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20 pt-16">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Header */}
        <header className="py-6 flex items-center gap-3 border-b border-gray-50 mb-8">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            <img src={settings?.storeLogo || "https://framerusercontent.com/images/3m5f7f3f3f3f3f3f3f3f3f3f3f.png"} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg tracking-tight">Your Wishlist</span>
        </header>

        {wishlist.length === 0 ? (
          <div className="py-20 text-center space-y-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-400 font-medium">Your wishlist is empty.</p>
            <button 
              onClick={() => router.push('/')}
              className="text-white bg-black px-10 py-3.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
            >
              Discover Products
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Items */}
            <div className="space-y-8">
              {wishlist.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="w-24 h-24 rounded-[10px] overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer" onClick={() => router.push(`/products/${item.id}`)}>
                    <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2 cursor-pointer" onClick={() => router.push(`/products/${item.id}`)}>{item.name}</h3>
                    <p className="text-xs text-gray-400 mb-4 truncate max-w-full">
                      {item.category || (item as any).sku || 'Premium Item'}
                    </p>
                    
                    <button 
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add to cart
                    </button>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1 pt-1 min-w-[80px]">
                    <span className="text-sm font-bold">₦{Number(item.price).toLocaleString()}</span>
                    {item.original_price && Number(item.original_price) > Number(item.price) && (
                      <span className="text-xs text-gray-400 line-through">₦{Number(item.original_price).toLocaleString()}</span>
                    )}
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-gray-300 hover:text-red-500 ml-2 mt-10 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
