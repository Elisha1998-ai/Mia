"use client";

import React, { useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  ChevronDown,
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
  Search
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
                <span className="font-serif text-xl font-bold tracking-tight">Manus</span>
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
                className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-all"
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
            <Link href="#" className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium text-center">
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
            There's no better way to say it, imagine your business in the hands of a team of 50 experts, tracking orders, designing your store, writing your copies, running email campaigns, invoicing, accounting for your business and so on.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-black/80 transition-all flex items-center gap-2"
            >
              Request early access.
            </button>
          </div>
        </div>
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden bg-[#f3f4f6] border border-black/5 shadow-inner p-4 md:p-12 flex justify-center">
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-black/5 overflow-hidden font-sans">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
                <div className="flex items-center gap-3">
                  <div className="text-purple-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-sm">Ask AI</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold text-gray-400 rounded-md">Q&A Beta</span>
                </div>
                <div className="flex items-center gap-5">
                  <button className="flex items-center gap-1.5 text-purple-600 text-sm font-semibold">
                    <Check className="w-4 h-4" /> Save
                  </button>
                  <Link2 className="w-4 h-4 text-gray-400" />
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                <div className="text-center text-[10px] font-medium text-gray-400">Today 4:08 PM</div>
                
                <div className="flex justify-end">
                  <div className="bg-[#f3f4f6] rounded-2xl rounded-tr-sm px-5 py-2.5 text-sm font-medium">
                    What are design systems?
                  </div>
                </div>

                <div className="space-y-4 max-w-[90%] md:max-w-[85%]">
                  <div className="flex gap-4">
                    <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest pt-1 shrink-0">2 / 2</div>
                    <div className="text-[15px] leading-relaxed text-gray-700">
                      Design systems are <span className="bg-purple-100 text-purple-700 px-1 rounded font-semibold">essential frameworks <span className="inline-flex items-center justify-center w-4 h-4 bg-purple-600 text-white text-[10px] rounded-full">1</span></span> that stream... ndardize the process of creating digital products. At their core, <span className="text-purple-600 font-semibold underline decoration-2 underline-offset-4">design systems consist of reusable components</span> and clear standards <span className="inline-flex items-center justify-center w-4 h-4 bg-gray-200 text-gray-500 text-[10px] rounded-full font-bold">2</span> for how to use them, ensuring a consistent user experience across a
                    </div>
                  </div>

                  {/* Reply Popup */}
                  <div className="relative">
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white shadow-xl border border-black/5 rounded-lg px-3 py-1.5 flex items-center gap-2 z-10 whitespace-nowrap">
                      <span className="text-xs font-bold text-black flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3"><path d="M3 21l1.65-3.8A9 9 0 1 1 21 9a9 9 0 0 1-9 9 9 9 0 0 1-4.7-1.3L3 21z" fill="currentColor"/></svg>
                        Reply
                      </span>
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
                        <span className="line-clamp-1 sm:line-clamp-none">What are the essential components included in most design systems?</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-black font-semibold bg-gray-50 p-2 rounded-xl border border-black/5">
                        <ArrowRight className="w-4 h-4 text-black shrink-0" />
                        <span className="line-clamp-1 sm:line-clamp-none">How do you ensure consistency in components across different platforms?</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 p-1 rounded-lg transition-colors cursor-pointer">
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="line-clamp-1 sm:line-clamp-none">What criteria are used to decide whether a new component should be added to a design system?</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 p-1 rounded-lg transition-colors cursor-pointer">
                        <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                        <span className="line-clamp-1 sm:line-clamp-none">How do you handle version control and updates for components in a design system?</span>
                      </div>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-white border border-black/5 rounded-2xl shadow-sm">
                    <div className="w-[2px] h-5 bg-purple-400 animate-pulse" />
                    <span className="text-gray-400 text-sm line-clamp-1">Ask a question about this answer</span>
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
              <div className="bg-purple-50/50 p-1">
                <div className="bg-white rounded-[18px] border border-purple-100 overflow-hidden">
                   <div className="bg-purple-100/50 px-4 py-1.5 flex items-center gap-2">
                     <ArrowRight className="w-3 h-3 text-purple-600" />
                     <span className="text-xs font-semibold text-purple-700 line-clamp-1">design systems consist of reusable components</span>
                     <X className="w-3 h-3 text-purple-300 ml-auto cursor-pointer" />
                   </div>
                   <div className="p-4 space-y-4">
                     <div className="text-sm font-medium">
                       <span className="text-black">/sug</span><span className="text-gray-300">gest</span>
                     </div>
                     <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2 bg-pink-50 text-pink-500 px-3 py-1.5 rounded-full text-[10px] font-bold border border-pink-100">
                         Speed
                         <div className="w-6 h-3.5 bg-pink-200 rounded-full relative">
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
          
          <div className="relative rounded-3xl bg-white border border-black/5 shadow-2xl p-6 md:p-12">
            <div className="aspect-[16/10] relative bg-[#f9fafb] overflow-hidden rounded-2xl border border-black/5 shadow-sm">
              {/* Browser/Canvas Header */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-white border-b border-black/5 flex items-center px-6 z-10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-black/10" />
                </div>
                <div className="ml-8 mr-auto flex items-center gap-8 text-[11px] font-medium text-black/40">
                  <div className="w-6 h-6 bg-black rounded flex items-center justify-center -ml-2 mr-4">
                    <span className="text-white font-bold text-[10px]">V</span>
                  </div>
                  <span>New Arrivals</span>
                  <span>Best-Sellers</span>
                  <span>Boards</span>
                  <span>Accessories</span>
                </div>
                <div className="w-16" /> {/* Spacer */}
              </div>

              {/* Main Content Preview */}
              <div className="absolute inset-0 pt-12 flex items-center justify-center p-8 md:p-12">
                <div className="w-full h-full rounded-2xl bg-[#e5e7eb] relative overflow-hidden flex items-center justify-center border-4 border-white shadow-lg">
                  {/* Hero Background (Matching the screenshot) */}
                  <div className="absolute inset-0 bg-[#eecbcb]/40" />
                  
                  {/* Hero Content */}
                  <div className="relative z-10 text-center px-12">
                    <h3 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-8 drop-shadow-sm font-medium">
                      Embrace the chill,<br />let nature in
                    </h3>
                    <div className="relative inline-block">
                      <div className="px-8 py-3 bg-white text-black text-sm font-medium rounded-lg shadow-lg">
                        Shop
                      </div>
                      {/* Purple Button Label from Screenshot */}
                      <div className="absolute -top-3 left-0 px-2 py-0.5 bg-[#6366f1] text-white text-[10px] font-bold rounded-sm shadow-sm">
                        Button
                      </div>
                    </div>
                  </div>

                  {/* Character Image (Matching the screenshot) */}
                  <div className="absolute bottom-0 right-0 w-1/2 h-full z-0">
                    <img 
                      src="https://images.unsplash.com/photo-1544923246-77307dd654ca?auto=format&fit=crop&q=80&w=800" 
                      alt="Storefront Hero"
                      className="w-full h-full object-cover object-center translate-x-1/4"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Editor Panel */}
              <div className="absolute top-24 left-12 w-64 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-[#e0e7ff] p-4 z-20">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-black/5">
                  <ChevronDown className="w-4 h-4 text-black/20" />
                  <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                  </div>
                  <span className="text-xs font-semibold text-black/70">Image Banner</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-black/60">
                    <Type className="w-4 h-4 text-black/30" />
                    <span>Elevate your skin care ritual</span>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-lg border border-[#c7d2fe] shadow-[0_0_20px_rgba(199,210,254,0.6)] text-xs font-bold text-black/80">
                      <GripVertical className="w-4 h-4 text-black/20" />
                      <span>Button</span>
                      <div className="ml-auto">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black/30"><path d="M12 5v14M5 12h14"/></svg>
                      </div>
                    </div>
                    {/* Hand Cursor Icon */}
                    <div className="absolute -bottom-2 -right-2 transform translate-x-1 translate-y-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 10V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V10" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M15 7V5.5C15 4.11929 16.1193 3 17.5 3C18.8807 3 20 4.11929 20 5.5V12C20 15.866 16.866 19 13 19H12C8.13401 19 5 15.866 5 12V10" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M9 10V12.5C9 13.8807 7.88071 15 6.5 15C5.11929 15 4 13.8807 4 12.5V11" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-blue-600 pt-3">
                    <div className="w-4 h-4 rounded-full border border-blue-600 flex items-center justify-center">
                      <Plus className="w-2.5 h-2.5" />
                    </div>
                    <span>Add block</span>
                  </div>
                </div>
              </div>

              {/* Draft Badge */}
              <div className="absolute bottom-8 left-1/4 transform -translate-x-1/2">
                <div className="px-4 py-1.5 bg-[#e0f2fe] text-[#0369a1] text-xs font-bold rounded-lg shadow-sm border border-[#bae6fd]">
                  Draft
                </div>
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
              <h3 className="text-2xl font-medium mb-2 tracking-tight">Create your receiving emails</h3>
              <p className="text-black/60 mb-8 text-sm leading-relaxed">Pick your unique email prefix with @manus.bot.</p>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f0f0f0] flex items-center justify-center">
                {/* Empty Image Frame */}
              </div>
            </div>

            {/* Card 2 */}
            <div className="min-w-[320px] md:min-w-[400px] bg-white p-8 rounded-3xl snap-start border border-black/5">
              <h3 className="text-2xl font-medium mb-2 tracking-tight">Link your sending emails</h3>
              <p className="text-black/60 mb-8 text-sm leading-relaxed">Let us know where you'll be sending emails from.</p>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f0f0f0] flex items-center justify-center">
                {/* Empty Image Frame */}
              </div>
            </div>

            {/* Card 3 */}
            <div className="min-w-[320px] md:min-w-[400px] bg-white p-8 rounded-3xl snap-start border border-black/5">
              <h3 className="text-2xl font-medium mb-2 tracking-tight">Turn emails into tasks</h3>
              <p className="text-black/60 mb-8 text-sm leading-relaxed">If you've just got a task on hand, just let manus handle it.</p>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#f0f0f0] flex items-center justify-center">
                {/* Empty Image Frame */}
              </div>
            </div>

            {/* Card 4 */}
            <div className="min-w-[320px] md:min-w-[400px] bg-white p-8 rounded-3xl snap-start border border-black/5">
              <h3 className="text-2xl font-medium mb-2 tracking-tight">Collaborate with your team</h3>
              <p className="text-black/60 mb-8 text-sm leading-relaxed">Share workflows and automate responses across your organization.</p>
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
                  title: "AI-Powered Extraction",
                  desc: "Automatically identify action items, deadlines, and owners from any complex email thread instantly."
                },
                {
                  title: "Seamless Integration",
                  desc: "Works directly with your existing inbox. No need to migrate or install any new applications."
                },
                {
                  title: "Deep Research",
                  desc: "Offload complex research tasks to Manus. Get comprehensive summaries and insights in minutes."
                },
                {
                  title: "Team Collaboration",
                  desc: "Share workflows and automate responses across your entire organization with one click."
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
            <div className="h-full min-h-[400px] md:min-h-[600px] bg-[#f0f0f0] rounded-[2.5rem] overflow-hidden relative">
              {/* Empty Image Frame */}
              <div className="absolute inset-0 flex items-center justify-center text-black/5 text-sm font-medium uppercase tracking-widest">
                Benefit Visualization
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
              Find answers to common questions about Manus AI Website Builder.
            </p>
          </div>
          
          <div className="divide-y divide-black/5">
            {[
              "What is Manus AI website builder?",
              "Do I need coding experience to use Manus?",
              "What types of applications can I build with Manus?",
              "How does Manus handle SEO optimization?",
              "Can I accept payments through my Manus-built website?",
              "How do I track visitors and leads on my website?",
              "Can I connect my own domain to my Manus website?",
              "How do I make a website?",
              "How long does it take to build a website?",
              "What is the best website builder for beginners?"
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
            Take back your time.<br />Just forward it to Manus.
          </h2>
          <button 
            onClick={onGetStarted}
            className="bg-black text-white px-10 py-4 rounded-full text-xl font-medium hover:bg-black/80 transition-all"
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
              <span className="font-serif text-xl font-bold tracking-tight">Manus</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Less structure,<br />more intelligence.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Security', 'Business', 'Resources', 'Email AI', 'Forwarding'] },
            { title: 'Resources', links: ['Blog', 'Guides', 'Support', 'API', 'Changelog', 'Newsletter'] },
            { title: 'Company', links: ['About', 'Careers', 'Contact', 'Press', 'Legal', 'Privacy'] }
          ].map((col, i) => (
            <div key={i} className="col-span-1">
              <h4 className="font-bold text-sm mb-6">{col.title}</h4>
              <ul className="space-y-4">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">{link}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20">
          <p>© 2024 Manus AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
