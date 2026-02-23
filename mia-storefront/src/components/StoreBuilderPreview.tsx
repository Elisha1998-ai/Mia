import React from 'react';
import { RefreshCw, Monitor, Sparkles } from 'lucide-react';
import { SiteConfig, PageView } from '@/types/store-builder';

// Import all wireframes
import StorefrontWireframe from '@/app/library/components/StorefrontWireframe';
import ProductListWireframe from '@/app/library/components/ProductListWireframe';
import ProductDetailsWireframe from '@/app/library/components/ProductDetailsWireframe';
import CartWireframe from '@/app/library/components/CartWireframe';
import CheckoutWireframe from '@/app/library/components/CheckoutWireframe';
import CheckoutWireframeVariant2 from '@/app/library/components/CheckoutWireframeVariant2';
import NavbarWireframe from '@/app/library/components/NavbarWireframe';
import NavbarVariant2 from '@/app/library/components/NavbarVariant2';
import FooterWireframe from '@/app/library/components/FooterWireframe';
import FooterVariant2 from '@/app/library/components/FooterVariant2';

interface StoreBuilderPreviewProps {
  config: SiteConfig | null;
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  regenerateVariant: () => void;
  onUpdateConfig?: (config: SiteConfig) => void;
}

export function StoreBuilderPreview({
  config,
  currentView,
  setCurrentView,
  regenerateVariant,
  onUpdateConfig
}: StoreBuilderPreviewProps) {

  const getSettings = () => config ? {
    storeName: config.branding.storeName,
    primaryColor: config.branding.primaryColor,
    headingFont: config.branding.headingFont,
    bodyFont: config.branding.bodyFont,
    currency: "₦",
    heroTitle: config.copy.heroTitle,
    heroDescription: config.copy.heroSubtitle,
    heroButtonText: config.copy.heroButton,
    heroImage: config.copy.heroImage,
    aboutTitle: config.copy.aboutTitle,
    aboutText: config.copy.aboutText,
    footerDescription: config.copy.footerDescription,
  } : undefined;

  const handleUpdateStorefrontSettings = (key: string, value: string) => {
    if (!config || !onUpdateConfig) return;
    const newConfig = { ...config };
    newConfig.copy = { ...config.copy };
    
    if (key === 'heroTitle') newConfig.copy.heroTitle = value;
    if (key === 'heroDescription') newConfig.copy.heroSubtitle = value;
    if (key === 'heroButtonText') newConfig.copy.heroButton = value;
    if (key === 'heroImage') newConfig.copy.heroImage = value;
    
    onUpdateConfig(newConfig);
  };

  const handleUpdateFooterSettings = (key: string, value: string) => {
    if (!config || !onUpdateConfig) return;
    const newConfig = { ...config };
    newConfig.copy = { ...config.copy };
    
    if (key === 'footerDescription') newConfig.copy.footerDescription = value;
    
    onUpdateConfig(newConfig);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-muted/20">
      
      {/* Preview Toolbar */}
      <div className="h-16 bg-background border-b border-border-custom flex items-center justify-between px-6">
        <div className="flex bg-muted p-1 rounded-lg">
          {(['home', 'shop', 'product', 'checkout'] as PageView[]).map((view) => (
            <button 
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                currentView === view 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {view}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Monitor size={14} />
            <span>Desktop Preview</span>
          </div>
          {config && (
            <button 
              onClick={regenerateVariant}
              className="flex items-center gap-2 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-md text-xs font-medium transition-colors text-foreground"
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
          <div className="min-h-full bg-background shadow-2xl mx-auto max-w-[1400px] transition-all duration-500 ease-in-out">
            
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
                  onUpdateSettings={handleUpdateStorefrontSettings}
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
                  settings={{
                    ...getSettings(),
                    primaryColor: config.branding.primaryColor,
                    headingFont: config.branding.headingFont,
                    bodyFont: config.branding.bodyFont,
                    footerDescription: config.copy.footerDescription
                  }}
                  onUpdateSettings={handleUpdateFooterSettings}
                />
              ) : (
                <FooterVariant2 
                  storeName={config.branding.storeName} 
                  settings={{
                    ...getSettings(),
                    primaryColor: config.branding.primaryColor,
                    headingFont: config.branding.headingFont,
                    bodyFont: config.branding.bodyFont,
                    footerDescription: config.copy.footerDescription
                  }}
                  onUpdateSettings={handleUpdateFooterSettings}
                />
              )
            ) : null}

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center animate-pulse">
              <Sparkles size={32} className="text-muted-foreground/50" />
            </div>
            <p className="font-medium">Ready to design your store</p>
            <p className="text-sm max-w-xs text-center text-muted-foreground/70">Type a prompt in the sidebar to generate a unique store design.</p>
          </div>
        )}
      </div>

    </div>
  );
}
