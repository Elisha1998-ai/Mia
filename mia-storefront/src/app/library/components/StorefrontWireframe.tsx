import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
  Youtube
} from 'lucide-react';
import { EditableText } from '@/components/EditableText';
import ProductListWireframe from './ProductListWireframe';
import { useRouter } from 'next/navigation';

export interface StorefrontProps {
  settings?: {
    storeName?: string;
    primaryColor?: string;
    headingFont?: string;
    bodyFont?: string;
    heroTitle?: string;
    heroDescription?: string;
    heroButtonText?: string;
    heroImage?: string;
  };
  products?: Record<string, unknown>[];
  showNavbar?: boolean;
  showFooter?: boolean;
  onUpdateSettings?: (key: string, value: string) => void;
}

export default function StorefrontWireframe({
  settings,
  products = [],
  showNavbar = true,
  showFooter = true,
  onUpdateSettings
}: StorefrontProps) {
  const primaryColor = settings?.primaryColor || '#000000';
  const headingFont = settings?.headingFont || 'inherit';
  const bodyFont = settings?.bodyFont || 'inherit';

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  React.useEffect(() => {
    const updateCart = () => {
      try {
        const c = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(c.reduce((acc: number, i: any) => acc + i.quantity, 0));
      } catch { setCartCount(0); }
    };
    updateCart();
    window.addEventListener('cart-updated', updateCart);
    return () => window.removeEventListener('cart-updated', updateCart);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 relative">

      {/* Navbar - Transparent Overlay */}
      {showNavbar && (
        <nav className={`absolute top-0 left-0 right-0 z-50 ${isSearchOpen ? 'bg-white/10 backdrop-blur-md' : ''} transition-all duration-300`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">

              {isSearchOpen ? (
                <div className="flex-1 flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mx-4">
                  <Search className="w-4 h-4 text-white/70" />
                  <input
                    type="text"
                    placeholder="Search collections..."
                    className="bg-transparent border-none focus:ring-0 text-white placeholder-white/50 w-full ml-2 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => setIsSearchOpen(false)}>
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: headingFont }}>
                      {settings?.storeName || 'Mixtas'}
                    </span>
                  </div>

                  <div className="hidden md:flex items-center space-x-8">
                    {['New Arrivals', 'Shop All', 'Collections', 'About'].map((item) => (
                      <a
                        key={item}
                        href="#"
                        className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                        style={{ fontFamily: bodyFont }}
                      >
                        {item}
                      </a>
                    ))}
                  </div>

                  <div className="flex items-center space-x-5">
                    <button onClick={() => setIsSearchOpen(true)} className="text-white hover:text-white/80 transition-colors">
                      <Search className="w-5 h-5" />
                    </button>
                    <button onClick={() => router.push('/store/checkout')} className="text-white hover:text-white/80 transition-colors relative">
                      <ShoppingBag className="w-5 h-5" />
                      {cartCount > 0 ? (
                        <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>
                      ) : (
                        <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">0</span>
                      )}
                    </button>
                    <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                      {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-gray-50">
        {/* Hero Background */}
        <div className="absolute inset-0">
          {settings?.heroImage ? (
            <img
              src={settings.heroImage}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
          )}
          <div className="absolute inset-0 bg-black/5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-2xl">
            {onUpdateSettings ? (
              <EditableText
                initialValue={settings?.heroTitle || 'Curating Excellence'}
                onSave={(val) => onUpdateSettings('heroTitle', val)}
                tagName="h1"
                className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight"
                style={{ fontFamily: headingFont }}
              />
            ) : (
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: headingFont }}>
                {settings?.heroTitle || 'Curating Excellence'}
              </h1>
            )}

            {onUpdateSettings ? (
              <EditableText
                initialValue={settings?.heroDescription || 'Discover the latest trends in fashion with our exclusive collection. Elegant, stylish, and perfect for any occasion.'}
                onSave={(val) => onUpdateSettings('heroDescription', val)}
                tagName="p"
                className="text-lg text-gray-600 mb-8 max-w-lg"
                style={{ fontFamily: bodyFont }}
                multiline
              />
            ) : (
              <p className="text-lg text-gray-600 mb-8 max-w-lg" style={{ fontFamily: bodyFont }}>
                {settings?.heroDescription || 'Discover the latest trends in fashion with our exclusive collection. Elegant, stylish, and perfect for any occasion.'}
              </p>
            )}

            <div className="flex items-center space-x-4">
              <button
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-full font-medium text-white transition-colors"
                style={{ backgroundColor: primaryColor, fontFamily: bodyFont }}
              >
                {onUpdateSettings ? (
                  <EditableText
                    initialValue={settings?.heroButtonText || 'Shop Now'}
                    onSave={(val) => onUpdateSettings('heroButtonText', val)}
                    tagName="span"
                  />
                ) : (
                  <span>{settings?.heroButtonText || 'Shop Now'}</span>
                )}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
          <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-medium">Scroll</span>
        </div>
      </section>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto py-12">
        <ProductListWireframe
          isSection
          products={products as any}
          storeSettings={{
            ...settings,
            storeName: settings?.storeName || 'Mixtas',
            primaryColor: primaryColor,
            headingFont: headingFont,
            bodyFont: bodyFont,
            currency: '₦'
          }}
        />
      </section>

      {/* Footer */}
      {showFooter && (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <span className="text-2xl font-bold tracking-tight mb-6 block" style={{ fontFamily: headingFont }}>
                  {settings?.storeName || 'Mixtas'}
                </span>
                <p className="text-gray-500 max-w-sm mb-8" style={{ fontFamily: bodyFont }}>
                  Redefining the modern wardrobe with a focus on quality, sustainability, and timeless design.
                </p>
                <div className="flex space-x-5">
                  {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                    <a key={i} href="#" className="text-gray-400 hover:text-black transition-colors">
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ fontFamily: headingFont }}>Shop</h4>
                <ul className="space-y-4">
                  {['New Arrivals', 'Best Sellers', 'Sale', 'Gift Cards'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors" style={{ fontFamily: bodyFont }}>{item}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ fontFamily: headingFont }}>Help</h4>
                <ul className="space-y-4">
                  {['Shipping', 'Returns', 'Track Order', 'Contact Us'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm text-gray-500 hover:text-black transition-colors" style={{ fontFamily: bodyFont }}>{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-xs text-gray-400" style={{ fontFamily: bodyFont }}>
                © {new Date().getFullYear()} {settings?.storeName || 'Mixtas'}. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {['Privacy Policy', 'Terms of Service'].map((item) => (
                  <a key={item} href="#" className="text-xs text-gray-400 hover:text-black transition-colors" style={{ fontFamily: bodyFont }}>{item}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
