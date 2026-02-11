"use client";

import React, { useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  Maximize2,
  Menu,
  X,
  Mail,
  Plus,
  ArrowUp,
  Type,
  GripVertical,
  Sparkles,
  Check,
  Link2,
  MoreHorizontal,
  Clock,
  Zap,
  Paperclip,
  Search,
  ShoppingCart,
  BarChart3,
  Package,
  FileText,
  Download
} from 'lucide-react';
import Link from 'next/link';

export const LandingPage = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#1a1a1a] font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="font-serif text-xl font-bold tracking-tight">Mia</span>
              </Link>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-black/60">
                <Link href="#" className="hover:text-black transition-colors">Solutions</Link>
                <Link href="#" className="hover:text-black transition-colors">Resources</Link>
                <Link href="#" className="hover:text-black transition-colors">Pricing</Link>
                <Link href="#" className="hover:text-black transition-colors">Company</Link>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/signin" className="text-sm font-medium hover:text-black transition-colors">Log in</Link>
              <button 
                onClick={onGetStarted}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
              >
                Get started
              </button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-black/5 p-4 flex flex-col gap-4">
            <Link href="#" className="text-sm font-medium">Solutions</Link>
            <Link href="#" className="text-sm font-medium">Resources</Link>
            <Link href="#" className="text-sm font-medium">Pricing</Link>
            <Link href="/auth/signin" className="text-sm font-medium">Log in</Link>
            <Link href="#" className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium text-center">
              Get started
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl tracking-tight mb-6 font-medium">
            AI built ready for business.
          </h1>
          <p className="text-xl md:text-2xl text-black/60 mb-8 max-w-3xl mx-auto leading-relaxed">
            Mia is your AI commerce agent. From building your store to managing operations, tracking orders, and handling support, she handles the heavy lifting while you focus on scaling.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-base font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              Request early access.
            </button>
          </div>
        </div>
        <div className="mt-16 max-w-7xl mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden bg-[#f3f4f6] border border-black/5 p-4 md:p-12 flex justify-center">
            <img 
              src="https://i.pinimg.com/736x/3c/c3/eb/3cc3ebf6643083cd45e58e58405589c8.jpg"
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="relative z-10 w-full max-w-4xl bg-white rounded-3xl border border-black/5 overflow-hidden font-sans">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">Ask Mia</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-400 rounded-md">Commerce Beta</span>
                </div>
                <div className="flex items-center gap-5">
                  <button className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold">
                    <Check className="w-4 h-4" /> Save
                  </button>
                  <Link2 className="w-4 h-4 text-gray-400" />
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                <div className="text-center text-[10px] font-medium text-gray-400">Today 10:24 AM</div>
                
                <div className="flex justify-end">
                  <div className="bg-[#f3f4f6] rounded-2xl rounded-tr-sm px-5 py-2.5 text-sm font-medium">
                    How is my store performing today compared to last week?
                  </div>
                </div>

                <div className="space-y-4 max-w-[90%] md:max-w-[85%]">
                  <div className="flex gap-4">
                    <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest pt-1 shrink-0">1 / 1</div>
                    <div className="text-[15px] leading-relaxed text-gray-700">
                      Your store is <span className="bg-green-100 text-green-700 px-1 rounded font-semibold">performing exceptionally well <span className="inline-flex items-center justify-center w-4 h-4 bg-green-600 text-white text-[10px] rounded-full">↑</span></span> today. Revenue is up <span className="text-blue-600 font-semibold">12.5% compared to last Tuesday</span>, primarily driven by a surge in "Winter Collection" sales. I've also noticed your conversion rate has increased to 4.2% following the UI optimizations we applied yesterday.
                    </div>
                  </div>

                  {/* Suggestion Card */}
                  <div className="bg-white rounded-2xl border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] p-6 space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-2">
                      <div className="w-3 h-3 bg-gray-100 rounded flex items-center justify-center">▲</div>
                      <div className="w-3 h-3 bg-gray-100 rounded flex items-center justify-center">▼</div>
                      <span className="hidden sm:inline">to navigate</span>
                      <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center mx-1 sm:mx-2">↩</div>
                      <span className="hidden sm:inline">to select</span>
                      <div className="ml-auto flex items-center gap-1">
                        <span className="px-1 py-0.5 bg-gray-50 border border-gray-200 rounded text-[8px]">esc</span>
                        <span className="hidden sm:inline">to close</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 p-1 rounded-lg transition-colors cursor-pointer">
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="line-clamp-1 sm:line-clamp-none">Which products from the Winter Collection are selling the most?</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-black font-semibold bg-gray-50 p-2 rounded-xl border border-black/5">
                        <ArrowRight className="w-4 h-4 text-black shrink-0" />
                        <span className="line-clamp-1 sm:line-clamp-none">Can you generate a discount code for customers who abandoned their carts today?</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 p-1 rounded-lg transition-colors cursor-pointer">
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="line-clamp-1 sm:line-clamp-none">What is the current stock level for the "Alpine Parka"?</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 p-1 rounded-lg transition-colors cursor-pointer">
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="line-clamp-1 sm:line-clamp-none">Should I increase the ad spend for the top-performing products?</span>
                      </div>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-white border border-black/5 rounded-2xl shadow-sm">
                    <div className="w-[2px] h-5 bg-purple-600 animate-pulse" />
                    <span className="text-gray-400 text-sm line-clamp-1">Ask Mia about your store analytics</span>
                    <div className="ml-auto flex items-center gap-3 shrink-0">
                      <Clock className="w-4 h-4 text-gray-300" />
                      <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                        <ArrowUp className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Bar */}
              <div className="bg-blue-50/50 p-1">
                <div className="bg-white rounded-[18px] border border-blue-100 overflow-hidden">
                   <div className="bg-blue-100/50 px-4 py-1.5 flex items-center gap-2">
                     <ArrowRight className="w-3 h-3 text-blue-600" />
                     <span className="text-xs font-semibold text-blue-600 line-clamp-1">revenue is up 12.5% compared to last Tuesday</span>
                     <X className="w-3 h-3 text-blue-300 ml-auto cursor-pointer" />
                   </div>
                   <div className="p-4 space-y-4">
                     <div className="text-sm font-medium">
                       <span className="text-black">/ana</span><span className="text-gray-300">lyze</span>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-blue-100">
                         Insights
                         <div className="w-6 h-3.5 bg-blue-200 rounded-full relative">
                           <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
                         </div>
                       </div>
                       <div className="hidden sm:flex items-center gap-4">
                         <Type className="w-4 h-4 text-gray-400" />
                         <Paperclip className="w-4 h-4 text-gray-400" />
                         <Search className="w-4 h-4 text-gray-400" />
                       </div>
                       <div className="ml-auto flex items-center gap-4">
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                          <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-black/5">
                            <ArrowUp className="w-4 h-4 text-gray-200" />
                          </div>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Marquee Section */}
      <section className="py-12 border-y border-black/5 overflow-hidden bg-white/50">
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee flex items-center gap-12 md:gap-24 px-4 opacity-40 grayscale contrast-125 whitespace-nowrap">
            <span className="text-xl font-bold tracking-tighter">Gemini</span>
            <span className="text-xl font-bold tracking-tighter">Paystack</span>
            <span className="text-xl font-bold tracking-tighter">Flutterwave</span>
            <span className="text-xl font-bold tracking-tighter">MailChimp</span>
            <span className="text-xl font-bold tracking-tighter">Terminal Africa</span>
            
            {/* Duplicate for seamless loop */}
            <span className="text-xl font-bold tracking-tighter">Gemini</span>
            <span className="text-xl font-bold tracking-tighter">Paystack</span>
            <span className="text-xl font-bold tracking-tighter">Flutterwave</span>
            <span className="text-xl font-bold tracking-tighter">MailChimp</span>
            <span className="text-xl font-bold tracking-tighter">Terminal Africa</span>
          </div>
        </div>
      </section>

      {/* Storefront Showcase Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6 font-medium">
            Beautiful storefronts designed to convert.
          </h2>
          <p className="text-xl text-black/60 mb-16 max-w-3xl mx-auto leading-relaxed">
            Built in minutes. Mia builds your online store with everything optimized from speed to SEO in minutes, from just a simple command.
          </p>
          
            <div className="aspect-[16/10] relative bg-[#f9fafb] overflow-hidden rounded-[2.5rem] border border-black/5">
            {/* Storefront Window tucked out from the bottom right */}
            <div className="absolute top-[35%] left-[35%] w-[130%] h-[130%] bg-white rounded-tl-[3rem] border-t border-l border-black/5 overflow-hidden flex flex-col font-sans shadow-2xl">
              {/* Store Navbar */}
              <div className="h-20 border-b border-black/5 flex items-center justify-between px-12 shrink-0">
                <div className="flex items-center gap-12">
                  <div className="font-black text-3xl tracking-tighter">SWOOSH</div>
                  <div className="hidden md:flex items-center gap-8 text-[12px] font-bold uppercase tracking-widest text-black/40">
                    <span>New Releases</span>
                    <span>Men</span>
                    <span>Women</span>
                    <span>Kids</span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <Search className="w-6 h-6 text-black/40" />
                  <ShoppingCart className="w-6 h-6 text-black/40" />
                </div>
              </div>

              {/* Hero Content */}
              <div className="flex-1 flex items-center relative px-20 overflow-hidden">
                <div className="relative z-10 max-w-lg">
                  <div className="text-[12px] font-black uppercase tracking-[0.3em] text-blue-600 mb-6">Just Do It</div>
                  <h3 className="font-serif text-7xl md:text-8xl lg:text-9xl leading-[0.85] font-black tracking-tighter mb-10 italic uppercase">
                    Air Max<br />Pulse
                  </h3>
                  <p className="text-base text-black/60 mb-10 max-w-md leading-relaxed">
                    Inspired by the energy of London's music scene, the Air Max Pulse brings an underground touch to the iconic Air Max line.
                  </p>
                  <button className="bg-blue-600 text-white px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">
                    Shop Now
                  </button>
                </div>

                {/* Nike Shoe Image */}
                <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[60%] aspect-square select-none pointer-events-none">
                  <img 
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000" 
                    alt="Nike Air Max"
                    className="w-full h-full object-contain -rotate-[25deg] drop-shadow-[0_45px_45px_rgba(0,0,0,0.15)]"
                  />
                </div>
              </div>
            </div>

            {/* Draft Badge moved to top left */}
            <div className="absolute top-8 left-8 z-20">
              <div className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm border border-blue-500/20">
                Storefront Draft
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faster Business Management Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-16 tracking-tight font-medium text-left">
            Faster business management.
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#f8faff] to-[#e6eef9] aspect-video flex items-center justify-center p-6">
                {/* Analytics Widget */}
                <div className="bg-white rounded-3xl p-6 w-full max-w-sm h-[164px] flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-[10px] text-black/30 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl font-bold text-black/80 tracking-tight">$12,842</span>
                        <span className="text-[10px] font-bold text-green-500 flex items-center">
                          <ArrowUp className="w-2.5 h-2.5" /> 12.5%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-black/30 font-bold uppercase tracking-wider mb-1">Orders</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl font-bold text-black/80 tracking-tight">142</span>
                        <span className="text-[10px] font-bold text-green-500 flex items-center">
                          <ArrowUp className="w-2.5 h-2.5" /> 8.2%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Simple Line Chart SVG */}
                  <div className="relative h-12 w-full">
                    <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="10" x2="100" y2="10" stroke="black" strokeOpacity="0.03" strokeWidth="0.5" />
                      <line x1="0" y1="20" x2="100" y2="20" stroke="black" strokeOpacity="0.03" strokeWidth="0.5" />
                      <line x1="0" y1="30" x2="100" y2="30" stroke="black" strokeOpacity="0.03" strokeWidth="0.5" />
                      {/* Vertical Grid Lines */}
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map(x => (
                        <line key={x} x1={x} y1="0" x2={x} y2="40" stroke="black" strokeOpacity="0.03" strokeWidth="0.5" />
                      ))}
                      {/* Area Fill */}
                      <path 
                        d="M 0 30 L 10 30 L 20 30 L 30 15 L 40 25 L 50 20 L 60 18 L 70 25 L 80 22 L 90 10 L 100 10 L 100 40 L 0 40 Z" 
                        fill="url(#chartGradient)" 
                      />
                      {/* Line */}
                      <path 
                        d="M 0 30 L 10 30 L 20 30 L 30 15 L 40 25 L 50 20 L 60 18 L 70 25 L 80 22 L 90 10 L 100 10" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="0.8" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-medium tracking-tight">Be in the know, better.</h3>
                <p className="text-black/60 leading-relaxed">
                  Mia knows everything about your business from your most recent customer to products low on stock, and so on. You can save time by asking Mia what’s up?
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#8db7d6] to-[#b8d4e9] aspect-video flex items-center justify-center p-6">
                {/* Mia Chat Widget */}
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full h-[164px] flex flex-col justify-between">
                  <p className="text-[#1a1a1a] text-sm md:text-base leading-snug font-medium">
                    Can you generate an invoice for order #8429 and send it to the customer?
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl border border-black/5 flex items-center justify-center text-black/40">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-white">
                        <ArrowUp className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-medium tracking-tight">Just tell Mia to do it.</h3>
                <p className="text-black/60 leading-relaxed">
                  Mia can perform tasks, just say it. From updating your store in bulk with products, rebranding your site, generating invoices and the likes, Mia gets it done.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works (Carousel) */}
      <section className="py-24 bg-[#fcfcfc] overflow-hidden">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-serif text-5xl md:text-6xl mb-16 tracking-tight font-medium text-left">
            How it works
          </h2>
        </div>
        
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory px-4 md:pl-[max(1rem,calc((100vw-1024px)/2+1rem))] md:pr-8"
          >
            {/* Card 1 */}
            <div className="min-w-[320px] md:min-w-[400px] bg-white p-8 rounded-3xl snap-start border border-black/5">
              <h3 className="text-2xl font-medium mb-2 tracking-tight">Run your finances effortlessly</h3>
              <p className="text-black/60 mb-8 text-sm leading-relaxed">From generating invoices to tracking expenses, calculating taxes, and forecasting revenue, Mia keeps your finances under control while you focus on growth.</p>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f0f0f0]">
                <div className="absolute -bottom-6 -left-6 w-[95%] h-[95%] bg-white rounded-2xl border border-black/5 p-6 flex flex-col gap-4 overflow-hidden">
                  {/* Invoice Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-[12px] font-bold text-gray-900 tracking-tight mb-1 uppercase">INV2398-08-087</h4>
                      <div className="h-[1px] w-12 bg-gray-100" />
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-1">
                      <p className="text-[8px] font-medium text-gray-400 uppercase tracking-wider">Due date</p>
                      <p className="text-[10px] font-bold text-gray-900">10 November 2023</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-medium text-gray-400 uppercase tracking-wider">Subject</p>
                      <p className="text-[10px] font-bold text-gray-900">Order #8429</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-medium text-gray-400 uppercase tracking-wider">Billed to</p>
                      <p className="text-[10px] font-bold text-gray-900 leading-tight">John Smith<br /><span className="text-gray-400 font-medium text-[9px]">john_s@gmail.com</span></p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] font-medium text-gray-400 uppercase tracking-wider">Currency</p>
                      <p className="text-[10px] font-bold text-gray-900">NGN - Nigerian Naira</p>
                    </div>
                  </div>

                  {/* Table Header */}
                  <div className="bg-gray-50 rounded-lg px-3 py-1.5 grid grid-cols-[1fr_32px_70px_70px] gap-2 items-center mt-2">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Description</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider text-center">Qty</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider text-right">Unit Price</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider text-right">Amount</span>
                  </div>

                  {/* Table Item */}
                  <div className="px-3 py-2 grid grid-cols-[1fr_32px_70px_70px] gap-2 items-center border-b border-gray-50">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center shrink-0">
                        <Package className="w-3 h-3 text-gray-400" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-900 truncate">Premium Cotton Tee</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-900 text-center">1</span>
                    <span className="text-[10px] font-bold text-gray-900 text-right">₦55,000</span>
                    <span className="text-[10px] font-bold text-gray-900 text-right">₦55,000</span>
                  </div>

                  {/* Totals */}
                  <div className="flex flex-col items-end gap-1.5 mt-2 pr-3">
                    <div className="flex justify-between w-full max-w-[160px]">
                      <span className="text-[10px] font-medium text-gray-400">Subtotal</span>
                      <span className="text-[10px] font-bold text-gray-900">₦55,000</span>
                    </div>
                    <div className="flex justify-between w-full max-w-[160px]">
                      <span className="text-[10px] font-medium text-gray-400">Discount (10%)</span>
                      <span className="text-[10px] font-bold text-gray-900">-₦5,500</span>
                    </div>
                    <div className="h-[1px] w-full max-w-[160px] bg-gray-100 my-0.5" />
                    <div className="flex justify-between w-full max-w-[160px]">
                      <span className="text-[10px] font-bold text-gray-900">Total</span>
                      <span className="text-[10px] font-bold text-gray-900">₦49,500</span>
                    </div>
                    <div className="flex justify-between w-full max-w-[160px]">
                      <span className="text-[10px] font-bold text-gray-900">Amount due</span>
                      <span className="text-[10px] font-bold text-gray-900">₦49,500</span>
                    </div>
                  </div>

                  {/* Attachment */}
                  <div className="mt-auto space-y-2">
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Attachment</p>
                    <div className="bg-white border border-black/5 rounded-xl p-2.5 flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-900">Invoice-8429.pdf</p>
                          <p className="text-[8px] text-gray-400 font-medium">512kb</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-blue-600">
                        <span className="text-[9px] font-bold">Download</span>
                        <Download className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="min-w-[320px] md:min-w-[400px] bg-white p-8 rounded-3xl snap-start border border-black/5">
              <h3 className="text-2xl font-medium mb-2 tracking-tight">Never miss a sale</h3>
              <p className="text-black/60 mb-8 text-sm leading-relaxed">Orders processed, inventory tracked, and suppliers restocked automatically. With Mia handling it all, your store stays fully stocked and customers happy.</p>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f0f0f0] flex flex-col justify-center p-6 gap-3">
                <div className="bg-white rounded-2xl p-4 border border-black/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">Order #8429 Processed</p>
                    <p className="text-[10px] text-gray-500">Auto-synced to warehouse</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-black/5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">Inventory Sync Complete</p>
                    <p className="text-[10px] text-gray-500">24 channels updated</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="min-w-[320px] md:min-w-[400px] bg-white p-8 rounded-3xl snap-start border border-black/5">
              <h3 className="text-2xl font-medium mb-2 tracking-tight">Deliver 24/7 customer service that converts</h3>
              <p className="text-black/60 mb-8 text-sm leading-relaxed">Chat support, personalized recommendations, and automated review collection ensure every customer feels valued — even while you sleep.</p>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f0f0f0] border border-black/5">
                <div className="absolute top-6 left-6 right-6 bottom-0">
                  <div className="w-full h-full bg-white rounded-t-2xl border-t border-l border-r border-black/5 overflow-hidden flex flex-col">
                    {/* Chat Header */}
                    <div className="px-4 py-3 border-b border-black/5 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-2">
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-bold text-gray-800">Mia</span>
                      </div>
                      <Maximize2 className="w-3.5 h-3.5 text-gray-300" />
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 px-4 py-0 space-y-4 overflow-y-auto scrollbar-hide">
                      <div className="flex justify-end pt-4">
                        <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 text-[11px] font-medium max-w-[80%]">
                          Hi, I received my order #4291 but the size is too small. How do I start a refund?
                        </div>
                      </div>
                      <div className="flex gap-2 pb-4">
                        <div className="bg-transparent rounded-2xl px-0 py-2 text-[11px] text-gray-700 leading-relaxed">
                          <p className="font-bold text-gray-900 mb-1">Mia</p>
                          Hi Alex, I'm sorry the size didn't fit! I can certainly help with that. I've already initiated a return label for order #4291. You'll receive an email with instructions shortly. Would you like me to suggest the next size up?
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="min-w-[320px] md:min-w-[400px] bg-white p-8 rounded-3xl snap-start border border-black/5">
              <h3 className="text-2xl font-medium mb-2 tracking-tight">Optimize and run your marketing</h3>
              <p className="text-black/60 mb-8 text-sm leading-relaxed">Email campaigns, ads, content creation, and promotion testing — Mia manages it all to drive engagement and sales without the guesswork.</p>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f0f0f0] border border-black/5">
                <div className="absolute top-6 left-6 w-[120%] bg-white rounded-tl-2xl border-t border-l border-black/5 overflow-hidden font-sans">
                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-[#f3f4f6] rounded-xl rounded-tr-sm px-3 py-1.5 text-[10px] font-medium text-gray-800">
                        Create a social media campaign for our new collection.
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pt-1 shrink-0">1 / 1</div>
                        <div className="text-[11px] leading-relaxed text-gray-700">
                          I've drafted <span className="text-black font-bold">5 Instagram posts</span> and <span className="text-black font-bold">3 email templates</span>. I'm also running A/B tests on the headlines.
                        </div>
                      </div>

                      {/* Workflow Card */}
                      <div className="bg-white rounded-xl border border-black/5 p-3 space-y-2">
                        <div className="flex items-center gap-2 text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                          Active Tasks
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] text-black font-semibold bg-gray-50 p-2 rounded-lg border border-black/5">
                            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                            <span>Generating visual assets...</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-600 p-1 px-2">
                            <Check className="w-3.5 h-3.5 text-green-500" />
                            <span>Ad copies approved</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex items-center gap-3 px-3 py-2 bg-white border border-black/5 rounded-xl">
                      <div className="w-[1.5px] h-4 bg-black animate-pulse" />
                      <span className="text-gray-400 text-[10px]">Review and schedule</span>
                      <div className="ml-auto">
                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                          <ArrowUp className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="min-w-[320px] md:min-w-[400px] bg-white p-8 rounded-3xl snap-start border border-black/5">
              <h3 className="text-2xl font-medium mb-2 tracking-tight">Handle shipping, returns, and delivery seamlessly</h3>
              <p className="text-black/60 mb-8 text-sm leading-relaxed">From labels to carrier updates and returns management, Mia ensures your operations run smoothly, freeing you to focus on growth.</p>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f0f0f0] flex items-center justify-center">
                {/* Empty Image Frame */}
              </div>
            </div>

            {/* Card 7 */}
            <div className="min-w-[320px] md:min-w-[400px] bg-white p-8 rounded-3xl snap-start border border-black/5">
              <h3 className="text-2xl font-medium mb-2 tracking-tight">Grow smarter with insights</h3>
              <p className="text-black/60 mb-8 text-sm leading-relaxed">Market trends, competitor monitoring, pricing optimization, and upsell opportunities give you the edge to scale faster.</p>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f0f0f0] flex items-center justify-center">
                {/* Empty Image Frame */}
              </div>
            </div>
            
            {/* Spacer for right bleed effect */}
            <div className="min-w-[1rem] md:min-w-[calc((100vw-1024px)/2)] h-1" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 mt-12">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:border-black/20 hover:bg-black/[0.02] transition-all group"
              aria-label="Previous"
            >
              <ArrowLeft className="w-5 h-5 text-black/40 group-hover:text-black transition-colors" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center hover:border-black/20 hover:bg-black/[0.02] transition-all group"
              aria-label="Next"
            >
              <ArrowRight className="w-5 h-5 text-black/40 group-hover:text-black transition-colors" />
            </button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            {/* Left Section: 4 Points */}
            <div className="space-y-12">
              {[
                {
                  title: "Save time and focus on growth",
                  desc: "Mia automates repetitive tasks like invoicing, inventory tracking, and order management, freeing you to focus on strategy and scaling your business."
                },
                {
                  title: "Increase sales effortlessly",
                  desc: "From automated marketing campaigns to personalized recommendations, Mia helps you convert more visitors into paying customers without lifting a finger."
                },
                {
                  title: "Make smarter decisions",
                  desc: "With real-time analytics and insights, Mia gives you the data you need to optimize pricing, track performance, and identify growth opportunities instantly."
                },
                {
                  title: "Deliver a seamless customer experience",
                  desc: "Mia handles support, returns, and order notifications automatically, ensuring every customer feels valued and comes back for more."
                }
              ].map((benefit, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="text-2xl font-medium tracking-tight text-black/90">
                    {benefit.title}
                  </h3>
                  <p className="text-black/50 leading-relaxed text-sm md:text-base">
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Right Section: Image Frame */}
            <div className="h-full min-h-[400px] md:min-h-[600px] bg-[#f3f4f6] rounded-[2.5rem] overflow-hidden relative border border-black/5">
              <img 
                src="https://i.pinimg.com/736x/6a/7e/9f/6a7e9f7cddb02d4610fdf8bb148efa4f.jpg"
                alt="Growth and Automation"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-16 left-16 w-[140%] bg-white rounded-tl-[3rem] border-t border-l border-black/5 overflow-hidden font-sans">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-base">Ask Mia</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-400 rounded-md">Automation</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <button className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold">
                      <Check className="w-5 h-5" /> Save
                    </button>
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">
                  <div className="flex justify-end">
                    <div className="bg-[#f3f4f6] rounded-2xl rounded-tr-sm px-6 py-3 text-base font-medium">
                      Automate my pending invoices and check inventory.
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="text-[12px] font-bold text-gray-300 uppercase tracking-widest pt-1 shrink-0">1 / 1</div>
                      <div className="text-[16px] leading-relaxed text-gray-700">
                        I've processed <span className="text-blue-600 font-semibold">12 pending invoices</span> and sent reminders for overdue payments. I also noticed that <span className="text-blue-600 font-semibold">inventory for "Alpine Parka" is low (3 left)</span>. Should I create a restock order with your supplier?
                      </div>
                    </div>

                    {/* Automation Card */}
                    <div className="bg-white rounded-2xl border border-black/5 shadow-[0_15px_40px_rgba(0,0,0,0.08)] p-6 space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">
                        Running Workflows
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-base text-black font-semibold bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse" />
                          <span>Generating weekly inventory report...</span>
                        </div>
                        <div className="flex items-center gap-3 text-base text-gray-600 p-3">
                          <Check className="w-5 h-5 text-green-500" />
                          <span>12 Invoices sent to customers</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="flex items-center gap-4 px-6 py-4 bg-white border border-black/5 rounded-2xl shadow-sm">
                    <div className="w-[2px] h-6 bg-blue-600 animate-pulse" />
                    <span className="text-gray-400 text-base">Yes, create the restock order</span>
                    <div className="ml-auto">
                      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center">
                        <ArrowUp className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-5xl md:text-6xl tracking-tight mb-4 font-medium">
              Frequently asked questions
            </h2>
            <p className="text-black/40 text-lg">
              Find answers to common questions about Mia AI.
            </p>
          </div>
          
          <div className="divide-y divide-black/5">
            {[
              "Is Mia just a website builder?",
              "What can Mia do for my e-commerce business?",
              "How does Mia handle customer support?",
              "Can Mia help with marketing and copywriting?",
              "Do I need to be tech-savvy to use Mia?",
              "Which African payment gateways does Mia support?",
              "How does order tracking work with Mia?",
              "Can Mia manage my inventory across different platforms?",
              "What makes Mia different from Shopify or Wix?",
              "How can I get early access to Mia?"
            ].map((q, i) => (
              <div key={i} className="py-7 flex items-center justify-between group cursor-pointer transition-all">
                <span className="text-lg font-medium text-black/80 tracking-tight">{q}</span>
                <Plus className="w-6 h-6 text-black/20 group-hover:text-black transition-colors font-light" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl tracking-tight mb-8">
            Take back your time.<br />Just forward it to Mia.
          </h2>
          <button 
            onClick={onGetStarted}
            className="bg-blue-600 text-white px-10 py-4 rounded-xl text-xl font-medium hover:bg-blue-700 transition-all"
          >
            Try it now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-black" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight">Mia</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Less structure,<br />more intelligence.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-sm mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Legal</Link></li>
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="font-bold text-sm mb-6">Social</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Twitter</Link></li>
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">LinkedIn</Link></li>
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">GitHub</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
          <p>© 2024 Mia AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
