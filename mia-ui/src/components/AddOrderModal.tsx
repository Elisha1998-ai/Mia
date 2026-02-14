"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import { X, ShoppingCart, User, Calendar, DollarSign, CreditCard, ChevronDown, Package, ChevronLeft, ChevronRight, Plus, Trash2, Mail, Phone } from 'lucide-react';

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (order: any) => void;
  customers: { id: string, name: string, email?: string, phone?: string }[];
  products: { id: string, name: string, price: number }[];
}

const SearchableSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder,
  icon: Icon,
  allowFreeText = false 
}: { 
  value: string, 
  onChange: (val: string, id?: string) => void, 
  options: { id: string, name: string }[],
  placeholder: string,
  icon?: any,
  allowFreeText?: boolean
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Sync search state with value prop when not open
  React.useEffect(() => {
    if (!isOpen) {
      setSearch(value);
    }
  }, [value, isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />}
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (allowFreeText) {
              onChange(e.target.value);
            }
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearch(''); // Clear search on focus to show all options
          }}
          placeholder={placeholder}
          className={`w-full bg-foreground/5 border border-border-custom rounded-xl py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 ring-accent/20 transition-all font-medium ${Icon ? 'pl-10' : 'px-4'}`}
        />
        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (filteredOptions.length > 0 || (allowFreeText && search)) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100 max-h-[200px] overflow-y-auto">
          {filteredOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                onChange(option.name, option.id);
                setIsOpen(false);
                setSearch('');
              }}
              className="w-full text-left px-4 py-2 text-sm text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors font-medium"
            >
              {option.name}
            </button>
          ))}
          {allowFreeText && search && !filteredOptions.find(o => o.name.toLowerCase() === search.toLowerCase()) && (
            <button
              type="button"
              onClick={() => {
                onChange(search);
                setIsOpen(false);
                setSearch('');
              }}
              className="w-full text-left px-4 py-2 text-sm text-accent hover:bg-foreground/5 transition-colors font-medium border-t border-border-custom"
            >
              Add new: "{search}"
            </button>
          )}
        </div>
      )}
    </div>
  );
};

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
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100 max-h-[200px] overflow-y-auto">
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

