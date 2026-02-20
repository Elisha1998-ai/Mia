"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
  X, 
  Printer, 
  Download,
  Mail,
  Package,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Truck,
  ChevronLeft
} from 'lucide-react';
import { Order } from '@/lib/api';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const InvoiceModal = ({ isOpen, onClose, order }: InvoiceModalProps) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[120] md:block hidden" />
        <Dialog.Content className="fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-3xl bg-background md:border border-border-custom md:rounded-3xl z-[130] overflow-hidden flex flex-col h-full md:h-[95vh] inset-0 md:inset-auto">
          
          {/* Header Actions */}
          <div className="px-6 py-4 border-b border-border-custom flex items-center justify-between bg-foreground/[0.02] no-print sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="md:hidden p-2 -ml-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-accent/10"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print Invoice</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-custom text-foreground/60 text-sm font-medium hover:bg-foreground/5 transition-all">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download PDF</span>
              </button>
            </div>
            <Dialog.Close asChild>
              <button className="hidden md:block p-2 hover:bg-foreground/5 rounded-xl text-foreground/40 hover:text-foreground transition-all">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Invoice Content */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white text-black scrollbar-hide" id="invoice-content">
            {/* Invoice Header */}
            <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white">
                    <Package className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black tracking-tight">MIA</span>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>123 Business Avenue</p>
                  <p>Lagos, Nigeria</p>
                  <p>contact@mia.ai</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Invoice</h1>
                <div className="text-sm text-gray-500 space-y-1">
                  <p className="font-bold text-gray-900">#{order.order_number}</p>
                  <p>{order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  }) : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Bill To / Ship To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Bill To</h2>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 text-lg">{order.customer?.full_name || 'Guest Customer'}</p>
                  <p className="text-gray-500">{order.customer?.email || 'No email provided'}</p>
                  <p className="text-gray-500">{order.customer?.phone || ''}</p>
                </div>
              </div>
              <div>
                <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Ship To</h2>
                <div className="space-y-1">
                  <p className="text-gray-500 leading-relaxed">
                    {order.shipping_address || 'No shipping address provided'}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Truck className="w-3.5 h-3.5" />
                      {order.shipping_method || 'Standard Shipping'}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <CreditCard className="w-3.5 h-3.5" />
                      {order.payment_method || 'Manual Payment'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-12 border border-gray-100 rounded-2xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider">Item Description</th>
                    <th className="px-6 py-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider text-center">Qty</th>
                    <th className="px-6 py-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider text-right">Price</th>
                    <th className="px-6 py-4 font-bold text-gray-400 text-[10px] uppercase tracking-wider text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.items?.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{item.product_name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">ID: {item.product_id.slice(0, 8)}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-medium text-gray-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-600">₦{item.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">₦{order.total_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-gray-900">₦0.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium text-gray-900">₦0.00</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-accent">₦{order.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-20 pt-12 border-t border-gray-100 text-center">
              <p className="text-sm font-medium text-gray-900 mb-1">Thank you for your business!</p>
              <p className="text-xs text-gray-400">Please contact us if you have any questions regarding this invoice.</p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
        }
      `}</style>
    </Dialog.Root>
  );
};
