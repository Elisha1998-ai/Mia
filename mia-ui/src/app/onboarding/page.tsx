"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Store, 
  CreditCard, 
  Share2, 
  ArrowRight, 
  ArrowLeft, 
  Check,
  Loader2,
  Sparkles,
  Sun,
  Moon,
  Search,
  ChevronDown,
  X,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Music,
  Video
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import * as Dialog from "@radix-ui/react-dialog";
import { saveOnboardingData, checkOnboardingStatus } from "@/actions/onboarding";
import Link from "next/link";

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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-input-bg border border-border-custom rounded-lg px-3.5 py-2.5 text-sm text-foreground hover:border-foreground/20 transition-all"
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
                  className="w-full bg-transparent pl-7 pr-2 py-2 text-sm outline-none placeholder:text-foreground/30 text-foreground border-none focus:ring-0"
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto scrollbar-hide">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
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

export default function OnboardingPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isDarkMode = resolvedTheme === "dark";

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const [formData, setFormData] = useState({
    storeName: "",
    storeSlug: "",
    niche: "",
    storeAddress: "",
    storePhone: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
    socialInstagram: "",
    socialTwitter: "",
    socialFacebook: "",
    socialTiktok: "",
    socialYoutube: "",
    socialSnapchat: "",
    firstName: "",
    lastName: "",
  });

  const [nicheSearch, setNicheSearch] = useState("");
  const [isNicheOpen, setIsNicheOpen] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateUrl = (name: string, value: string) => {
    if (!value) return "";
    
    const patterns: Record<string, RegExp> = {
      socialInstagram: /^(https?:\/\/)?(www\.)?instagram\.com\/@?[a-zA-Z0-9._]+\/?$/,
      socialTwitter: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/@?[a-zA-Z0-9_]+\/?$/,
      socialFacebook: /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
      socialTiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\/@[a-zA-Z0-9._]+\/?$/,
      socialYoutube: /^(https?:\/\/)?(www\.)?youtube\.com\/(@|c\/|channel\/|user\/)?[a-zA-Z0-9_-]+\/?$/,
      socialSnapchat: /^(https?:\/\/)?(www\.)?snapchat\.com\/add\/[a-zA-Z0-9._]+\/?$/,
    };

    const pattern = patterns[name];
    if (pattern && !pattern.test(value)) {
      return `Invalid ${name.replace('social', '')} URL format`;
    }
    return "";
  };

  const filteredNiches = NICHES.filter(n => 
    n.toLowerCase().includes(nicheSearch.toLowerCase())
  );

  const filteredBanks = NIGERIAN_BANKS.filter(b => 
    b.toLowerCase().includes(bankSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".combobox-container")) {
        setIsNicheOpen(false);
        setIsBankOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalSteps = 3;

  useEffect(() => {
    setMounted(true);
    
    // Check if already completed
    async function checkStatus() {
      const { completed } = await checkOnboardingStatus();
      if (completed) {
        router.push("/dashboard");
      }
    }
    checkStatus();
  }, [router]);

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "storeName") {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value,
        storeSlug: generateSlug(value)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Validate URLs in real-time
    if (name.startsWith('social')) {
      const error = validateUrl(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const nextStep = () => {
    // Validate all social fields before moving from step 3 (though step 3 is the last step)
    if (step === 3) {
      const newErrors: Record<string, string> = {};
      let hasError = false;
      
      ['socialInstagram', 'socialTwitter', 'socialFacebook', 'socialTiktok', 'socialYoutube', 'socialSnapchat'].forEach(field => {
        const error = validateUrl(field, formData[field as keyof typeof formData]);
        if (error) {
          newErrors[field] = error;
          hasError = true;
        }
      });
      
      if (hasError) {
        setErrors(newErrors);
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation for all social links
    if (step === totalSteps) {
      const newErrors: Record<string, string> = {};
      let hasError = false;
      
      ['socialInstagram', 'socialTwitter', 'socialFacebook', 'socialTiktok', 'socialYoutube', 'socialSnapchat'].forEach(field => {
        const error = validateUrl(field, formData[field as keyof typeof formData]);
        if (error) {
          newErrors[field] = error;
          hasError = true;
        }
      });
      
      if (hasError) {
        setErrors(newErrors);
        // Find first error field and scroll to it if needed
        return;
      }
    }

    if (step < totalSteps) {
      nextStep();
      return;
    }

    setIsLoading(true);
    try {
      const result = await saveOnboardingData(formData);
      if (result.success) {
        router.push("/dashboard");
      } else {
        alert(result.error || "Failed to save onboarding data");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const progress = (step / totalSteps) * 100;

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300 relative" suppressHydrationWarning>
      {/* Progress Bar - Top Most */}
      <div className="absolute top-0 left-0 w-full h-1 z-50">
        <div className="w-full h-full bg-border-custom/30">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Left Side - Onboarding Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-12 relative justify-center">
        {/* Top Navigation */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to landing page
          </Link>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-3 transition-all group hover:opacity-70 active:scale-95"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-foreground group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-6 h-6 text-foreground group-hover:-rotate-12 transition-transform" />
            )}
          </button>
        </div>

        <div className="max-w-[440px] w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold mb-2 tracking-tight">
              Introduce Mia to your business
            </h1>
            <p className="text-muted-foreground text-sm">
              Step {step} of {totalSteps}: {
                step === 1 ? "Configure your store" :
                step === 2 ? "Set up payments" :
                "Connect socials"
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="min-h-[280px] relative z-0">
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2.5">
                      <label className="text-sm font-medium">Store Name</label>
                      <input
                        required
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleChange}
                        placeholder="Mia Electronics"
                        className="w-full px-3.5 py-2.5 bg-input-bg border border-border-custom rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-muted-foreground/30"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-sm font-medium">Store URL</label>
                      <div className="relative group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-sm select-none">
                          bloume.shop/@
                        </div>
                        <input
                          readOnly
                          value={formData.storeSlug}
                          className="w-full pl-[125px] pr-3.5 py-2.5 bg-input-bg/50 border border-border-custom rounded-lg outline-none transition-all text-sm text-muted-foreground cursor-default"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground/60 italic ml-1">
                        Auto-generated from your store name
                      </p>
                    </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2.5 relative">
                      <label className="text-sm font-medium text-foreground">Niche</label>
                      <CustomSelect 
                        value={formData.niche} 
                        onChange={(val) => setFormData(prev => ({ ...prev, niche: val }))} 
                        options={NICHES}
                        showSearch={true}
                        placeholder="Select Niche"
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-sm font-medium">Whatsapp Number</label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-foreground/40 pointer-events-none">
                          +234
                        </div>
                        <input
                          required
                          name="storePhone"
                          value={formData.storePhone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData(prev => ({ ...prev, storePhone: val }));
                          }}
                          placeholder="8012345678"
                          className="w-full pl-14 pr-3.5 py-2.5 bg-input-bg border border-border-custom rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-muted-foreground/30"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-sm font-medium">Store Address</label>
                    <input
                      required
                      name="storeAddress"
                      value={formData.storeAddress}
                      onChange={handleChange}
                      placeholder="Business location"
                      className="w-full px-3.5 py-2.5 bg-input-bg border border-border-custom rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-muted-foreground/30"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="space-y-2.5 relative">
                    <label className="text-sm font-medium text-foreground">Bank Name</label>
                    <CustomSelect 
                      value={formData.bankName} 
                      onChange={(val) => setFormData(prev => ({ ...prev, bankName: val }))} 
                      options={NIGERIAN_BANKS}
                      showSearch={true}
                      placeholder="Select Bank"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-sm font-medium">Account Name</label>
                    <input
                      required
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleChange}
                      placeholder="Account holder name"
                      className="w-full px-3.5 py-2.5 bg-input-bg border border-border-custom rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-muted-foreground/30"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-sm font-medium">Account Number</label>
                    <input
                      required
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="0000000000"
                      className="w-full px-3.5 py-2.5 bg-input-bg border border-border-custom rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all placeholder:text-muted-foreground/30"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/128/1409/1409946.png" 
                    alt="Instagram" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <input
                  name="socialInstagram"
                  value={formData.socialInstagram}
                  onChange={handleChange}
                  placeholder="instagram.com/@username"
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-input-bg border rounded-lg focus:ring-2 outline-none transition-all placeholder:text-muted-foreground/30 text-sm ${
                    errors.socialInstagram 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' 
                      : 'border-border-custom focus:border-accent focus:ring-accent/20'
                  }`}
                />
              </div>
                  <div className="relative">
                       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                         <img 
                           src="https://cdn-icons-png.flaticon.com/128/5968/5968830.png" 
                           alt="X (Twitter)" 
                           className="w-full h-full object-contain"
                         />
                       </div>
                       <input
                         name="socialTwitter"
                         value={formData.socialTwitter}
                         onChange={handleChange}
                         placeholder="x.com/@username"
                         className={`w-full pl-10 pr-3.5 py-2.5 bg-input-bg border rounded-lg focus:ring-2 outline-none transition-all placeholder:text-muted-foreground/30 text-sm ${
                           errors.socialTwitter 
                             ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' 
                             : 'border-border-custom focus:border-accent focus:ring-accent/20'
                         }`}
                       />
                     </div>
                     <div className="relative">
                       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                         <img 
                           src="https://cdn-icons-png.flaticon.com/128/5968/5968764.png" 
                           alt="Facebook" 
                           className="w-full h-full object-contain"
                         />
                       </div>
                       <input
                         name="socialFacebook"
                         value={formData.socialFacebook}
                         onChange={handleChange}
                         placeholder="facebook.com/username"
                         className={`w-full pl-10 pr-3.5 py-2.5 bg-input-bg border rounded-lg focus:ring-2 outline-none transition-all placeholder:text-muted-foreground/30 text-sm ${
                           errors.socialFacebook 
                             ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' 
                             : 'border-border-custom focus:border-accent focus:ring-accent/20'
                         }`}
                       />
                     </div>
                     <div className="relative">
                       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                         <img 
                           src="https://cdn-icons-png.flaticon.com/128/2504/2504942.png" 
                           alt="TikTok" 
                           className="w-full h-full object-contain"
                         />
                       </div>
                       <input
                         name="socialTiktok"
                         value={formData.socialTiktok}
                         onChange={handleChange}
                         placeholder="tiktok.com/@username"
                         className={`w-full pl-10 pr-3.5 py-2.5 bg-input-bg border rounded-lg focus:ring-2 outline-none transition-all placeholder:text-muted-foreground/30 text-sm ${
                           errors.socialTiktok 
                             ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' 
                             : 'border-border-custom focus:border-accent focus:ring-accent/20'
                         }`}
                       />
                     </div>
                     <div className="relative">
                       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                         <img 
                           src="https://cdn-icons-png.flaticon.com/128/1384/1384060.png" 
                           alt="YouTube" 
                           className="w-full h-full object-contain"
                         />
                       </div>
                       <input
                         name="socialYoutube"
                         value={formData.socialYoutube}
                         onChange={handleChange}
                         placeholder="youtube.com/@username"
                         className={`w-full pl-10 pr-3.5 py-2.5 bg-input-bg border rounded-lg focus:ring-2 outline-none transition-all placeholder:text-muted-foreground/30 text-sm ${
                           errors.socialYoutube 
                             ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' 
                             : 'border-border-custom focus:border-accent focus:ring-accent/20'
                         }`}
                       />
                     </div>
                     <div className="relative">
                       <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                         <img 
                           src="https://cdn-icons-png.flaticon.com/128/1409/1409941.png" 
                           alt="Snapchat" 
                           className="w-full h-full object-contain"
                         />
                       </div>
                       <input
                         name="socialSnapchat"
                         value={formData.socialSnapchat}
                         onChange={handleChange}
                         placeholder="snapchat.com/add/username"
                         className={`w-full pl-10 pr-3.5 py-2.5 bg-input-bg border rounded-lg focus:ring-2 outline-none transition-all placeholder:text-muted-foreground/30 text-sm ${
                           errors.socialSnapchat 
                             ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/10' 
                             : 'border-border-custom focus:border-accent focus:ring-accent/20'
                         }`}
                       />
                     </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 flex items-center justify-center gap-2 bg-sidebar border border-border-custom py-2.5 rounded-lg font-semibold hover:opacity-80 transition-all border-b-2 border-black/10 dark:border-white/10 active:border-b-0 active:translate-y-[1px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center gap-2 bg-accent text-background py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all border-b-2 border-black/20 dark:border-white/20 active:border-b-0 active:translate-y-[1px] disabled:opacity-50`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : step === totalSteps ? (
                  <>
                    Complete
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground px-8">
            By completing this setup, you allow Mia to use this information to personalize your business experience.
          </p>
        </div>
      </div>

      {/* Right Side - Visual Frame */}
      <div className="hidden lg:flex lg:w-1/2 p-[5px]">
        <div className="w-full h-full bg-sidebar rounded-tl-[32px] rounded-bl-[32px] transition-colors duration-300 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
          {/* Animated Background Orbs */}
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-accent/5 rounded-full blur-[100px] animate-pulse duration-3000" />
        </div>
      </div>
    </div>
  );
}
