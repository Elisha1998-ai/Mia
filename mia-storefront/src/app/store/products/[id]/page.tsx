"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/useData';
import ProductDetailsWireframe from '@/app/library/components/ProductDetailsWireframe';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  sku?: string;
  category?: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { settings, fetchSettings } = useSettings();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchSettings();
  }, []);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setProduct(data);
      } catch (e) {
        console.error('Product fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const storeSettings = {
    storeName: settings?.storeName,
    primaryColor: settings?.primaryColor,
    headingFont: settings?.headingFont,
    bodyFont: settings?.bodyFont,
    currency: '₦',
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-square bg-gray-100 rounded-xl" />
          <div className="space-y-8">
            <div className="h-10 bg-gray-100 w-3/4 rounded" />
            <div className="h-6 bg-gray-100 w-1/4 rounded" />
            <div className="h-32 bg-gray-100 w-full rounded" />
            <div className="h-14 bg-gray-100 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button
          onClick={() => router.push('/store')}
          className="text-sm underline text-gray-600 hover:text-black"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Convert to wireframe's expected shape
  const wireframeProduct = {
    name: product.name,
    price: Number(product.price),
    description: product.description,
    images: product.image_url ? [product.image_url] : [],
    category: product.category,
    breadcrumbs: ['Home', 'Shop', product.name],
    rating: undefined, // real ratings not yet implemented
  };

  return (
    <ProductDetailsWireframe
      product={wireframeProduct}
      storeSettings={storeSettings}
    />
  );
}
