"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, User, CheckCircle2, LogOut, LayoutDashboard, Heart, Mail, MapPin, Phone, Instagram, Twitter, Facebook } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useSettings } from '@/hooks/useData';

export const StorefrontHeader = ({ session }: { session?: Session | null }) => {
  const [cartCount, setCartCount] = React.useState(0);
  const [wishlistCount, setWishlistCount] = React.useState(0);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { settings, fetchSettings } = useSettings();
  const router = useRouter();

  React.useEffect(() => {
    fetchSettings();
  }, []);

  React.useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((acc: number, item: any) => acc + item.quantity, 0));
      
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('cart-updated', updateCount);
    window.addEventListener('wishlist-updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cart-updated', updateCount);
      window.removeEventListener('wishlist-updated', updateCount);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`?q=${encodeURIComponent(searchQuery)}`);
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 h-16 flex items-center px-6 w-full">
        {isSearching ? (
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              autoFocus
              type="text"
              placeholder="Search products..."
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => !searchQuery && setIsSearching(false)}
            />
            <button 
              type="button" 
              onClick={() => setIsSearching(false)}
              className="p-2 text-gray-400 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="flex-1 flex items-center justify-between animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSearching(true)}
                className="p-2 text-gray-900 hover:scale-110 transition-transform"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            <Link href="/" className="absolute left-1/2 -translate-x-1/2 font-store-heading text-lg font-black tracking-tighter text-gray-900">
              {settings?.storeName || 'Pony'}
            </Link>

            <div className="flex items-center gap-2">
              <Link href="/wishlist" className="relative p-2 text-gray-900 hover:scale-110 transition-transform">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>
              <Link href="/cart" className="relative p-2 text-gray-900 hover:scale-110 transition-transform">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export const StorefrontFooter = ({ session }: { session?: Session | null }) => {
  const { settings } = useSettings();
  const [email, setEmail] = React.useState('');

  const hasContact = settings?.adminEmail || settings?.storePhone || settings?.storeAddress;
  const hasSocials = settings?.socialInstagram || settings?.socialTwitter || settings?.socialFacebook;

  return (
    <footer className="bg-black pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left items-start">
          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-white">Subscribe to our newsletter</h4>
            <div className="flex gap-2 max-w-sm">
              <input 
                type="email" 
                placeholder="Email address"
                className="bg-white/5 border border-white/10 rounded-[10px] px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 ring-white/20 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="bg-white text-black rounded-[10px] px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                Join
              </button>
            </div>
          </div>

          {/* Contact Details */}
          {hasContact && (
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Contact</h4>
              <div className="space-y-1.5 text-xs text-gray-400 font-medium">
                {settings?.adminEmail && <p>{settings.adminEmail}</p>}
                {settings?.storePhone && <p>{settings.storePhone}</p>}
                {settings?.storeAddress && <p className="max-w-[200px] leading-relaxed">{settings.storeAddress}</p>}
              </div>
            </div>
          )}

          {/* Social Links */}
          {hasSocials && (
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Follow Us</h4>
              <div className="flex gap-4">
                {settings?.socialInstagram && (
                  <a href={settings.socialInstagram} className="text-gray-400 hover:text-white transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings?.socialTwitter && (
                  <a href={settings.socialTwitter} className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {settings?.socialFacebook && (
                  <a href={settings.socialFacebook} className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* About */}
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-500">About</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-xs">
              {settings?.footerDescription || 'Crafting premium experiences for our community.'}
            </p>
          </div>
        </div>

        <div className="pt-8 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.4em] font-bold">
            © {new Date().getFullYear()} {settings?.storeName} • Powered by Bloume
          </p>
        </div>
      </div>
    </footer>
  );
};
