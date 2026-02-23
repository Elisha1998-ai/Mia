"use client";

import React, { useState } from 'react';
import { 
  ShoppingBag, Check, MessageCircle
} from 'lucide-react';

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

export default function CheckoutWireframeVariant2({ cart: propCart, storeSettings }: CheckoutProps) {
  // --- Helpers & Defaults ---
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

  const defaultCart: CartItem[] = [
    {
      id: "1",
      name: "Top Coat Amon",
      price: 132000,
      quantity: 1,
      image: "", 
      variant: "Size: M / Color: Black"
    },
    {
      id: "2",
      name: "Dress Bastet",
      price: 91000,
      quantity: 1,
      variant: "Size: S / Color: Black"
    },
    {
      id: "3",
      name: "Robe Ninrti",
      price: 153000,
      quantity: 1,
      variant: "Size: M / Color: Black"
    }
  ];

  const cart = propCart && propCart.length > 0 ? propCart : defaultCart;

  // --- State ---
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'flutterwave' | 'whatsapp'>('paystack');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingCost = deliveryMethod === 'express' ? 50000 : 0;
  const discount = 0;
  const total = subtotal + shippingCost - discount;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      currencyDisplay: 'narrowSymbol' 
    }).format(amount).replace('NGN', currency);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    if (paymentMethod === 'whatsapp') {
      // Construct WhatsApp message
      const itemsList = cart.map(item => 
        `• ${item.name} x${item.quantity} (${formatPrice(item.price)})`
      ).join('\n');
      
      const message = `*New Order from Store*\n\n*Items:*\n${itemsList}\n\n*Total:* ${formatPrice(total)}\n\n*Delivery:* ${deliveryMethod}\n*Customer:* John Doe\n*Address:* 123 Street, Lagos`;
      
      const whatsappUrl = `https://wa.me/2348000000000?text=${encodeURIComponent(message)}`;
      
      setTimeout(() => {
        setIsProcessing(false);
        window.open(whatsappUrl, '_blank');
        setIsSuccess(true);
      }, 1500);
      return;
    }

    // Simulate other payment gateways
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] bg-[#F4F4F4] flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-12 max-w-md w-full text-center shadow-sm">
          <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold uppercase mb-4 tracking-tight">Order Placed</h2>
          <p className="text-gray-500 mb-8">Thank you for your purchase. Your order number is #ORD-{Math.floor(Math.random() * 10000)}.</p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="w-full text-white py-4 uppercase font-bold tracking-widest hover:opacity-90 transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] font-sans text-[#1a1a1a] pt-12 pb-20" style={{ fontFamily: bodyFont }}>
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Page Title */}
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-12 mt-4" style={{ fontFamily: headingFont }}>Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* LEFT COLUMN - FORMS */}
          <div className="flex-1 space-y-12">
            
            {/* Information Section */}
            <section>
              <div className="flex justify-between items-baseline mb-8 border-b border-gray-200 pb-2">
                <h2 className="text-xl font-medium">Information</h2>
                <span className="text-xs text-gray-500">Already have an account? <a href="#" className="underline">Log in</a></span>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide mb-4 text-gray-400">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <input type="text" placeholder="First name" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                    <input type="text" placeholder="Last name" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                    <input type="tel" placeholder="Phone number" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                    <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide mb-4 text-gray-400">Shipping Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <input type="text" placeholder="Country / Region" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                    <input type="text" placeholder="City" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors" />
                    <input type="text" placeholder="Address" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors md:col-span-2" />
                    <input type="text" placeholder="Zip / Postal code" className="w-full bg-transparent border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors md:col-span-2" />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" id="data-processing" className="w-4 h-4 rounded-none border-gray-300 text-black focus:ring-0" />
                  <label htmlFor="data-processing" className="text-xs text-gray-500">I agree to data processing</label>
                </div>
              </div>
            </section>

            {/* Delivery Section */}
            <section>
              <h2 className="text-xl font-medium mb-6 border-b border-gray-200 pb-2">Delivery</h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${deliveryMethod === 'standard' ? 'border-black' : 'border-gray-300'}`}>
                      {deliveryMethod === 'standard' && <div className="w-2 h-2 bg-black rounded-full" />}
                    </div>
                    <input type="radio" name="delivery" className="hidden" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} />
                    <div>
                      <span className="block text-sm font-medium">Standard Delivery</span>
                      <span className="block text-xs text-gray-500">Delivery within 5-7 days</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium">Free</span>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${deliveryMethod === 'express' ? 'border-black' : 'border-gray-300'}`}>
                      {deliveryMethod === 'express' && <div className="w-2 h-2 bg-black rounded-full" />}
                    </div>
                    <input type="radio" name="delivery" className="hidden" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} />
                    <div>
                      <span className="block text-sm font-medium">Express Shipping</span>
                      <span className="block text-xs text-gray-500">Delivery within 1-3 days</span>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(50000)}</span>
                </label>
              </div>
            </section>

            {/* Payment Section (African Context) */}
            <section>
              <h2 className="text-xl font-medium mb-6 border-b border-gray-200 pb-2">Payment</h2>
              
              <div className="space-y-6">
                
                {/* Paystack Option */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'paystack' ? 'border-black' : 'border-gray-300'}`}>
                      {paymentMethod === 'paystack' && <div className="w-2 h-2 bg-black rounded-full" />}
                    </div>
                    <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'paystack'} onChange={() => setPaymentMethod('paystack')} />
                    <span className="text-sm font-medium">Paystack</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-blue-600 font-bold text-sm tracking-tighter">paystack</span>
                  </div>
                </label>

                {/* Flutterwave Option */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'flutterwave' ? 'border-black' : 'border-gray-300'}`}>
                      {paymentMethod === 'flutterwave' && <div className="w-2 h-2 bg-black rounded-full" />}
                    </div>
                    <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'flutterwave'} onChange={() => setPaymentMethod('flutterwave')} />
                    <span className="text-sm font-medium">Flutterwave</span>
                  </div>
                   <span className="text-orange-500 font-bold text-sm">Flutterwave</span>
                </label>

                {/* WhatsApp Option */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'whatsapp' ? 'border-black' : 'border-gray-300'}`}>
                      {paymentMethod === 'whatsapp' && <div className="w-2 h-2 bg-black rounded-full" />}
                    </div>
                    <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'whatsapp'} onChange={() => setPaymentMethod('whatsapp')} />
                    <span className="text-sm font-medium">Order via WhatsApp</span>
                  </div>
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </label>

              </div>

              <div className="flex items-center gap-2 mt-8 mb-8">
                <input type="checkbox" id="terms" className="w-4 h-4 rounded-none border-gray-300 text-black focus:ring-0" />
                <label htmlFor="terms" className="text-xs text-gray-500">I agree to data processing and terms</label>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full text-white py-4 text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ backgroundColor: primaryColor }}
              >
                {isProcessing ? "Processing..." : (
                  <>
                    {paymentMethod === 'whatsapp' ? 'Send Order to WhatsApp' : 'Pay and Place Order'}
                  </>
                )}
              </button>
            </section>

          </div>

          {/* RIGHT COLUMN - SHOPPING BAG */}
          <div className="lg:w-[400px] xl:w-[450px] flex-shrink-0">
            <h2 className="text-xl font-medium mb-8">Shopping Bag ({cart.length})</h2>
            
            <div className="space-y-8 mb-8">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-24 bg-gray-200 flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                       // Placeholder if no image
                       <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-300">
                         <ShoppingBag size={20} />
                       </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                      <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      {item.variant && <p>{item.variant}</p>}
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code */}
            <div className="flex gap-2 mb-8">
              <input 
                type="text" 
                placeholder="Promocode" 
                className="flex-1 bg-transparent border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black"
              />
              <button className="bg-gray-200 text-gray-600 px-6 py-2 text-xs font-bold uppercase hover:bg-gray-300 transition-colors">
                Apply
              </button>
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium">{formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-gray-200">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
