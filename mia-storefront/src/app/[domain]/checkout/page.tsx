"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/useData';
import CheckoutWireframe from '@/app/library/components/CheckoutWireframe';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  image?: string;
  variant?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { settings, fetchSettings } = useSettings();

  React.useEffect(() => {
    fetchSettings();
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    if (saved.length === 0) {
      router.push('/');
      return;
    }
    setCart(saved);
    setLoading(false);
  }, [router]);

  // Build settings
  const primaryColor = settings?.primaryColor || '#000000';
  const headingFont = settings?.headingFont || 'inherit';

  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });

  const total = cart.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill in your name, phone, and delivery address.');
      return;
    }

    const itemsList = cart
      .map((item) => `- ${item.name} (x${item.quantity}) - ₦${(Number(item.price) * item.quantity).toLocaleString()}`)
      .join('\n');

    const message = `*NEW ORDER FROM ${settings?.storeName?.toUpperCase()}*\n\n` +
      `*Customer Details:*\n` +
      `Name: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Address: ${formData.address}\n` +
      (formData.notes ? `Notes: ${formData.notes}\n` : '') +
      `\n*Order Summary:*\n${itemsList}\n\n` +
      `*Total: ₦${total.toLocaleString()}*`;

    const encoded = encodeURIComponent(message);
    const storePhone = settings?.storePhone?.replace(/\D/g, '') || '';
    const formattedPhone = storePhone.startsWith('234') ? storePhone : `234${storePhone.startsWith('0') ? storePhone.slice(1) : storePhone}`;
    
    // Clear cart before redirecting
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cart-updated'));
    
    window.open(`https://wa.me/${formattedPhone}?text=${encoded}`, '_blank');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-32 px-6">
        <div className="max-w-screen-xl mx-auto space-y-8 animate-pulse">
          <div className="h-12 bg-gray-50 rounded-xl w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-96 bg-gray-50 rounded-[2.5rem]" />
            <div className="h-64 bg-gray-50 rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Order Summary - Social Vibe Left Side */}
          <div className="space-y-12">
            <div className="space-y-4">
               <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter" style={{ fontFamily: headingFont }}>
                 Checkout
               </h1>
               <p className="text-sm font-medium text-gray-500">
                 Finalize your order via Whatsapp
               </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-gray-50/50 border border-gray-100/50 space-y-8">
               <div className="space-y-6">
                 {cart.map((item) => (
                   <div key={item.id} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 overflow-hidden flex-shrink-0">
                            <img src={item.image_url || item.image} alt={item.name} className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <p className="text-sm font-black text-gray-900 line-clamp-1">{item.name}</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Qty: {item.quantity}</p>
                         </div>
                      </div>
                      <p className="text-sm font-black text-gray-900">₦{(Number(item.price) * item.quantity).toLocaleString()}</p>
                   </div>
                 ))}
               </div>

               <div className="h-px bg-gray-100" />

               <div className="space-y-4 font-black uppercase tracking-widest">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Subtotal</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl tracking-tighter text-gray-900">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Checkout Form - Right Side */}
          <div className="space-y-12">
             <div className="space-y-8">
                <form onSubmit={handleWhatsAppCheckout} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 ml-4">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. John Doe"
                        className="w-full bg-[#f3f4f6] border border-gray-200/50 px-8 py-5 rounded-[10px] text-sm font-medium focus:ring-0 focus:border-gray-300 transition-all shadow-none"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 ml-4">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="e.g. 08012345678"
                        className="w-full bg-[#f3f4f6] border border-gray-200/50 px-8 py-5 rounded-[10px] text-sm font-medium focus:ring-0 focus:border-gray-300 transition-all shadow-none"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 ml-4">Delivery Address</label>
                      <textarea 
                        required
                        placeholder="Street, City, State"
                        className="w-full bg-[#f3f4f6] border border-gray-200/50 px-8 py-5 rounded-[10px] text-sm font-medium focus:ring-0 focus:border-gray-300 transition-all shadow-none min-h-[120px]"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                   </div>

                   <button 
                     type="submit"
                     className="w-full bg-green-500 text-white py-4 rounded-[10px] font-medium text-sm flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-none mt-8"
                   >
                     Complete order on Whatsapp
                     <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                   </button>
                </form>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
