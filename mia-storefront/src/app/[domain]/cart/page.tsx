"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/useData';
import { ShoppingBag, X, ArrowRight, Trash2, Plus, Minus, MoreHorizontal, ChevronRight, Star, Heart, Check } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  quantity: number;
  image_url?: string;
  image?: string;
  variant?: string;
}

export default function CartPage() {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { settings, fetchSettings } = useSettings();
  const router = useRouter();

  React.useEffect(() => {
    fetchSettings();
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(saved);
    setLoading(false);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id: string) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const subtotal = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const primaryColor = settings?.primaryColor || '#6366f1';
  const headingFont = settings?.headingFont || 'inherit';

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
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Cart Header */}
        <header className="py-6 flex items-center gap-3 border-b border-gray-50 mb-8">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            <img src={settings?.storeLogo || "https://framerusercontent.com/images/3m5f7f3f3f3f3f3f3f3f3f3f3f.png"} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg tracking-tight">{settings?.storeName || 'Modern Wall Art Shop'}</span>
        </header>

        {cart.length === 0 ? (
          <div className="py-20 text-center space-y-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-400 font-medium">Your bag is currently empty.</p>
            <button 
              onClick={() => router.push('/')}
              className="text-white bg-black px-10 py-3.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cart Items */}
            <div className="space-y-8">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-start">
                  <div className="w-24 h-24 rounded-[10px] overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-gray-400 mb-4 truncate max-w-full">
                      {(item as any).category || (item as any).sku || 'Premium Item'}
                    </p>
                    
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-fit gap-4 shadow-sm">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-900">
                        {item.quantity === 1 ? <Trash2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-900">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1 pt-1 min-w-[80px]">
                    <span className="text-sm font-bold">₦{(Number(item.price) * item.quantity).toLocaleString()}</span>
                    {item.original_price && (
                      <span className="text-xs text-gray-400 line-through">₦{(Number(item.original_price) * item.quantity).toLocaleString()}</span>
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

            {/* Subtotal & Checkout */}
            <div className="pt-8 border-t border-gray-100 space-y-6">
               <div className="flex justify-between items-center">
                  <span className="text-md font-bold text-gray-900">Subtotal</span>
                  <span className="text-lg font-black tracking-tight">₦{subtotal.toLocaleString()}</span>
               </div>

               <button 
                 onClick={() => router.push('/checkout')}
                 className="w-full py-4 rounded-[10px] font-bold text-sm tracking-tight transition-all active:scale-[0.98] shadow-sm text-white"
                 style={{ backgroundColor: primaryColor }}
               >
                 Continue to checkout
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
