"use client";

import React from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useSettings } from '@/hooks/useData';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { settings, fetchSettings } = useSettings();

  React.useEffect(() => {
    fetchSettings();
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    setLoading(false);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse bg-gray-50 h-[400px]"></div>;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 text-center font-store-body">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <ShoppingBag className="w-8 h-8 text-gray-300" />
        </div>
        <h1 className="font-store-heading text-3xl sm:text-4xl font-medium mb-4">Your cart is empty</h1>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">Looks like you haven't added anything to your collection yet. {settings?.storeName || 'Mia'} can help you find something you'll love.</p>
        <Link 
          href="/store" 
          className="inline-flex items-center gap-3 bg-store-primary text-white px-10 py-5 text-[11px] uppercase tracking-[0.3em] font-bold hover:opacity-90 transition-all rounded-sm shadow-xl"
        >
          Explore Collection <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 font-store-body">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-12 pb-6 border-b border-gray-100">
            <h1 className="font-store-heading text-3xl sm:text-4xl font-medium tracking-tight">Shopping Bag</h1>
            <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">{cart.length} Items</span>
          </div>

          <div className="space-y-10">
            {cart.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 sm:gap-10 pb-10 border-b border-gray-50 group">
                {/* Product Image */}
                <Link href={`/store/products/${item.id}`} className="w-full sm:w-40 aspect-square bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 uppercase tracking-widest italic">No Image</div>
                  )}
                </Link>

                {/* Product Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link href={`/store/products/${item.id}`} className="block text-lg sm:text-xl font-medium tracking-tight hover:underline underline-offset-4 decoration-1 mb-1">{item.name}</Link>
                      <p className="text-gray-400 text-[11px] uppercase tracking-widest font-medium mb-4">Item ID: {item.id.slice(0, 8)}</p>
                    </div>
                    <p className="text-lg font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="flex border border-gray-200 rounded-sm h-12 bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-12 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors border-r border-gray-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <div className="w-14 flex items-center justify-center text-[13px] font-bold">{item.quantity}</div>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-12 flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors border-l border-gray-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold"
                    >
                      <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link 
            href="/store" 
            className="mt-12 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-black transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Continue Shopping
          </Link>
        </div>

        {/* Summary */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-gray-50 p-8 sm:p-10 rounded-sm sticky top-32">
            <h2 className="font-store-heading text-[12px] uppercase tracking-[0.2em] font-bold mb-8 border-b border-gray-200 pb-4">Order Summary</h2>
            
            <div className="space-y-5 text-sm mb-10">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">
                  {shipping === 0 ? <span className="text-emerald-600 uppercase text-[10px] font-bold tracking-widest">Free</span> : `₦${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="pt-5 border-t border-gray-200 flex justify-between items-end">
                <span className="text-gray-900 font-bold uppercase tracking-widest text-[11px]">Total</span>
                <span className="font-store-heading text-2xl font-medium tracking-tight">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <Link 
              href="/store/checkout" 
              className="w-full bg-store-primary text-white py-5 text-[11px] uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all rounded-sm shadow-2xl shadow-gray-200"
            >
              Checkout Now <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="mt-8 space-y-4">
              <p className="text-[10px] text-gray-400 leading-relaxed text-center uppercase tracking-widest">
                Secure checkout powered by {settings?.storeName || 'Mia'} AI
              </p>
              <div className="flex justify-center gap-6 text-gray-300">
                {/* Icons would go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
