"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, User, Mail, Phone, Image as ImageIcon, ChevronDown } from 'lucide-react';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (customer: any) => void;
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
        className="w-full flex items-center justify-between bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground hover:border-foreground/20 transition-all"
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
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                value === option 
                  ? 'bg-foreground/5 text-foreground font-medium' 
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

export const AddCustomerModal = ({ isOpen, onClose, onAdd }: AddCustomerModalProps) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    status: 'New',
    avatar: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: '—'
    });
    onClose();
    setFormData({
      name: '',
      email: '',
      phone: '',
      status: 'New',
      avatar: ''
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] bg-background border border-border-custom rounded-2xl z-[101] overflow-hidden flex flex-col h-[70vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-custom bg-background">
            <Dialog.Title className="text-lg font-bold text-foreground">Add New Customer</Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-background">
            <div className="max-w-[560px] mx-auto flex flex-col gap-8">
              
              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Personal Information</h3>
                <div className="grid gap-6">
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                      <input 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. John Doe"
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                      <input 
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                      <input 
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                        placeholder="+1 234 567 890"
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Profile Details</h3>
                <div className="grid gap-6">
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Status</label>
                    <CustomSelect 
                      value={formData.status}
                      onChange={val => setFormData({...formData, status: val as any})}
                      options={['Active', 'Inactive', 'New']}
                    />
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Avatar URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                      <input 
                        value={formData.avatar}
                        onChange={e => setFormData({...formData, avatar: e.target.value})}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </form>

          {/* Footer */}
          <div className="p-5 border-t border-border-custom bg-background flex justify-end gap-3">
            <Dialog.Close asChild>
              <button className="px-6 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors">
                Cancel
              </button>
            </Dialog.Close>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-foreground text-background rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Add Customer
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
