"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, 
  User, 
  Store, 
  Bot, 
  Truck, 
  CreditCard, 
  Bell,
  ChevronDown,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground hover:border-foreground/20 transition-all"
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

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = React.useState('Account');
  const [role, setRole] = React.useState('Store Owner');
  const [currency, setCurrency] = React.useState('USD ($)');
  const [tone, setTone] = React.useState('Professional & Helpful');
  const [location, setLocation] = React.useState('United States of America');

  const navItems = [
    { id: 'Account', icon: User, label: 'Account' },
    { id: 'Store', icon: Store, label: 'Store Settings' },
    { id: 'Agents', icon: Bot, label: 'AI Agents' },
    { id: 'Logistics', icon: Truck, label: 'Logistics' },
    { id: 'Payments', icon: CreditCard, label: 'Payments' },
    { id: 'Security', icon: Shield, label: 'Security' },
    { id: 'Notifications', icon: Bell, label: 'Notifications' },
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[850px] bg-background border border-border-custom rounded-2xl z-[101] overflow-hidden flex flex-col h-[60vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-custom bg-background">
            <div className="flex items-center gap-3">
              <Dialog.Title className="text-lg font-bold text-foreground">Settings</Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-[220px] border-r border-border-custom p-3 flex flex-col gap-1 bg-sidebar/50">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    activeTab === item.id 
                      ? 'bg-foreground/10 text-foreground font-bold' 
                      : 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-foreground' : 'opacity-70'}`} />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-background">
              <div className="max-w-[560px] mx-auto flex flex-col gap-8">
                
                {activeTab === 'Account' && (
                  <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <section>
                      <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">Profile Information</h3>
                      <div className="grid gap-6">
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-sm font-semibold text-foreground/80">Full Name</label>
                          <input 
                            type="text" 
                            defaultValue="Jonathan Frazzelle"
                            className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                          />
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-sm font-semibold text-foreground/80">Email Address</label>
                          <input 
                            type="email" 
                            defaultValue="jon@mia-agents.ai"
                            className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                          />
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">Organization</h3>
                      <div className="grid gap-6">
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-sm font-semibold text-foreground/80">Role</label>
                          <CustomSelect 
                            value={role} 
                            onChange={setRole} 
                            options={['Store Owner', 'Operations Manager', 'Agent Developer']} 
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === 'Store' && (
                  <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <section>
                      <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">Store Configuration</h3>
                      <div className="grid gap-6">
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-sm font-semibold text-foreground/80">Store Name</label>
                          <input 
                            type="text" 
                            defaultValue="Mia Electronics"
                            className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                          />
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-sm font-semibold text-foreground/80">Store Domain</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="text" 
                              defaultValue="mia-electronics"
                              className="flex-1 bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none text-foreground"
                            />
                            <span className="text-sm text-foreground/40">.mia.shop</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-sm font-semibold text-foreground/80">Primary Currency</label>
                          <CustomSelect 
                            value={currency} 
                            onChange={setCurrency} 
                            options={['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)', 'CAD ($)']} 
                            icon={Globe}
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === 'Agents' && (
                  <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <section>
                      <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">Agent Intelligence</h3>
                      <div className="grid gap-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-input-bg border border-border-custom">
                          <div>
                            <p className="text-sm font-semibold text-foreground">Auto-pilot Mode</p>
                            <p className="text-xs text-foreground/40">Allow agents to handle support and logistics automatically.</p>
                          </div>
                          <div className="w-10 h-5 rounded-full bg-accent relative cursor-pointer">
                            <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
                          </div>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-sm font-semibold text-foreground/80">Agent Tone</label>
                          <CustomSelect 
                            value={tone} 
                            onChange={setTone} 
                            options={['Professional & Helpful', 'Friendly & Casual', 'Efficient & Direct']} 
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {activeTab === 'Logistics' && (
                  <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <section>
                      <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">Fulfillment Settings</h3>
                      <div className="grid gap-6">
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-sm font-semibold text-foreground/80">Warehouse Location</label>
                          <CustomSelect 
                            value={location} 
                            onChange={setLocation} 
                            options={['United States of America', 'United Kingdom', 'European Union', 'Canada', 'Australia']} 
                          />
                        </div>
                        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                          <label className="text-sm font-semibold text-foreground/80">Carrier Priority</label>
                          <div className="flex gap-2">
                            <span className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-bold border border-accent/20">FedEx</span>
                            <span className="px-3 py-1.5 rounded-lg bg-foreground/5 text-foreground/60 text-xs font-bold border border-border-custom">UPS</span>
                            <span className="px-3 py-1.5 rounded-lg bg-foreground/5 text-foreground/60 text-xs font-bold border border-border-custom">DHL</span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-border-custom flex justify-end gap-3 bg-background">
            <button 
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-sm font-medium text-foreground/60 hover:bg-foreground/5 transition-colors"
            >
              Cancel
            </button>
            <button className="px-6 py-2 rounded-xl text-sm font-bold bg-accent text-white hover:brightness-110 transition-all">
              Save Changes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
