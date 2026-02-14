"use client";

import React from 'react';
import { 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Layout, 
  Save, 
  RotateCcw,
  Smartphone,
  Monitor,
  Eye,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface ThemeSettings {
  primaryColor: string;
  fontFamily: string;
  heroTitle: string;
  heroSubtitle: string;
  buttonRadius: string;
}

export const ThemeEditorPage = () => {
  const [settings, setSettings] = React.useState<ThemeSettings>({
    primaryColor: '#6366f1',
    fontFamily: 'Inter',
    heroTitle: 'Welcome to our store',
    heroSubtitle: 'Discover the best products curated just for you.',
    buttonRadius: '0.75rem'
  });

  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');

  const updateSetting = (key: keyof ThemeSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-full bg-background overflow-hidden animate-in fade-in duration-500">
      {/* Editor Sidebar */}
      <aside className="w-80 border-r border-border-custom flex flex-col bg-background z-20">
        <header className="px-6 py-6 border-b border-border-custom">
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent" />
            Theme Editor
          </h1>
          <p className="text-[12px] text-foreground/40 font-medium mt-1">Customize your storefront appearance</p>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Colors Section */}
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider flex items-center justify-between cursor-pointer group">
              Colors
              <ChevronDown className="w-3 h-3 group-hover:text-foreground transition-colors" />
            </h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-[13px] font-medium text-foreground/60 mb-1.5 block">Primary Brand Color</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={settings.primaryColor}
                    onChange={(e) => updateSetting('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-border-custom bg-transparent cursor-pointer p-0 overflow-hidden [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
                  />
                  <input 
                    type="text" 
                    value={settings.primaryColor}
                    onChange={(e) => updateSetting('primaryColor', e.target.value)}
                    className="flex-1 bg-foreground/[0.03] border border-border-custom rounded-lg px-3 py-2 text-[13px] font-medium focus:outline-none focus:border-accent"
                  />
                </div>
              </label>
            </div>
          </section>

          {/* Typography Section */}
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider flex items-center justify-between cursor-pointer group">
              Typography
              <ChevronDown className="w-3 h-3 group-hover:text-foreground transition-colors" />
            </h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-[13px] font-medium text-foreground/60 mb-1.5 block">Font Family</span>
                <select 
                  value={settings.fontFamily}
                  onChange={(e) => updateSetting('fontFamily', e.target.value)}
                  className="w-full bg-foreground/[0.03] border border-border-custom rounded-lg px-3 py-2 text-[13px] font-medium focus:outline-none focus:border-accent"
                >
                  <option value="Inter">Inter (Sans-serif)</option>
                  <option value="Playfair Display">Playfair Display (Serif)</option>
                  <option value="Roboto Mono">Roboto Mono (Monospace)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                </select>
              </label>
            </div>
          </section>

          {/* Content Section */}
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider flex items-center justify-between cursor-pointer group">
              Hero Section
              <ChevronDown className="w-3 h-3 group-hover:text-foreground transition-colors" />
            </h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-[13px] font-medium text-foreground/60 mb-1.5 block">Title Text</span>
                <input 
                  type="text" 
                  value={settings.heroTitle}
                  onChange={(e) => updateSetting('heroTitle', e.target.value)}
                  className="w-full bg-foreground/[0.03] border border-border-custom rounded-lg px-3 py-2 text-[13px] font-medium focus:outline-none focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="text-[13px] font-medium text-foreground/60 mb-1.5 block">Subtitle</span>
                <textarea 
                  rows={3}
                  value={settings.heroSubtitle}
                  onChange={(e) => updateSetting('heroSubtitle', e.target.value)}
                  className="w-full bg-foreground/[0.03] border border-border-custom rounded-lg px-3 py-2 text-[13px] font-medium focus:outline-none focus:border-accent resize-none"
                />
              </label>
            </div>
          </section>

          {/* UI Elements Section */}
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider flex items-center justify-between cursor-pointer group">
              UI Elements
              <ChevronDown className="w-3 h-3 group-hover:text-foreground transition-colors" />
            </h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-[13px] font-medium text-foreground/60 mb-1.5 block">Button Corner Radius</span>
                <div className="grid grid-cols-4 gap-2">
                  {['0px', '0.5rem', '0.75rem', '9999px'].map((radius) => (
                    <button
                      key={radius}
                      onClick={() => updateSetting('buttonRadius', radius)}
                      className={`h-8 border rounded-md transition-all ${settings.buttonRadius === radius ? 'bg-accent border-accent text-white' : 'border-border-custom hover:border-foreground/20'}`}
                      title={radius}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-current" style={{ borderRadius: radius }} />
                      </div>
                    </button>
                  ))}
                </div>
              </label>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-border-custom bg-foreground/[0.01] flex items-center gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-lg shadow-accent/20">
            <Save className="w-4 h-4" />
            Publish
          </button>
          <button className="p-2.5 rounded-xl border border-border-custom text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 bg-foreground/[0.02] flex flex-col relative">
        <header className="px-8 py-4 border-b border-border-custom flex items-center justify-between bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="flex bg-foreground/[0.05] rounded-lg p-1">
              <button 
                onClick={() => setViewMode('desktop')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/40 hover:text-foreground'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/40 hover:text-foreground'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[12px] font-bold text-foreground/30 uppercase tracking-wider">Live Preview</span>
          </div>
          <button className="text-[13px] font-bold text-accent flex items-center gap-2 hover:underline">
            View Live Site
            <Eye className="w-4 h-4" />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
          <div 
            className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden ${viewMode === 'desktop' ? 'w-full max-w-5xl' : 'w-[375px] h-[667px]'}`}
            style={{ fontFamily: settings.fontFamily }}
          >
            {/* Mock Storefront */}
            <nav className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
              <div className="text-xl font-black" style={{ color: settings.primaryColor }}>MIA STORE</div>
              <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
                <span>Shop</span>
                <span>Collections</span>
                <span>About</span>
                <div 
                  className="px-5 py-2 text-white font-bold transition-all shadow-lg"
                  style={{ backgroundColor: settings.primaryColor, borderRadius: settings.buttonRadius }}
                >
                  Cart (0)
                </div>
              </div>
            </nav>

            <div className="px-8 py-20 flex flex-col items-center text-center space-y-6">
              <h1 className="text-5xl font-black text-gray-900 leading-tight max-w-2xl">
                {settings.heroTitle}
              </h1>
              <p className="text-lg text-gray-500 max-w-lg">
                {settings.heroSubtitle}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <button 
                  className="px-8 py-4 text-white font-bold text-lg shadow-xl transition-all active:scale-95"
                  style={{ backgroundColor: settings.primaryColor, borderRadius: settings.buttonRadius }}
                >
                  Shop Now
                </button>
                <button 
                  className="px-8 py-4 text-gray-900 font-bold text-lg border-2 border-gray-200 transition-all hover:bg-gray-50 active:scale-95"
                  style={{ borderRadius: settings.buttonRadius }}
                >
                  Learn More
                </button>
              </div>
            </div>

            <div className="px-8 py-12 grid grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/5] bg-gray-100 rounded-2xl" />
                  <div className="space-y-1">
                    <div className="h-4 w-2/3 bg-gray-100 rounded" />
                    <div className="h-4 w-1/3 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
