"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/useData';
import CartWireframe from '@/app/library/components/CartWireframe';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  image?: string;
  variant?: string;
}

export default function CartPage() {
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { settings, fetchSettings } = useSettings();
  const router = useRouter();

  React.useEffect(() => {
    fetchSettings();
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(saved);
    setLoading(false);
  }, []);

  // Keep localStorage in sync when cart changes inside the wireframe
  // The CartWireframe handles its own quantity/remove state internally;
  // we just supply the initial data. For a full sync we'd lift state,
  // but the wireframe is intentionally self-contained for the storefront.

  const storeSettings = {
    storeName: settings?.storeName,
    primaryColor: settings?.primaryColor,
    headingFont: settings?.headingFont,
    bodyFont: settings?.bodyFont,
    currency: '₦',
  };

  // Reshape localStorage cart items to what the wireframe expects
  const wireframeCart = cart.map((item) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    quantity: item.quantity,
    image: item.image_url || item.image || null,
    variant: item.variant,
  }));

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg" />
            ))}
          </div>
          <div className="h-64 bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <CartWireframe
      cart={wireframeCart}
      storeSettings={storeSettings}
    />
  );
}
