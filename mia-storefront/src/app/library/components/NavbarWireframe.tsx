import React from 'react';
import { ShoppingBag, Search, Menu } from 'lucide-react';

export interface NavbarProps {
  storeName?: string;
  cartCount?: number;
  settings?: {
    primaryColor?: string;
    headingFont?: string;
    bodyFont?: string;
  };
  onSearch?: () => void;
}

export default function NavbarWireframe({ storeName = "Pony Store", cartCount = 0, settings, onSearch }: NavbarProps) {
  const primaryColor = settings?.primaryColor || "#000000";
  const headingFont = settings?.headingFont || "inherit";
  const bodyFont = settings?.bodyFont || "inherit";

  return (
    <header className="px-4 py-4 flex justify-between items-center bg-white border-b border-gray-100 sticky top-0 z-50" style={{ fontFamily: bodyFont }}>
      <div className="flex items-center gap-4">
        <Menu className="w-5 h-5 md:hidden" />
        <div className="font-bold text-lg tracking-tight" style={{ fontFamily: headingFont, color: primaryColor }}>{storeName}</div>
      </div>
      
      <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
        <a href="#" className="hover:text-black transition-colors" style={{ fontFamily: headingFont }}>Shop</a>
        <a href="#" className="hover:text-black transition-colors" style={{ fontFamily: headingFont }}>New Arrivals</a>
        <a href="#" className="hover:text-black transition-colors" style={{ fontFamily: headingFont }}>Sale</a>
        <a href="#" className="hover:text-black transition-colors" style={{ fontFamily: headingFont }}>Journal</a>
      </nav>

      <div className="flex items-center gap-4 text-gray-600">
        <Search className="w-5 h-5 hover:text-black cursor-pointer transition-colors" onClick={onSearch} />
        <div className="relative hover:text-black cursor-pointer transition-colors">
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white" style={{ backgroundColor: primaryColor }}>
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
