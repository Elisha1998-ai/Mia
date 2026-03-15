"use client";

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useSettings } from '@/hooks/useData';
import { ShoppingBag, Users, ArrowRight, Share2, MoreHorizontal, Plus, User, Image as ImageIcon } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  sku?: string;
  category?: string;
  isDigital?: boolean;
}

export default function ShopPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const { settings, fetchSettings } = useSettings();
  const router = useRouter();
  const params = useParams();
  const domain = params?.domain as string;
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const PRODUCTS_PER_PAGE = 20;

  const [allProducts, setAllProducts] = React.useState<Product[]>([]);

  const addToCartInstant = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.findIndex((i: any) => i.id === product.id);
    if (existing > -1) {
      cart[existing].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
  };

  React.useEffect(() => {
    fetchSettings();
  }, []);

  // Effect for initial fetch
  React.useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const hostname = window.location.hostname;
        const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
        const baseDomain = isLocal ? 'localhost' : 'bloume.shop';
        const subdomain = hostname.includes(`.${baseDomain}`) ? hostname.split(`.${baseDomain}`)[0] : null;
        const domainParam = (domain || subdomain) as string;

        if (!domainParam || domainParam === 'localhost') {
           setAllProducts([]);
           return;
        }

        const productsRes = await fetch(`/api/products?domain=${domainParam}`).catch(() => null);
        const productsData = productsRes?.ok ? await productsRes.json() : { products: [] };
        setAllProducts(productsData.products || []);
      } catch (e) {
        console.error('Error fetching products:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, [domain]);

  // Effect for filtering
  React.useEffect(() => {
    if (query) {
      const q = query.toLowerCase();
      console.log('Filtering with query:', q);
      console.log('All products:', allProducts);
      
      const filtered = allProducts.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        console.log(`Product: ${p.name}, Name Match: ${nameMatch}, Desc Match: ${descMatch}`);
        return nameMatch || descMatch;
      });
      
      console.log('Filtered results:', filtered);
      setProducts(filtered);
    } else {
      setProducts(allProducts);
    }
    setPage(1); // Reset to first page on search
  }, [query, allProducts]);

  const primaryColor = settings?.primaryColor || '#000000';
  const headingFont = settings?.headingFont || 'inherit';

  // Pagination slicing
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const paginatedProducts = products.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-64 bg-gray-50 animate-pulse" />
        <div className="px-6 -mt-12 space-y-8">
           <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white animate-pulse" />
              <div className="space-y-2 flex-1">
                 <div className="h-6 bg-gray-100 w-1/3 rounded" />
                 <div className="h-4 bg-gray-100 w-1/4 rounded" />
              </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-50 rounded-2xl animate-pulse" />)}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[280px] sm:h-[350px]">
        {/* Background Image */}
        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center overflow-hidden">
          {settings?.heroImage ? (
            <img 
              src={settings.heroImage} 
              className="w-full h-full object-cover"
              alt="Hero"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-200">
              <ImageIcon className="w-12 h-12" />
              <button className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/20 hover:bg-white/30 transition-all">
                Upload Cover Image
              </button>
            </div>
          )}
          {/* Transparent to White Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </div>
        
        {/* Profile Content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
           <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                 {/* Store Info */}
                 <div className="space-y-0.5">
                    <h1 className="text-xl sm:text-3xl font-black tracking-tighter text-gray-900 leading-none" style={{ fontFamily: headingFont }}>
                       {settings?.storeName || 'Pony Store'}
                    </h1>
                    <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[9px] sm:text-xs">
                       <Users className="w-2.5 h-2.5" />
                       <span>{settings?.customerCount || '1.2k'} active customers</span>
                    </div>
                 </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => {
                  const el = document.getElementById('products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all hidden xs:flex items-center gap-2 shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                Shop Now
                <ArrowRight className="w-3 h-3" />
              </button>
           </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="products" className="pt-12 space-y-12">
        {/* Product Grid (Responsive: 2 mobile, 4 tablet, 6 desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-12">
          {paginatedProducts.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer space-y-4"
              onClick={() => router.push(`/products/${product.id}`)}
            >
              {/* Product Image Frame */}
              <div className="relative aspect-square rounded-[1rem] overflow-hidden bg-gray-50 border border-black/5 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05)] transition-all duration-500 group-hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] group-hover:-translate-y-1">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-200">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}
                
                {/* Plus Icon Button - Instant Add to Cart */}
                <button 
                  className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-[10px] flex items-center justify-center text-black border border-black/5 shadow-sm transition-all hover:bg-black hover:text-white group-hover:scale-110 active:scale-95 z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCartInstant(product);
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="space-y-1 text-left px-1">
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 leading-tight group-hover:text-store-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm font-medium text-gray-500">
                  ₦{Number(product.price).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-12 pb-8">
             <button 
               disabled={page === 1}
               onClick={() => setPage(p => Math.max(1, p - 1))}
               className="p-3 bg-gray-50 rounded-full disabled:opacity-30 transition-all hover:bg-gray-100"
             >
                <ArrowRight className="w-4 h-4 rotate-180" />
             </button>
             <div className="text-[10px] font-black tracking-widest uppercase">
                Page {page} of {totalPages}
             </div>
             <button 
               disabled={page === totalPages}
               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
               className="p-3 bg-gray-50 rounded-full disabled:opacity-30 transition-all hover:bg-gray-100"
             >
                <ArrowRight className="w-4 h-4" />
             </button>
          </div>
        )}

        {/* Empty State */}
        {!products.length && !loading && (
          <div className="py-24 text-center space-y-6">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <ShoppingBag className="w-6 h-6 text-gray-200" />
            </div>
            <h2 className="text-xl font-black tracking-tighter text-gray-300 uppercase italic">No items found</h2>
            <button 
              onClick={() => router.push('/')}
              className="text-[10px] font-black uppercase tracking-widest underline underline-offset-8 decoration-gray-200 hover:decoration-black transition-all"
            >
              Reset filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
