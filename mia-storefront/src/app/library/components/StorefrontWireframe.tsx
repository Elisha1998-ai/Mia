import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Menu, X, Search, User, Heart, 
  ChevronRight, ChevronLeft, Star, ArrowRight,
  Instagram, Twitter, Facebook, Youtube,
  Filter, ChevronDown
} from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { EditableText } from '@/components/EditableText';

interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image?: string;
  category: string;
  isNew?: boolean;
  rating?: number; // Added for the star rating
}

interface StoreSettings {
  storeName: string;
  currency: string;
  heroTitle?: string;
  heroDescription?: string;
  heroButtonText?: string;
  heroImage?: string;
  footerDescription?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  socialFacebook?: string;
  socialYoutube?: string;
  storeAddress?: string;
  storePhone?: string;
  adminEmail?: string;
  primaryColor?: string;
  headingFont?: string;
  bodyFont?: string;
}

interface StorefrontProps {
  products?: Product[];
  settings?: StoreSettings;
  loading?: boolean;
  showNavbar?: boolean;
  showFooter?: boolean;
  onUpdateSettings?: (key: keyof StoreSettings, value: string) => void;
}

export default function StorefrontWireframe({ 
  products = [], 
  settings, 
  loading = false,
  showNavbar = true,
  showFooter = true,
  onUpdateSettings
}: StorefrontProps) {
  const { primaryColor, headingFont, bodyFont } = settings || {};

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Derive categories from products, but prioritize the design's suggested tabs if possible
  // For this wireframe, we'll just use the dynamic categories + 'All'
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Filter products for "New Arrivals" section
  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Apply sorting
    if (sortOption === 'price-low-high') {
      result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortOption === 'price-high-low') {
      result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortOption === 'name-a-z') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Limit to 8 products for the "New Arrivals" grid
    return result.slice(0, 8);
  }, [products, selectedCategory, sortOption]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 relative">
      
      {/* Navbar - Transparent Overlay */}
      {showNavbar && (
      <nav className={`absolute top-0 left-0 right-0 z-50 ${isSearchOpen ? 'bg-white/10 backdrop-blur-md' : ''} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {isSearchOpen ? (
              <div className="w-full flex items-center">
                 <Search className="w-5 h-5 text-white mr-4" />
                 <input 
                    type="text" 
                    autoFocus
                    placeholder="Search products..."
                    className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none shadow-none text-white placeholder-white/70 text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => !searchQuery && setIsSearchOpen(false)}
                 />
                 <button 
                   onClick={() => setIsSearchOpen(false)}
                   className="p-2 text-white hover:text-gray-200"
                 >
                   <X className="w-6 h-6" />
                 </button>
              </div>
            ) : (
              <>
                {/* Left: Desktop Navigation */}
                <div className="hidden md:flex space-x-8">
                  {['Home', 'Contact Us'].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-white hover:text-gray-200"
                  >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>

                {/* Center: Logo */}
                <div className="flex-shrink-0 flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
                  <span className="text-2xl font-serif font-bold tracking-wider text-white">
                    {settings?.storeName || 'Mixtas'}
                  </span>
                </div>

                {/* Right: Icons */}
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="text-white/90 hover:text-white"
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  <button className="text-white/90 hover:text-white hidden sm:block">
                    <Heart className="w-5 h-5" />
                  </button>

                  <button className="text-white/90 hover:text-white relative">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-black bg-white rounded-full">
                      0
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/60 backdrop-blur-md border-t border-white/10 absolute w-full top-full left-0">
            <div className="pt-2 pb-4 space-y-1 px-4">
              {['Home', 'Contact Us'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-3 py-2 text-base font-medium text-white hover:bg-white/10 rounded-md"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
      )}

      {/* Hero Section */}
      <div className="relative h-[600px] lg:h-[800px] bg-gray-900 overflow-hidden group">
        {/* Background Image Placeholder - using gradient/color to simulate the blue sky look */}
        <div className="absolute inset-0 bg-[#547C96]">
           {settings?.heroImage && (
             <img src={settings.heroImage} alt="Hero Background" className="w-full h-full object-cover opacity-80" />
           )}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90"></div>
        </div>

        {onUpdateSettings && (
          <button 
            onClick={() => {
              const url = window.prompt("Enter background image URL:", settings?.heroImage || "");
              if (url !== null) onUpdateSettings('heroImage', url);
            }}
            className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-black px-4 py-2 rounded-md text-sm font-medium shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Change Background
          </button>
        )}

        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-end pb-24">
          <div className="max-w-xl text-white text-left">
            {onUpdateSettings ? (
              <EditableText
                initialValue={settings?.heroTitle || 'Jackets for the Modern Man'}
                onSave={(val) => onUpdateSettings('heroTitle', val)}
                tagName="h1"
                className="text-5xl md:text-7xl font-bold leading-tight mb-4"
                style={{ fontFamily: headingFont }}
              />
            ) : (
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4" style={{ fontFamily: headingFont }}>
                {settings?.heroTitle || 'Jackets for the Modern Man'}
              </h1>
            )}
            
            {onUpdateSettings ? (
              <EditableText
                initialValue={settings?.heroDescription || 'Discover the latest trends in fashion with our exclusive collection. Elegant, stylish, and perfect for any occasion.'}
                onSave={(val) => onUpdateSettings('heroDescription', val)}
                tagName="p"
                className="text-lg text-white/80 mb-8 max-w-lg"
                multiline
              />
            ) : (
              <p className="text-lg text-white/80 mb-8 max-w-lg">
                {settings?.heroDescription || 'Discover the latest trends in fashion with our exclusive collection. Elegant, stylish, and perfect for any occasion.'}
              </p>
            )}

            <button 
              className="inline-flex items-center space-x-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors"
              style={{ color: primaryColor }}
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

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter and Sort Bar */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 relative">
          <div className="relative">
            <button 
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsSortOpen(false);
              }}
              className="flex items-center space-x-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
               <Filter className="w-4 h-4" />
               <span>Filter {selectedCategory !== 'All' ? `(${selectedCategory})` : ''}</span>
            </button>
            
            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md z-20 py-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedCategory === cat ? 'font-bold text-black' : 'text-gray-600'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
             <button 
               onClick={() => {
                 setIsSortOpen(!isSortOpen);
                 setIsFilterOpen(false);
               }}
               className="flex items-center space-x-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
             >
               <span>Sort by</span>
               <ChevronDown className="w-4 h-4" />
             </button>

             {isSortOpen && (
               <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md z-20 py-1">
                 {[
                   { label: 'Default', value: 'default' },
                   { label: 'Price: Low to High', value: 'price-low-high' },
                   { label: 'Price: High to Low', value: 'price-high-low' },
                   { label: 'Name: A-Z', value: 'name-a-z' },
                 ].map((option) => (
                   <button
                     key={option.value}
                     onClick={() => {
                       setSortOption(option.value);
                       setIsSortOpen(false);
                     }}
                     className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortOption === option.value ? 'font-bold text-black' : 'text-gray-600'}`}
                   >
                     {option.label}
                   </button>
                 ))}
               </div>
             )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Image Container */}
              <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                )}
                
                {/* Floating Actions */}
                <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <button className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-50 transition-colors">
                     <Heart className="w-4 h-4 text-gray-900" />
                   </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
                <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {product.salePrice ? (
                      <span className="space-x-2">
                        <span className="line-through">{formatPrice(product.price)}</span>
                        <span className="text-red-600">{formatPrice(product.salePrice)}</span>
                      </span>
                    ) : (
                      formatPrice(product.price)
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
           <div className="text-center py-12 text-gray-500">
             No products found in this category.
           </div>
        )}
      </section>

      {/* Footer */}
      {showFooter && (
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <h2 className="text-2xl font-serif font-bold tracking-wider mb-8">
            {settings?.storeName || 'Mixtas'}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm text-gray-500 uppercase tracking-wide">
            <a href="#" className="hover:text-black">Home</a>
            <a href="#" className="hover:text-black">Contact</a>
          </div>

          <div className="flex gap-6 mb-8">
            {settings?.socialInstagram && (
              <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer" />
              </a>
            )}
            {settings?.socialTwitter && (
              <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer" />
              </a>
            )}
            {settings?.socialFacebook && (
              <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer" />
              </a>
            )}
            {settings?.socialYoutube && (
              <a href={settings.socialYoutube} target="_blank" rel="noopener noreferrer">
                <Youtube className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer" />
              </a>
            )}
          </div>

          <p className="text-gray-400 text-xs">
            &copy; {new Date().getFullYear()} {settings?.storeName || 'Mixtas'}. All rights reserved.
          </p>
        </div>
      </footer>
      )}
    </div>
  );
}