import { useState, useEffect } from 'react';
import { SiteConfig, PageView } from '@/types/store-builder';

// --- Generator Logic (Rule-Based AI) ---

export const FONTS = ['Inter', 'Playfair Display', 'Montserrat', 'Space Grotesk'];
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
      footerDescription: "Premium quality essentials for the modern lifestyle. Designed with care and crafted to last."
    }
  };
};

export const useStoreBuilder = () => {
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

  const regenerateVariant = () => {
    if (config) {
      const newConfig = generateConfig("Regenerate " + config.branding.storeName);
      setConfig(newConfig);
    }
  };

  return {
    prompt,
    setPrompt,
    isGenerating,
    config,
    setConfig,
    currentView,
    setCurrentView,
    stage,
    messages,
    progressStep,
    PROGRESS_STEPS,
    handleGenerate,
    handleFontSelection,
    regenerateVariant,
    setConfig
  };
};
