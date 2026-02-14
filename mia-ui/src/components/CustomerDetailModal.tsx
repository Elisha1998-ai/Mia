"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  ShoppingBag, 
  Clock,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  ExternalLink,
  User,
  History
} from 'lucide-react';

export interface OrderSummary {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface CustomerDetail {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  lifetime_value: number;
  created_at: string;
  orders_count: number;
  last_order_date?: string | null;
  recent_orders: OrderSummary[];
}

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerDetail | null;
}

export const CustomerDetailModal = ({ isOpen, onClose, customer }: CustomerDetailModalProps) => {
  if (!customer) return null;

  const handleWhatsApp = () => {
    if (customer.phone) {
      const phone = customer.phone.replace(/\D/g, '');
      const message = encodeURIComponent(`Hello ${customer.full_name || ''}, I'm contacting you from Mia.`);
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    }
  };

  const handleEmail = () => {
    window.location.href = `mailto:${customer.email}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'text-emerald-500 bg-emerald-500/10';
      case 'processing':
      case 'shipped':
        return 'text-blue-500 bg-blue-500/10';
      case 'pending':
        return 'text-amber-500 bg-amber-500/10';
      case 'cancelled':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-foreground/40 bg-foreground/5';
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100] md:block hidden" />
        <Dialog.Content className="fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-[600px] bg-background md:border border-border-custom md:rounded-2xl z-[101] overflow-hidden flex flex-col h-full md:h-[85vh] inset-0 md:inset-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-custom bg-background sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="md:hidden p-2 -ml-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent hidden md:flex">
                <User className="w-6 h-6" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold text-foreground">
                  {customer.full_name || 'Unnamed Customer'}
                </Dialog.Title>
                <div className="flex items-center gap-2 text-xs text-foreground/40 font-medium">
                  <span>ID: #{customer.id.substring(0, 8)}</span>
                  <span>•</span>
                  <span>Joined {new Date(customer.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="hidden md:block p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleWhatsApp}
                disabled={!customer.phone}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
              <button 
                onClick={handleEmail}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl text-sm font-bold transition-all"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-foreground/[0.02] border border-border-custom rounded-2xl p-4">
                <div className="flex items-center gap-2 text-foreground/40 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Lifetime Value</span>
                </div>
                <div className="text-xl font-black text-foreground">
                  ₦{customer.lifetime_value.toLocaleString()}
                </div>
              </div>
              <div className="bg-foreground/[0.02] border border-border-custom rounded-2xl p-4">
                <div className="flex items-center gap-2 text-foreground/40 mb-1">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                </div>
                <div className="text-xl font-black text-foreground">
                  {customer.orders_count}
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <section>
              <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-4 px-1">Contact Information</h3>
              <div className="bg-foreground/[0.02] border border-border-custom rounded-2xl overflow-hidden divide-y divide-border-custom">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-foreground/30" />
                    <span className="text-sm font-medium text-foreground">{customer.email}</span>
                  </div>
                  <button onClick={handleEmail} className="p-1.5 hover:bg-foreground/5 rounded-lg text-foreground/30 hover:text-foreground transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                {customer.phone && (
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-foreground/30" />
                      <span className="text-sm font-medium text-foreground">{customer.phone}</span>
                    </div>
                    <button onClick={handleWhatsApp} className="p-1.5 hover:bg-foreground/5 rounded-lg text-foreground/30 hover:text-foreground transition-all">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="p-4 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-foreground/30" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Last Order</span>
                    <span className="text-sm font-medium text-foreground">
                      {customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'No orders yet'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Orders */}
            <section className="pb-4">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider">Recent Orders</h3>
                <History className="w-4 h-4 text-foreground/20" />
              </div>
              
              {customer.recent_orders.length > 0 ? (
                <div className="space-y-3">
                  {customer.recent_orders.map((order) => (
                    <div 
                      key={order.id}
                      className="group flex items-center justify-between p-4 bg-foreground/[0.02] hover:bg-foreground/[0.04] border border-border-custom rounded-2xl transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/40 group-hover:text-foreground transition-colors">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-foreground">{order.order_number}</div>
                          <div className="text-[12px] text-foreground/40 font-medium">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-black text-foreground">₦{order.total_amount.toLocaleString()}</div>
                          <div className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1 ${getStatusColor(order.status)}`}>
                            {order.status}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-foreground/[0.02] border border-dashed border-border-custom rounded-2xl">
                  <ShoppingBag className="w-8 h-8 text-foreground/10 mx-auto mb-2" />
                  <p className="text-sm text-foreground/40 font-medium">No orders found for this customer</p>
                </div>
              )}
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};