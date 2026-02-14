"use client";

import React from 'react';
import { 
  Search, 
  Plus, 
  Ticket, 
  Calendar, 
  Tag, 
  MoreHorizontal,
  Trash2,
  Edit2,
  Percent,
  CircleDollarSign,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Loader2
} from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import * as Dialog from '@radix-ui/react-dialog';
import { useDiscounts } from '@/hooks/useData';
import { type Discount } from '@/lib/api';

const AddDiscountModal = ({ isOpen, onClose, onAdd, discount }: { isOpen: boolean, onClose: () => void, onAdd: (discount: any) => void, discount?: Discount | null }) => {
  const [formData, setFormData] = React.useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  React.useEffect(() => {
    if (discount) {
      setFormData({
        code: discount.code,
        type: discount.type,
        value: discount.value,
        startDate: discount.startDate,
        endDate: discount.endDate || '',
      });
    } else {
      setFormData({
        code: '',
        type: 'percentage',
        value: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      });
    }
  }, [discount, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: discount?.id || Math.random().toString(36).substr(2, 9),
      status: discount?.status || 'Active',
      usageCount: discount?.usageCount || 0,
    });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100] md:block hidden" />
        <Dialog.Content className="fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-[600px] bg-background md:border border-border-custom md:rounded-2xl z-[101] overflow-hidden flex flex-col h-full md:h-[70vh] inset-0 md:inset-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-custom bg-background sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="md:hidden p-2 -ml-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <Dialog.Title className="text-lg font-bold text-foreground">
                {discount ? 'Edit Discount' : 'Create Discount'}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="hidden md:block p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
            <button 
              onClick={handleSubmit}
              className="md:hidden px-4 py-2 bg-foreground text-background rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide bg-background">
            <div className="w-full max-w-[480px] mx-auto flex flex-col gap-8 pb-10">
              
              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Discount Information</h3>
                <div className="grid gap-6">
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Discount Code</label>
                    <input 
                      required
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      placeholder="e.g. SUMMER2024"
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Type</label>
                    <div className="relative group">
                      <select 
                        value={formData.type}
                        onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium appearance-none"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₦)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                    </div>
                  </div>

                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Value</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-foreground/30">
                        {formData.type === 'percentage' ? '%' : '₦'}
                      </span>
                      <input 
                        required
                        type="number"
                        value={formData.value}
                        onChange={e => setFormData({ ...formData, value: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Duration</h3>
                <div className="grid gap-6">
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Start Date</label>
                    <input 
                      required
                      type="date"
                      value={formData.startDate}
                      onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">End Date</label>
                    <input 
                      type="date"
                      value={formData.endDate}
                      onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                    />
                  </div>
                </div>
              </section>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="hidden md:flex p-5 border-t border-border-custom bg-background items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-foreground/40 hover:text-foreground transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="bg-accent hover:bg-accent/90 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent/20"
            >
              {discount ? 'Save Changes' : 'Create Discount'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const ActionPopover = ({ discount, onDelete, onEdit }: { discount: Discount, onDelete: (id: string) => void, onEdit: (discount: Discount) => void }) => {
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
            onClick={() => onEdit(discount)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit Discount
          </button>
          <div className="h-px bg-border-custom my-1" />
          <button 
            onClick={() => onDelete(discount.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-500/10 transition-colors font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const StatusBadge = ({ status }: { status: Discount['status'] }) => {
  const styles = {
    Active: 'text-emerald-500 bg-emerald-500/10',
    Scheduled: 'text-orange-500 bg-orange-500/10',
    Expired: 'text-foreground/40 bg-foreground/5',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${styles[status].split(' ')[0].replace('text-', 'bg-')}`} />
      <span className="text-[13px] font-medium">{status}</span>
    </div>
  );
};

const MobileDiscountCard = ({ 
  discount, 
  isExpanded, 
  onToggle, 
  onDelete, 
  onEdit 
}: { 
  discount: Discount; 
  isExpanded: boolean; 
  onToggle: () => void; 
  onDelete: (id: string) => void;
  onEdit: (discount: Discount) => void;
}) => {
  return (
    <div className={`border-b border-border-custom transition-colors ${isExpanded ? 'bg-foreground/[0.02]' : ''}`}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground line-clamp-1">{discount.code}</span>
            <span className="text-[12px] text-foreground/40 font-medium">
              {discount.type === 'percentage' ? `${discount.value}% off` : `₦${discount.value.toLocaleString()} off`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={discount.status} />
          <ChevronDown className={`w-4 h-4 text-foreground/20 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-4 bg-foreground/[0.03] rounded-xl p-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Usage</span>
              <span className="text-sm font-bold text-foreground">{discount.usageCount} used</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Type</span>
              <span className="text-sm font-bold text-foreground/60 capitalize">{discount.type}</span>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Duration</span>
              <span className="text-sm font-bold text-foreground/60">
                {discount.startDate} {discount.endDate ? `— ${discount.endDate}` : '(Ongoing)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(discount)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm font-bold transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button 
              onClick={() => onDelete(discount.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-xl text-sm font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const DiscountsPage = () => {
  const { discounts, loading, fetchDiscounts, createDiscount, updateDiscount, deleteDiscount } = useDiscounts();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('All Status');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingDiscount, setEditingDiscount] = React.useState<Discount | null>(null);
  const [expandedDiscountId, setExpandedDiscountId] = React.useState<string | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleAddDiscount = async (discountData: any) => {
    try {
      if (editingDiscount) {
        await updateDiscount(editingDiscount.id, discountData);
      } else {
        await createDiscount(discountData);
      }
      setIsAddModalOpen(false);
      setEditingDiscount(null);
    } catch (error) {
      console.error('Failed to save discount:', error);
      alert('Failed to save discount. Please try again.');
    }
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setIsAddModalOpen(true);
  };

  const handleDeleteDiscount = async (id: string) => {
    if (confirm('Are you sure you want to delete this discount?')) {
      try {
        await deleteDiscount(id);
        setSelectedIds(selectedIds.filter(i => i !== id));
      } catch (error) {
        console.error('Failed to delete discount:', error);
        alert('Failed to delete discount.');
      }
    }
  };

  const filteredDiscounts = discounts.filter(d => {
    const matchesSearch = d.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleAll = () => {
    if (selectedIds.length === filteredDiscounts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDiscounts.map(d => d.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading Discounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background animate-in fade-in duration-500">
      <AddDiscountModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDiscount(null);
        }} 
        onAdd={handleAddDiscount}
        discount={editingDiscount}
      />

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border-custom">
        <div className="flex items-center gap-4 flex-1 max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
            <input 
              type="text" 
              placeholder="Search by discount code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-foreground/5 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 ring-foreground/10 text-foreground transition-all font-medium"
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
                  {['All Status', 'Active', 'Scheduled', 'Expired'].map((status) => (
                    <button 
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors font-medium"
                    >
                      {status}
                    </button>
                  ))}
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create Discount
          </button>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex flex-col gap-4 px-4 py-4 border-b border-border-custom">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Discounts</h1>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="p-2 bg-foreground text-background rounded-xl active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
          <input 
            type="text" 
            placeholder="Search discounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-foreground/5 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 ring-foreground/10 text-foreground transition-all font-medium"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filteredDiscounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-foreground/40">
            <div className="w-16 h-16 rounded-3xl bg-foreground/5 flex items-center justify-center">
              <Tag className="w-8 h-8" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">No discounts found</p>
              <p className="text-[13px]">Create your first discount to get started</p>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="mt-2 bg-foreground text-background px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all active:scale-95"
            >
              Create Discount
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border-custom bg-foreground/[0.01]">
                <th className="w-12 px-6 py-4">
                  <button 
                    onClick={toggleAll}
                    className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedIds.length === filteredDiscounts.length ? 'bg-foreground border-foreground text-background' : 'border-border-custom hover:border-foreground/20'}`}
                  >
                    {selectedIds.length === filteredDiscounts.length && <Check className="w-3.5 h-3.5" />}
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Discount Code</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscounts.map((discount) => (
                <tr key={discount.id} className="group hover:bg-foreground/[0.02] transition-colors border-b border-border-custom last:border-0">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleOne(discount.id)}
                      className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedIds.includes(discount.id) ? 'bg-foreground border-foreground text-background' : 'border-border-custom hover:border-foreground/20 group-hover:border-foreground/20'}`}
                    >
                      {selectedIds.includes(discount.id) && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        <Ticket className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{discount.code}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-foreground/60 font-medium">
                      {discount.type === 'percentage' ? <Percent className="w-4 h-4" /> : <CircleDollarSign className="w-4 h-4" />}
                      <span className="capitalize">{discount.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-foreground">
                    {discount.type === 'percentage' ? `${discount.value}%` : `₦${discount.value.toLocaleString()}`}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={discount.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60 font-medium">
                    {discount.usageCount} used
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[13px] text-foreground/40 font-medium">
                      <Calendar className="w-4 h-4" />
                      {discount.startDate} {discount.endDate ? `— ${discount.endDate}` : '(Ongoing)'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionPopover discount={discount} onDelete={handleDeleteDiscount} onEdit={handleEdit} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          {filteredDiscounts.map((discount) => (
            <MobileDiscountCard 
              key={discount.id}
              discount={discount}
              isExpanded={expandedDiscountId === discount.id}
              onToggle={() => setExpandedDiscountId(expandedDiscountId === discount.id ? null : discount.id)}
              onDelete={handleDeleteDiscount}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </>
    )}
  </div>

  {/* Pagination (Footer) */}
      <div className="px-6 py-4 border-t border-border-custom flex items-center justify-between bg-background">
        <span className="text-sm text-foreground/40 font-medium">
          Showing <span className="text-foreground font-bold">{filteredDiscounts.length}</span> of <span className="text-foreground font-bold">{discounts.length}</span> discounts
        </span>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 disabled:opacity-30 transition-all" disabled>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 disabled:opacity-30 transition-all" disabled>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
