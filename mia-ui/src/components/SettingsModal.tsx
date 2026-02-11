"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { 
  X, 
  User, 
  Store, 
  CreditCard, 
  ChevronDown,
  Loader2,
  LogOut,
  Share2,
  Search,
  Palette,
} from 'lucide-react';

const NICHES = [
  "Electronics",
  "Fashion",
  "Skincare",
  "Home Decor",
  "Beauty",
  "Food & Beverage",
  "Health & Wellness",
  "Automotive",
  "Sports & Outdoors",
  "Books & Stationery",
  "Toys & Games",
  "Art & Craft",
  "Other"
];

const HEADING_FONTS = [
  "Instrument Serif",
  "Inter",
  "Playfair Display",
  "Montserrat",
  "Bormiolo",
  "Cormorant Garamond"
];

const BODY_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "System Sans"
];

const NIGERIAN_BANKS = [
  "Access Bank",
  "Access Bank (Diamond)",
  "ALAT by WEMA",
  "ASO Savings and Loans",
  "Bowen Microfinance Bank",
  "Carbon",
  "CEMCS Microfinance Bank",
  "Citibank Nigeria",
  "Ecobank Nigeria",
  "Ekondo Microfinance Bank",
  "Eyowo",
  "Fidelity Bank",
  "First Bank of Nigeria",
  "First City Monument Bank",
  "FSDH Merchant Bank Limited",
  "Globus Bank",
  "Guaranty Trust Bank",
  "Hackman Microfinance Bank",
  "Hasal Microfinance Bank",
  "Heritage Bank",
  "Ibile Microfinance Bank",
  "Infinity MFB",
  "Jaiz Bank",
  "Keystone Bank",
  "Kuda Bank",
  "Lagos Building Investment Company PLC",
  "Mayfair Microfinance Bank",
  "Mint MFB",
  "Moniepoint MFB",
  "Opay",
  "PalmPay",
  "Parallex Bank",
  "Parkway - ReadyCash",
  "Paycom",
  "Petra Mircofinance Bank",
  "Polaris Bank",
  "Providus Bank",
  "QuickCheck Microfinance Bank",
  "Rubies MFB",
  "Safe Haven MFB",
  "Sparkle Microfinance Bank",
  "Stanbic IBTC Bank",
  "Standard Chartered Bank",
  "Sterling Bank",
  "Suntrust Bank",
  "TAJ Bank",
  "Tangerine Money",
  "TCF MFB",
  "Titan Bank",
  "Union Bank of Nigeria",
  "United Bank For Africa",
  "Unity Bank",
  "VFD Microfinance Bank Limited",
  "Wema Bank",
  "Zenith Bank"
].sort();

