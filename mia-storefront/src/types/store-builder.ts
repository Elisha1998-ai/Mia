export type PageView = 'home' | 'shop' | 'product' | 'cart' | 'checkout';

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
    footerDescription?: string;
    heroImage?: string;
  };
}
