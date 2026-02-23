"use client";

import React, { useState, useEffect } from 'react';
import { Send, Sparkles, RefreshCw, Smartphone, Monitor, ChevronRight, ShoppingBag } from 'lucide-react';

// Import all wireframes
import StorefrontWireframe from '../library/components/StorefrontWireframe';
import ProductListWireframe from '../library/components/ProductListWireframe';
import ProductDetailsWireframe from '../library/components/ProductDetailsWireframe';
import CartWireframe from '../library/components/CartWireframe';
import CheckoutWireframe from '../library/components/CheckoutWireframe';
import CheckoutWireframeVariant2 from '../library/components/CheckoutWireframeVariant2';
import NavbarWireframe from '../library/components/NavbarWireframe';
import NavbarVariant2 from '../library/components/NavbarVariant2';
import FooterWireframe from '../library/components/FooterWireframe';
import FooterVariant2 from '../library/components/FooterVariant2';

// --- Types ---

type PageView = 'home' | 'shop' | 'product' | 'cart' | 'checkout';

interface SiteConfig {
  branding: {
    storeName: string;
    primaryColor: string;
    headingFont: string;
    bodyFont: string;
    logo?: string;
  };
  variants: {
    navbar: 'v1' | 'v2';
    footer: 'v1' | 'v2';
    checkout: 'v1' | 'v2';
    storefront: 'v1'; // Only one for now
  };
  copy: {
    heroTitle: string;
    heroSubtitle: string;
    heroButton: string;
    aboutTitle: string;
    aboutText: string;
  };
}

// --- Generator Logic (Rule-Based AI) ---

const FONTS = ['Inter', 'Playfair Display', 'Montserrat', 'Space Grotesk'];
const COLORS = ['#000000', '#2563EB', '#DC2626', '#059669', '#7C3AED'];

const generateConfig = (prompt: string, preferences?: { color?: string, font?: string }): SiteConfig => {
  const isMinimal = prompt.toLowerCase().includes('minimal') || prompt.toLowerCase().includes('clean');
  const isFashion = prompt.toLowerCase().includes('fashion') || prompt.toLowerCase().includes('clothing');
  
  // Branding
  const storeName = prompt.match(/called\s+["']?([^"'\s.,!?]+(?: [^"'\s.,!?]+)*)["']?/i)?.[1] || 
                   prompt.match(/named\s+["']?([^"'\s.,!?]+(?: [^"'\s.,!?]+)*)["']?/i)?.[1] || 
                   prompt.match(/brand\s+(?:called|named)\s+["']?([^"'\s.,!?]+(?: [^"'\s.,!?]+)*)["']?/i)?.[1] ||
                   "MIA STORE";
  
  // Resolve Color
  let primaryColor = isMinimal ? '#000000' : COLORS[Math.floor(Math.random() * COLORS.length)];
  if (preferences?.color && !preferences.color.toLowerCase().includes('surprise')) {
    // Basic color mapping or pass through if it looks like a hex
    if (preferences.color.startsWith('#')) {
      primaryColor = preferences.color;
    } else {
      // Map common names to hex
      const colorMap: Record<string, string> = {
        'blue': '#2563EB',
        'red': '#DC2626',
        'green': '#059669',
        'purple': '#7C3AED',
        'black': '#000000',
        'white': '#FFFFFF',
        'pink': '#EC4899',
        'orange': '#F97316',
      };
      // Try to find a match in the user's string
      const matchedColor = Object.keys(colorMap).find(c => preferences.color!.toLowerCase().includes(c));
      if (matchedColor) primaryColor = colorMap[matchedColor];
    }
  }

  // Resolve Font
  // Priority: User Preference > Prompt Context > Default
  let headingFont = 'Playfair Display'; // Default fallback
  
  if (preferences?.font && !preferences.font.toLowerCase().includes('decide')) {
     // Direct match from our FONTS list first
     const exactMatch = FONTS.find(f => preferences.font!.toLowerCase().includes(f.toLowerCase()));
     if (exactMatch) {
       headingFont = exactMatch;
     } else {
       // Map generic terms
       const fontMap: Record<string, string> = {
          'modern': 'Inter',
          'classic': 'Playfair Display',
          'serif': 'Playfair Display',
          'sans': 'Inter',
          'bold': 'Montserrat',
          'tech': 'Space Grotesk'
       };
       const matchedFont = Object.keys(fontMap).find(f => preferences.font!.toLowerCase().includes(f));
       if (matchedFont) headingFont = fontMap[matchedFont];
     }
  } else {
    // Fallback logic if no preference was set
    headingFont = isMinimal ? 'Inter' : 'Playfair Display';
  }
  
  // Variants - Randomize if not specific
  const navbarVariant = isMinimal ? 'v2' : (Math.random() > 0.5 ? 'v1' : 'v2');
  const footerVariant = isMinimal ? 'v2' : (Math.random() > 0.5 ? 'v1' : 'v2');
  const checkoutVariant = isMinimal ? 'v2' : (Math.random() > 0.5 ? 'v1' : 'v2');

  // Copy Generation (Mock AI)
  let heroTitle = "Elevate Your Lifestyle";
  let heroSubtitle = "Discover our curated collection of premium essentials.";
  
  if (isFashion) {
    heroTitle = "Redefine Your Wardrobe";
    heroSubtitle = "Timeless pieces for the modern individual.";
  } else if (prompt.toLowerCase().includes('tech')) {
    heroTitle = "Future of Tech";
    heroSubtitle = "Innovative gadgets for a smarter life.";
  }

  return {
    branding: {
      storeName,
      primaryColor,
      headingFont,
      bodyFont: 'Inter',
    },
    variants: {
      navbar: navbarVariant,
      footer: footerVariant,
      checkout: checkoutVariant,
      storefront: 'v1',
    },
    copy: {
      heroTitle,
      heroSubtitle,
      heroButton: "Shop Collection",
      aboutTitle: `About ${storeName}`,
      aboutText: "We believe in quality, sustainability, and exceptional design. Our mission is to bring you the best products that enhance your daily life.",
    }
  };
};