export const AddOrderModal = ({ isOpen, onClose, onAdd, customers, products }: AddOrderModalProps) => {
  const [formData, setFormData] = React.useState({
    orderNumber: '',
    customerName: '',
    customerId: '',
    customerEmail: '',
    customerPhone: '',
    items: [] as OrderItem[],
    total: '0',
    status: 'Processing',
    paymentMethod: 'Bank Transfer',
    shippingMethod: 'Standard Shipping',
    date: new Date().toISOString().split('T')[0],
    address: ''
  });

  const [selectedProduct, setSelectedProduct] = React.useState<{id: string, name: string, price: number} | null>(null);
  const [quantity, setQuantity] = React.useState(1);

  // Auto-calculate total whenever items change
  React.useEffect(() => {
    const total = formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setFormData(prev => ({ ...prev, total: total.toString() }));
  }, [formData.items]);

  // Reset/Initialize form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: '',
        customerId: '',
        customerEmail: '',
        customerPhone: '',
        items: [],
        total: '0',
        status: 'Processing',
        paymentMethod: 'Bank Transfer',
        shippingMethod: 'Standard Shipping',
        date: new Date().toISOString().split('T')[0],
        address: ''
      });
      setSelectedProduct(null);
      setQuantity(1);
    }
  }, [isOpen]);

  const addItem = () => {
    if (selectedProduct) {
      const existingItemIndex = formData.items.findIndex(item => item.productId === selectedProduct.id);
      
      if (existingItemIndex > -1) {
        const newItems = [...formData.items];
        newItems[existingItemIndex].quantity += quantity;
        setFormData({ ...formData, items: newItems });
      } else {
        const newItem: OrderItem = {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          price: selectedProduct.price,
          quantity: quantity
        };
        setFormData({ ...formData, items: [...formData.items, newItem] });
      }
      
      setSelectedProduct(null);
      setQuantity(1);
    }
  };

  const removeItem = (productId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.productId !== productId)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      alert("Please add at least one product to the order.");
      return;
    }
    
    // Format data for API
    const apiData = {
      order_number: formData.orderNumber,
      customer_id: formData.customerId,
      customer_name: formData.customerName,
      customer_email: formData.customerEmail,
      customer_phone: formData.customerPhone,
      total_amount: parseFloat(formData.total) || 0,
      status: formData.status,
      payment_method: formData.paymentMethod,
      shipping_method: formData.shippingMethod,
      shipping_address: formData.address,
      items: formData.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    };

    onAdd(apiData);
    onClose();
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
                    <div className="grid gap-3">
                      <SearchableSelect 
                        value={formData.customerName}
                        onChange={(name, id) => {
                          const customer = customers.find(c => c.id === id);
                          setFormData({ 
                            ...formData, 
                            customerName: name, 
                            customerId: id || '',
                            customerEmail: customer?.email || formData.customerEmail,
                            customerPhone: customer?.phone || formData.customerPhone
                          });
                        }}
                        options={customers}
                        placeholder="Search or type customer name..."
                        icon={User}
                        allowFreeText={true}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                          <input 
                            type="email"
                            value={formData.customerEmail}
                            onChange={e => setFormData({...formData, customerEmail: e.target.value})}
                            placeholder="Email address"
                            className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all"
                          />
                        </div>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                          <input 
                            type="tel"
                            value={formData.customerPhone}
                            onChange={e => setFormData({...formData, customerPhone: e.target.value})}
                            placeholder="Phone number"
                            className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all"
                          />
                        </div>
                      </div>
                    </div>
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
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Products</h3>
                <div className="grid gap-6">
                  {/* Selected Items List */}
                  {formData.items.length > 0 && (
                    <div className="bg-foreground/5 rounded-2xl overflow-hidden border border-border-custom">
                      <div className="px-4 py-3 border-b border-border-custom bg-foreground/5">
                        <div className="grid grid-cols-[1fr_80px_100px_40px] gap-4 text-[10px] font-bold text-foreground/40 uppercase tracking-wider">
                          <span>Product</span>
                          <span className="text-center">Qty</span>
                          <span className="text-right">Price</span>
                          <span></span>
                        </div>
                      </div>
                      <div className="divide-y divide-border-custom">
                        {formData.items.map((item) => (
                          <div key={item.productId} className="px-4 py-3 grid grid-cols-[1fr_80px_100px_40px] gap-4 items-center group">
                            <span className="text-sm font-medium text-foreground truncate">{item.productName}</span>
                            <span className="text-sm text-center text-foreground/60">{item.quantity}</span>
                            <span className="text-sm text-right font-semibold text-foreground">₦{(item.price * item.quantity).toLocaleString()}</span>
                            <button 
                              type="button"
                              onClick={() => removeItem(item.productId)}
                              className="p-1 hover:bg-red-500/10 rounded-lg text-foreground/20 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-3 bg-foreground/5 flex justify-between items-center">
                        <span className="text-xs font-bold text-foreground/40 uppercase">Total Amount</span>
                        <span className="text-lg font-black text-foreground">₦{parseFloat(formData.total).toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Add Product Form */}
                  <div className="bg-foreground/[0.02] border border-dashed border-border-custom rounded-2xl p-6 flex flex-col gap-6">
                    <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                      <label className="text-sm font-semibold text-foreground/80">Select Product</label>
                      <SearchableSelect 
                        value={selectedProduct?.name || ''}
                        onChange={(name, id) => {
                          const product = products.find(p => p.id === id);
                          if (product) setSelectedProduct(product);
                        }}
                        options={products}
                        placeholder="Search store products..."
                        icon={Package}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                      <label className="text-sm font-semibold text-foreground/80">Quantity</label>
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <input 
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                            className="w-full bg-background border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addItem}
                          disabled={!selectedProduct}
                          className="flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-30 disabled:grayscale"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Payment & Shipping</h3>
                <div className="grid gap-6">
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
                      options={['Bank Transfer', 'Paystack', 'Flutterwave', 'Cash on Delivery', 'USSD']}
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

          {/* Footer Actions */}
          <div className="hidden md:flex p-5 border-t border-border-custom bg-background items-center justify-end gap-3">
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