import { useSettings } from '@/hooks/useData';
import { StoreSettings } from '@/lib/api';
import { logout } from '@/actions/auth';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomSelect = ({ value, onChange, options, icon: Icon, showSearch = false, placeholder = "Select option" }: { 
  value: string, 
  onChange: (val: string) => void, 
  options: string[],
  icon?: React.ElementType,
  showSearch?: boolean,
  placeholder?: string
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
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
          <span className={!value ? "text-foreground/40" : ""}>{value || placeholder}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-foreground/30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[280px]">
          {showSearch && (
            <div className="p-2 border-b border-border-custom sticky top-0 bg-background z-10">
              <div className="relative bg-foreground/5 rounded-lg px-3 border border-border-custom">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/30" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-transparent pl-7 pr-2 py-2 text-sm outline-none placeholder:text-foreground/30 text-foreground"
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto scrollbar-hide">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    value === option 
                      ? 'bg-accent text-white font-medium' 
                      : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'
                  }`}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="px-4 py-4 text-sm text-center text-foreground/40">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = React.useState('Account');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
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
      setIsSaving(true);
      await updateSettings(sectionData);
      // Update local state to reflect changes immediately
      setFormData(prev => ({ ...prev, ...sectionData }));
      
      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const navItems = [
    { id: 'Account', icon: User, label: 'Account' },
    { id: 'Store', icon: Store, label: 'Store Settings' },
    { id: 'Design', icon: Palette, label: 'Store Design' },
    { id: 'Payments', icon: CreditCard, label: 'Payments & Bank' },
    { id: 'Social', icon: Share2, label: 'Social Links' },
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
            <div className="w-[220px] border-r border-border-custom p-3 flex flex-col bg-sidebar/50">
              <div className="flex flex-col gap-1">
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

              <div className="mt-auto pt-3">
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
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

                      <section className="pt-4 border-t border-border-custom">
                        <button
                          onClick={() => logout()}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out of Account
                        </button>
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
                              <span className="text-sm text-foreground/40 font-medium">bloume.shop/@</span>
                              <input 
                                type="text" 
                                value={formData.storeDomain || ''}
                                onChange={(e) => setFormData({...formData, storeDomain: e.target.value})}
                                onBlur={() => handleSave({ storeDomain: formData.storeDomain })}
                                className="flex-1 bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none text-foreground"
                                placeholder="store-name"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Niche</label>
                            <CustomSelect 
                              value={formData.niche || ''} 
                              onChange={(val) => {
                                setFormData({...formData, niche: val});
                                handleSave({ niche: val });
                              }} 
                              options={NICHES}
                              showSearch={true}
                              placeholder="Select Niche"
                            />
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">WhatsApp Number</label>
                            <input 
                              type="text" 
                              value={formData.storePhone || ''}
                              onChange={(e) => setFormData({...formData, storePhone: e.target.value})}
                              onBlur={() => handleSave({ storePhone: formData.storePhone })}
                              placeholder="e.g. +2348012345678"
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                            />
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Address</label>
                            <input 
                              type="text" 
                              value={formData.storeAddress || ''}
                              onChange={(e) => setFormData({...formData, storeAddress: e.target.value})}
                              onBlur={() => handleSave({ storeAddress: formData.storeAddress })}
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                            />
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Currency</label>
                            <div className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground/60 cursor-not-allowed">
                              Nigerian Naira (₦)
                            </div>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Location</label>
                            <div className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground/60 cursor-not-allowed">
                              Nigeria
                            </div>
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

                  {activeTab === 'Design' && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <section>
                        <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">Brand Style Guide</h3>
                        <div className="grid gap-6">
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Primary Color</label>
                            <div className="flex items-center gap-4">
                              <input 
                                type="color" 
                                value={formData.primaryColor || '#000000'}
                                onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                                onBlur={() => handleSave({ primaryColor: formData.primaryColor })}
                                className="w-12 h-12 rounded-lg border-none cursor-pointer overflow-hidden bg-transparent p-0"
                              />
                              <input 
                                type="text" 
                                value={formData.primaryColor || '#000000'}
                                onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                                onBlur={() => handleSave({ primaryColor: formData.primaryColor })}
                                className="flex-1 bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Heading Font</label>
                            <CustomSelect 
                              value={formData.headingFont || 'Instrument Serif'} 
                              onChange={(val) => {
                                setFormData({...formData, headingFont: val});
                                handleSave({ headingFont: val });
                              }} 
                              options={HEADING_FONTS} 
                            />
                          </div>

                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Body Font</label>
                            <CustomSelect 
                              value={formData.bodyFont || 'Inter'} 
                              onChange={(val) => {
                                setFormData({...formData, bodyFont: val});
                                handleSave({ bodyFont: val });
                              }} 
                              options={BODY_FONTS} 
                            />
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">AI Content (Hero & Footer)</h3>
                        <div className="grid gap-6">
                          <div className="grid grid-cols-[140px_1fr] items-start gap-4 pt-2">
                            <label className="text-sm font-semibold text-foreground/80 pt-2.5">Hero Title</label>
                            <textarea 
                              value={formData.heroTitle || ''}
                              onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                              onBlur={() => handleSave({ heroTitle: formData.heroTitle })}
                              placeholder="e.g. The Future of Commerce"
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground min-h-[80px] resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                            <label className="text-sm font-semibold text-foreground/80 pt-2.5">Hero Description</label>
                            <textarea 
                              value={formData.heroDescription || ''}
                              onChange={(e) => setFormData({...formData, heroDescription: e.target.value})}
                              onBlur={() => handleSave({ heroDescription: formData.heroDescription })}
                              placeholder="e.g. Agentic storefronts that understand your needs."
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground min-h-[100px] resize-none"
                            />
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                            <label className="text-sm font-semibold text-foreground/80 pt-2.5">Footer Text</label>
                            <textarea 
                              value={formData.footerDescription || ''}
                              onChange={(e) => setFormData({...formData, footerDescription: e.target.value})}
                              onBlur={() => handleSave({ footerDescription: formData.footerDescription })}
                              placeholder="e.g. Experience the future of commerce with Mia."
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground min-h-[80px] resize-none"
                            />
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">Preview</h3>
                        <div className="p-6 rounded-2xl border border-border-custom bg-foreground/[0.02] space-y-4">
                          <h1 style={{ fontFamily: formData.headingFont || 'serif', color: formData.primaryColor }} className="text-3xl font-medium">
                            Heading Preview
                          </h1>
                          <p style={{ fontFamily: formData.bodyFont || 'sans-serif' }} className="text-sm text-foreground/70 leading-relaxed">
                            This is how your store body text will look. Mia helps you build a brand that resonates with your customers through beautiful design and agentic commerce.
                          </p>
                          <button style={{ backgroundColor: formData.primaryColor }} className="px-6 py-2.5 rounded-lg text-white text-sm font-medium">
                            Primary Button
                          </button>
                        </div>
                      </section>
                    </div>
                  )}

                  {activeTab === 'Payments' && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <section>
                        <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">Bank Account Details</h3>
                        <div className="grid gap-6">
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Bank Name</label>
                            <CustomSelect 
                              value={formData.bankName || ''} 
                              onChange={(val) => {
                                setFormData({...formData, bankName: val});
                                handleSave({ bankName: val });
                              }} 
                              options={NIGERIAN_BANKS}
                              showSearch={true}
                              placeholder="Select Bank"
                            />
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Account Name</label>
                            <input 
                              type="text" 
                              value={formData.accountName || ''}
                              onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                              onBlur={() => handleSave({ accountName: formData.accountName })}
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                            />
                          </div>
                          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Account Number</label>
                            <input 
                              type="text" 
                              value={formData.accountNumber || ''}
                              onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                              onBlur={() => handleSave({ accountNumber: formData.accountNumber })}
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                            />
                          </div>
                        </div>
                      </section>
                    </div>
                  )}

                  {activeTab === 'Social' && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <section>
                        <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">Social Media Profiles</h3>
                        <div className="grid gap-6">
                          {[
                            { id: 'socialInstagram', label: 'Instagram', icon: 'https://cdn-icons-png.flaticon.com/128/1384/1384063.png', placeholder: 'instagram.com/username' },
                            { id: 'socialTwitter', label: 'Twitter / X', icon: 'https://cdn-icons-png.flaticon.com/128/3256/3256013.png', placeholder: 'twitter.com/username' },
                            { id: 'socialFacebook', label: 'Facebook', icon: 'https://cdn-icons-png.flaticon.com/128/5968/5968764.png', placeholder: 'facebook.com/username' },
                            { id: 'socialTiktok', label: 'TikTok', icon: 'https://cdn-icons-png.flaticon.com/128/3046/3046121.png', placeholder: 'tiktok.com/@username' },
                            { id: 'socialYoutube', label: 'YouTube', icon: 'https://cdn-icons-png.flaticon.com/128/1384/1384060.png', placeholder: 'youtube.com/@username' },
                            { id: 'socialSnapchat', label: 'Snapchat', icon: 'https://cdn-icons-png.flaticon.com/128/1409/1409941.png', placeholder: 'snapchat.com/add/username' },
                          ].map((platform) => (
                            <div key={platform.id} className="grid grid-cols-[140px_1fr] items-center gap-4">
                              <div className="flex items-center gap-2">
                                <img src={platform.icon} alt={platform.label} className="w-4 h-4 object-contain" />
                                <label className="text-sm font-semibold text-foreground/80">{platform.label}</label>
                              </div>
                              <input 
                                type="text" 
                                value={(formData as any)[platform.id] || ''}
                                onChange={(e) => setFormData({...formData, [platform.id]: e.target.value})}
                                onBlur={() => handleSave({ [platform.id]: (formData as any)[platform.id] })}
                                className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                                placeholder={platform.placeholder}
                              />
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-border-custom flex items-center justify-between bg-background">
            <div className="flex items-center gap-2">
              {isSaving && (
                <div className="flex items-center gap-2 text-accent animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs font-medium">Saving changes...</span>
                </div>
              )}
              {showSuccess && !isSaving && (
                <div className="flex items-center gap-2 text-green-500 animate-in fade-in slide-in-from-left-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-xs font-medium">All changes saved</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-sm font-medium text-foreground/60 hover:bg-foreground/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleSave(formData)}
                disabled={isSaving}
                className="px-6 py-2 rounded-xl text-sm font-bold bg-accent text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