// --- Main Component ---

export default function AIBuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [currentView, setCurrentView] = useState<PageView>('home');
  
  // New State for Multi-step conversation
  const [stage, setStage] = useState<'initial' | 'asking_color' | 'asking_font' | 'generating' | 'completed'>('initial');
  const [storeDescription, setStoreDescription] = useState("");
  const [preferences, setPreferences] = useState({ color: '', font: '' });
  const [progressStep, setProgressStep] = useState(0);

  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hi! I'm Mia, your AI store builder. Describe your dream store, and I'll design it for you in seconds." }
  ]);

  const PROGRESS_STEPS = [
    "Designing the store layout...",
    "Adding colors to spice things up...",
    "Perfecting the layout...",
    "Writing content...",
    "Finalizing the design..."
  ];

  // Effect to handle the progress simulation
  useEffect(() => {
    if (stage === 'generating') {
      setIsGenerating(true);
      let step = 0;
      setProgressStep(0);
      
      const interval = setInterval(() => {
        step++;
        if (step < PROGRESS_STEPS.length) {
          setProgressStep(step);
        } else {
          clearInterval(interval);
          finishGeneration();
        }
      }, 2000); // 2000ms per step

      return () => clearInterval(interval);
    }
  }, [stage]);

  const finishGeneration = () => {
    const newConfig = generateConfig(storeDescription, preferences);
    setConfig(newConfig);
    
    let responseText = `I've designed a ${newConfig.variants.navbar === 'v2' ? 'minimalist' : 'standard'} store for "${newConfig.branding.storeName}".`;
    responseText += ` I chose ${newConfig.branding.headingFont} for the typography to give it a ${newConfig.branding.headingFont === 'Inter' ? 'modern' : 'classic'} feel.`;
    
    setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    setIsGenerating(false);
    setStage('completed');
  };

  const handleFontSelection = (selectedFont: string) => {
    setPreferences(prev => ({ ...prev, font: selectedFont }));
      
    // Start generation
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'user', 
        text: selectedFont 
      }, { 
        role: 'ai', 
        text: "Perfect! I'm starting the design now..." 
      }]);
      setStage('generating');
    }, 500);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userText = prompt.trim();
    setPrompt(""); // Clear input

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userText }]);

    if (stage === 'initial' || stage === 'completed') {
      // Start new flow
      setStoreDescription(userText);
      setPreferences({ color: '', font: '' }); // Reset preferences
      
      // Ask for color
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "That sounds exciting! To tailor the look, what primary color would you like for your store?" 
        }]);
        setStage('asking_color');
      }, 500);
    
    } else if (stage === 'asking_color') {
      setPreferences(prev => ({ ...prev, color: userText }));
      
      // Ask for font
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "Got it. And what font style do you prefer? (e.g., Modern, Classic, Bold)" 
        }]);
        setStage('asking_font');
      }, 500);

    } else if (stage === 'asking_font') {
      setPreferences(prev => ({ ...prev, font: userText }));
      
      // Start generation
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'ai', 
          text: "Perfect! I'm starting the design now..." 
        }]);
        setStage('generating');
      }, 500);
    }
  };

  // Mock Data Helpers
  const getSettings = () => config ? {
    storeName: config.branding.storeName,
    primaryColor: config.branding.primaryColor,
    headingFont: config.branding.headingFont,
    bodyFont: config.branding.bodyFont,
    currency: "₦",
    heroTitle: config.copy.heroTitle,
    heroDescription: config.copy.heroSubtitle,
    aboutTitle: config.copy.aboutTitle,
    aboutText: config.copy.aboutText,
  } : undefined;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar - Chat Interface */}
      <div className="w-[400px] flex flex-col bg-white border-r border-gray-200 shadow-xl z-20">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg">Mia Builder</h1>
            <p className="text-xs text-gray-500">AI-Powered Store Generator</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'ai' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                {msg.role === 'ai' ? <Sparkles size={14} /> : <div className="w-2 h-2 bg-gray-500 rounded-full" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm max-w-[85%] leading-relaxed ${msg.role === 'ai' ? 'bg-gray-100 text-gray-800 rounded-tl-none' : 'bg-black text-white rounded-tr-none'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles size={14} />
              </div>
              <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none text-sm text-gray-500 flex flex-col gap-3 min-w-[200px]">
                {PROGRESS_STEPS.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      idx < progressStep 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : idx === progressStep 
                          ? 'border-black border-t-transparent animate-spin' 
                          : 'border-gray-300'
                    }`}>
                      {idx < progressStep && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span className={`${
                      idx < progressStep 
                        ? 'text-gray-800 line-through opacity-50' 
                        : idx === progressStep 
                          ? 'text-black font-medium' 
                          : 'text-gray-400'
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          {stage === 'asking_font' ? (
             <div className="grid grid-cols-2 gap-3 pb-2">
                {FONTS.map((font) => (
                  <button
                    key={font}
                    onClick={() => handleFontSelection(font)}
                    className="p-3 border border-gray-200 rounded-xl bg-white hover:border-black hover:shadow-md transition-all text-left"
                  >
                    <span className="block text-xs text-gray-500 mb-1">{font}</span>
                    <span className="text-lg" style={{ fontFamily: font }}>Ag</span>
                  </button>
                ))}
             </div>
          ) : (
          <form onSubmit={handleGenerate} className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                stage === 'initial' || stage === 'completed' ? "Describe your store..." :
                stage === 'asking_color' ? "e.g., Blue, #FF5733..." :
                "Please wait..."
              }
              disabled={isGenerating}
              className="w-full bg-white border-0 rounded-xl shadow-sm p-4 pr-12 text-sm focus:ring-2 focus:ring-black resize-none h-24 disabled:opacity-50 disabled:cursor-not-allowed"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate(e);
                }
              }}
            />
            <button 
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="absolute right-3 bottom-3 p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-all"
            >
              <Send size={16} />
            </button>
          </form>
          )}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-100/50">
        
        {/* Preview Toolbar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setCurrentView('home')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${currentView === 'home' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setCurrentView('shop')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${currentView === 'shop' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Shop
            </button>
            <button 
              onClick={() => setCurrentView('product')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${currentView === 'product' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Product
            </button>
            <button 
              onClick={() => setCurrentView('checkout')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${currentView === 'checkout' ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-black'}`}
            >
              Checkout
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-400 flex items-center gap-2">
              <Monitor size={14} />
              <span>Desktop Preview</span>
            </div>
            {config && (
              <button 
                onClick={() => setConfig(generateConfig("Regenerate " + config.branding.storeName))}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-xs font-medium transition-colors"
              >
                <RefreshCw size={12} />
                <span>Shuffle Variant</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Render */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {config ? (
            <div className="min-h-full bg-white shadow-2xl mx-auto max-w-[1400px] transition-all duration-500 ease-in-out">
              
              {/* Navbar Injection */}
              {currentView !== 'checkout' || config.variants.checkout === 'v1' ? (
                config.variants.navbar === 'v1' ? (
                  <NavbarWireframe 
                    storeName={config.branding.storeName} 
                    settings={getSettings()}
                  />
                ) : (
                  <NavbarVariant2 
                    storeName={config.branding.storeName} 
                    settings={getSettings()}
                  />
                )
              ) : null}

              {/* Page Content */}
              <div className="min-h-[80vh]">
                {currentView === 'home' && (
                  <StorefrontWireframe 
                    settings={getSettings()} 
                    showNavbar={false}
                    showFooter={false}
                  />
                )}
                
                {currentView === 'shop' && (
                  <ProductListWireframe storeSettings={getSettings()} />
                )}

                {currentView === 'product' && (
                  <ProductDetailsWireframe storeSettings={getSettings()} />
                )}

                {currentView === 'checkout' && (
                  config.variants.checkout === 'v1' ? (
                    <CheckoutWireframe storeSettings={getSettings()} />
                  ) : (
                    <CheckoutWireframeVariant2 storeSettings={getSettings()} />
                  )
                )}
              </div>

              {/* Footer Injection */}
              {currentView !== 'checkout' || config.variants.checkout === 'v1' ? (
                config.variants.footer === 'v1' ? (
                  <FooterWireframe 
                    storeName={config.branding.storeName} 
                    settings={getSettings()}
                  />
                ) : (
                  <FooterVariant2 
                    storeName={config.branding.storeName} 
                    settings={getSettings()}
                  />
                )
              ) : null}

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles size={32} className="text-gray-400" />
              </div>
              <p className="font-medium">Ready to design your store</p>
              <p className="text-sm max-w-xs text-center">Type a prompt in the sidebar to generate a unique store design.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
