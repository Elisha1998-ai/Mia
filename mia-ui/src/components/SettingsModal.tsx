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
  Shield,
  Loader2
} from 'lucide-react';
import { useSettings } from '@/hooks/useData';
import { StoreSettings } from '@/lib/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomSelect = ({ value, onChange, options, icon: Icon }: { 
  value: string, 
  onChange: (val: string) => void, 
  options: string[],
  icon?: React.ElementType
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
  const { settings, loading, fetchSettings, updateSettings } = useSettings();
  
  // Local state for form fields
  const [formData, setFormData] = React.useState<Partial<StoreSettings>>({});

  React.useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  React.useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSave = async (sectionData: Partial<StoreSettings>) => {
    try {
      await updateSettings(sectionData);
      // Update local state to reflect changes immediately
      setFormData(prev => ({ ...prev, ...sectionData }));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

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
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : (
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
                              value={formData.adminName || ''}
                              onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                              onBlur={() => handleSave({ adminName: formData.adminName })}
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                            />
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Email Address</label>
                            <input 
                              type="email" 
                              value={formData.adminEmail || ''}
                              onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                              onBlur={() => handleSave({ adminEmail: formData.adminEmail })}
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
                              value={formData.adminRole || 'Store Owner'} 
                              onChange={(val) => {
                                setFormData({...formData, adminRole: val});
                                handleSave({ adminRole: val });
                              }} 
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
                              value={formData.storeName || ''}
                              onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                              onBlur={() => handleSave({ storeName: formData.storeName })}
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                            />
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Store Domain</label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="text" 
                                value={formData.storeDomain || ''}
                                onChange={(e) => setFormData({...formData, storeDomain: e.target.value})}
                                onBlur={() => handleSave({ storeDomain: formData.storeDomain })}
                                className="flex-1 bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none text-foreground"
                              />
                              <span className="text-sm text-foreground/40">.mia.shop</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Currency</label>
                            <CustomSelect 
                              value={formData.currency || 'USD ($)'} 
                              onChange={(val) => {
                                setFormData({...formData, currency: val});
                                handleSave({ currency: val });
                              }} 
                              options={['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)']} 
                            />
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Location</label>
                            <CustomSelect 
                              value={formData.location || 'United States'} 
                              onChange={(val) => {
                                setFormData({...formData, location: val});
                                handleSave({ location: val });
                              }} 
                              options={['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France']} 
                            />
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">AI Preferences</h3>
                        <div className="grid gap-6">
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Agent Tone</label>
                            <CustomSelect 
                              value={formData.aiTone || 'Professional & Helpful'} 
                              onChange={(val) => {
                                setFormData({...formData, aiTone: val});
                                handleSave({ aiTone: val });
                              }} 
                              options={['Professional & Helpful', 'Casual & Friendly', 'Formal & Direct', 'Enthusiastic & Sales-focused']} 
                            />
                          </div>
                        </div>
                      </section>
                    </div>
                  )}

                  {/* Placeholders for other tabs */}
                  {['Agents', 'Logistics', 'Payments', 'Security', 'Notifications'].includes(activeTab) && (
                    <div className="flex flex-col items-center justify-center h-[300px] text-foreground/40 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <Bot className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-sm">This section is coming soon.</p>
                    </div>
                  )}
                </div>
              )}
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
