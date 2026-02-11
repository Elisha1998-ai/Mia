"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useSettings } from '@/hooks/useData';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  sku?: string;
}

export default function ShopPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [addingId, setAddingId] = React.useState<string | null>(null);
  const [showToast, setShowToast] = React.useState(false);
  const [sortBy, setSortBy] = React.useState('newest');
  const [showFilters, setShowFilters] = React.useState(false);
  const { settings, fetchSettings } = useSettings();
  
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const category = searchParams.get('category');

  React.useEffect(() => {
    fetchSettings();
  }, []);

  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        let filteredProducts = data.products || [];

        // Apply search filter
        if (query) {
          const lowerQuery = query.toLowerCase();
          filteredProducts = filteredProducts.filter((p: Product) => 
            p.name.toLowerCase().includes(lowerQuery) || 
            p.description?.toLowerCase().includes(lowerQuery)
          );
        }

        // Apply category filter
        if (category && category !== 'all') {
          // This is a mock category filter as backend might not have it yet
          if (category === 'new') {
            filteredProducts = filteredProducts.slice(0, 4);
          }
        }

        // Apply sorting
        if (sortBy === 'price-low') {
          filteredProducts.sort((a: Product, b: Product) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          filteredProducts.sort((a: Product, b: Product) => b.price - a.price);
        } else if (sortBy === 'newest') {
          filteredProducts.sort((a: Product, b: Product) => b.id.localeCompare(a.id));
        }

        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query, category, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    setAddingId(product.id);
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    
    setTimeout(() => {
      setAddingId(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 500);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-gray-100 w-1/4 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
        ))}
      </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-16 sm:pb-24">
      {/* Hero Section */}
      {!query && (
        <div className="relative py-20 sm:py-32 overflow-hidden border-b border-gray-100 mb-16 sm:mb-24">
          <div className="absolute inset-0 bg-gray-50/50 -z-10"></div>
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
          
          <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
            <div className="space-y-4">
              <h1 className="font-store-heading text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.9]">
                 {settings?.heroTitle ? (
                   settings.heroTitle.split(' ').map((word, i, arr) => (
                     <React.Fragment key={i}>
                       {i === arr.length - 1 ? <span className="text-store-primary">{word}</span> : word}
                       {i < arr.length - 1 ? ' ' : ''}
                       {i === Math.floor(arr.length / 2) && <br />}
                     </React.Fragment>
                   ))
                 ) : (
                   <>
                     The Future of <br />
                     <span className="text-store-primary">{settings?.niche || 'Commerce'}</span>
                   </>
                 )}
               </h1>
               <p className="text-gray-500 text-sm sm:text-lg max-w-xl mx-auto font-light font-store-body">
                 {settings?.heroDescription || `Experience the future of ${settings?.niche?.toLowerCase() || 'commerce'} with ${settings?.storeName || 'Mia'}. Agentic storefronts that understand your needs.`}
               </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="#collection" 
                className="w-full sm:w-auto bg-store-primary text-white px-10 py-5 text-[11px] uppercase tracking-[0.3em] font-bold hover:opacity-90 transition-all rounded-sm shadow-xl flex items-center justify-center gap-3 group"
              >
                Explore Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-8 right-8 z-[100] bg-black text-white px-6 py-4 rounded-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-[11px] uppercase tracking-[0.2em] font-bold">Added to Bag</span>
          </div>
        )}

        {/* Header & Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12 pt-8 sm:pt-0">
          <div>
            <h2 className="font-store-heading text-3xl sm:text-4xl font-medium tracking-tight mb-4">
              {query ? `Results for "${query}"` : 'The Collection'}
            </h2>
            <p className="text-gray-500 text-[10px] sm:text-[12px] uppercase tracking-widest font-medium font-store-body">
              {products.length} Pieces Available
            </p>
          </div>
          <div className="flex flex-wrap gap-4 w-full sm:w-auto font-store-body">
            {query && (
              <Link href="/store" className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gray-50 transition-all">
                Clear Search
              </Link>
            )}
            
            <div className="relative group flex-1 sm:flex-none">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold transition-all ${showFilters ? 'bg-store-primary text-white border-store-primary' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <SlidersHorizontal className="w-4 h-4" /> {showFilters ? 'Close' : 'Filter & Sort'}
              </button>

              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 shadow-2xl z-[50] p-6 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Sort By</h4>
                      <div className="space-y-3">
                        {[
                          { id: 'newest', label: 'Newest First' },
                          { id: 'price-low', label: 'Price: Low to High' },
                          { id: 'price-high', label: 'Price: High to Low' },
                        ].map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setSortBy(option.id);
                              setShowFilters(false);
                            }}
                            className={`block w-full text-left text-[12px] transition-colors ${sortBy === option.id ? 'text-black font-bold' : 'text-gray-400 hover:text-black'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Categories</h4>
                      <div className="space-y-3">
                        {[
                          { id: 'all', label: 'All Items' },
                          { id: 'new', label: 'New Arrivals' },
                          { id: 'featured', label: 'Featured' },
                        ].map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/store${cat.id === 'all' ? '' : `?category=${cat.id}`}`}
                            onClick={() => setShowFilters(false)}
                            className={`block w-full text-left text-[12px] transition-colors ${category === cat.id || (!category && cat.id === 'all') ? 'text-black font-bold' : 'text-gray-400 hover:text-black'}`}
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16 font-store-body">
          {products.map((product) => (
            <div key={product.id} className="group relative">
              <Link href={`/store/products/${product.id}`} className="block">
                <div className="relative aspect-square bg-gray-50 mb-6 overflow-hidden rounded-2xl">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 italic text-[10px] uppercase tracking-widest">
                      No Image
                    </div>
                  )}
                  
                  <button 
                    onClick={(e) => handleQuickAdd(e, product)}
                    disabled={addingId === product.id}
                    className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md py-3 text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 rounded-sm hover:bg-store-primary hover:text-white disabled:bg-gray-100 disabled:text-gray-400 z-10"
                  >
                    {addingId === product.id ? 'Adding...' : 'Quick Add'}
                  </button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-[13px] sm:text-[14px] font-medium tracking-tight text-gray-900 group-hover:underline underline-offset-4 decoration-1">{product.name}</h3>
                  <p className="text-[13px] sm:text-[14px] text-gray-500 font-light">₦{product.price.toLocaleString()}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 font-store-body">
          <p className="text-gray-500 text-lg mb-8">No products found matching your criteria.</p>
          <Link 
            href="/store" 
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-bold text-black border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
          >
            View All Products
          </Link>
        </div>
      )}
      </div>
    </div>
  );
}
