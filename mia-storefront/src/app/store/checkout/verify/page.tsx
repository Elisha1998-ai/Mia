"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function VerifyPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference found.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reference }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setOrderDetails(data.order);
          // Clear cart
          localStorage.removeItem('cart');
          window.dispatchEvent(new Event('cart-updated'));
        } else {
          setStatus('error');
          setMessage(data.error || 'Payment verification failed.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred while verifying payment.');
      }
    };

    verifyPayment();
  }, [reference]);

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-black animate-spin mb-4" />
        <h2 className="text-xl font-medium">{message}</h2>
        <p className="text-gray-500 mt-2">Please wait while we confirm your transaction.</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 sm:py-32 text-center animate-in fade-in zoom-in-95 duration-700">
        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-100">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-medium mb-6 tracking-tight">Payment Successful</h1>
        <p className="text-gray-500 mb-12 text-lg leading-relaxed max-w-lg mx-auto">
          Thank you for your purchase. Your payment has been confirmed and your order is being processed.
        </p>
        <div className="bg-gray-50 p-8 rounded-sm border border-gray-100 mb-12 text-left max-w-md mx-auto">
          <div className="flex justify-between text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-4">
            <span>Order Number</span>
            <span className="text-black">{orderDetails?.orderNumber || orderDetails?.order_number || reference}</span>
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-widest leading-loose">
            A confirmation email has been sent to your inbox.
          </p>
        </div>
        <Link 
          href="/store" 
          className="inline-flex items-center gap-3 bg-black text-white px-12 py-5 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-gray-900 transition-all rounded-sm shadow-2xl"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 sm:py-32 text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-red-100">
        <XCircle className="w-12 h-12 text-red-500" />
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl font-medium mb-6 tracking-tight">Payment Failed</h1>
      <p className="text-gray-500 mb-12 text-lg leading-relaxed max-w-lg mx-auto">
        {message}
      </p>
      <div className="flex justify-center gap-4">
        <Link 
          href="/store/checkout" 
          className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-gray-900 transition-all rounded-sm shadow-xl"
        >
          Try Again
        </Link>
        <Link 
          href="/store" 
          className="inline-flex items-center gap-3 bg-white text-black border border-gray-200 px-8 py-4 text-[11px] uppercase tracking-[0.3em] font-bold hover:bg-gray-50 transition-all rounded-sm"
        >
          Return to Store
        </Link>
      </div>
    </div>
  );
}
