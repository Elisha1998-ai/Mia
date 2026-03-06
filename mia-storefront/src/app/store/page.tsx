"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useSettings } from '@/hooks/useData';
import StorefrontWireframe from '@/app/library/components/StorefrontWireframe';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  sku?: string;
  category?: string;
  isDigital?: boolean;
}

export default function ShopPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { settings, fetchSettings } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  React.useEffect(() => {
    fetchSettings();
  }, []);

  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const [productsRes, digitalRes] = await Promise.all([
          fetch('/api/products').catch(() => null),
          fetch('/api/digital/products').catch(() => null)
        ]);

        const productsData = productsRes?.ok ? await productsRes.json() : { products: [] };
        const digitalData = digitalRes?.ok ? await digitalRes.json() : { products: [] };

        let physicalList: Product[] = productsData.products || [];

        let digitalList: Product[] = (digitalData.products || [])
          .filter((p: any) => p.status === 'published')
          .map((p: any) => ({
            id: p.id,
            name: p.title,
            price: p.price,
            image_url: p.cover_image_url,
            category: p.product_type,
            isDigital: true
          }));

        let list: Product[] = [...physicalList, ...digitalList];

        if (query) {
          const q = query.toLowerCase();
          list = list.filter((p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
          );
        }
        setProducts(list);
      } catch (e) {
        console.error('Error fetching products:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query]);

  // Map to the shape the wireframe expects
  const wireframeProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    image: p.image_url,
    category: p.category,
    isDigital: p.isDigital,
  }));

  // Build settings object for the wireframe
  const storeSettings = {
    storeName: settings?.storeName,
    primaryColor: settings?.primaryColor,
    headingFont: settings?.headingFont,
    bodyFont: settings?.bodyFont,
    heroTitle: settings?.heroTitle,
    heroDescription: settings?.heroDescription,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white animate-pulse">
        <div className="h-[90vh] bg-gray-100" />
        <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <StorefrontWireframe
      settings={storeSettings}
      products={wireframeProducts}
      showNavbar={false}  // layout.tsx already provides header
      showFooter={false}  // layout.tsx already provides footer
      onUpdateSettings={undefined}
    />
  );
}
