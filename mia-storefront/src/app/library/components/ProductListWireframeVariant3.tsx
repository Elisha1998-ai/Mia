"use client";

import React from 'react';
import { ShoppingBag, ArrowRight, Play, Star, Heart, User, Search, Instagram, Youtube, Twitter } from 'lucide-react';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';
import { adjustBrightness, hexToRgba } from '@/lib/colorUtils';

export interface ProductListProps {
  isSection?: boolean;
  onUpdateSettings?: (key: string, value: string) => void;
  storeSettings?: {
    primaryColor?: string;
    headingFont?: string;
    bodyFont?: string;
    currency?: string;
    storeName?: string;
    announcementText?: string;
    heroTitle?: string;
    heroButtonText?: string;
    heroImage?: string;
    skincareBannerTitle?: string;
    skincareBannerImage?: string;
    accessoriesBannerTitle?: string;
    accessoriesBannerImage?: string;
    storyTitle?: string;
    storyContent?: string;
    footerCTATitle?: string;
    footerCTAButtonText?: string;
  };
  products?: Array<{
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    image?: string;
    category?: string;
    shortDescription?: string;
    size?: string;
    badge?: string;
  }>;
  collections?: Array<{
    id: string;
    name: string;
  }>;
}

export default function ProductListWireframeVariant3({ products: propProducts, collections = [], storeSettings, isSection = false, onUpdateSettings }: ProductListProps) {
  const getCurrencySymbol = (str?: string) => {
    if (!str) return "$";
    if (str.includes("₦") || str.toLowerCase().includes("naira")) return "₦";
    const match = str.match(/\(([^)]+)\)/);
    if (match) return match[1];
    return str;
  };

  const currency = getCurrencySymbol(storeSettings?.currency);
  const primaryColor = storeSettings?.primaryColor || "#000000";
  const headingFont = storeSettings?.headingFont || "serif";
  const bodyFont = storeSettings?.bodyFont || "inherit";

  // Dynamic Tones based on Primary Color
  const lightTone = adjustBrightness(primaryColor, 90); // Very light/wash
  const mediumTone = adjustBrightness(primaryColor, 40); // Soft accent
  const darkTone = adjustBrightness(primaryColor, -40); // Deep accent
  const mutedDark = adjustBrightness(primaryColor, -70); // Almost black but tinted
  const primaryRgba = hexToRgba(primaryColor, 0.9);
  const primarySoftRgba = hexToRgba(primaryColor, 0.1);

  // State for dummy products so they are editable
  const [dummyProducts, setDummyProducts] = React.useState([
    { id: "1", name: "Custom Shampoo", price: 28.75, size: "8.5 fl oz", image: "https://images.unsplash.com/photo-1585751353027-2797fa86938f?auto=format&fit=crop&q=80&w=800", category: "Cleanse" },
    { id: "2", name: "Custom Conditioner", price: 28.75, size: "8.5 fl oz", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800", category: "Condition" },
    { id: "3", name: "Custom Scalp Mask", price: 42.50, size: "8.5 fl oz", image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=800", category: "Treat" },
    { id: "4", name: "Custom Hair Mask", price: 42.50, size: "8.5 fl oz", image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800", category: "Treat" },
    { id: "5", name: "Custom Styling Gel", price: 27.20, size: "5.1 fl oz", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800", category: "Style" },
    { id: "6", name: "Custom Root Source®", price: 54.40, size: "Two daily capsules", image: "https://images.unsplash.com/photo-1584305671510-7998c0678972?auto=format&fit=crop&q=80&w=800", category: "Supplement" },
    { id: "7", name: "Custom Scalp Serum", price: 49.00, size: "1.7 fl oz", badge: "NEW", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=800", category: "Treat" },
    { id: "8", name: "Custom Hair Density Set", price: 147.00, size: "Full hair in two simple steps", image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800", category: "Set" },
    { id: "9", name: "Custom Hair Oil", price: 41.00, size: "1.7 fl oz", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800", category: "Style" },
    { id: "10", name: "Custom Dry Shampoo", price: 27.20, size: "1.3 oz", image: "https://images.unsplash.com/photo-1590159357421-2e6500472f8d?auto=format&fit=crop&q=80&w=800", category: "Cleanse" },
    { id: "11", name: "Custom Leave-In Conditioner", price: 27.20, size: "5.1 fl oz", image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800", category: "Condition" },
    { id: "12", name: "Custom Curl Cream", price: 27.20, size: "5.1 fl oz", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800", category: "Style" },
  ]);

  const displayProducts = propProducts && propProducts.length > 0 ? propProducts : dummyProducts;

  const handleUpdateProduct = (id: string, key: string, value: string) => {
    setDummyProducts(prev => prev.map(p => p.id === id ? { ...p, [key]: value } : p));
  };

  return (
    <div className={`w-full ${isSection ? '' : 'min-h-full no-scrollbar'} bg-white`} style={{ fontFamily: bodyFont }}>
      
      {!isSection && (
        <>
          {/* Announcement Bar */}
          <div className="text-white py-2 text-center text-[10px] font-bold tracking-widest uppercase" style={{ backgroundColor: primaryColor }}>
            {onUpdateSettings ? (
              <EditableText
                initialValue={storeSettings?.announcementText || "Subscribe for 20% off forever"}
                onSave={(val) => onUpdateSettings('announcementText', val)}
                tagName="span"
              />
            ) : (
              storeSettings?.announcementText || "Subscribe for 20% off forever"
            )}
          </div>

          {/* Header */}
          <header className="px-6 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
            <div className="flex items-center gap-6">
              <span className="text-xl font-bold tracking-tighter" style={{ fontFamily: headingFont }}>{storeSettings?.storeName || 'prose'}</span>
              <nav className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                {collections && collections.length > 0 ? (
                  collections.map(col => (
                    <a key={col.id} href="#" className="hover:text-black">{col.name}</a>
                  ))
                ) : (
                  // Only show defaults if user has NO collections
                  null
                )}
                <a href="#" className="hover:text-black">Our Ingredients</a>
                <a href="#" className="hover:text-black">About Us</a>
              </nav>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <a href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-black">Reviews</a>
              <a href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-black">Gift Prose</a>
              <a href="#" className="text-[11px] font-bold uppercase tracking-widest hover:text-black">Subscribe & Save</a>
              <ShoppingBag className="w-5 h-5 ml-4" />
              <User className="w-5 h-5" />
            </div>
          </header>
        </>
      )}

      {/* Editorial Hero */}
      <section className="relative h-[80vh] flex items-center overflow-hidden" style={{ backgroundColor: darkTone }}>
        <div className="absolute inset-0 z-0">
          {onUpdateSettings ? (
            <EditableImage
              initialValue={storeSettings?.heroImage || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=2000"}
              onSave={(val) => onUpdateSettings('heroImage', val)}
              className="w-full h-full"
              aspectRatio="h-full"
              alt="Custom Haircare Display"
            />
          ) : (
            <img 
              src={storeSettings?.heroImage || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=2000"} 
              className="w-full h-full object-cover opacity-80 mix-blend-multiply"
              alt="Custom Haircare Display"
            />
          )}
          {/* Subtle color overlay to pull the image into the brand color */}
          <div className="absolute inset-0 z-0" style={{ backgroundColor: primaryColor, opacity: 0.2 }} />
        </div>
        <div className="container mx-auto px-12 relative z-10 flex justify-end">
          <div className="max-w-lg text-right">
            {onUpdateSettings ? (
              <EditableText
                initialValue={storeSettings?.heroTitle || "Custom haircare and supplements"}
                onSave={(val) => onUpdateSettings('heroTitle', val)}
                tagName="h1"
                className="text-5xl md:text-6xl font-light mb-8 text-white leading-[1.1]"
                style={{ fontFamily: headingFont }}
              />
            ) : (
              <h1 className="text-5xl md:text-6xl font-light mb-8 text-white leading-[1.1]" style={{ fontFamily: headingFont }}>
                {storeSettings?.heroTitle || "Custom haircare and supplements"}
              </h1>
            )}
            <button 
              className="backdrop-blur-md text-white px-10 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-white/20 transition-all shadow-lg"
              style={{ backgroundColor: hexToRgba(primaryColor, 0.4) }}
            >
              {onUpdateSettings ? (
                <EditableText
                  initialValue={storeSettings?.heroButtonText || "GET YOUR FORMULA"}
                  onSave={(val) => onUpdateSettings('heroButtonText', val)}
                  tagName="span"
                />
              ) : (
                storeSettings?.heroButtonText || "GET YOUR FORMULA"
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Product List Header */}
      <div className="container mx-auto px-6 pt-24 pb-12 text-center">
        <h2 className="text-2xl font-light mb-6 text-gray-800" style={{ fontFamily: headingFont }}>The Collection</h2>
        <div className="w-12 h-px bg-gray-200 mx-auto"></div>
      </div>

      {/* Editorial Grid */}
      <div className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {displayProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative aspect-[1/1] mb-6 bg-[#f7f7f5] flex items-center justify-center overflow-hidden rounded-sm">
                {product.badge && (
                  <div className="absolute top-4 left-4 w-10 h-10 bg-[#eaff00] rounded-full flex items-center justify-center text-[10px] font-black text-black z-10 shadow-sm">
                    {product.badge}
                  </div>
                )}
                
                {!propProducts || propProducts.length === 0 ? (
                  <EditableImage
                    initialValue={product.image}
                    onSave={(val) => handleUpdateProduct(product.id, 'image', val)}
                    className="w-full h-full"
                    aspectRatio="h-full"
                    alt={product.name}
                  />
                ) : (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                
                <button className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest shadow-xl whitespace-nowrap z-20">
                  CUSTOMIZE
                </button>
              </div>
              <div className="text-center space-y-1">
                {!propProducts || propProducts.length === 0 ? (
                  <EditableText
                    initialValue={product.name}
                    onSave={(val) => handleUpdateProduct(product.id, 'name', val)}
                    tagName="h3"
                    className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors"
                    style={{ fontFamily: headingFont }}
                  />
                ) : (
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors" style={{ fontFamily: headingFont }}>
                    {product.name}
                  </h3>
                )}
                
                <p className="text-[11px] text-gray-500">
                  From {currency}{product.price.toFixed(2)}, {product.size}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Banners */}
      <section className="container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
            {onUpdateSettings ? (
              <EditableImage
                initialValue={storeSettings?.skincareBannerImage || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1200"}
                onSave={(val) => onUpdateSettings('skincareBannerImage', val)}
                className="w-full h-full"
                aspectRatio="h-full"
                alt="Skincare"
              />
            ) : (
              <img 
                src={storeSettings?.skincareBannerImage || "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1200"} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Skincare"
              />
            )}
            <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center text-white text-center p-8 pointer-events-none">
              {onUpdateSettings ? (
                <EditableText
                  initialValue={storeSettings?.skincareBannerTitle || "Discover custom skincare"}
                  onSave={(val) => onUpdateSettings('skincareBannerTitle', val)}
                  tagName="h3"
                  className="text-3xl font-light mb-6 pointer-events-auto"
                  style={{ fontFamily: headingFont }}
                />
              ) : (
                <h3 className="text-3xl font-light mb-6" style={{ fontFamily: headingFont }}>{storeSettings?.skincareBannerTitle || "Discover custom skincare"}</h3>
              )}
              <button className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-xl hover:bg-gray-100 transition-all pointer-events-auto">
                EXPLORE SKINCARE
              </button>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
            {onUpdateSettings ? (
              <EditableImage
                initialValue={storeSettings?.accessoriesBannerImage || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200"}
                onSave={(val) => onUpdateSettings('accessoriesBannerImage', val)}
                className="w-full h-full"
                aspectRatio="h-full"
                alt="Accessories"
              />
            ) : (
              <img 
                src={storeSettings?.accessoriesBannerImage || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200"} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="Accessories"
              />
            )}
            <div className="absolute inset-0 bg-black/5 flex flex-col items-center justify-center text-white text-center p-8 pointer-events-none">
              {onUpdateSettings ? (
                <EditableText
                  initialValue={storeSettings?.accessoriesBannerTitle || "Elevate your routine"}
                  onSave={(val) => onUpdateSettings('accessoriesBannerTitle', val)}
                  tagName="h3"
                  className="text-3xl font-light mb-6 pointer-events-auto"
                  style={{ fontFamily: headingFont }}
                />
              ) : (
                <h3 className="text-3xl font-light mb-6" style={{ fontFamily: headingFont }}>{storeSettings?.accessoriesBannerTitle || "Elevate your routine"}</h3>
              )}
              <button className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-xl hover:bg-gray-100 transition-all pointer-events-auto">
                EXPLORE ACCESSORIES
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Layer */}
      <section className="py-32 text-center" style={{ backgroundColor: lightTone }}>
        <div className="container mx-auto px-6 max-w-3xl">
          {onUpdateSettings ? (
            <EditableText
              initialValue={storeSettings?.storyTitle || "Always made to order, always just for you"}
              onSave={(val) => onUpdateSettings('storyTitle', val)}
              tagName="h2"
              className="text-4xl font-light mb-8 text-gray-900 leading-tight"
              style={{ fontFamily: headingFont, color: mutedDark }}
            />
          ) : (
            <h2 className="text-4xl font-light mb-8 leading-tight" style={{ fontFamily: headingFont, color: mutedDark }}>
              {storeSettings?.storyTitle || "Always made to order, always just for you"}
            </h2>
          )}
          
          {onUpdateSettings ? (
            <EditableText
              initialValue={storeSettings?.storyContent || "Every Prose hair product is formulated according to 85+ unique factors from your in-depth consultation — for truly custom haircare and always-improving results. From shampoo and conditioner to masks, treatments, and styling products, your personalized haircare routine is tailored to your specific goals for healthy, nourished hair from root to tip."}
              onSave={(val) => onUpdateSettings('storyContent', val)}
              tagName="p"
              className="text-sm leading-relaxed max-w-2xl mx-auto"
              style={{ color: darkTone }}
              multiline
            />
          ) : (
            <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: darkTone }}>
              {storeSettings?.storyContent || "Every Prose hair product is formulated according to 85+ unique factors from your in-depth consultation — for truly custom haircare and always-improving results. From shampoo and conditioner to masks, treatments, and styling products, your personalized haircare routine is tailored to your specific goals for healthy, nourished hair from root to tip."}
            </p>
          )}
        </div>
      </section>

      {/* Detailed Footer */}
      <footer className="text-white pt-24 pb-12" style={{ backgroundColor: mutedDark }}>
        <div className="container mx-auto px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Link Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
              {/* ... same link columns ... */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Support</h4>
                <ul className="space-y-2 text-xs opacity-70">
                  <li><a href="#" className="hover:text-white transition-colors">Contact us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Help + FAQ</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Collaborate</h4>
                <ul className="space-y-2 text-xs opacity-70">
                  <li><a href="#" className="hover:text-white transition-colors">Gift Prose</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">For stylists</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Referral program</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of use</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Legal</h4>
                <ul className="space-y-2 text-xs opacity-70">
                  <li><a href="#" className="hover:text-white underline transition-colors" style={{ textDecorationColor: primaryColor }}>Privacy policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Health Privacy Notice</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
                </ul>
              </div>
              <div className="space-y-6 pt-4">
                <div className="flex gap-4 items-center">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/B_Corp_Logo.png" alt="B-Corp" className="h-10 invert opacity-30" />
                  <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center opacity-30">
                    <span className="text-[8px] font-bold">1%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="lg:col-span-4 rounded-2xl p-8 flex flex-col items-center text-center justify-center space-y-6" style={{ backgroundColor: darkTone }}>
              {onUpdateSettings ? (
                <EditableText
                  initialValue={storeSettings?.footerCTATitle || "Custom care for skin and hair"}
                  onSave={(val) => onUpdateSettings('footerCTATitle', val)}
                  tagName="h3"
                  className="text-xl font-light text-white"
                  style={{ fontFamily: headingFont }}
                />
              ) : (
                <h3 className="text-xl font-light" style={{ fontFamily: headingFont }}>
                  {storeSettings?.footerCTATitle || "Custom care for skin and hair"}
                </h3>
              )}
              
              <button className="w-full bg-white text-black py-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-2xl hover:bg-gray-100 transition-all">
                {onUpdateSettings ? (
                  <EditableText
                    initialValue={storeSettings?.footerCTAButtonText || "GET YOUR FORMULA"}
                    onSave={(val) => onUpdateSettings('footerCTAButtonText', val)}
                    tagName="span"
                  />
                ) : (
                  storeSettings?.footerCTAButtonText || "GET YOUR FORMULA"
                )}
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex gap-6 text-gray-500">
              <Instagram className="w-4 h-4 hover:text-white cursor-pointer" />
              <Youtube className="w-4 h-4 hover:text-white cursor-pointer" />
              <Twitter className="w-4 h-4 hover:text-white cursor-pointer" />
              <Instagram className="w-4 h-4 hover:text-white cursor-pointer" />
            </div>
            <div className="text-[9px] text-gray-600 uppercase tracking-widest">
              © 2024 Prose. Made to order in NYC.
            </div>
            <div className="text-[9px] text-gray-600 uppercase tracking-widest">
              United States (USD $)
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-12 text-center">
            <p className="text-[8px] text-gray-700 max-w-2xl mx-auto leading-relaxed uppercase tracking-tighter">
              *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure or prevent any disease.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
