import React from 'react';
import { RefreshCw, Monitor, Sparkles, Smartphone } from 'lucide-react';
import IframePortal from '@/components/IframePortal';
import { SiteConfig, PageView } from '@/types/store-builder';

// Import all wireframes
import StorefrontWireframe from '@/app/library/components/StorefrontWireframe';
import ProductDetailsWireframe from '@/app/library/components/ProductDetailsWireframe';
import CartWireframe from '@/app/library/components/CartWireframe';
import CheckoutWireframe from '@/app/library/components/CheckoutWireframe';
import CheckoutWireframeVariant2 from '@/app/library/components/CheckoutWireframeVariant2';
import CheckoutWireframeVariant3 from '@/app/library/components/CheckoutWireframeVariant3';
import NavbarWireframe from '@/app/library/components/NavbarWireframe';
import NavbarVariant2 from '@/app/library/components/NavbarVariant2';
import FooterWireframe from '@/app/library/components/FooterWireframe';
import FooterVariant2 from '@/app/library/components/FooterVariant2';
import ContactWireframe from '@/app/library/components/ContactWireframe';
import WishlistWireframe from '@/app/library/components/WishlistWireframe';
import ConfirmationWireframe from '@/app/library/components/ConfirmationWireframe';

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

  const [device, setDevice] = React.useState<'desktop' | 'mobile'>('desktop');
  const [showSearch, setShowSearch] = React.useState(false);

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
    footerBigText: config.copy.footerBigText ? config.copy.footerBigText.replaceAll('<br/>', '\n') : undefined,
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
    if (key === 'footerBigText') newConfig.copy.footerBigText = value;
    
    onUpdateConfig(newConfig);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-muted/20">
      
      {/* Preview Toolbar */}
      <div className="h-16 bg-background border-b border-border-custom flex items-center justify-between px-6">
        <div className="flex bg-muted p-1 rounded-lg overflow-x-auto no-scrollbar">
          {(['home', 'product', 'cart', 'wishlist', 'contact', 'checkout', 'thank-you'] as PageView[]).map((view) => (
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
          <div className="flex items-center gap-1">
            <button 
              aria-label="Mobile"
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-md ${device === 'mobile' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Smartphone size={16} />
            </button>
            <button 
              aria-label="Desktop"
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-md ${device === 'desktop' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Monitor size={16} />
            </button>
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
      <div className={`flex-1 ${device === 'mobile' ? 'overflow-hidden' : 'overflow-y-auto no-scrollbar'} custom-scrollbar pt-0 px-[5px] pb-[5px]`}>
        {config ? (
          device === 'mobile' ? (
            <IframePortal width={430} height="100%" className="mx-auto h-full">
              <div className="min-h-full bg-background overflow-y-auto no-scrollbar">
                {showSearch && (
                  <div className="mb-3 p-2 bg-muted rounded-md flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Search products..." 
                      className="flex-1 bg-background border border-border-custom rounded-md px-3 py-2 text-sm"
                      onBlur={() => setShowSearch(false)}
                      autoFocus
                    />
                  </div>
                )}
                {config.variants.navbar === 'v1' ? (
                  <NavbarWireframe 
                    storeName={config.branding.storeName} 
                    settings={getSettings()}
                    onSearch={() => setShowSearch(true)}
                  />
                ) : (
                  <NavbarVariant2 
                    storeName={config.branding.storeName} 
                    settings={getSettings()}
                    onSearch={() => setShowSearch(true)}
                  />
                )}
                <div className="min-h-[80vh]">
                  {currentView === 'home' && (
                    <StorefrontWireframe 
                      settings={getSettings()} 
                      showNavbar={false}
                      showFooter={false}
                      onUpdateSettings={handleUpdateStorefrontSettings}
                    />
                  )}
                  {currentView === 'product' && <ProductDetailsWireframe storeSettings={getSettings()} />}
                  {currentView === 'checkout' && (
                    config.variants.checkout === 'v1'
                      ? <CheckoutWireframe storeSettings={getSettings()} />
                      : config.variants.checkout === 'v2'
                        ? <CheckoutWireframeVariant2 storeSettings={getSettings()} />
                        : <CheckoutWireframeVariant3 storeSettings={getSettings()} />
                  )}
                  {currentView === 'cart' && <CartWireframe storeSettings={getSettings()} />}
                  {currentView === 'contact' && <ContactWireframe storeSettings={getSettings()} />}
                  {currentView === 'wishlist' && <WishlistWireframe storeSettings={getSettings()} />}
                  {currentView === 'thank-you' && <ConfirmationWireframe storeSettings={getSettings()} />}
                </div>
                {config.variants.footer === 'v1' ? (
                  <FooterWireframe 
                    storeName={config.branding.storeName} 
                    settings={{
                      ...getSettings(),
                      primaryColor: config.branding.primaryColor,
                      headingFont: config.branding.headingFont,
                      bodyFont: config.branding.bodyFont,
                      footerDescription: config.copy.footerDescription,
                      footerBigText: config.copy.footerBigText
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
                      footerDescription: config.copy.footerDescription,
                      footerBigText: config.copy.footerBigText ? config.copy.footerBigText.replaceAll('<br/>', '\n') : undefined
                    }}
                    onUpdateSettings={handleUpdateFooterSettings}
                  />
                )}
              </div>
            </IframePortal>
          ) : (
            <div className="min-h-full bg-background shadow-2xl mx-auto max-w-[1400px] transition-all duration-500 ease-in-out no-scrollbar">
              {showSearch && (
                <div className="mb-3 p-2 bg-muted rounded-md flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="flex-1 bg-background border border-border-custom rounded-md px-3 py-2 text-sm"
                    onBlur={() => setShowSearch(false)}
                    autoFocus
                  />
                </div>
              )}
              {config.variants.navbar === 'v1' ? (
                <NavbarWireframe 
                  storeName={config.branding.storeName} 
                  settings={getSettings()}
                  onSearch={() => setShowSearch(true)}
                />
              ) : (
                <NavbarVariant2 
                  storeName={config.branding.storeName} 
                  settings={getSettings()}
                  onSearch={() => setShowSearch(true)}
                />
              )}
              <div className="min-h-[80vh]">
                {currentView === 'home' && (
                  <StorefrontWireframe 
                    settings={getSettings()} 
                    showNavbar={false}
                    showFooter={false}
                    onUpdateSettings={handleUpdateStorefrontSettings}
                  />
                )}
                {currentView === 'product' && <ProductDetailsWireframe storeSettings={getSettings()} />}
                {currentView === 'checkout' && (
                  config.variants.checkout === 'v1'
                    ? <CheckoutWireframe storeSettings={getSettings()} />
                    : config.variants.checkout === 'v2'
                      ? <CheckoutWireframeVariant2 storeSettings={getSettings()} />
                      : <CheckoutWireframeVariant3 storeSettings={getSettings()} />
                )}
                {currentView === 'cart' && <CartWireframe storeSettings={getSettings()} />}
                {currentView === 'contact' && <ContactWireframe storeSettings={getSettings()} />}
                {currentView === 'wishlist' && <WishlistWireframe storeSettings={getSettings()} />}
                {currentView === 'thank-you' && <ConfirmationWireframe storeSettings={getSettings()} />}
              </div>
              {config.variants.footer === 'v1' ? (
                <FooterWireframe 
                  storeName={config.branding.storeName} 
                  settings={{
                    ...getSettings(),
                    primaryColor: config.branding.primaryColor,
                    headingFont: config.branding.headingFont,
                    bodyFont: config.branding.bodyFont,
                    footerDescription: config.copy.footerDescription,
                    footerBigText: config.copy.footerBigText
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
                    footerDescription: config.copy.footerDescription,
                    footerBigText: config.copy.footerBigText ? config.copy.footerBigText.replaceAll('<br/>', '\n') : undefined
                  }}
                  onUpdateSettings={handleUpdateFooterSettings}
                />
              )}
            </div>
          )
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
