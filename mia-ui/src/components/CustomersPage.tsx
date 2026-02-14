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
  Users,
  Mail,
  Phone,
  History
} from 'lucide-react';

import { useCustomers } from '@/hooks/useData';
import * as Popover from '@radix-ui/react-popover';
import { AddCustomerModal } from './AddCustomerModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { CustomerDetailModal, type CustomerDetail } from './CustomerDetailModal';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Active' | 'Inactive' | 'New';
  lastOrder: string;
  avatar?: string;
}

const ActionPopover = ({ customer, onDelete, onViewDetails, onEdit, onHistory }: { 
  customer: Customer, 
  onDelete: (id: string) => void, 
  onViewDetails: (id: string) => void,
  onEdit: (customer: Customer) => void,
  onHistory: (id: string) => void
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
            onClick={() => onViewDetails(customer.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors"
          >
            <Users className="w-4 h-4" />
            View Details
          </button>
          <button 
            onClick={() => onEdit(customer)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Customer
          </button>
          <button 
            onClick={() => onHistory(customer.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors"
          >
            <History className="w-4 h-4" />
            Order History
          </button>
          <div className="h-px bg-border-custom my-1" />
          <button 
            onClick={() => onDelete(customer.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete Customer
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const StatusBadge = ({ status }: { status: Customer['status'] }) => {
  const styles = {
    Active: 'text-emerald-500 bg-emerald-500/10',
    Inactive: 'text-foreground/40 bg-foreground/5',
    New: 'text-accent bg-accent/10',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${styles[status].split(' ')[0].replace('text-', 'bg-')}`} />
      <span className="text-[13px] font-medium">{status}</span>
    </div>
  );
};

const MobileCustomerCard = ({ 
  customer, 
  isExpanded, 
  onToggle, 
  onDelete,
  onViewDetails,
  onEdit,
  onHistory
}: { 
  customer: Customer; 
  isExpanded: boolean; 
  onToggle: () => void; 
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  onEdit: (customer: Customer) => void;
  onHistory: (id: string) => void;
}) => {
  return (
    <div className={`border-b border-border-custom transition-colors ${isExpanded ? 'bg-foreground/[0.02]' : ''}`}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-foreground/5 overflow-hidden border border-border-custom flex-shrink-0">
            {customer.avatar ? (
              <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-foreground/20">
                <Users className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground">{customer.name}</span>
            <span className="text-[12px] text-foreground/40 font-medium">#{customer.id.padStart(4, '0')}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={customer.status} />
          <ChevronDown className={`w-4 h-4 text-foreground/20 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-3 bg-foreground/[0.03] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-foreground/30" />
              <span className="text-sm text-foreground/60">{customer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-foreground/30" />
              <span className="text-sm text-foreground/60">{customer.phone}</span>
            </div>
            <div className="h-px bg-border-custom my-1" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Total Spent</span>
                <span className="text-sm font-bold text-foreground">₦{customer.totalSpent.toLocaleString()}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Orders</span>
                <span className="text-sm font-bold text-foreground/60">{customer.totalOrders}</span>
              </div>
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Last Order</span>
                <span className="text-sm font-bold text-foreground/60">{customer.lastOrder}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onViewDetails(customer.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm font-bold transition-colors"
            >
              <Users className="w-4 h-4" />
              Details
            </button>
            <button 
              onClick={() => onEdit(customer)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm font-bold transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button 
              onClick={() => onHistory(customer.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm font-bold transition-colors"
            >
              <History className="w-4 h-4" />
              History
            </button>
            <button 
              onClick={() => onDelete(customer.id)}
              className="p-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const CustomersPage = () => {
  const { customers: apiCustomers, loading, fetchCustomers, createCustomer, deleteCustomer, getCustomer } = useCustomers();
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [detailModal, setDetailModal] = React.useState<{ isOpen: boolean; customer: CustomerDetail | null }>({
    isOpen: false,
    customer: null
  });

  const handleViewDetails = async (id: string) => {
    try {
      const customerData = await getCustomer(id);
      setDetailModal({ isOpen: true, customer: customerData });
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  React.useEffect(() => {
    if (apiCustomers) {
      setCustomers(apiCustomers.map(c => ({
        id: c.id,
        name: c.full_name || 'Unknown',
        email: c.email,
        phone: c.phone || '-',
        totalOrders: c.orders_count,
        totalSpent: Number(c.lifetime_value || 0),
        status: (c.orders_count > 0 ? 'Active' : 'New') as Customer['status'],
        lastOrder: c.last_order_date ? new Date(c.last_order_date).toLocaleDateString() : '—',
        avatar: undefined
      })));
    }
  }, [apiCustomers]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('All Status');
  const [sortBy, setSortBy] = React.useState<string>('Name');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null);
  const [expandedCustomerId, setExpandedCustomerId] = React.useState<string | null>(null);
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string | null; isBulk: boolean }>({
    isOpen: false,
    id: null,
    isBulk: false
  });

  const filteredCustomers = React.useMemo(() => {
    return customers
      .filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             c.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'Name') return a.name.localeCompare(b.name);
        if (sortBy === 'Total Spent: High to Low') return b.totalSpent - a.totalSpent;
        if (sortBy === 'Total Orders: High to Low') return b.totalOrders - a.totalOrders;
        return 0;
      });
  }, [customers, searchQuery, statusFilter, sortBy]);

  const toggleAll = () => {
    if (selectedIds.length === filteredCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCustomers.map(c => c.id));
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

  const confirmDelete = async () => {
    try {
      if (deleteModal.isBulk) {
        await Promise.all(selectedIds.map(id => deleteCustomer(id)));
        setCustomers(prev => prev.filter(c => !selectedIds.includes(c.id)));
        setSelectedIds([]);
      } else if (deleteModal.id) {
        await deleteCustomer(deleteModal.id);
        setCustomers(prev => prev.filter(c => c.id !== deleteModal.id));
        if (selectedIds.includes(deleteModal.id)) {
          setSelectedIds(selectedIds.filter(id => id !== deleteModal.id));
        }
      }
    } catch (e) {
      console.error(e);
    }
    setDeleteModal({ isOpen: false, id: null, isBulk: false });
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsAddModalOpen(true);
  };

  const handleAddOrUpdateCustomer = async (customerData: any) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, {
          full_name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
        });
        fetchCustomers();
      } else {
        await createCustomer({
          full_name: customerData.name,
          email: customerData.email,
          phone: customerData.phone
        });
        fetchCustomers();
      }
    } catch (e) {
      console.error(e);
    }
    setEditingCustomer(null);
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
              placeholder="Search customers by name or email..."
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
                  {['All Status', 'Active', 'Inactive', 'New'].map((status) => (
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
                <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 w-[200px]" align="start" sideOffset={8}>
                  {['Name', 'Total Spent: High to Low', 'Total Orders: High to Low'].map((sort) => (
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
            <button 
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedIds.length})
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-accent/10"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex flex-col bg-background border-b border-border-custom">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">Customers</h1>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 bg-accent text-white rounded-xl shadow-lg shadow-accent/20"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="px-4 pb-4 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input 
              type="text" 
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-foreground/5 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 text-[12px] font-bold text-foreground/60 whitespace-nowrap">
                  {statusFilter}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] py-1 w-[160px]" align="start" sideOffset={4}>
                  {['All Status', 'Active', 'Inactive', 'New'].map((status) => (
                    <button 
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 font-medium"
                    >
                      {status}
                    </button>
                  ))}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 text-[12px] font-bold text-foreground/60 whitespace-nowrap">
                  Sort: {sortBy}
                  <ChevronDown className="w-3 h-3" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] py-1 w-[200px]" align="start" sideOffset={4}>
                  {['Name', 'Total Spent: High to Low', 'Total Orders: High to Low'].map((sort) => (
                    <button 
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 font-medium"
                    >
                      {sort}
                    </button>
                  ))}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>
      </div>

      <AddCustomerModal 
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCustomer(null);
        }}
        onAdd={handleAddOrUpdateCustomer}
        initialData={editingCustomer}
      />

      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        title={deleteModal.isBulk ? 'Delete Multiple Customers' : 'Delete Customer'}
        description={deleteModal.isBulk 
          ? `Are you sure you want to delete ${selectedIds.length} selected customers? This action cannot be undone.`
          : 'Are you sure you want to delete this customer? This action cannot be undone.'
        }
      />

      {/* Desktop Table View */}
      <div className="hidden md:block flex-1 overflow-auto scrollbar-hide">
        <table className="w-full border-collapse text-left min-w-[1000px]">
          <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border-custom">
            <tr>
              <th className="pl-6 py-4 w-12">
                <button 
                  onClick={toggleAll}
                  className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                    selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0
                      ? 'bg-accent border-accent text-white' 
                      : 'border-border-custom hover:border-foreground/30'
                  }`}
                >
                  {selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0 && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              </th>
              <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Orders</th>
              <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Total Spent</th>
              <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Last Order</th>
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
                    <p className="text-sm font-medium">Loading customers...</p>
                  </div>
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-foreground/40">
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-foreground/30">
                    <Users className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">No customers found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
              <tr 
                key={customer.id}
                className={`group transition-colors hover:bg-foreground/[0.02] ${
                  selectedIds.includes(customer.id) ? 'bg-foreground/[0.03]' : ''
                }`}
              >
                <td className="pl-6 py-4">
                  <button 
                    onClick={() => toggleOne(customer.id)}
                    className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                      selectedIds.includes(customer.id) 
                        ? 'bg-accent border-accent text-white' 
                        : 'border-border-custom group-hover:border-foreground/30'
                    }`}
                  >
                    {selectedIds.includes(customer.id) && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-foreground/5 overflow-hidden border border-border-custom flex-shrink-0">
                      {customer.avatar ? (
                        <img src={customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/20">
                          <Users className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-medium text-foreground">{customer.name}</span>
                      <span className="text-[12px] text-foreground/40">ID: #{customer.id.padStart(4, '0')}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[13px] text-foreground/60">
                      <Mail className="w-3.5 h-3.5" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-foreground/40">
                      <Phone className="w-3.5 h-3.5" />
                      {customer.phone}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[14px] text-foreground/60">{customer.totalOrders} orders</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[14px] font-medium text-foreground/80">₦{customer.totalSpent.toFixed(2)}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[14px] text-foreground/60">{customer.lastOrder}</span>
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={customer.status} />
                </td>
                <td className="pr-6 py-4 text-right">
                  <ActionPopover 
                    customer={customer} 
                    onDelete={handleDelete} 
                    onViewDetails={handleViewDetails}
                    onEdit={handleEditCustomer}
                    onHistory={handleViewDetails}
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
            Customer <ChevronDown className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">
            Status <ChevronDown className="w-3 h-3" />
          </div>
        </div>
        <div className="flex flex-col">
          {filteredCustomers.map((customer) => (
            <MobileCustomerCard 
              key={customer.id} 
              customer={customer} 
              isExpanded={expandedCustomerId === customer.id}
              onToggle={() => setExpandedCustomerId(expandedCustomerId === customer.id ? null : customer.id)}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onEdit={handleEditCustomer}
              onHistory={handleViewDetails}
            />
          ))}
          {filteredCustomers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-foreground/30">
              <Users className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">No customers found</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination Footer (Desktop) */}
      <div className="hidden md:flex px-6 py-4 border-t border-border-custom items-center justify-between bg-background">
        <div className="text-sm text-foreground/40">
          Showing <span className="font-medium text-foreground/60">{filteredCustomers.length}</span> of {customers.length} customers
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
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 px-4">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="w-2 h-2 rounded-full bg-foreground/10" />
            <span className="w-2 h-2 rounded-full bg-foreground/10" />
          </div>
          <button className="p-2 rounded-lg text-foreground/40">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <CustomerDetailModal 
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, customer: null })}
        customer={detailModal.customer}
      />
    </div>
  );
};