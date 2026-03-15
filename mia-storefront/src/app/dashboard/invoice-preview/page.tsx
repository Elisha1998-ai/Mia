"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Import InvoiceTemplate — using standard PDF Document components
import { InvoiceTemplate } from '@/components/documents/InvoiceTemplate';

// Dynamic import for PDFViewer to handle SSR issues
const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
    {
        ssr: false,
        loading: () => <div className="flex items-center justify-center p-12 text-sm text-foreground/40">Loading PDF Viewer...</div>
    }
);

export default function InvoicePreviewPage() {
    const dummyData = {
        order: {
            orderNumber: "ORD-SAMPLE",
            createdAt: new Date().toISOString(),
            status: "paid",
            totalAmount: 45750,
            shippingAddress: "45 Business Way, VI, Lagos, Nigeria",
        },
        items: [
            {
                product: { name: "Premium Red Ankara Dress" },
                quantity: 1,
                price: 25000
            },
            {
                product: { name: "Handcrafted Gold Earrings" },
                quantity: 2,
                price: 10000
            },
            {
                product: { name: "Luxury Gift Wrap" },
                quantity: 1,
                price: 750
            }
        ],
        storeSettings: {
            storeName: "Pony Luxury",
            storeAddress: "123 Business Avenue, Lagos, Nigeria",
            storePhone: "+234 81 000 0000",
            adminEmail: "hello@pony-auto.ai"
        },
        customer: {
            fullName: "Elisha Benson",
            email: "elisha@example.com",
            phone: "+234 90 123 4567"
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            <div className="p-4 border-b border-border-custom flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-bold">Pony Invoice Designer</h1>
                    <p className="text-xs text-foreground/40">Real-time PDF design preview</p>
                </div>
                <div className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-xl animate-pulse">
                    LIVE PREVIEW
                </div>
            </div>

            <div className="flex-1">
                <PDFViewer className="w-full h-full border-0">
                    <InvoiceTemplate
                        order={dummyData.order}
                        items={dummyData.items}
                        storeSettings={dummyData.storeSettings}
                        customer={dummyData.customer}
                    />
                </PDFViewer>
            </div>
        </div>
    );
}
