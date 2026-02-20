"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Heart, Share2, Facebook, Twitter, Mail, Minus, Plus, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  sku?: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const { settings, fetchSettings } = useSettings();

  React.useEffect(() => {
    fetchSettings();
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    setIsAdding(true);
    
    // Simple cart management with localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Dispatch event for header update
    window.dispatchEvent(new Event('cart-updated'));
    
    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const message = `*Inquiry for ${product.name}*\n\n` +
      `*Product:* ${product.name}\n` +
      `*Price:* ₦${product.price.toLocaleString()}\n` +
      `*Quantity:* ${quantity}\n\n` +
      `I'm interested in buying this item. Is it available?`;
    
    const whatsappNumber = settings?.storePhone?.replace(/[^0-9]/g, '') || '2348012345678';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-square bg-gray-100 rounded-lg"></div>
          <div className="space-y-8">
            <div className="h-10 bg-gray-100 w-3/4 rounded"></div>
            <div className="h-6 bg-gray-100 w-1/4 rounded"></div>
            <div className="h-32 bg-gray-100 w-full rounded"></div>
            <div className="h-12 bg-gray-100 w-full rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-store-heading mb-4">Product Not Found</h2>
        <Link href="/store" className="text-store-primary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 w-full font-store-body antialiased pb-12 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-8 sm:mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/store" className="hover:text-black transition-colors">Shop</Link>
          <span className="text-gray-200">/</span>
          <span className="text-black truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 overflow-hidden rounded-2xl group border border-gray-100">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-sm">No Image</div>
              )}
            </div>
          </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="border-b border-gray-100 pb-8 mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-store-heading font-medium tracking-tight mb-4 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-4 mb-6">
                  <p className="text-2xl font-medium">₦{product.price.toLocaleString()}</p>
                  <div className="h-4 w-[1px] bg-gray-200"></div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 fill-black text-black" />
                    ))}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">24 Reviews</span>
                  </div>
                </div>
                <p className="text-gray-500 font-light leading-relaxed max-w-xl">
                  {product.description || "A meticulously crafted piece designed with both form and function in mind. Part of our latest collection, this item embodies the essence of modern elegance and superior craftsmanship."}
                </p>
              </div>

              {/* Add to Cart Section */}
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center border border-gray-200 rounded-sm w-full sm:w-auto">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 bg-white text-black border border-black py-4 px-8 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
                  >
                    {isAdding ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : showSuccess ? (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                        <CheckCircle2 className="w-4 h-4" /> Added to Bag
                      </div>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Bag
                      </>
                    )}
                  </button>

                  <button 
                    onClick={handleWhatsAppOrder}
                    className="flex-1 bg-emerald-500 text-white py-4 px-8 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-emerald-600 transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    <MessageCircle className="w-4 h-4" /> Pay on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
