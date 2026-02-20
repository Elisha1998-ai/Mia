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
  Globe,
  Settings2,
  ChevronLeft
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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(false);
  const { settings, loading, fetchSettings, updateSettings } = useSettings();

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768 is the 'md' breakpoint in Tailwind
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Local state for form fields
  const [formData, setFormData] = React.useState<Partial<StoreSettings>>({});

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

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
      
      // Filter out fields that shouldn't be sent to the API
      const { id, userId, updatedAt, ...cleanData } = sectionData as any;
      
      await updateSettings(cleanData);
      // Update local state to reflect changes immediately
      setFormData(prev => ({ ...prev, ...sectionData }));
      
      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. The store domain might already be taken.');
    } finally {
      setIsSaving(false);
    }
  };

  const navItems = [
    { id: 'Account', icon: User, label: 'Account' },
    { id: 'Store', icon: Store, label: 'Store Settings' },
    { id: 'Design', icon: Palette, label: 'Store Design' },
    { id: 'SEO', icon: Globe, label: 'SEO & Meta' },
    { id: 'Payments', icon: CreditCard, label: 'Payments & Bank' },
    { id: 'Social', icon: Share2, label: 'Social Links' },
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100] md:block hidden" />
        <Dialog.Content className="fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-[850px] bg-background md:border border-border-custom md:rounded-2xl z-[101] overflow-hidden flex flex-col h-full md:h-[60vh] inset-0 md:inset-auto">
          
          {/* Header */}
          <div className="flex flex-col border-b border-border-custom bg-background sticky top-0 z-10">
            <div className="flex items-center justify-between p-4 md:p-5">
              <div className="flex items-center gap-4">
                <button onClick={onClose} className="md:hidden p-2 -ml-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <Dialog.Title className="text-lg font-bold text-foreground">Settings</Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button className="hidden md:block p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            
            {/* Search Bar - Mobile Only */}
            <div className="px-4 pb-4 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search settings..."
                  className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
            {/* Sidebar Navigation - Desktop Only */}
            <div className="hidden md:flex w-[220px] border-r border-border-custom p-3 flex-col bg-sidebar/50 shrink-0">
              <div className="flex flex-col gap-1 w-full">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      activeTab === item.id 
                        ? 'bg-foreground/10 text-foreground font-bold shadow-sm' 
                        : 'text-foreground/50 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${activeTab === item.id ? 'text-foreground' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-3 border-t border-border-custom/10">
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
            <div className="flex-1 overflow-y-auto p-5 md:p-8 scrollbar-hide bg-background">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : (
                <div className="max-w-[560px] mx-auto flex flex-col gap-12 pb-20 md:pb-0">
                  
                  {/* Account Section */}
                  {(searchQuery ? ['Account', 'Profile Information', 'Organization', 'Full Name', 'Email Address', 'Role'].some(term => term.toLowerCase().includes(searchQuery.toLowerCase())) : (isMobile || activeTab === 'Account')) && (
                    <>
                      <div id="Account" className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <section>
                        <div className="flex items-center gap-3 mb-4">
                          <User className="w-5 h-5 text-accent md:hidden" />
                          <h3 className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-wider">Profile Information</h3>
                        </div>
                        <div className="grid gap-4 md:gap-6">
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Full Name</label>
                            <input 
                              type="text" 
                              value={formData.adminName || ''}
                              onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                            />
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Email Address</label>
                            <input 
                              type="email" 
                              value={formData.adminEmail || ''}
                              onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                            />
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">Organization</h3>
                        <div className="grid gap-4 md:gap-6">
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Role</label>
                            <CustomSelect 
                              value={formData.adminRole || 'Store Owner'} 
                              onChange={(val) => {
                                setFormData({...formData, adminRole: val});
                              }} 
                              options={['Store Owner', 'Operations Manager', 'Agent Developer']} 
                            />
                          </div>
                        </div>
                      </section>
                    </div>
                  </>
                )}

                  {/* Store Section */}
                  {(searchQuery ? ['Store Settings', 'Store Configuration', 'AI Preferences', 'Store Name', 'Store Domain', 'Niche', 'WhatsApp Number', 'Address', 'Agent Tone'].some(term => term.toLowerCase().includes(searchQuery.toLowerCase())) : (isMobile || activeTab === 'Store')) && (
                    <>
                      {isMobile && !searchQuery && <div className="h-px bg-border-custom" />}
                      <div id="Store" className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <section>
                        <div className="flex items-center gap-3 mb-4">
                          <Store className="w-5 h-5 text-accent md:hidden" />
                          <h3 className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-wider">Store Configuration</h3>
                        </div>
                        <div className="grid gap-4 md:gap-6">
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Store Name</label>
                            <input 
                              type="text" 
                              value={formData.storeName || ''}
                              onChange={(e) => {
                                const newName = e.target.value;
                                setFormData({
                                  ...formData, 
                                  storeName: newName,
                                  storeDomain: slugify(newName)
                                });
                              }}
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                            />
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Store Domain</label>
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] md:text-sm text-foreground/40 font-medium shrink-0">bloume.shop/@</span>
                              <input 
                                type="text" 
                                value={formData.storeDomain || ''}
                                readOnly
                                className="flex-1 bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none text-foreground/60 cursor-not-allowed min-w-0"
                                placeholder="store-name"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Niche</label>
                            <CustomSelect 
                              value={formData.niche || ''} 
                              onChange={(val) => {
                                setFormData({...formData, niche: val});
                              }} 
                              options={NICHES}
                              showSearch={true}
                              placeholder="Select Niche"
                            />
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">WhatsApp Number</label>
                            <div className="relative">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-foreground/40 pointer-events-none">
                                +234
                              </div>
                              <input 
                                type="text" 
                                value={formData.storePhone || ''}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                  setFormData({...formData, storePhone: val});
                                }}
                                placeholder="8012345678"
                                className="w-full bg-input-bg border border-border-custom rounded-xl pl-14 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Address</label>
                            <input 
                              type="text" 
                              value={formData.storeAddress || ''}
                              onChange={(e) => setFormData({...formData, storeAddress: e.target.value})}
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                            />
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4">AI Preferences</h3>
                        <div className="grid gap-4 md:gap-6">
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Agent Tone</label>
                            <CustomSelect 
                              value={formData.aiTone || 'Professional & Helpful'} 
                              onChange={(val) => {
                                setFormData({...formData, aiTone: val});
                              }} 
                              options={['Professional & Helpful', 'Friendly & Casual', 'Bold & Creative', 'Luxury & Elegant']} 
                            />
                          </div>
                        </div>
                      </section>
                    </div>
                  </>
                )}

                  {/* Design Section */}
                  {(searchQuery ? ['Store Design', 'Brand Style Guide', 'Primary Color', 'Heading Font', 'Body Font'].some(term => term.toLowerCase().includes(searchQuery.toLowerCase())) : (isMobile || activeTab === 'Design')) && (
                    <>
                      {isMobile && !searchQuery && <div className="h-px bg-border-custom" />}
                      <div id="Design" className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <section>
                        <div className="flex items-center gap-3 mb-4">
                          <Palette className="w-5 h-5 text-accent md:hidden" />
                          <h3 className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-wider">Brand Style Guide</h3>
                        </div>
                        <div className="grid gap-4 md:gap-6">
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Primary Color</label>
                            <div className="flex items-center gap-4">
                              <div className="relative group shrink-0">
                                <input 
                                  type="color" 
                                  value={formData.primaryColor || '#000000'}
                                  onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                                  className="w-12 h-12 rounded-xl border border-border-custom cursor-pointer overflow-hidden bg-background p-1 hover:border-accent/40 transition-colors"
                                />
                                <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-inset ring-black/5" />
                              </div>
                              <div className="flex-1 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-foreground/30 font-mono">#</span>
                                <input 
                                  type="text" 
                                  value={(formData.primaryColor || '#000000').replace('#', '')}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '').slice(0, 6);
                                    setFormData({...formData, primaryColor: `#${val}`});
                                  }}
                                  className="w-full bg-input-bg border border-border-custom rounded-xl pl-8 pr-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Heading Font</label>
                            <CustomSelect 
                              value={formData.headingFont || 'Instrument Serif'} 
                              onChange={(val) => {
                                setFormData({...formData, headingFont: val});
                              }} 
                              options={HEADING_FONTS}
                              placeholder="Select Heading Font"
                            />
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Body Font</label>
                            <CustomSelect 
                              value={formData.bodyFont || 'Inter'} 
                              onChange={(val) => {
                                setFormData({...formData, bodyFont: val});
                              }} 
                              options={BODY_FONTS}
                              placeholder="Select Body Font"
                            />
                          </div>
                        </div>
                      </section>
                    </div>
                  </>
                )}

                  {/* SEO Section */}
                  {(searchQuery ? ['SEO & Meta', 'Search Engine Optimization', 'Meta Description', 'Social Preview Title'].some(term => term.toLowerCase().includes(searchQuery.toLowerCase())) : (isMobile || activeTab === 'SEO')) && (
                    <>
                      {isMobile && !searchQuery && <div className="h-px bg-border-custom" />}
                      <div id="SEO" className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <section>
                        <div className="flex items-center gap-3 mb-4">
                          <Globe className="w-5 h-5 text-accent md:hidden" />
                          <h3 className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-wider">Search Engine Optimization</h3>
                        </div>
                        <div className="grid gap-4 md:gap-6">
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80 md:mt-2">Meta Description</label>
                            <textarea 
                              value={formData.heroDescription || ''}
                              onChange={(e) => setFormData({...formData, heroDescription: e.target.value})}
                              rows={4}
                              placeholder="Enter a brief description of your store for search engines..."
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground resize-none"
                            />
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Social Preview Title</label>
                            <input 
                              type="text" 
                              value={formData.storeName || ''}
                              onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                              placeholder="e.g. Bloume Store | Best in Fashion"
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                            />
                          </div>
                        </div>
                      </section>
                    </div>
                  </>
                )}

                  {/* Payments Section */}
                  {(searchQuery ? ['Payments & Bank', 'Bank Account Details', 'Bank Name', 'Account Number', 'Account Name'].some(term => term.toLowerCase().includes(searchQuery.toLowerCase())) : (isMobile || activeTab === 'Payments')) && (
                    <>
                      {isMobile && !searchQuery && <div className="h-px bg-border-custom" />}
                      <div id="Payments" className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <section>
                        <div className="flex items-center gap-3 mb-4">
                          <CreditCard className="w-5 h-5 text-accent md:hidden" />
                          <div className="flex-1 flex items-center justify-between">
                            <h3 className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-wider">Bank Account Details</h3>
                            <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded-lg">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-[10px] font-bold text-green-500 uppercase">Settlement Active</span>
                            </div>
                          </div>
                        </div>
                        <div className="grid gap-4 md:gap-6">
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Bank Name</label>
                            <CustomSelect 
                              value={formData.bankName || ''} 
                              onChange={(val) => {
                                setFormData({...formData, bankName: val});
                              }} 
                              options={NIGERIAN_BANKS}
                              showSearch={true}
                              placeholder="Select Bank"
                            />
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Account Number</label>
                            <input 
                              type="text" 
                              value={formData.accountNumber || ''}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setFormData({...formData, accountNumber: val});
                              }}
                              placeholder="0123456789"
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground font-mono"
                            />
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Account Name</label>
                            <input 
                              type="text" 
                              value={formData.accountName || ''}
                              onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                              placeholder="EMMANUEL OKWARA"
                              className="w-full bg-input-bg border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground uppercase"
                            />
                          </div>
                        </div>
                      </section>
                    </div>
                  </>
                )}

                  {/* Social Section */}
                  {(searchQuery ? ['Social Links', 'Connect Social Media', 'Instagram', 'TikTok', 'Twitter', 'X'].some(term => term.toLowerCase().includes(searchQuery.toLowerCase())) : (isMobile || activeTab === 'Social')) && (
                    <>
                      {isMobile && !searchQuery && <div className="h-px bg-border-custom" />}
                      <div id="Social" className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <section>
                        <div className="flex items-center gap-3 mb-4">
                          <Share2 className="w-5 h-5 text-accent md:hidden" />
                          <h3 className="text-xs md:text-sm font-bold text-foreground/40 uppercase tracking-wider">Connect Social Media</h3>
                        </div>
                        <div className="grid gap-4 md:gap-6">
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Instagram</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-foreground/30">@</span>
                              <input 
                                type="text" 
                                value={formData.socialInstagram || ''}
                                onChange={(e) => setFormData({...formData, socialInstagram: e.target.value})}
                                placeholder="username"
                                className="w-full bg-input-bg border border-border-custom rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">TikTok</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-foreground/30">@</span>
                              <input 
                                type="text" 
                                value={formData.socialTiktok || ''}
                                onChange={(e) => setFormData({...formData, socialTiktok: e.target.value})}
                                placeholder="username"
                                className="w-full bg-input-bg border border-border-custom rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                            <label className="text-sm font-semibold text-foreground/80">Twitter (X)</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-foreground/30">@</span>
                              <input 
                                type="text" 
                                value={formData.socialTwitter || ''}
                                onChange={(e) => setFormData({...formData, socialTwitter: e.target.value})}
                                placeholder="username"
                                className="w-full bg-input-bg border border-border-custom rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Sign Out Button - Mobile Only */}
                      <div className="md:hidden mt-4 pt-6 border-t border-border-custom">
                        <button
                          onClick={() => logout()}
                          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-all border border-red-500/10"
                        >
                          <LogOut className="w-5 h-5" />
                          Sign Out of Account
                        </button>
                      </div>
                    </div>
                  </>
                )}

                  {/* Empty Search State */}
                  {searchQuery && ![
                    'Account', 'Profile Information', 'Organization', 'Full Name', 'Email Address', 'Role',
                    'Store Settings', 'Store Configuration', 'AI Preferences', 'Store Name', 'Store Domain', 'Niche', 'WhatsApp Number', 'Address', 'Agent Tone',
                    'Store Design', 'Brand Style Guide', 'Primary Color', 'Heading Font', 'Body Font',
                    'SEO & Meta', 'Search Engine Optimization', 'Meta Description', 'Social Preview Title',
                    'Payments & Bank', 'Bank Account Details', 'Bank Name', 'Account Number', 'Account Name',
                    'Social Links', 'Connect Social Media', 'Instagram', 'TikTok', 'Twitter', 'X'
                  ].some(term => term.toLowerCase().includes(searchQuery.toLowerCase())) && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-foreground/20" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground">No settings found</h4>
                      <p className="text-xs text-foreground/40 mt-1">Try searching for something else</p>
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
