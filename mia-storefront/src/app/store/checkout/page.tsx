"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/useData';
import CheckoutWireframe from '@/app/library/components/CheckoutWireframe';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  image?: string;
  variant?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { settings, fetchSettings } = useSettings();

  React.useEffect(() => {
    fetchSettings();
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    if (saved.length === 0) {
      router.push('/store');
      return;
    }
    setCart(saved);
    setLoading(false);
  }, [router]);

  const storeSettings = {
    storeName: settings?.storeName,
    storePhone: settings?.storePhone,
    primaryColor: settings?.primaryColor,
    headingFont: settings?.headingFont,
    bodyFont: settings?.bodyFont,
    currency: '₦',
    paystackEnabled: settings?.paystackEnabled,
    flutterwaveEnabled: settings?.flutterwaveEnabled,
    shippingEnabled: true,
  };

  const wireframeCart = cart.map((item) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    quantity: item.quantity,
    image: item.image_url || item.image,
    variant: item.variant,
  }));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 bg-gray-50 h-[600px] animate-pulse" />
    );
  }

  return (
    <CheckoutWireframe
      cart={wireframeCart}
      storeSettings={storeSettings}
    />
  );
}
