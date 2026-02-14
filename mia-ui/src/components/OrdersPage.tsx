"use client";

import React from 'react';
import { 
  Search, 
  MoreHorizontal, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Check,
  ChevronDown,
  Trash2,
  Edit2,
  Share2,
  ShoppingCart,
  Eye,
  FileText,
  Minus,
  Download,
  Filter,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Package as PackageIcon,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

import * as Popover from '@radix-ui/react-popover';
import { AddOrderModal } from './AddOrderModal';
import { OrderDetailModal } from './OrderDetailModal';
import { InvoiceModal } from './InvoiceModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { useOrders, useCustomers, useProducts } from '@/hooks/useData';
import { Order as ApiOrder } from '@/lib/api';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerId?: string;
  date: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  itemsCount: number;
  paymentMethod: string;
  shippingMethod: string;
  productName: string;
  address?: string;
}

const ActionPopover = ({ order, onDelete, onViewDetails, onViewInvoice }: { 
  order: Order, 
  onDelete: (id: string) => void, 
  onViewDetails: (id: string) => void,
  onViewInvoice: (id: string) => void 
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-all">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 min-w-[140px] animate-in fade-in zoom-in-95 duration-100"
          sideOffset={5}
          align="end"
        >
          <button 
            onClick={() => onViewDetails(order.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button 
            onClick={() => onViewInvoice(order.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors"
          >
            <FileText className="w-4 h-4" />
            Invoice
          </button>
          <div className="h-px bg-border-custom my-1" />
          <button 
            onClick={() => onDelete(order.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Order
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const StatusBadge = ({ status }: { status: Order['status'] }) => {
  const styles = {
    Delivered: 'text-emerald-500 bg-emerald-500/10',
    Shipped: 'text-blue-500 bg-blue-500/10',
    Processing: 'text-orange-500 bg-orange-500/10',
    Cancelled: 'text-foreground/40 bg-foreground/5',
    Refunded: 'text-red-500 bg-red-500/10',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${styles[status].split(' ')[0].replace('text-', 'bg-')}`} />
      <span className="text-[13px] font-medium">{status}</span>
    </div>
  );
};

const MobileOrderCard = ({ 
  order, 
  isExpanded, 
  onToggle, 
  onDelete, 
  onViewDetails,
  onViewInvoice 
}: { 
  order: Order, 
  isExpanded: boolean, 
  onToggle: () => void,
  onDelete: (id: string) => void,
  onViewDetails: (id: string) => void,
  onViewInvoice: (id: string) => void
}) => {
  return (
    <div className="border-b border-border-custom last:border-none">
      <div 
        className="flex items-center justify-between px-4 py-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded border border-border-custom flex items-center justify-center text-foreground/40">
            {isExpanded ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </div>
          <span className="font-bold text-[14px] text-foreground">#{order.orderNumber}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {isExpanded && (
        <div className="px-4 pb-6 pt-2 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-foreground/40">Customer</span>
              <span className="font-medium text-foreground">{order.customerName}</span>
            </div>
            <div className="flex justify-between items-start text-right">
              <span className="text-foreground/40">Shipping Address</span>
              <span className="font-medium text-foreground max-w-[200px]">{order.address}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/40">Items</span>
              <span className="font-medium text-foreground">{order.itemsCount} {order.itemsCount === 1 ? 'Item' : 'Items'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/40">Total Amount</span>
              <span className="font-bold text-foreground">₦{order.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/40">Order Date</span>
              <span className="font-medium text-foreground">{order.date}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/40">Shipping Method</span>
              <span className="font-medium text-foreground">{order.shippingMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-foreground/40">Payment Method</span>
              <span className="font-medium text-foreground">{order.paymentMethod}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button 
              onClick={() => onViewDetails(order.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border-custom text-[13px] font-medium text-foreground/60 hover:bg-foreground/5 transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
            <button 
              onClick={() => onViewInvoice(order.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border-custom text-[13px] font-medium text-foreground/60 hover:bg-foreground/5 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Invoice
            </button>
            <button className="p-2.5 rounded-xl border border-border-custom text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(order.id)}
              className="p-2.5 rounded-xl border border-border-custom text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const OrdersPage = () => {
  const { orders: apiOrders, loading, fetchOrders, getOrder, createOrder, updateOrder, deleteOrder } = useOrders();
  const { customers, fetchCustomers, loading: customersLoading } = useCustomers();
  const { products, fetchProducts, loading: productsLoading } = useProducts();

  const [orders, setOrders] = React.useState<Order[]>([]);
  
  React.useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  React.useEffect(() => {
    if (apiOrders) {
      const mappedOrders: Order[] = apiOrders.map((o: any) => ({
        id: o.id,
        orderNumber: o.order_number || o.external_id || `ORD-${o.id.slice(0, 4)}`,
        customerName: o.customer?.full_name || o.customer?.email || 'Unknown Customer',
        customerId: o.customer_id,
        date: o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : 'Today',
        total: o.total_amount,
        status: (o.status.charAt(0).toUpperCase() + o.status.slice(1)) as Order['status'],
        itemsCount: o.items_count || 0,
        paymentMethod: o.payment_method || 'Bank Transfer',
        shippingMethod: o.shipping_method || 'Standard Shipping',
        productName: o.product_name || 'No Product',
        address: o.shipping_address || o.address || 'No Address'
      }));
      setOrders(mappedOrders);
    }
  }, [apiOrders]);

  
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('All Status');
  const [sortBy, setSortBy] = React.useState<string>('Newest');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [expandedOrderId, setExpandedOrderId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'All Orders' | 'Upcoming' | 'Past Orders'>('All Orders');
  
  const [detailModal, setDetailModal] = React.useState<{ isOpen: boolean; order: ApiOrder | null }>({
    isOpen: false,
    order: null
  });

  const [invoiceModal, setInvoiceModal] = React.useState<{ isOpen: boolean; order: ApiOrder | null }>({
    isOpen: false,
    order: null
  });

  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string | null; isBulk: boolean }>({
    isOpen: false,
    id: null,
    isBulk: false
  });

  const handleViewDetails = async (id: string) => {
    try {
      const orderData = await getOrder(id);
      setDetailModal({ isOpen: true, order: orderData });
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const handleViewInvoice = async (id: string) => {
    try {
      const orderData = await getOrder(id);
      setInvoiceModal({ isOpen: true, order: orderData });
    } catch (error) {
      console.error('Failed to fetch invoice details:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateOrder(id, { status: status.toLowerCase() });
      // Refresh details if the modal is open for this order
      if (detailModal.isOpen && detailModal.order?.id === id) {
        const updatedOrder = await getOrder(id);
        setDetailModal({ isOpen: true, order: updatedOrder });
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const filteredOrders = React.useMemo(() => {
    return orders
      .filter(o => {
        const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || o.status === statusFilter;
        
        let matchesTab = true;
        if (activeTab === 'Upcoming') matchesTab = o.status === 'Processing' || o.status === 'Shipped';
        if (activeTab === 'Past Orders') matchesTab = o.status === 'Delivered' || o.status === 'Cancelled' || o.status === 'Refunded';
        
        return matchesSearch && matchesStatus && matchesTab;
      })
      .sort((a, b) => {
        if (sortBy === 'Newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'Total: Low to High') return a.total - b.total;
        if (sortBy === 'Total: High to Low') return b.total - a.total;
        return 0;
      });
  }, [orders, searchQuery, statusFilter, sortBy, activeTab]);

  const toggleAll = () => {
    if (selectedIds.length === filteredOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map(o => o.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteModal({ isOpen: true, id, isBulk: false });
  };

  const handleBulkDelete = () => {
    setDeleteModal({ isOpen: true, id: null, isBulk: true });
  };

  const handleBulkStatusUpdate = async (newStatus: Order['status']) => {
    try {
      await Promise.all(selectedIds.map(id => updateOrder(id, { status: newStatus.toLowerCase() })));
      setOrders(orders.map(o => selectedIds.includes(o.id) ? { ...o, status: newStatus } : o));
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to update orders status:', error);
    }
  };

  const confirmDelete = async () => {
    if (deleteModal.isBulk) {
      try {
        await Promise.all(selectedIds.map(id => deleteOrder(id)));
        setOrders(orders.filter(o => !selectedIds.includes(o.id)));
        setSelectedIds([]);
      } catch (error) {
        console.error('Failed to delete orders:', error);
      }
    } else if (deleteModal.id) {
      try {
        await deleteOrder(deleteModal.id);
        setOrders(orders.filter(o => o.id !== deleteModal.id));
        setSelectedIds(selectedIds.filter(i => i !== deleteModal.id));
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
    setDeleteModal({ isOpen: false, id: null, isBulk: false });
  };

  const handleAddOrder = async (orderData: any) => {
    try {
      const payload = {
        order_number: orderData.orderNumber,
        customer_id: orderData.customerId || null,
        customer_name: orderData.customerName,
        total_amount: orderData.total,
        status: orderData.status.toLowerCase(),
        shipping_address: orderData.address,
        shipping_method: orderData.shippingMethod,
        payment_method: orderData.paymentMethod,
        items: orderData.items.map((item: any) => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };
      
      await createOrder(payload);
      // Re-fetch orders and customers to ensure UI is in sync
      fetchOrders();
      fetchCustomers();
    } catch (error) {
      console.error('Failed to add order:', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background h-full overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border-custom">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input 
              type="text" 
              placeholder="Search orders by number or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-foreground/5 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 ring-foreground/10 text-foreground transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors whitespace-nowrap">
                  {statusFilter}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 w-[160px]" align="start" sideOffset={8}>
                  {['All Status', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'].map((status) => (
                    <button 
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors"
                    >
                      {status}
                    </button>
                  ))}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors whitespace-nowrap">
                  Sort: {sortBy}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 w-[180px]" align="start" sideOffset={8}>
                  {['Newest', 'Total: Low to High', 'Total: High to Low'].map((sort) => (
                    <button 
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors"
                    >
                      {sort}
                    </button>
                  ))}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors">
                    <Check className="w-4 h-4" />
                    Update Status ({selectedIds.length})
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 w-[160px]" align="start" sideOffset={8}>
                    {['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'].map((status) => (
                      <button 
                        key={status}
                        onClick={() => handleBulkStatusUpdate(status as Order['status'])}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors"
                      >
                        {status}
                      </button>
                    ))}
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>

              <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-accent/10"
          >
            <Plus className="w-4 h-4" />
            Create Order
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex flex-col gap-4 px-4 py-6 border-b border-border-custom">
        <div className="flex items-center gap-1.5 p-1 bg-foreground/[0.03] rounded-xl mt-8">
          {(['All Orders', 'Upcoming', 'Past Orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[13px] font-medium rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-foreground/40 hover:text-foreground/60'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input 
              type="text" 
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-foreground/[0.03] border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 ring-foreground/10 text-foreground"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-foreground/[0.03] text-foreground/40 hover:text-foreground">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-2.5 rounded-xl bg-foreground/[0.03] text-foreground/40 hover:text-foreground">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AddOrderModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddOrder}
        customers={customers.map(c => ({ id: c.id, name: c.full_name || c.email }))}
        products={products.map(p => ({ id: p.id, name: p.name, price: p.price }))}
      />

      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title={deleteModal.isBulk ? 'Delete Multiple Orders' : 'Delete Order'}
        description={deleteModal.isBulk 
          ? `Are you sure you want to delete ${selectedIds.length} orders? This action cannot be undone.`
          : 'Are you sure you want to delete this order? This action cannot be undone.'
        }
      />

      <OrderDetailModal 
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, order: null })}
        order={detailModal.order}
        onUpdateStatus={handleUpdateStatus}
        onViewInvoice={(order) => setInvoiceModal({ isOpen: true, order })}
      />

      <InvoiceModal 
        isOpen={invoiceModal.isOpen}
        onClose={() => setInvoiceModal({ isOpen: false, order: null })}
        order={invoiceModal.order}
      />

      {/* Table Area (Desktop) */}
      <div className="hidden md:block flex-1 overflow-auto scrollbar-hide">
        <table className="w-full border-collapse text-left min-w-[1000px]">
          <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border-custom">
            <tr>
              <th className="pl-6 py-4 w-12">
                <button 
                  onClick={toggleAll}
                  className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                    selectedIds.length === filteredOrders.length && filteredOrders.length > 0
                      ? 'bg-accent border-accent text-white' 
                      : 'border-border-custom hover:border-foreground/30'
                  }`}
                >
                  {selectedIds.length === filteredOrders.length && filteredOrders.length > 0 && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              </th>
              <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Order</th>
              <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Product</th>
              <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Items</th>
              <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Total</th>
              <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Date</th>
              <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Status</th>
              <th className="pr-6 py-4 w-16 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-custom">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-foreground/40">
                  <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium">Loading orders...</p>
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-foreground/40">
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-foreground/30">
                    <PackageIcon className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">No orders found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
              <tr 
                key={order.id}
                className={`group transition-colors hover:bg-foreground/[0.02] ${
                  selectedIds.includes(order.id) ? 'bg-foreground/[0.03]' : ''
                }`}
              >
                <td className="pl-6 py-4">
                  <button 
                    onClick={() => toggleOne(order.id)}
                    className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                      selectedIds.includes(order.id) 
                        ? 'bg-accent border-accent text-white' 
                        : 'border-border-custom group-hover:border-foreground/30'
                    }`}
                  >
                    {selectedIds.includes(order.id) && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[14px] font-bold text-foreground">#{order.orderNumber}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[14px] font-medium text-foreground">{order.customerName}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[14px] text-foreground/60">{order.productName}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[14px] text-foreground/60">{order.itemsCount} {order.itemsCount === 1 ? 'Item' : 'Items'}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[14px] font-bold text-foreground">₦{order.total.toLocaleString()}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[14px] text-foreground/60">{order.date}</span>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="pr-6 py-4 text-right">
                  <ActionPopover 
                    order={order} 
                    onDelete={handleDelete} 
                    onViewDetails={handleViewDetails} 
                    onViewInvoice={handleViewInvoice}
                  />
                </td>
              </tr>
            )))}
          </tbody>
          </table>
        </div>

      {/* Mobile List View */}
      <div className="md:hidden flex-1 overflow-auto scrollbar-hide">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border-custom bg-foreground/[0.02]">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">
            Order ID <ChevronDown className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">
            Status <ChevronDown className="w-3 h-3" />
          </div>
        </div>
        <div className="flex flex-col">
          {filteredOrders.map((order) => (
            <MobileOrderCard 
              key={order.id} 
              order={order} 
              isExpanded={expandedOrderId === order.id}
              onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onViewInvoice={handleViewInvoice}
            />
          ))}
          {filteredOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-foreground/30">
              <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Footer (Desktop) */}
      <div className="hidden md:flex px-6 py-4 border-t border-border-custom items-center justify-between bg-background">
        <div className="text-sm text-foreground/40">
          Showing <span className="font-medium text-foreground/60">{filteredOrders.length}</span> of {orders.length} orders
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 disabled:opacity-30 disabled:hover:bg-transparent transition-colors" disabled>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Pagination Footer (Mobile) */}
      <div className="md:hidden px-4 py-6 border-t border-border-custom flex items-center justify-center bg-background">
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-foreground/40 disabled:opacity-30">
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-foreground/40 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1 mx-2">
            {[1, 2, 3].map((page) => (
              <button 
                key={page}
                className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-all ${
                  page === 1 
                    ? 'bg-foreground/[0.05] text-foreground border border-border-custom' 
                    : 'text-foreground/40 hover:text-foreground/60'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-foreground/30">...</span>
            <button className="w-8 h-8 rounded-lg text-[13px] font-medium text-foreground/40">16</button>
          </div>

          <button className="p-2 rounded-lg text-foreground/40 hover:text-foreground">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-foreground/40 hover:text-foreground">
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="md:hidden fixed bottom-6 right-6">
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/20 hover:scale-105 transition-all active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
