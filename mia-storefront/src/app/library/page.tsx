"use client";

import React, { useState, useEffect } from 'react';
import ProductDetailsWireframe from './components/ProductDetailsWireframe';
import CartWireframe from './components/CartWireframe';
import CheckoutWireframe from './components/CheckoutWireframe';
import CheckoutWireframeVariant2 from './components/CheckoutWireframeVariant2';
import CheckoutWireframeVariant3 from './components/CheckoutWireframeVariant3';
import NavbarWireframe from './components/NavbarWireframe';
import NavbarVariant2 from './components/NavbarVariant2';
import FooterWireframe from './components/FooterWireframe';
import FooterVariant2 from './components/FooterVariant2';
import ConfirmationWireframe from './components/ConfirmationWireframe';
import ProductListWireframe from './components/ProductListWireframe';
import ProductListWireframeVariant2 from './components/ProductListWireframeVariant2';
import ProductListWireframeVariant3 from './components/ProductListWireframeVariant3';
import WishlistWireframe from './components/WishlistWireframe';
import ContactWireframe from './components/ContactWireframe';
import StorefrontWireframe from './components/StorefrontWireframe';
import { useProducts, useSettings } from '@/hooks/useData';
import { Loader2, Settings2, X, ChevronRight } from 'lucide-react';

