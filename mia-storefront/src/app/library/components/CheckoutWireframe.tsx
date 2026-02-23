"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Lock, CreditCard, Truck, ShieldCheck, MessageCircle, ChevronRight, ShoppingBag } from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

export interface CheckoutProps {
  cart?: CartItem[];
  storeSettings?: {
    storeName?: string;
    storePhone?: string;
    currency?: string;
    primaryColor?: string;
    headingFont?: string;
    bodyFont?: string;
  };
}

export default function CheckoutWireframe({ cart: propCart, storeSettings }: CheckoutProps) {
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
  const storeName = storeSettings?.storeName || "Mia Store";
  const primaryColor = storeSettings?.primaryColor || "#000000";
  const headingFont = storeSettings?.headingFont || "inherit";
  const bodyFont = storeSettings?.bodyFont || "inherit";

  // Default/Placeholder Data
  const defaultCart: CartItem[] = [
    {
      id: "1",
      name: "Classic Heavyweight Cotton T-Shirt",
      price: 60000,
      quantity: 1,
      image: "", // Placeholder
      variant: "Black / M"
    },
    {
      id: "2",
      name: "Slim Fit Chino Pants",
      price: 45000,
      quantity: 2,
      variant: "Beige / 32"
    }
  ];

  const cart = propCart && propCart.length > 0 ? propCart : defaultCart;

  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'paystack'>('whatsapp');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    phone: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setOrderNumber(`ORD-${Math.floor(Math.random() * 100000)}`);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-12 sm:py-24 text-center font-sans animate-in fade-in zoom-in-95 duration-500" style={{ fontFamily: bodyFont }}>
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 border"
          style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}30` }}
        >
          <CheckCircle2 className="w-10 h-10" style={{ color: primaryColor }} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight" style={{ fontFamily: headingFont }}>Order Confirmed</h1>
        <p className="text-gray-500 mb-10 text-base leading-relaxed max-w-md mx-auto">
          Thank you for your purchase. {storeName} has received your order and is currently processing it.
        </p>
        
        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 mb-10 text-left max-w-sm mx-auto shadow-sm">
          <div className="flex justify-between text-xs uppercase tracking-widest font-bold text-gray-400 mb-4 border-b border-gray-200 pb-4" style={{ fontFamily: headingFont }}>
            <span>Order Number</span>
            <span className="text-black">#{orderNumber}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Date</span>
              <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Total</span>
              <span className="font-medium text-gray-900">{currency}{total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Payment</span>
              <span className="font-medium text-gray-900 capitalize">{paymentMethod}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsSuccess(false)}
          className="inline-flex items-center gap-2 text-white px-8 py-4 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-all rounded-md shadow-lg"
          style={{ backgroundColor: primaryColor, fontFamily: headingFont }}
        >
          <ArrowLeft className="w-4 h-4" /> Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white font-sans text-gray-900" style={{ fontFamily: bodyFont }}>
      {/* Header Placeholder */}
      <div className="h-16 border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 bg-white sticky top-0 z-20">
        <div className="text-lg font-bold tracking-tight" style={{ fontFamily: headingFont }}>{storeName}</div>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <Lock className="w-3 h-3" /> Secure Checkout
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-8 lg:mb-12" style={{ fontFamily: headingFont }}>
          <span className="hover:text-black cursor-pointer">Cart</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-black">Checkout</span>
        </div>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column: Forms */}
          <div className="flex-1 space-y-12">
            
            {/* 1. Contact & Shipping */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3" style={{ fontFamily: headingFont }}>
                <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center" style={{ backgroundColor: primaryColor }}>1</span>
                Contact & Shipping
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500" style={{ fontFamily: headingFont }}>First Name</label>
                  <input 
                    required 
                    type="text"
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black rounded-md transition-all placeholder:text-gray-300"
                    placeholder="Enter first name"
                    style={{ fontFamily: bodyFont }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500" style={{ fontFamily: headingFont }}>Last Name</label>
                  <input 
                    required 
                    type="text"
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black rounded-md transition-all placeholder:text-gray-300"
                    placeholder="Enter last name"
                    style={{ fontFamily: bodyFont }}
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500" style={{ fontFamily: headingFont }}>Email Address</label>
                  <input 
                    required 
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black rounded-md transition-all placeholder:text-gray-300"
                    placeholder="name@example.com"
                    style={{ fontFamily: bodyFont }}
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500" style={{ fontFamily: headingFont }}>Street Address</label>
                  <input 
                    required 
                    type="text"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black rounded-md transition-all placeholder:text-gray-300"
                    placeholder="House number and street name"
                    style={{ fontFamily: bodyFont }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500" style={{ fontFamily: headingFont }}>City</label>
                  <input 
                    required 
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black rounded-md transition-all placeholder:text-gray-300"
                    placeholder="Enter city"
                    style={{ fontFamily: bodyFont }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500" style={{ fontFamily: headingFont }}>Phone</label>
                  <input 
                    required 
                    type="tel" 
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black rounded-md transition-all placeholder:text-gray-300"
                    placeholder="Phone number"
                    style={{ fontFamily: bodyFont }}
                  />
                </div>
              </div>
            </section>

            {/* 2. Payment Method */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-3" style={{ fontFamily: headingFont }}>
                <span className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center" style={{ backgroundColor: primaryColor }}>2</span>
                Payment Method
              </h2>
              
              <div className="space-y-3">
                <div 
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`border p-5 rounded-lg flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'whatsapp' ? 'bg-emerald-50/30 ring-1' : 'hover:border-gray-300 hover:bg-gray-50'}`}
                  style={{ 
                    borderColor: paymentMethod === 'whatsapp' ? primaryColor : '#e5e7eb',
                    backgroundColor: paymentMethod === 'whatsapp' ? `${primaryColor}10` : undefined, // 10% opacity
                    boxShadow: paymentMethod === 'whatsapp' ? `0 0 0 1px ${primaryColor}` : undefined
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full" style={{ backgroundColor: paymentMethod === 'whatsapp' ? `${primaryColor}20` : '#f3f4f6', color: paymentMethod === 'whatsapp' ? primaryColor : '#6b7280' }}>
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900" style={{ fontFamily: headingFont }}>Pay via WhatsApp</p>
                      <p className="text-xs text-gray-500 mt-0.5">Chat with us to complete your order</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 border rounded-full flex items-center justify-center`} style={{ borderColor: paymentMethod === 'whatsapp' ? primaryColor : '#d1d5db' }}>
                    {paymentMethod === 'whatsapp' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>}
                  </div>
                </div>
                
                <div 
                  onClick={() => setPaymentMethod('paystack')}
                  className={`border p-5 rounded-lg flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'paystack' ? 'bg-gray-50 ring-1' : 'hover:border-gray-300 hover:bg-gray-50'}`}
                  style={{ 
                    borderColor: paymentMethod === 'paystack' ? primaryColor : '#e5e7eb',
                    backgroundColor: paymentMethod === 'paystack' ? `${primaryColor}10` : undefined, // 10% opacity
                    boxShadow: paymentMethod === 'paystack' ? `0 0 0 1px ${primaryColor}` : undefined
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full" style={{ backgroundColor: paymentMethod === 'paystack' ? primaryColor : '#f3f4f6', color: paymentMethod === 'paystack' ? 'white' : '#6b7280' }}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900" style={{ fontFamily: headingFont }}>Card Payment</p>
                      <p className="text-xs text-gray-500 mt-0.5">Secure payment via Paystack</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 border rounded-full flex items-center justify-center`} style={{ borderColor: paymentMethod === 'paystack' ? primaryColor : '#d1d5db' }}>
                    {paymentMethod === 'paystack' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-gray-50 p-6 sm:p-8 rounded-xl sticky top-24 border border-gray-100 shadow-sm">
              <h2 className="text-xs uppercase tracking-widest font-bold mb-6 pb-4 border-b border-gray-200 flex items-center justify-between" style={{ fontFamily: headingFont }}>
                <span>Order Summary</span>
                <span className="text-gray-400">{cart.length} Item(s)</span>
              </h2>
              
              <div className="max-h-[320px] overflow-y-auto mb-6 pr-2 space-y-5 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-16 h-16 bg-white rounded-md border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate pr-2" style={{ fontFamily: headingFont }}>{item.name}</h3>
                      {item.variant && <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                        <span className="text-sm font-semibold">{currency}{(item.price * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{currency}{subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-medium" style={{ color: primaryColor }}>Free</span>
                  ) : (
                    <span>{currency}{shipping.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                  )}
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-4 border-t border-gray-200 mt-4" style={{ fontFamily: headingFont }}>
                  <span>Total</span>
                  <span>{currency}{total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full mt-8 text-white py-4 px-6 text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-all rounded-md shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                style={{ backgroundColor: primaryColor, fontFamily: headingFont }}
              >
                {isProcessing ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-3 h-3" /> Pay {currency}{total.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </>
                )}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Secure Encrypted Payment
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
