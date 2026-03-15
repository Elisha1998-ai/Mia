import React from 'react';
import { CheckCircle2, ArrowRight, Package, MapPin, Printer } from 'lucide-react';

interface Address {
  name: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

interface OrderData {
  id: string;
  date: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: Address;
}

interface StoreSettings {
  currency?: string;
  primaryColor?: string;
  headingFont?: string;
  bodyFont?: string;
}

export interface ConfirmationWireframeProps {
  order?: Partial<OrderData>;
  storeSettings?: StoreSettings;
}

const DEFAULT_ORDER = {
  id: 'ORD-1234-5678',
  date: new Date().toLocaleDateString(),
  email: 'customer@example.com',
  items: [
    {
      id: '1',
      name: 'Classic Heavyweight Cotton T-Shirt',
      price: 60.00,
      quantity: 1,
      variant: 'Black / L'
    },
    {
      id: '2',
      name: 'Minimalist Canvas Backpack',
      price: 120.00,
      quantity: 1,
      variant: 'Grey'
    }
  ],
  subtotal: 180.00,
  shipping: 0,
  total: 180.00,
  shippingAddress: {
    name: 'Jane Doe',
    line1: '123 Fashion Ave',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'US'
  }
};

export default function ConfirmationWireframe({ order, storeSettings }: ConfirmationWireframeProps) {
  const displayOrder = order ? {
    ...order,
    shippingAddress: order.shippingAddress || DEFAULT_ORDER.shippingAddress
  } : DEFAULT_ORDER;
  const currency = storeSettings?.currency || 'USD';
  const currencySymbol = currency.includes('Naira') ? '₦' : '$';
  const primaryColor = storeSettings?.primaryColor || '#000000';
  const headingFont = storeSettings?.headingFont || 'inherit';
  const bodyFont = storeSettings?.bodyFont || 'inherit';

  return (
    <div className="bg-white min-h-full no-scrollbar" style={{ fontFamily: bodyFont }}>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-10 w-10" style={{ color: primaryColor }} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl" style={{ fontFamily: headingFont }}>
            Thank you for your order!
          </h1>
          <p className="mt-4 text-base text-gray-500">
            We&apos;ve received your order <span className="font-medium text-gray-900">#{displayOrder.id}</span> and sent a confirmation email to <span className="font-medium text-gray-900">{displayOrder.email}</span>.
          </p>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-10">
          <h2 className="sr-only">Order Summary</h2>

          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden">
            {/* Order Items */}
            <ul className="divide-y divide-gray-100 p-6 sm:p-8">
              {(displayOrder.items || []).map((item: any) => (
                <li key={item.id} className="flex py-4 first:pt-0 last:pb-0">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    {item.variant && (
                      <p className="text-sm text-gray-500 mt-1">{item.variant}</p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <p className="font-medium text-gray-900">{currencySymbol}{item.price.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">Qty {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div className="border-t border-gray-100 bg-gray-50 p-6 sm:p-8">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">{currencySymbol}{(displayOrder.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-gray-900">
                    {displayOrder.shipping === 0 ? 'Free' : `${currencySymbol}${(displayOrder.shipping || 0).toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-3 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{currencySymbol}{(displayOrder.total || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Grid */}
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <MapPin className="h-4 w-4 text-gray-500" />
                Shipping Address
              </h3>
              <div className="mt-3 text-sm text-gray-500">
                <p className="font-medium text-gray-900">{displayOrder.shippingAddress.name}</p>
                <p>{displayOrder.shippingAddress.line1}</p>
                <p>{displayOrder.shippingAddress.city}, {displayOrder.shippingAddress.state} {displayOrder.shippingAddress.postalCode}</p>
                <p>{displayOrder.shippingAddress.country}</p>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <Package className="h-4 w-4 text-gray-500" />
                Order Information
              </h3>
              <div className="mt-3 text-sm text-gray-500 space-y-1">
                <p>Order Date: <span className="text-gray-900">{displayOrder.date}</span></p>
                <p>Status: <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Paid</span></p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 text-sm font-medium text-white transition hover:opacity-90" style={{ backgroundColor: primaryColor, fontFamily: headingFont }}>
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
