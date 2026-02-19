"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, User, Mail, Phone, ChevronDown, ChevronLeft } from 'lucide-react';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (customer: any) => void;
  initialData?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
  } | null;
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

export const AddCustomerModal = ({ isOpen, onClose, onAdd, initialData }: AddCustomerModalProps) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    status: 'New'
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone === '-' ? '' : initialData.phone,
        status: initialData.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'New'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(initialData ? { ...formData, id: initialData.id } : formData);
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100] md:block hidden" />
        <Dialog.Content className="fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-[700px] bg-background md:border border-border-custom md:rounded-2xl z-[101] overflow-hidden flex flex-col h-full md:h-[70vh] inset-0 md:inset-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-border-custom bg-background sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="md:hidden p-2 -ml-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <Dialog.Title className="sr-only">
                {initialData ? 'Edit Customer' : 'Add New Customer'}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="hidden md:block p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
            <button 
            onClick={handleSubmit}
            className="md:hidden px-4 py-2 bg-accent text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
          >
            Save
          </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide bg-background">
            <div className="w-full max-w-[560px] mx-auto flex flex-col gap-8 pb-10">
              
              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Personal Information</h3>
                <div className="grid gap-6">
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
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
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
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
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
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
                  <div className="grid md:grid-cols-[140px_1fr] items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Status</label>
                    <CustomSelect 
                      value={formData.status}
                      onChange={val => setFormData({...formData, status: val as any})}
                      options={['Active', 'Inactive', 'New']}
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
              className="px-6 py-2 bg-accent text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
            >
              {initialData ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
