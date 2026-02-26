"use client";

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  ChevronDown, 
  CheckCircle2,
  Lock,
  MessageCircle
} from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
  color?: string;
  size?: string;
}

export interface CheckoutProps {
  cart?: CartItem[];
  storeSettings?: {
    storeName?: string;
    currency?: string;
    primaryColor?: string;
    headingFont?: string;
    bodyFont?: string;
  };
}

export default function CheckoutWireframeVariant3({ cart: propCart, storeSettings }: CheckoutProps) {
  const getCurrencySymbol = (str?: string) => {
    if (!str) return "₦";
    if (str.includes("₦") || str.toLowerCase().includes("naira")) return "₦";
    const match = str.match(/\(([^)]+)\)/);
    if (match) return match[1];
    return str;
  };

  const currency = getCurrencySymbol(storeSettings?.currency);
  const primaryColor = storeSettings?.primaryColor || "#000000"; // Monochrome default
  const focusStyle = { '--tw-ring-color': primaryColor, borderColor: primaryColor } as React.CSSProperties;
  const headingFont = storeSettings?.headingFont || "inherit";
  const bodyFont = storeSettings?.bodyFont || "inherit";

  const defaultCart: CartItem[] = [
    {
      id: "1",
      name: "Basic Tee",
      price: 15000.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
      color: "Black",
      size: "Large"
    },
    {
      id: "2",
      name: "Basic Tee",
      price: 15000.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
      color: "Sienna",
      size: "Large"
    }
  ];

  const [cart] = useState(propCart && propCart.length > 0 ? propCart : defaultCart);
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'flutterwave' | 'whatsapp'>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCost = deliveryMethod === 'standard' ? 3000.00 : 7500.00; // Updated for Naira values
  const taxes = subtotal * 0.075; // Nigeria VAT is 7.5%
  const total = subtotal + shippingCost + taxes;

  const formatPrice = (amount: number) => {
    return amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center py-20 px-4 bg-white" style={{ fontFamily: bodyFont }}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: headingFont }}>Order Received</h2>
        <p className="text-gray-500 text-center max-w-sm mb-8">
          Thank you for your purchase. We&apos;ve sent a confirmation email with your order details.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="px-8 py-3 rounded-md text-white font-bold transition-opacity hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          Return to Store
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-full no-scrollbar" style={{ fontFamily: bodyFont }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handlePlaceOrder} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          
          {/* Left Column: Forms */}
          <div className="space-y-12">
            
            {/* Contact Information */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-6" style={{ fontFamily: headingFont }}>Contact information</h2>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <input
                  type="email"
                  id="email"
                  required
                  className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3"
                  style={focusStyle}
                />
              </div>
            </section>

            {/* Shipping Information */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-6" style={{ fontFamily: headingFont }}>Shipping information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                  <input type="text" id="first-name" required className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                  <input type="text" id="last-name" required className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input type="text" id="company" className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input type="text" id="address" required className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-2">Apartment, suite, etc.</label>
                  <input type="text" id="apartment" className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input type="text" id="city" required className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select id="country" className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3 bg-white" style={focusStyle}>
                    <option>Nigeria</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State / Province</label>
                  <input type="text" id="state" required className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                </div>
                <div>
                  <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 mb-2">Postal code</label>
                  <input type="text" id="postal-code" required className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" id="phone" required className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-6" style={{ fontFamily: headingFont }}>Delivery method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div 
                  onClick={() => setDeliveryMethod('standard')}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-all flex flex-col justify-between h-32 ${deliveryMethod === 'standard' ? 'bg-white shadow-sm' : 'bg-gray-50'}`}
                  style={{ borderColor: deliveryMethod === 'standard' ? primaryColor : '#F3F4F6' }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Standard</p>
                      <p className="text-xs text-gray-500 mt-1">4–10 business days</p>
                    </div>
                    {deliveryMethod === 'standard' && <CheckCircle2 className="w-5 h-5" style={{ color: primaryColor }} />}
                  </div>
                  <p className="text-sm font-bold text-gray-900">{currency}{formatPrice(3000)}</p>
                </div>

                <div 
                  onClick={() => setDeliveryMethod('express')}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-all flex flex-col justify-between h-32 ${deliveryMethod === 'express' ? 'bg-white shadow-sm' : 'bg-gray-50'}`}
                  style={{ borderColor: deliveryMethod === 'express' ? primaryColor : '#F3F4F6' }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-gray-900">Express</p>
                      <p className="text-xs text-gray-500 mt-1">2–5 business days</p>
                    </div>
                    {deliveryMethod === 'express' && <CheckCircle2 className="w-5 h-5" style={{ color: primaryColor }} />}
                  </div>
                  <p className="text-sm font-bold text-gray-900">{currency}{formatPrice(7500)}</p>
                </div>
              </div>
            </section>

            {/* Payment */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-6" style={{ fontFamily: headingFont }}>Payment</h2>
              <div className="space-y-4">
                <label 
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'paystack' ? 'bg-white shadow-sm' : 'bg-gray-50'}`}
                  style={{ borderColor: paymentMethod === 'paystack' ? primaryColor : '#F3F4F6' }}
                >
                  <div className="flex items-center">
                    <div className="relative flex items-center justify-center">
                      <input type="radio" className="sr-only" checked={paymentMethod === 'paystack'} onChange={() => setPaymentMethod('paystack')} />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'paystack' ? '' : 'border-gray-100'}`} style={{ borderColor: paymentMethod === 'paystack' ? primaryColor : '#F3F4F6' }}>
                        {paymentMethod === 'paystack' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />}
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-bold text-gray-900">Paystack</p>
                      <p className="text-xs text-gray-500">Pay securely with your card or bank account</p>
                    </div>
                  </div>
                  <img src="/Paystack.png" alt="Paystack" className="h-6 object-contain" />
                </label>

                <label 
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'flutterwave' ? 'bg-white shadow-sm' : 'bg-gray-50'}`}
                  style={{ borderColor: paymentMethod === 'flutterwave' ? primaryColor : '#F3F4F6' }}
                >
                  <div className="flex items-center">
                    <div className="relative flex items-center justify-center">
                      <input type="radio" className="sr-only" checked={paymentMethod === 'flutterwave'} onChange={() => setPaymentMethod('flutterwave')} />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'flutterwave' ? '' : 'border-gray-100'}`} style={{ borderColor: paymentMethod === 'flutterwave' ? primaryColor : '#F3F4F6' }}>
                        {paymentMethod === 'flutterwave' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />}
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-bold text-gray-900">Flutterwave</p>
                      <p className="text-xs text-gray-500">Fast and secure payments across Africa</p>
                    </div>
                  </div>
                  <img src="/Flutterwave.png" alt="Flutterwave" className="h-6 object-contain" />
                </label>

                <label 
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'whatsapp' ? 'bg-white shadow-sm' : 'bg-gray-50'}`}
                  style={{ borderColor: paymentMethod === 'whatsapp' ? primaryColor : '#F3F4F6' }}
                >
                  <div className="flex items-center">
                    <div className="relative flex items-center justify-center">
                      <input type="radio" className="sr-only" checked={paymentMethod === 'whatsapp'} onChange={() => setPaymentMethod('whatsapp')} />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'whatsapp' ? '' : 'border-gray-100'}`} style={{ borderColor: paymentMethod === 'whatsapp' ? primaryColor : '#F3F4F6' }}>
                        {paymentMethod === 'whatsapp' && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />}
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-bold text-gray-900">Order via WhatsApp</p>
                      <p className="text-xs text-gray-500">Complete your order on WhatsApp</p>
                    </div>
                  </div>
                  <MessageCircle className="w-5 h-5 text-green-500" />
                </label>
              </div>

              {paymentMethod !== 'whatsapp' && (
                <div className="mt-8 space-y-6">
                  <div>
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-2">Card number</label>
                    <input type="text" id="card-number" required className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                  </div>
                  <div>
                    <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700 mb-2">Name on card</label>
                    <input type="text" id="name-on-card" required className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">Expiration date (MM/YY)</label>
                      <input type="text" id="expiry" required className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                      <input type="text" id="cvc" required className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 sm:text-sm h-11 border px-3" style={focusStyle} />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="mt-16 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900 mb-6" style={{ fontFamily: headingFont }}>Order summary</h2>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <ul className="divide-y divide-gray-200 px-6">
                {cart.map((item) => (
                  <li key={item.id} className="flex py-6">
                    <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{item.color}</p>
                          <p className="text-xs text-gray-500 mt-1">{item.size}</p>
                        </div>
                        <button type="button" className="text-gray-400 hover:text-gray-500">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <p className="text-sm font-bold text-gray-900">{currency}{formatPrice(item.price)}</p>
                        <div className="relative">
                          <select className="block w-full rounded-md border-gray-100 shadow-sm focus:border-black focus:ring-black focus:ring-1 text-xs py-1 pl-2 pr-8 border appearance-none bg-white" style={focusStyle}>
                            {[1, 2, 3, 4, 5].map(q => (
                              <option key={q} value={q}>{q}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 py-6 px-6 space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{currency}{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">{currency}{formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxes</span>
                  <span className="font-medium text-gray-900">{currency}{formatPrice(taxes)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>{currency}{formatPrice(total)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 text-white py-4 rounded-md text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-70 flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isProcessing ? "Processing..." : "Confirm order"}
                </button>
                
                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  <Lock className="w-3 h-3" /> Secure Checkout
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
