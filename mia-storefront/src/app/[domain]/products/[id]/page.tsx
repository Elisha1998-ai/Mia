"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/useData';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Minus, 
  Plus, 
  Truck, 
  RotateCcw, 
  Check,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url?: string;
  description?: string;
  sku?: string;
  category?: string;
  images?: string[];
  variants?: {
    materials?: string[];
    sizes?: string[];
  };
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { settings, fetchSettings } = useSettings();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);
  const [isWishlisted, setIsWishlisted] = React.useState(false);

  React.useEffect(() => {
    fetchSettings();
    
    const load = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        
        // Mocking additional images only if the real data doesn't have them
        const images = data.images || (data.image_url ? [data.image_url] : []);
        
        const updatedProduct = {
          ...data,
          images: images,
          original_price: data.original_price || (data.price > 0 ? undefined : undefined) // Real discount check
        };
        
        setProduct(updatedProduct);
        
        // Initial wishlist check
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsWishlisted(wishlist.some((i: any) => i.id === updatedProduct.id));
      } catch (e) {
        console.error('Product fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse space-y-4">
          <div className="p-[10px]">
            <div className="aspect-square bg-gray-50 rounded-[10px]" />
          </div>
          <div className="p-4 space-y-4">
            <div className="h-8 bg-gray-50 w-3/4 rounded" />
            <div className="h-6 bg-gray-50 w-1/4 rounded" />
            <div className="h-24 bg-gray-50 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-6">
        <h2 className="text-4xl font-black tracking-tighter">Product not found</h2>
        <button onClick={() => router.push('/')} className="text-xs font-black uppercase tracking-widest underline underline-offset-8">Return Home</button>
      </div>
    );
  }

  // Build settings
  const primaryColor = settings?.primaryColor || '#6366f1';
  const headingFont = settings?.headingFont || 'inherit';

  const totalPrice = Number(product.price) * quantity;
  const originalTotalPrice = product.original_price ? Number(product.original_price) * quantity : null;

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.findIndex((i: any) => i.id === product.id);
    if (existing > -1) {
      cart[existing].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    // No redirect anymore
  };

  const buyNow = () => {
    addToCart();
    router.push('/checkout');
  };

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const existing = wishlist.findIndex((i: any) => i.id === product.id);
    if (existing > -1) {
      wishlist.splice(existing, 1);
      setIsWishlisted(false);
    } else {
      wishlist.push(product);
      setIsWishlisted(true);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const hasMultipleImages = product.images && product.images.length > 1;

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Visuals - Gallery */}
          <div className="p-[10px] relative">
            <div className="aspect-square bg-gray-50 overflow-hidden relative group rounded-[10px]">
              <img 
                src={product.images?.[0] || product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              
              {/* Image Indicators - Only if multiple images */}
              {hasMultipleImages && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {product.images?.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${i === 0 ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} />
                  ))}
                </div>
              )}

              {/* Next/Prev buttons - Only if multiple images */}
              {hasMultipleImages && (
                <>
                  <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center text-white hidden lg:flex transition-opacity opacity-0 group-hover:opacity-100">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center text-white hidden lg:flex transition-opacity opacity-0 group-hover:opacity-100">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Quantity Tabbed Button - Bottom Right of Image */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md rounded-[10px] border border-gray-100 p-0.5 flex items-center shadow-sm">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 text-center font-bold text-xs">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-[8px] hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="px-4 py-8 lg:px-0 lg:py-12 space-y-6">
            <div className="space-y-1">
               <h1 className="text-2xl font-bold tracking-tight text-gray-900" style={{ fontFamily: headingFont }}>
                 {product.name}
               </h1>
               
               <div className="flex items-center gap-3">
                  <span className="text-lg font-medium text-gray-900">₦{totalPrice.toLocaleString()}</span>
                  {product.original_price && Number(product.original_price) > Number(product.price) && (
                    <>
                      <span className="text-sm text-gray-400 line-through font-medium">₦{originalTotalPrice?.toLocaleString()}</span>
                      <span className="bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                        {Math.round((1 - Number(product.price) / Number(product.original_price)) * 100)}% off
                      </span>
                    </>
                  )}
               </div>
            </div>

            {/* Description - Moved under Name/Price duo */}
            <div className="pt-2">
              <p className="text-sm leading-relaxed text-gray-600">
                {product.description || 'Elevate your space with this premium selection, crafted with care and high-quality materials.'}
              </p>
            </div>

            {/* Main Actions */}
            <div className="space-y-3 pt-4">
               <button 
                 onClick={addToCart}
                 className="w-full py-4 rounded-[10px] font-bold text-sm tracking-tight transition-all active:scale-[0.98] shadow-sm text-white"
                 style={{ backgroundColor: primaryColor }}
               >
                 Add to cart
               </button>
               <button 
                 onClick={buyNow}
                 className="w-full bg-black text-white py-4 rounded-[10px] font-bold text-sm tracking-tight transition-all active:scale-[0.98] shadow-sm"
               >
                 Buy now
               </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <button 
                onClick={toggleWishlist}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-[10px] font-bold text-xs hover:bg-gray-50 transition-colors"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500 border-red-500' : ''}`} />
                {isWishlisted ? 'Saved' : 'Save'}
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-200 rounded-[10px] font-bold text-xs hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

