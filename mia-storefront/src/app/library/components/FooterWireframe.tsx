import React from 'react';

export interface FooterProps {
  storeName?: string;
  settings?: {
    primaryColor?: string;
    headingFont?: string;
    bodyFont?: string;
  };
}

export default function FooterWireframe({ storeName = "Mia Store", settings }: FooterProps) {
  const primaryColor = settings?.primaryColor || "#000000";
  const headingFont = settings?.headingFont || "inherit";
  const bodyFont = settings?.bodyFont || "inherit";

  return (
    <footer className="bg-gray-50 text-gray-600 py-12 px-4 border-t border-gray-200" style={{ fontFamily: bodyFont }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-gray-900 mb-4" style={{ fontFamily: headingFont, color: primaryColor }}>{storeName}</h3>
          <p className="text-sm leading-relaxed">
            Premium quality essentials for the modern lifestyle. Designed with care and crafted to last.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider" style={{ fontFamily: headingFont }}>Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-black transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Best Sellers</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Accessories</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Sale</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider" style={{ fontFamily: headingFont }}>Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-black transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Size Guide</a></li>
            <li><a href="#" className="hover:text-black transition-colors">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider" style={{ fontFamily: headingFont }}>Newsletter</h4>
          <p className="text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-black text-sm"
              style={{ borderColor: 'rgba(0,0,0,0.1)' }}
            />
            <button 
              className="text-white px-4 py-2 rounded-r-md text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: primaryColor }}
            >
              Join
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-black transition-colors">Privacy</a>
          <a href="#" className="hover:text-black transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
