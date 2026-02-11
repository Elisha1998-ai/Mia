"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Lock, CreditCard, Truck, ShieldCheck, MessageCircle } from 'lucide-react';
import { useSettings } from '@/hooks/useData';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const { settings, fetchSettings } = useSettings();

  const [shippingInfo, setShippingInfo] = React.useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: ''
  });

  React.useEffect(() => {
    fetchSettings();
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0 && !isSuccess) {
      router.push('/store');
    }
    setCart(savedCart);
    setLoading(false);
  }, [router, isSuccess]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Format WhatsApp message
      const orderItems = cart.map(item => `- ${item.name} (x${item.quantity}): ₦${(item.price * item.quantity).toLocaleString()}`).join('\n');
      const message = `*New Order from ${settings?.storeName || 'Mia Store'}*\n\n` +
        `*Customer Details:*\n` +
        `- Name: ${shippingInfo.firstName} ${shippingInfo.lastName}\n` +
        `- Address: ${shippingInfo.address}, ${shippingInfo.city}\n` +
        `- Phone: ${shippingInfo.phone}\n\n` +
        `*Order Items:*\n${orderItems}\n\n` +
        `*Total Amount:* ₦${total.toLocaleString()}\n` +
        `*Shipping:* ${shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}\n\n` +
        `Please confirm availability and send payment details.`;

      const whatsappNumber = settings?.storePhone?.replace(/[^0-9]/g, '') || '2348012345678';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));
      setIsSuccess(true);

      // Redirect to WhatsApp after success
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);

    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 bg-gray-50 h-[600px] animate-pulse"></div>;

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 sm:py-32 text-center animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-100">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-medium mb-6 tracking-tight">Order Confirmed</h1>
        <p className="text-gray-500 mb-12 text-lg leading-relaxed max-w-lg mx-auto">
          Thank you for your purchase. Mia has received your order and is currently processing it with our logistics partners.
        </p>
        <div className="bg-gray-50 p-8 rounded-sm border border-gray-100 mb-12 text-left max-w-md mx-auto">
          <div className="flex justify-between text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-4">
            <span>Order Number</span>
            <span className="text-black">#MIA-{Math.floor(Math.random() * 90000) + 10000}</span>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-widest leading-loose">
            A confirmation email has been sent to your inbox. We'll notify you as soon as your items are dispatched.
          </p>
        </div>
        <Link 
          href="/store" 
          className="inline-flex items-center gap-3 bg-black text-white px-12 py-5 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-gray-900 transition-all rounded-sm shadow-2xl"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <Link 
        href="/store/cart" 
        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-black mb-12 transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Bag
      </Link>

      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-16">
        {/* Checkout Form */}
        <div className="flex-1 space-y-12">
          <section>
            <h2 className="font-serif text-2xl font-medium mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-black text-white text-xs flex items-center justify-center font-sans font-bold">1</span>
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">First Name</label>
                <input 
                  required 
                  value={shippingInfo.firstName}
                  onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                  className="w-full bg-white border border-gray-200 px-5 py-4 text-sm focus:outline-none focus:border-black rounded-sm transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Last Name</label>
                <input 
                  required 
                  value={shippingInfo.lastName}
                  onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                  className="w-full bg-white border border-gray-200 px-5 py-4 text-sm focus:outline-none focus:border-black rounded-sm transition-all" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Street Address</label>
                <input 
                  required 
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                  className="w-full bg-white border border-gray-200 px-5 py-4 text-sm focus:outline-none focus:border-black rounded-sm transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">City</label>
                <input 
                  required 
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                  className="w-full bg-white border border-gray-200 px-5 py-4 text-sm focus:outline-none focus:border-black rounded-sm transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Phone</label>
                <input 
                  required 
                  type="tel" 
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                  className="w-full bg-white border border-gray-200 px-5 py-4 text-sm focus:outline-none focus:border-black rounded-sm transition-all" 
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-medium mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-black text-white text-xs flex items-center justify-center font-sans font-bold">2</span>
              Payment Method
            </h2>
            <div className="space-y-4">
              <div className="border border-black p-6 rounded-sm flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-4">
                  <MessageCircle className="w-6 h-6 text-emerald-500" />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest">Pay via WhatsApp</p>
                    <p className="text-xs text-gray-400">Order details will be sent to our WhatsApp for payment</p>
                  </div>
                </div>
                <div className="w-5 h-5 border-4 border-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-black rounded-full"></div>
                </div>
              </div>
              <div className="border border-gray-100 p-6 rounded-sm flex items-center justify-between text-gray-400 grayscale opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <CreditCard className="w-6 h-6" />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest">Card / Bank Transfer</p>
                    <p className="text-xs">Temporarily disabled</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Order Review */}
        <div className="w-full lg:w-[450px]">
          <div className="bg-gray-50 p-8 sm:p-10 rounded-sm sticky top-32 border border-gray-100">
            <h2 className="text-[12px] uppercase tracking-[0.2em] font-bold mb-8 border-b border-gray-200 pb-4">Order Review</h2>
            
            <div className="max-h-[300px] overflow-y-auto mb-8 pr-2 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight mb-1">{item.name}</p>
                    <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-sm mb-10 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">₦{shipping.toLocaleString()}</span>
              </div>
              <div className="pt-6 border-t border-gray-200 flex justify-between items-end">
                <span className="text-gray-900 font-bold uppercase tracking-widest text-[11px]">Total</span>
                <span className="text-2xl font-medium tracking-tight">₦{total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-black text-white py-6 text-[11px] uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-3 hover:bg-gray-900 transition-all rounded-sm shadow-2xl disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Place Order
                </>
              )}
            </button>

            <div className="mt-8 flex items-center justify-center gap-3 text-gray-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Secure Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
