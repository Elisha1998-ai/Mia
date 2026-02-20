"use client";

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, User, CheckCircle2, LogOut, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useSettings } from '@/hooks/useData';

export const StorefrontHeader = ({ session }: { session?: Session | null }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isAccountOpen, setIsAccountOpen] = React.useState(false);
  const { settings, fetchSettings } = useSettings();
  const router = useRouter();

  React.useEffect(() => {
    fetchSettings();
  }, []);

  React.useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((acc: number, item: any) => acc + item.quantity, 0));
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('cart-updated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cart-updated', updateCount);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/store?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-black p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link href="/store" className="font-store-heading text-2xl font-bold tracking-tight">
              {settings?.storeName || 'Mia Store'}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-store-body font-medium text-gray-500">
            <Link href="/store" className="hover:text-black transition-colors">Shop All</Link>
            <Link href="/store?category=new" className="hover:text-black transition-colors">New Arrivals</Link>
            <Link href="/store?category=best" className="hover:text-black transition-colors">Best Sellers</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-500 hover:text-black transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            {/* Account hidden for now
            <div className="relative">
              {session ? (
                <>
                  <button 
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="p-2 text-gray-500 hover:text-black transition-colors flex items-center gap-2 group"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden lg:block text-[10px] uppercase tracking-widest font-bold group-hover:underline underline-offset-4">
                      {session.user?.name?.split(' ')[0] || 'Account'}
                    </span>
                  </button>
                  
                  {isAccountOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-sm py-2 z-[70] animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Signed in as</p>
                        <p className="text-xs font-medium truncate">{session.user?.email}</p>
                      </div>
                      <Link 
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                        onClick={() => setIsAccountOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button 
                        onClick={() => {
                          setIsAccountOpen(false);
                          signOut({ callbackUrl: '/store' });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                  
                  {isAccountOpen && (
                    <div 
                      className="fixed inset-0 z-[65]" 
                      onClick={() => setIsAccountOpen(false)}
                    />
                  )}
                </>
              ) : (
                <Link href="/auth/signin" className="p-2 text-gray-500 hover:text-black transition-colors flex items-center gap-2 group">
                  <User className="w-5 h-5" />
                  <span className="hidden lg:block text-[10px] uppercase tracking-widest font-bold group-hover:underline underline-offset-4">Account</span>
                </Link>
              )}
            </div>
            */}
            <Link href="/store/cart" className="p-2 text-gray-500 hover:text-black transition-colors relative group">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-store-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-white z-[60] flex items-center px-4 sm:px-8 animate-in fade-in slide-in-from-top-2">
          <form onSubmit={handleSearch} className="max-w-7xl mx-auto w-full flex items-center gap-4">
            <Search className="w-6 h-6 text-gray-300" />
            <input 
              autoFocus
              type="text" 
              placeholder="Search products..." 
              className="flex-1 bg-transparent border-none text-xl sm:text-2xl font-store-heading focus:outline-none placeholder:text-gray-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-6 shadow-xl animate-in fade-in slide-in-from-top-4">
          <Link 
            href="/store" 
            onClick={() => setIsMenuOpen(false)}
            className="text-sm uppercase tracking-widest font-medium border-b border-gray-50 pb-2"
          >
            Shop All
          </Link>
          <Link 
            href="/store?category=new" 
            onClick={() => setIsMenuOpen(false)}
            className="text-sm uppercase tracking-widest font-medium border-b border-gray-50 pb-2"
          >
            New Arrivals
          </Link>
          <Link 
            href="/store?category=best" 
            onClick={() => setIsMenuOpen(false)}
            className="text-sm uppercase tracking-widest font-medium border-b border-gray-50 pb-2"
          >
            Best Sellers
          </Link>
        </div>
      )}
    </header>
  );
};

export const StorefrontFooter = ({ session }: { session?: Session | null }) => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);
  const { settings, fetchSettings } = useSettings();

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="font-store-heading text-xl font-bold tracking-tight">{settings?.storeName || 'Mia Store'}</h3>
            <p className="text-gray-500 text-sm font-light leading-relaxed max-w-xs">
              {settings?.footerDescription || `Agentic storefronts that understand your needs. Experience the future of commerce with ${settings?.storeName || 'Mia'}.`}
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 mb-6">Shop</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/store" className="hover:text-black transition-colors">All Products</Link></li>
              <li><Link href="/store?category=new" className="hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link href="/store?category=best" className="hover:text-black transition-colors">Best Sellers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/store/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
              {/* Account hidden for now
              <li>
                <Link href={session ? "/dashboard" : "/auth/signin"} className="hover:text-black transition-colors">
                  {session ? "My Dashboard" : "My Account"}
                </Link>
              </li>
              */}
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-900">Join the Newsletter</h4>
            <p className="text-gray-500 text-sm font-light">Be the first to know about new arrivals and exclusive offers.</p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="w-full bg-white border border-gray-100 px-4 py-3 text-sm focus:outline-none focus:ring-1 ring-store-primary rounded-sm transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                type="submit"
                className="w-full bg-store-primary text-white py-3 text-[10px] uppercase tracking-widest font-bold hover:opacity-90 transition-all rounded-sm shadow-lg"
              >
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle2 className="w-3 h-3 inline mr-1" /> Thank you for subscribing!
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-100 text-[10px] text-gray-400 uppercase tracking-widest">
          <p>© 2026 Mia AI Storefront. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
