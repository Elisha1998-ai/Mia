export type PageView = 'home' | 'product' | 'cart' | 'wishlist' | 'contact' | 'checkout' | 'thank-you';

export interface SiteConfig {
  branding: {
    storeName: string;
    primaryColor: string;
    headingFont: string;
    bodyFont: string;
    logo?: string;
  };
  variants: {
    navbar: 'v1' | 'v2';
    hero: 'v1' | 'v2';
    footer: 'v1' | 'v2';
    checkout: 'v1' | 'v2' | 'v3';
  };
  copy: {
    heroTitle: string;
    heroDescription: string;
    heroButtonText: string;
    footerBigText?: string;
  };
}
