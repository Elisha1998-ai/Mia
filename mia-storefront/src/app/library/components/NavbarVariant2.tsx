import React from 'react';
import { Search, User, Heart, ShoppingBag, Menu } from 'lucide-react';

export interface NavbarProps {
  storeName?: string;
  cartCount?: number;
  transparent?: boolean;
  settings?: {
    primaryColor?: string;
    headingFont?: string;
    bodyFont?: string;
  };
}

export default function NavbarVariant2({ storeName = "LINOGE", cartCount = 0, transparent = false, settings }: NavbarProps) {
  const primaryColor = settings?.primaryColor || "#000000";
  const headingFont = settings?.headingFont || "inherit";
  const bodyFont = settings?.bodyFont || "inherit";

  return (
    <header 
      className={`px-4 md:px-8 py-6 flex justify-between items-center z-50 border-b transition-colors duration-300 ${transparent ? 'bg-transparent border-transparent absolute w-full top-0' : 'bg-[#F4F4F4] border-gray-200 sticky top-0'}`}
      style={{ fontFamily: bodyFont }}
    >
      <div className="font-bold text-xl tracking-widest uppercase" style={{ fontFamily: headingFont, color: transparent ? 'inherit' : primaryColor }}>{storeName}</div>
      
      {/* Desktop Nav */}
      <nav className="hidden md:flex space-x-8 text-xs font-bold tracking-widest uppercase text-gray-500">
        <span className="cursor-pointer hover:underline underline-offset-4 transition-colors" style={{ fontFamily: headingFont, color: transparent ? 'inherit' : primaryColor }}>Men</span>
        <span className="cursor-pointer hover:text-black transition-colors" style={{ fontFamily: headingFont }}>Women</span>
        <span className="cursor-pointer hover:text-black transition-colors" style={{ fontFamily: headingFont }}>Lookbook</span>
        <span className="cursor-pointer hover:text-black transition-colors" style={{ fontFamily: headingFont }}>About</span>
      </nav>

      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <Menu className="w-6 h-6 cursor-pointer" />
      </div>

      {/* Icons */}
      <div className="hidden md:flex space-x-6 text-gray-600">
        <Search className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
        <User className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
        <Heart className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
        <div className="relative cursor-pointer hover:text-black transition-colors group">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 text-white text-[10px] w-3 h-3 flex items-center justify-center rounded-full" style={{ backgroundColor: primaryColor }}>
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
