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
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useSettings } from '@/hooks/useData';
import CheckoutWireframe from '@/app/library/components/CheckoutWireframe';

interface ThemeSettings {
  primaryColor: string;
  fontFamily: string;
  heroTitle: string;
  heroSubtitle: string;
  buttonRadius: string;
  paystackEnabled: boolean;
  flutterwaveEnabled: boolean;
  shippingEnabled: boolean;
}

export const ThemeEditorPage = () => {
  const { settings: remoteSettings, loading, updateSettings } = useSettings();
  const [settings, setSettings] = React.useState<ThemeSettings>({
    primaryColor: '#6366f1',
    fontFamily: 'Inter',
    heroTitle: 'Welcome to our store',
    heroSubtitle: 'Discover the best products curated just for you.',
    buttonRadius: '0.75rem',
    paystackEnabled: false,
    flutterwaveEnabled: false,
    shippingEnabled: true
  });
  const [currentView, setCurrentView] = React.useState<'home' | 'checkout'>('home');
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    // Only fetch once on mount via hook, but here we sync local state
    if (remoteSettings) {
      setSettings({
        primaryColor: remoteSettings.primaryColor || '#6366f1',
        fontFamily: remoteSettings.bodyFont || 'Inter',
        heroTitle: remoteSettings.heroTitle || 'Welcome to our store',
        heroSubtitle: remoteSettings.heroDescription || 'Discover the best products curated just for you.',
        buttonRadius: remoteSettings.buttonRadius || '0.75rem',
        paystackEnabled: !!remoteSettings.paystackEnabled,
        flutterwaveEnabled: !!remoteSettings.flutterwaveEnabled,
        shippingEnabled: remoteSettings.shippingEnabled !== false
      });
    }
  }, [remoteSettings]);

  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const updateSetting = (key: keyof ThemeSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateSettings({
        primaryColor: settings.primaryColor,
        bodyFont: settings.fontFamily,
        headingFont: settings.fontFamily, // Sync both for now
        heroTitle: settings.heroTitle,
        heroDescription: settings.heroSubtitle,
        buttonRadius: settings.buttonRadius,
        paystackEnabled: settings.paystackEnabled,
        flutterwaveEnabled: settings.flutterwaveEnabled,
        shippingEnabled: settings.shippingEnabled
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !remoteSettings) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full bg-background overflow-hidden animate-in fade-in duration-500 relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border-custom bg-background z-30">
        <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
          <Palette className="w-5 h-5 text-accent" />
          Theme Editor
        </h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -mr-2 text-foreground/60 hover:text-foreground"
        >
          <Layout className="w-5 h-5" />
        </button>
      </div>

      {/* Editor Sidebar */}
      <aside className={`
        fixed inset-0 z-40 bg-background md:static md:w-80 border-r border-border-custom flex flex-col transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <header className="px-6 py-6 border-b border-border-custom flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Palette className="w-5 h-5 text-accent" />
              Theme Editor
            </h1>
            <p className="text-[12px] text-foreground/40 font-medium mt-1">Customize your storefront appearance</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 -mr-2 text-foreground/40 hover:text-foreground"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
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
                  <option value="Instrument Serif">Instrument Serif (Serif)</option>
                  <option value="Playfair Display">Playfair Display (Serif)</option>
                  <option value="Montserrat">Montserrat (Sans-serif)</option>
                  <option value="Roboto">Roboto (Sans-serif)</option>
                  <option value="Lora">Lora (Serif)</option>
                  <option value="Bebas Neue">Bebas Neue (Display)</option>
                  <option value="Oswald">Oswald (Sans-serif)</option>
                  <option value="Libre Baskerville">Libre Baskerville (Serif)</option>
                  <option value="Cinzel">Cinzel (Serif)</option>
                  <option value="Poppins">Poppins (Sans-serif)</option>
                  <option value="Raleway">Raleway (Sans-serif)</option>
                  <option value="Quicksand">Quicksand (Sans-serif)</option>
                  <option value="Space Grotesk">Space Grotesk (Display)</option>
                  <option value="Cormorant Garamond">Cormorant Garamond (Serif)</option>
                  <option value="Work Sans">Work Sans (Sans-serif)</option>
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

          {/* Commerce Configuration Section */}
          <section className="space-y-4">
            <h2 className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider flex items-center justify-between cursor-pointer group">
              Commerce Config
              <ChevronDown className="w-3 h-3 group-hover:text-foreground transition-colors" />
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-foreground/60">Enable Paystack</span>
                <input
                  type="checkbox"
                  checked={settings.paystackEnabled}
                  onChange={(e) => updateSetting('paystackEnabled', e.target.checked)}
                  className="w-4 h-4 rounded border-border-custom text-accent focus:ring-accent"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-foreground/60">Enable Flutterwave</span>
                <input
                  type="checkbox"
                  checked={settings.flutterwaveEnabled}
                  onChange={(e) => updateSetting('flutterwaveEnabled', e.target.checked)}
                  className="w-4 h-4 rounded border-border-custom text-accent focus:ring-accent"
                />
              </div>
              <div className="flex items-center justify-between border-t border-border-custom pt-4">
                <span className="text-[13px] font-medium text-foreground/60">Enable Shipping Info</span>
                <input
                  type="checkbox"
                  checked={settings.shippingEnabled}
                  onChange={(e) => updateSetting('shippingEnabled', e.target.checked)}
                  className="w-4 h-4 rounded border-border-custom text-accent focus:ring-accent"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-border-custom bg-foreground/[0.01] flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : 'Publish'}
          </button>
          <button className="p-2.5 rounded-xl border border-border-custom text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 bg-foreground/[0.02] flex flex-col relative overflow-hidden">
        <header className="px-4 md:px-8 py-4 border-b border-border-custom flex items-center justify-between bg-background/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-foreground/60 hover:text-foreground"
            >
              <Palette className="w-5 h-5" />
            </button>
            <div className="flex bg-foreground/[0.05] rounded-lg p-1">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${currentView === 'home' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/40 hover:text-foreground'}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('checkout')}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all ${currentView === 'checkout' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/40 hover:text-foreground'}`}
              >
                Checkout
              </button>
            </div>

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

        <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center">
          <div
            className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden ${viewMode === 'desktop' ? 'w-full max-w-5xl' : 'w-full max-w-[375px] md:w-[375px] h-[667px]'}`}
            style={{ fontFamily: settings.fontFamily }}
          >
            {currentView === 'home' ? (
              <>
                {/* Mock Storefront */}
                <nav className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
                  <div className="text-xl font-black" style={{ color: settings.primaryColor }}>PONY STORE</div>
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
                      <div className="h-4 w-2/3 bg-gray-100 rounded" />
                      <div className="h-4 w-1/3 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full overflow-y-auto no-scrollbar">
                {remoteSettings ? (
                  <CheckoutWireframe storeSettings={{ ...settings, storeName: 'Pony Store', paystackEnabled: settings.paystackEnabled, flutterwaveEnabled: settings.flutterwaveEnabled, shippingEnabled: settings.shippingEnabled }} />
                ) : (
                  <div className="p-8 space-y-8">
                    <h2 className="text-2xl font-bold mb-6">Checkout Preview</h2>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-xl">
                        <h3 className="font-bold mb-2">Payment Methods</h3>
                        <div className="space-y-2">
                          {settings.paystackEnabled && <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 bg-green-500 rounded-full" /> Paystack Enabled</div>}
                          {settings.flutterwaveEnabled && <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 bg-blue-500 rounded-full" /> Flutterwave Enabled</div>}
                          {!settings.paystackEnabled && !settings.flutterwaveEnabled && <div className="text-sm text-gray-400">No payment methods enabled</div>}
                        </div>
                      </div>
                      {settings.shippingEnabled && (
                        <div className="p-4 border rounded-xl">
                          <h3 className="font-bold mb-2">Shipping Information</h3>
                          <div className="h-20 bg-gray-50 rounded-lg flex items-center justify-center text-sm text-gray-400 italic">
                            Shipping form placeholder
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