const PAGE_TYPES = [
  { id: 'storefront', label: 'Storefront', tags: ['home', 'hero', 'featured'] },
  { id: 'sections', label: 'Sections', tags: ['hero', 'cta', 'banner', 'footer', 'philosophy'] },
  { id: 'product_list', label: 'Product List', tags: ['grid', 'filter', 'sort'] },
  { id: 'product_details', label: 'Product Details', tags: ['minimalist', 'fashion', 'high-end'] },
  { id: 'cart', label: 'Cart', tags: [] },
  { id: 'checkout', label: 'Checkout', tags: ['minimalist', 'clean', 'secure'] },
  { id: 'navbar', label: 'Navbar', tags: ['navigation', 'header', 'menu'] },
  { id: 'footer', label: 'Footer', tags: ['footer', 'links', 'contact'] },
  { id: 'confirmation', label: 'Confirmation', tags: [] },
  { id: 'wishlist', label: 'Wishlist', tags: ['grid', 'save-for-later'] },
  { id: 'contact', label: 'Contact', tags: ['form', 'map', 'info'] },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState(PAGE_TYPES[4].id); // Default to checkout
  const [activeVariant, setActiveVariant] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const activePageType = PAGE_TYPES.find(t => t.id === activeTab);

  // Reset variant when tab changes
  useEffect(() => {
    setActiveVariant(1);
  }, [activeTab]);

  const [isDataMode, setIsDataMode] = useState(false);
  const { products, fetchProducts, loading: loadingProducts } = useProducts();
  const { settings, fetchSettings, loading: loadingSettings } = useSettings();

  // Local state for edits in library
  const [localSettings, setLocalSettings] = useState<any>(null);

  useEffect(() => {
    if (settings && !localSettings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleUpdateSettings = (key: string, value: string) => {
    setLocalSettings((prev: any) => ({ 
      ...(prev || settings || {}), 
      [key]: value 
    }));
  };

  const fonts = [
    { label: 'Sans Serif', value: 'Inter, sans-serif' },
    { label: 'Serif', value: 'Playfair Display, serif' },
    { label: 'Mono', value: 'JetBrains Mono, monospace' },
    { label: 'Modern', value: 'Plus Jakarta Sans, sans-serif' },
    { label: 'Display', value: 'Clash Display, sans-serif' }
  ];

  useEffect(() => {
    if (isDataMode) {
      fetchProducts();
      fetchSettings();
    }
  }, [isDataMode]);
  
  // Force Naira currency for all wireframes as requested
  const settingsWithNaira = (localSettings || settings) ? {
    ...(localSettings || settings),
    currency: "Nigerian Naira (₦)",
    // Map contact fields for ContactWireframe
    contactEmail: (localSettings || settings)?.adminEmail,
    contactPhone: (localSettings || settings)?.storePhone,
    contactAddress: (localSettings || settings)?.storeAddress
  } : undefined;

  // Use local settings if available, otherwise fallback
  const currentPrimaryColor = settingsWithNaira?.primaryColor || '#000000';
  const currentHeadingFont = settingsWithNaira?.headingFont || 'inherit';
  const currentBodyFont = settingsWithNaira?.bodyFont || 'inherit';

  // Helper to map API product to Wireframe props
  const mapProductToWireframe = (apiProduct: any) => {
    if (!apiProduct) return undefined;
    
    return {
      name: apiProduct.name,
      price: Number(apiProduct.price),
      salePrice: undefined, // API doesn't seem to have sale price yet
      description: apiProduct.description,
      images: apiProduct.image_url ? [apiProduct.image_url] : [],
      rating: undefined, // API doesn't have ratings
      reviewCount: undefined,
      variants: {
        colors: [], // API variants structure is flat, complex to map to colors without metadata
        sizes: (apiProduct as any).variants?.map((v: any) => v.name) || [] // simplistic mapping
      },
      policies: {
        description: apiProduct.description,
        fabricCare: undefined,
        shippingReturns: undefined
      },
      category: (apiProduct as any).category || "Shop",
      breadcrumbs: ["Home", "Shop", apiProduct.name]
    };
  };

  const realProductData = products.length > 0 ? mapProductToWireframe(products[0]) : undefined;

  // Helper for Product List
  const mapProductToList = (apiProduct: any) => ({
    id: apiProduct.id,
    name: apiProduct.name,
    price: Number(apiProduct.price),
    salePrice: undefined,
    image: apiProduct.image_url,
    category: "Shop"
  });

  const realProductListData = products.map(mapProductToList);

  // Helper for Collections
  const realCollectionsData = Array.from(new Set(products.map(p => p.category))).map((cat, i) => ({
    id: `col-${i}`,
    name: cat || 'General'
  }));

  // Helper to create cart from products for Checkout
  const createCartFromProducts = (products: any[]) => {
    if (!products || products.length === 0) return [];
    
    // Take up to 2 products
    return products.slice(0, 2).map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      quantity: 1,
      image: p.image_url,
      variant: p.variants && p.variants.length > 0 ? p.variants[0].name : undefined
    }));
  };

  const realCartData = products.length > 0 ? createCartFromProducts(products) : undefined;

  // Helper for Wishlist (reuse some products)
  const realWishlistData = products.slice(0, 3).map(p => ({
    ...mapProductToList(p),
    variant: p.variants && p.variants.length > 0 ? p.variants[0].name : undefined,
    inStock: true
  }));

  // Mock product data for demonstration
  const mockProduct = {
    name: "Classic Heavyweight Cotton T-Shirt",
    price: 60.00,
    salePrice: 45.00,
    description: "Crafted from premium 100% heavyweight cotton, this t-shirt features a relaxed fit and durable construction. Perfect for everyday wear, it combines timeless style with modern comfort.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewCount: 128,
    variants: {
      colors: [
        { name: 'Black', value: '#000000' },
        { name: 'White', value: '#f0f0f0' },
        { name: 'Navy', value: '#1a2b4b' }
      ],
      sizes: ['S', 'M', 'L', 'XL']
    },
    policies: {
      description: "Detailed product description goes here.",
      fabricCare: "Machine wash cold, tumble dry low.",
      shippingReturns: "Free shipping on orders over $100."
    },
    category: "T-Shirts",
    breadcrumbs: ["Home", "Men", "T-Shirts"]
  };

  // Mock data for other views
  const mockCart = [
    {
      id: "mock-1",
      name: mockProduct.name,
      price: mockProduct.salePrice || mockProduct.price,
      quantity: 1,
      image: mockProduct.images[0],
      variant: "L / Black"
    },
    {
      id: "mock-2",
      name: "Minimalist Cap",
      price: 25.00,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=800",
      variant: "One Size"
    }
  ];

  const orderId = "ORD-LIBRARY-PREVIEW";

  const realOrderData = realCartData ? {
    id: orderId,
    items: realCartData,
    subtotal: realCartData.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    total: realCartData.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    shipping: 0,
    tax: 0,
    grandTotal: realCartData.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    date: new Date().toLocaleDateString(),
    email: 'customer@example.com',
    shippingAddress: {
      name: 'Jane Doe',
      line1: '123 Fashion Ave',
      city: 'Lagos',
      state: 'LA',
      postalCode: '100001',
      country: 'Nigeria'
    }
  } : undefined;

  const mockOrder = {
    id: "ORD-7721-XK",
    items: mockCart,
    subtotal: 95.00,
    total: 103.50,
    shipping: 0,
    tax: 8.50,
    grandTotal: 103.50,
    date: new Date().toLocaleDateString(),
    status: "Confirmed",
    email: "customer@example.com"
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden h-screen">
      {/* Side Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 w-80 bg-white border-r border-gray-200 z-[60] transform transition-transform duration-300 ease-in-out shadow-2xl ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">Store Branding</h2>
            <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Primary Color */}
            <div className="space-y-4">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Primary Color</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  value={currentPrimaryColor}
                  onChange={(e) => handleUpdateSettings('primaryColor', e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                />
                <input 
                  type="text" 
                  value={currentPrimaryColor}
                  onChange={(e) => handleUpdateSettings('primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono uppercase"
                />
              </div>
            </div>

            {/* Heading Font */}
            <div className="space-y-4">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Heading Font</label>
              <div className="grid grid-cols-1 gap-2">
                {fonts.map(font => (
                  <button
                    key={font.value}
                    onClick={() => handleUpdateSettings('headingFont', font.value)}
                    className={`px-4 py-3 text-left text-sm border rounded-xl transition-all ${currentHeadingFont === font.value ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gray-300 bg-gray-50'}`}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Body Font */}
            <div className="space-y-4">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Body Font</label>
              <div className="grid grid-cols-1 gap-2">
                {fonts.map(font => (
                  <button
                    key={font.value}
                    onClick={() => handleUpdateSettings('bodyFont', font.value)}
                    className={`px-4 py-3 text-left text-sm border rounded-xl transition-all ${currentBodyFont === font.value ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gray-300 bg-gray-50'}`}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 leading-relaxed italic">
              These changes are live and local to this session. Use the settings modal in the main dashboard to save them permanently.
            </p>
          </div>
        </div>
      </div>

      {/* Drawer Toggle Button */}
      {!isDrawerOpen && (
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 bg-black text-white p-3 rounded-r-2xl shadow-2xl z-50 hover:pl-5 transition-all group"
        >
          <div className="flex flex-col items-center gap-2">
            <Settings2 className="w-5 h-5" />
            <span className="[writing-mode:vertical-lr] text-[10px] font-bold uppercase tracking-widest py-2">Branding</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      )}

      {/* Top Bar with Tabs */}
      <div className="border-b border-gray-200/50 sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 justify-between gap-8">
            <div className="flex items-center gap-4">
              <Settings2 
                className={`w-5 h-5 cursor-pointer transition-colors ${isDrawerOpen ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              />
              <h1 className="text-lg font-semibold text-gray-800 hidden md:block tracking-tight">Template Library</h1>
            </div>
            <div className="flex space-x-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto mask-image-linear-gradient">
              {PAGE_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ease-in-out
                    ${activeTab === type.id 
                      ? 'bg-black text-white shadow-md transform scale-105' 
                      : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Template Metadata Bar */}
        {activePageType?.tags && activePageType.tags.length > 0 && (
          <div className="bg-gray-50/50 border-t border-gray-100 py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {activePageType.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-xs text-gray-600 font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Variant Selector */}
              {(activeTab === 'checkout' || activeTab === 'navbar' || activeTab === 'footer' || activeTab === 'product_list' || activeTab === 'sections') && (
                <div className="ml-auto flex bg-gray-100 rounded-lg p-1 gap-1">
                  <button 
                    onClick={() => setActiveVariant(1)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeVariant === 1 ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                  >
                    V1
                  </button>
                  <button 
                    onClick={() => setActiveVariant(2)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeVariant === 2 ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                  >
                    V2
                  </button>
                  {(activeTab === 'checkout' || activeTab === 'product_list' || activeTab === 'sections') && (
                    <button 
                      onClick={() => setActiveVariant(3)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeVariant === 3 ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
                    >
                      V3
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto no-scrollbar">
        
        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
           <div className="flex items-center gap-2 text-xs text-gray-400">
             <span className="font-medium">Active Font:</span>
             <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200 text-gray-600 font-mono" style={{ fontFamily: currentHeadingFont }}>Heading</span>
             <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200 text-gray-600 font-mono" style={{ fontFamily: currentBodyFont }}>Body</span>
           </div>
           <div className="bg-white border border-gray-200 p-1 rounded-lg flex text-xs font-medium shadow-sm">
             <button 
               onClick={() => setIsDataMode(false)}
               className={`px-4 py-2 rounded-md transition-all ${!isDataMode ? 'bg-gray-100 text-black font-semibold' : 'text-gray-500 hover:text-gray-900'}`}
             >
               Dummy Mode
             </button>
             <button 
               onClick={() => setIsDataMode(true)}
               className={`px-4 py-2 rounded-md transition-all ${isDataMode ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
             >
               Data Mode
             </button>
           </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm min-h-[600px] overflow-y-auto transition-all duration-300 hover:shadow-md">
          {activeTab === 'storefront' ? (
            isDataMode && (loadingProducts || loadingSettings) ? (
              <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <StorefrontWireframe 
                products={isDataMode ? realProductListData : undefined}
                settings={isDataMode ? settingsWithNaira : undefined}
              />
            )
          ) : activeTab === 'sections' ? (
            <div className="p-8 space-y-12 bg-gray-50">
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Section Variant {activeVariant}</h3>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  {activeVariant === 1 ? (
                    <div className="p-12 text-center text-gray-400 italic">Section V1 under construction</div>
                  ) : activeVariant === 2 ? (
                    <div className="p-12 text-center text-gray-400 italic">Section V2 under construction</div>
                  ) : (
                    <ProductListWireframeVariant3 
                      isSection 
                      products={isDataMode ? realProductListData.slice(0, 4) : undefined}
                      collections={isDataMode ? realCollectionsData : undefined}
                      storeSettings={isDataMode ? settingsWithNaira : undefined}
                      onUpdateSettings={handleUpdateSettings}
                    />
                  )}
                </div>
              </section>
            </div>
          ) : activeTab === 'product_details' ? (
            isDataMode && loadingProducts ? (
              <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : isDataMode && (!realProductData) ? (
              <div className="flex flex-col items-center justify-center h-[600px] text-gray-400 gap-2">
                <p className="font-medium">No products found in your store.</p>
                <p className="text-sm">Add products to your store to preview them here.</p>
              </div>
            ) : (
              <ProductDetailsWireframe 
                product={isDataMode ? realProductData : mockProduct} 
                storeSettings={isDataMode ? settingsWithNaira : undefined}
              />
            )
          ) : activeTab === 'product_list' ? (
            isDataMode && loadingProducts ? (
              <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : activeVariant === 1 ? (
              <ProductListWireframe 
                products={isDataMode ? realProductListData : undefined}
                storeSettings={isDataMode ? settingsWithNaira : undefined}
              />
            ) : activeVariant === 2 ? (
              <ProductListWireframeVariant2 
                products={isDataMode ? realProductListData : undefined}
                storeSettings={isDataMode ? settingsWithNaira : undefined}
              />
            ) : (
              <ProductListWireframeVariant3 
                products={isDataMode ? realProductListData : undefined}
                collections={isDataMode ? realCollectionsData : undefined}
                storeSettings={isDataMode ? settingsWithNaira : undefined}
                onUpdateSettings={handleUpdateSettings}
              />
            )
          ) : activeTab === 'wishlist' ? (
             isDataMode && loadingProducts ? (
              <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <WishlistWireframe 
                wishlistItems={isDataMode ? realWishlistData : undefined}
                storeSettings={isDataMode ? settingsWithNaira : undefined}
              />
            )
          ) : activeTab === 'contact' ? (
             isDataMode && loadingSettings ? (
              <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <ContactWireframe 
                storeSettings={isDataMode ? settingsWithNaira : undefined}
              />
            )
          ) : activeTab === 'cart' ? (
            isDataMode && (loadingProducts || loadingSettings) ? (
              <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : isDataMode && (!realCartData || realCartData.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-[600px] text-gray-400 gap-2">
                <p className="font-medium">No products found to create a cart.</p>
                <p className="text-sm">Add products to your store to preview cart.</p>
              </div>
            ) : (
              <CartWireframe 
                cart={isDataMode ? realCartData : undefined} 
                storeSettings={isDataMode ? settingsWithNaira : undefined}
              />
            )
          ) : activeTab === 'checkout' ? (
            isDataMode && (loadingProducts || loadingSettings) ? (
              <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : isDataMode && (!realCartData || realCartData.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-[600px] text-gray-400 gap-2">
                <p className="font-medium">No products found to create a cart.</p>
                <p className="text-sm">Add products to your store to preview checkout.</p>
              </div>
            ) : (
              activeVariant === 1 ? (
                <CheckoutWireframe 
                  cart={isDataMode ? realCartData : undefined} 
                  storeSettings={isDataMode ? settingsWithNaira : undefined}
                />
              ) : activeVariant === 2 ? (
                <CheckoutWireframeVariant2 
                  cart={isDataMode ? realCartData : undefined} 
                  storeSettings={isDataMode ? settingsWithNaira : undefined}
                />
              ) : (
                <CheckoutWireframeVariant3 
                  cart={isDataMode ? realCartData : undefined} 
                  storeSettings={isDataMode ? settingsWithNaira : undefined}
                />
              )
            )
          ) : activeTab === 'navbar' ? (
            <div className="bg-gray-100 min-h-[400px] flex flex-col gap-8 p-8">
              <div className="bg-white shadow-sm overflow-hidden rounded-lg">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variant {activeVariant}
                </div>
                {activeVariant === 1 ? (
                  <NavbarWireframe 
                    storeName={isDataMode ? settingsWithNaira?.storeName : undefined}
                    cartCount={3}
                  />
                ) : (
                  <NavbarVariant2 
                    storeName={isDataMode ? settingsWithNaira?.storeName : undefined}
                    cartCount={3}
                  />
                )}
              </div>
            </div>
          ) : activeTab === 'footer' ? (
             <div className="bg-gray-100 min-h-[400px] flex flex-col gap-8 p-8">
              <div className="bg-white shadow-sm overflow-hidden rounded-lg">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variant {activeVariant}
                </div>
                {activeVariant === 1 ? (
                  <FooterWireframe 
                    storeName={isDataMode ? settingsWithNaira?.storeName : undefined}
                  />
                ) : (
                  <FooterVariant2 
                    storeName={isDataMode ? settingsWithNaira?.storeName : undefined}
                  />
                )}
              </div>
            </div>
          ) : activeTab === 'confirmation' ? (
            isDataMode && (loadingProducts || loadingSettings) ? (
              <div className="flex items-center justify-center h-[600px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : isDataMode && (!realOrderData) ? (
              <div className="flex flex-col items-center justify-center h-[600px] text-gray-400 gap-2">
                <p className="font-medium">No products found to create an order preview.</p>
                <p className="text-sm">Add products to your store to preview confirmation.</p>
              </div>
            ) : (
              <ConfirmationWireframe 
                order={isDataMode ? realOrderData : mockOrder}
                storeSettings={isDataMode ? settingsWithNaira : undefined}
              />
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center opacity-60">
              <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 animate-pulse"></div>
              <h2 className="text-xl font-medium text-gray-400 mb-2">
                {PAGE_TYPES.find(t => t.id === activeTab)?.label}
              </h2>
              <p className="text-gray-400 text-sm max-w-xs">
                This template variant is currently under construction.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
