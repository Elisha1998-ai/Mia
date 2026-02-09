"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import { X, ShoppingCart, User, Calendar, DollarSign, CreditCard, ChevronDown, Package, ChevronLeft, ChevronRight } from 'lucide-react';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (order: any) => void;
  customers: { id: string, name: string }[];
}

const CustomSelect = ({ value, onChange, options, icon: Icon }: { 
  value: string, 
  onChange: (val: string) => void, 
  options: string[],
  icon?: any
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground hover:border-foreground/20 transition-all font-medium"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-foreground/40" />}
          <span>{value}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-foreground/30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors font-medium ${
                value === option 
                  ? 'bg-foreground/5 text-foreground' 
                  : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DatePicker = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [viewDate, setViewDate] = React.useState(new Date(value || new Date()));
  
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const days = [];
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(year, month, day);
    onChange(selectedDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button className="w-full flex items-center gap-2 bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground hover:border-foreground/20 transition-all font-medium">
          <Calendar className="w-4 h-4 text-foreground/40" />
          <span>{value || 'Select Date'}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bg-background border border-border-custom rounded-2xl shadow-2xl z-[110] p-4 w-[280px] animate-in fade-in zoom-in-95 duration-100" sideOffset={8} align="start">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-foreground">{monthNames[month]} {year}</h4>
            <div className="flex items-center gap-1">
              <button 
                type="button"
                onClick={() => setViewDate(new Date(year, month - 1))}
                className="p-1.5 hover:bg-foreground/5 rounded-lg text-foreground/40 hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                type="button"
                onClick={() => setViewDate(new Date(year, month + 1))}
                className="p-1.5 hover:bg-foreground/5 rounded-lg text-foreground/40 hover:text-foreground transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-[10px] font-bold text-foreground/30 text-center uppercase py-1">{d}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <div key={i} className="aspect-square">
                {day && (
                  <button
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={`w-full h-full flex items-center justify-center text-xs rounded-lg transition-all font-medium ${
                      value === new Date(year, month, day).toISOString().split('T')[0]
                        ? 'bg-accent text-white shadow-lg shadow-accent/20'
                        : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export const AddOrderModal = ({ isOpen, onClose, onAdd, customers }: AddOrderModalProps) => {
  const [formData, setFormData] = React.useState({
    orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: '',
    customerId: '',
    productName: 'Premium Cotton T-Shirt',
    total: '',
    status: 'Processing',
    itemsCount: '1',
    paymentMethod: 'Credit Card',
    shippingMethod: 'Standard Shipping',
    date: new Date().toISOString().split('T')[0],
    address: ''
  });

  // Update order number when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: customers.length > 0 ? customers[0].name : '',
        customerId: customers.length > 0 ? customers[0].id : '',
        address: 'New Shipping Address',
        itemsCount: '1',
        productName: 'Premium Cotton T-Shirt',
        shippingMethod: 'Standard Shipping'
      }));
    }
  }, [isOpen, customers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      total: parseFloat(formData.total) || 0,
      itemsCount: parseInt(formData.itemsCount) || 1
    });
    onClose();
    setFormData({
      orderNumber: '',
      customerName: '',
      customerId: '',
      productName: 'Premium Cotton T-Shirt',
      total: '',
      status: 'Processing',
      itemsCount: '1',
      paymentMethod: 'Credit Card',
      shippingMethod: 'Standard Shipping',
      date: new Date().toISOString().split('T')[0],
      address: ''
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100] md:block hidden" />
        <Dialog.Content className="fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-[700px] bg-background md:border border-border-custom md:rounded-2xl z-[101] overflow-hidden flex flex-col h-full md:h-[70vh] inset-0 md:inset-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-custom bg-background sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="md:hidden p-2 -ml-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <Dialog.Title className="text-lg font-bold text-foreground">Create New Order</Dialog.Title>
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
            <div className="w-full max-w-[560px] mx-auto flex flex-col gap-8 pb-10">
              
              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Order Information</h3>
                <div className="grid gap-6">
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Order Number</label>
                    <div className="relative">
                      <ShoppingCart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                      <input 
                        disabled
                        value={formData.orderNumber}
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground/40 cursor-not-allowed transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Customer</label>
                    <CustomSelect 
                      value={formData.customerName}
                      onChange={val => {
                        const customer = customers.find(c => c.name === val);
                        setFormData({
                          ...formData, 
                          customerName: val,
                          customerId: customer?.id || ''
                        });
                      }}
                      options={customers.map(c => c.name)}
                      icon={User}
                    />
                  </div>
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Delivery Address</label>
                    <div className="relative">
                      <input 
                        required
                        type="text"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                        placeholder="Enter full address"
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Order Date</label>
                    <div className="relative group">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-accent transition-colors" />
                      <input 
                        required
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all [color-scheme:dark]
                        [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Payment & Details</h3>
                <div className="grid gap-6">
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Total Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-foreground/30">₦</span>
                      <input 
                        required
                        type="number"
                        step="0.01"
                        value={formData.total}
                        onChange={e => setFormData({...formData, total: e.target.value})}
                        placeholder="0.00"
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Product</label>
                    <CustomSelect 
                      value={formData.productName}
                      onChange={val => setFormData({...formData, productName: val})}
                      options={[
                        'Premium Cotton T-Shirt',
                        'Heritage Denim Jacket',
                        'Minimalist Leather Wallet',
                        'Performance Running Shoes',
                        'Mia Smart Kettle',
                        'Organic Bamboo Socks'
                      ]}
                      icon={Package}
                    />
                  </div>
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Quantity</label>
                    <div className="relative">
                      <input 
                        required
                        type="number"
                        min="1"
                        value={formData.itemsCount}
                        onChange={e => setFormData({...formData, itemsCount: e.target.value})}
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Shipping Method</label>
                    <CustomSelect 
                      value={formData.shippingMethod}
                      onChange={val => setFormData({...formData, shippingMethod: val})}
                      options={['Standard Shipping', 'Express Shipping', 'Next Day Delivery', 'Local Pickup']}
                    />
                  </div>
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Payment Method</label>
                    <CustomSelect 
                      value={formData.paymentMethod}
                      onChange={val => setFormData({...formData, paymentMethod: val})}
                      options={['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay']}
                      icon={CreditCard}
                    />
                  </div>
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Status</label>
                    <CustomSelect 
                      value={formData.status}
                      onChange={val => setFormData({...formData, status: val as any})}
                      options={['Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded']}
                    />
                  </div>
                </div>
              </section>
            </div>
          </form>

          {/* Footer */}
          <div className="hidden md:flex p-5 border-t border-border-custom bg-background justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-6 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors">
                Cancel
              </button>
            </Dialog.Close>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-foreground text-background rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Create Order
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
