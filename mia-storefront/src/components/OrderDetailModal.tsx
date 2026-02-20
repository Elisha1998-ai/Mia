"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Truck, 
  MessageSquare, 
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  Phone,
  ShoppingCart,
  ChevronLeft
} from 'lucide-react';
import { Order } from '@/lib/api';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onViewInvoice: (order: Order) => void;
}

export const OrderDetailModal = ({ isOpen, onClose, order, onUpdateStatus, onViewInvoice }: OrderDetailModalProps) => {
  if (!order) return null;

  const statusColors = {
    Processing: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    Shipped: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    Delivered: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    Cancelled: 'text-foreground/40 bg-foreground/5 border-foreground/10',
    Refunded: 'text-red-500 bg-red-500/10 border-red-500/20',
  };

  const nextStatus = {
    Processing: 'Shipped',
    Shipped: 'Delivered',
  };

  const handleWhatsApp = () => {
    if (order.customer?.phone) {
      const phone = order.customer.phone.replace(/\D/g, '');
      const message = encodeURIComponent(`Hello ${order.customer.full_name || ''}, I'm contacting you regarding your order #${order.order_number}.`);
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100] md:block hidden" />
        <Dialog.Content className="fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-2xl bg-background md:border border-border-custom md:rounded-3xl z-[101] overflow-hidden flex flex-col h-full md:h-[90vh] inset-0 md:inset-auto">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-border-custom flex items-center justify-between bg-foreground/[0.02] sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="md:hidden p-2 -ml-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent hidden md:flex">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold text-foreground">
                  Order #{order.order_number}
                </Dialog.Title>
                <div className="flex items-center gap-2 text-xs text-foreground/40 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
                </div>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="hidden md:block p-2 hover:bg-foreground/5 rounded-xl text-foreground/40 hover:text-foreground transition-all">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {/* Status & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border-custom bg-foreground/[0.01]">
              <div className="flex items-center gap-3">
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status as keyof typeof statusColors] || statusColors.Processing}`}>
                  {order.status}
                </div>
                {nextStatus[order.status as keyof typeof nextStatus] && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, nextStatus[order.status as keyof typeof nextStatus])}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-white text-xs font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20"
                  >
                    Mark as {nextStatus[order.status as keyof typeof nextStatus]}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {order.customer?.phone && (
                  <button 
                    onClick={handleWhatsApp}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 text-xs font-bold hover:bg-emerald-500/20 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                )}
                {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                  <button 
                    onClick={() => onUpdateStatus(order.id, 'Cancelled')}
                    className="px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-foreground/30" />
                  Customer Information
                </h3>
                <div className="p-4 rounded-2xl border border-border-custom space-y-3">
                  <div>
                    <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider mb-1">Name</div>
                    <div className="text-sm font-medium text-foreground">{order.customer?.full_name || 'Guest Customer'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider mb-1">Email</div>
                    <div className="text-sm font-medium text-foreground">{order.customer?.email || 'N/A'}</div>
                  </div>
                  {order.customer?.phone && (
                    <div>
                      <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider mb-1">Phone</div>
                      <div className="text-sm font-medium text-foreground flex items-center gap-2">
                        {order.customer.phone}
                        <Phone className="w-3 h-3 text-foreground/30" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping & Payment */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-foreground/30" />
                  Shipping & Payment
                </h3>
                <div className="p-4 rounded-2xl border border-border-custom space-y-3">
                  <div>
                    <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider mb-1">Address</div>
                    <div className="text-sm font-medium text-foreground leading-relaxed">
                      {order.shipping_address || 'No address provided'}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider mb-1">Method</div>
                      <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-foreground/30" />
                        {order.shipping_method || 'Standard'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider mb-1">Payment</div>
                      <div className="text-sm font-medium text-foreground flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-foreground/30" />
                        {order.payment_method || 'Manual'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-foreground/30" />
                Order Items ({order.items?.length || 0})
              </h3>
              <div className="border border-border-custom rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-foreground/[0.02] border-b border-border-custom">
                    <tr>
                      <th className="text-left px-4 py-3 font-bold text-foreground/40 text-[10px] uppercase tracking-wider">Product</th>
                      <th className="text-center px-4 py-3 font-bold text-foreground/40 text-[10px] uppercase tracking-wider">Qty</th>
                      <th className="text-right px-4 py-3 font-bold text-foreground/40 text-[10px] uppercase tracking-wider">Price</th>
                      <th className="text-right px-4 py-3 font-bold text-foreground/40 text-[10px] uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-custom">
                    {order.items?.map((item) => (
                      <tr key={item.id} className="hover:bg-foreground/[0.01] transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{item.product_name}</div>
                          <div className="text-[10px] text-foreground/40 mt-0.5">ID: {item.product_id.slice(0, 8)}</div>
                        </td>
                        <td className="px-4 py-3 text-center text-foreground/60 font-medium">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-foreground/60 font-medium">₦{item.price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold text-foreground">₦{(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border-custom bg-foreground/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onViewInvoice(order)}
                className="flex items-center gap-2 text-xs font-bold text-foreground/40 hover:text-foreground transition-colors px-3 py-2 rounded-xl hover:bg-foreground/5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Invoice
              </button>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider mb-0.5">Total Amount</div>
              <div className="text-xl font-black text-foreground">₦{order.total_amount.toLocaleString()}</div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}; 
