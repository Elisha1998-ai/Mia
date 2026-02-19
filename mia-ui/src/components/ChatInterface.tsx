"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, User, Bot, Sparkles, Plus, ArrowUp, ChevronDown, Copy, Reply, Check, Loader2, FileText, ChevronUp, Download, Eye, ExternalLink, X, Edit2, Save, Layout } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSettings } from '@/hooks/useData';
import { useNotificationLogic } from '@/hooks/useNotificationLogic';
import { NotificationCard } from './NotificationCard';

interface Widget {
  type: 'invoice' | 'document' | 'link' | 'store_preview';
  title?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  url?: string;
  storeName?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  steps?: string[];
  assets?: any[];
  intent?: string;
  template_data?: any;
  products?: any[];
  isComplete?: boolean;
  widgets?: Widget[];
}

const WidgetModal = ({ widget, onClose }: { widget: Widget, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-border-custom w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-border-custom flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-foreground/90">{widget.title}</h3>
              <p className="text-xs text-foreground/40">{widget.type.toUpperCase()}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-foreground/40" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 bg-foreground/[0.02] min-h-[400px] flex items-center justify-center">
          {widget.type === 'invoice' ? (
            widget.url ? (
               <div className="w-full h-full min-h-[600px] flex flex-col gap-4">
                  <div className="flex justify-end gap-2">
                     <a href={widget.url} download target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm">
                        <Download className="w-4 h-4" /> Download PDF
                     </a>
                  </div>
                  <iframe src={widget.url} className="w-full h-full flex-1 rounded-lg border border-border-custom min-h-[500px]" title="Invoice PDF" />
               </div>
            ) : (
            <div className="bg-background text-foreground p-8 w-full max-w-md shadow-lg rounded-sm font-mono text-[10px] space-y-4 border border-border-custom">
              <div className="flex justify-between border-b border-border-custom pb-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-tighter">Mia Storefront</h2>
                  <p>123 Design Avenue</p>
                </div>
                <div className="text-right">
                  <h2 className="text-sm font-bold uppercase tracking-tighter">Invoice</h2>
                  <p>#INV-2026-001</p>
                </div>
              </div>
              <div className="space-y-1">
                <p><strong>Bill To:</strong> HomePC</p>
                <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              </div>
              <table className="w-full border-t border-b border-border-custom py-2">
                <thead>
                  <tr className="text-left border-b border-border-custom">
                    <th className="py-1">Description</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">Storefront Design Implementation</td>
                    <td className="text-right">₦499.00</td>
                  </tr>
                  <tr>
                    <td className="py-2">Product Catalog Setup</td>
                    <td className="text-right">₦150.00</td>
                  </tr>
                </tbody>
              </table>
              <div className="text-right pt-2">
                <p className="text-xs font-bold">Total: ₦649.00</p>
              </div>
            </div>
            )
          ) : widget.type === 'document' ? (
            <div className="bg-background text-foreground p-10 w-full max-w-2xl shadow-xl rounded-sm border border-border-custom min-h-[500px]">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{widget.description}</ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-foreground/5 mx-auto flex items-center justify-center">
                <FileText className="w-10 h-10 text-foreground/10" />
              </div>
              <p className="text-sm text-foreground/40 italic">Preview for {widget.type} is coming soon...</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-border-custom bg-background flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            Close
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
            <Download className="w-4 h-4" /> Download {widget.type}
          </button>
        </div>
      </div>
    </div>
  );
};

const ThinkingState = () => (
  <div className="flex items-center gap-2 py-2 px-1 text-sm text-foreground/50 font-medium">
    <Loader2 className="w-4 h-4 animate-spin text-accent" />
    <span className="animate-pulse">Thinking...</span>
  </div>
);

const ThinkingProcess = ({ steps, isComplete, onComplete }: { steps: string[], isComplete?: boolean, onComplete?: () => void }) => {
  const [currentStep, setCurrentStep] = useState(isComplete ? steps.length : 0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isComplete) {
      setCurrentStep(steps.length);
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length) {
          const next = prev + 1;
          if (next === steps.length) {
            clearInterval(interval);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 800);
          }
          return next;
        }
        return prev;
      });
    }, 2500); // Slower, more natural reading pace

    return () => clearInterval(interval);
  }, [steps.length, isComplete, onComplete]);

  return (
    <div className="my-8 w-full max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-5">
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const isFinished = idx < currentStep;
            const isActive = idx === currentStep;
            const isWaiting = idx > currentStep;

            if (isWaiting && !isComplete) return null;

            return (
              <div 
                key={idx} 
                className={`flex gap-4 transition-all duration-500 ${isFinished ? 'opacity-50' : 'opacity-100'}`}
              >
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 ${
                    isFinished 
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                      : isActive 
                        ? 'bg-accent/10 border-accent/20 text-accent animate-pulse' 
                        : 'bg-transparent border-foreground/10 text-foreground/20'
                  }`}>
                    {isFinished ? (
                      <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-accent' : 'bg-foreground/20'}`} />
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-[1px] h-full my-1 transition-colors duration-500 ${isFinished ? 'bg-emerald-500/20' : 'bg-foreground/5'}`} />
                  )}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className={`text-sm leading-relaxed transition-all duration-500 ${
                    isFinished 
                      ? 'text-foreground/50' 
                      : isActive 
                        ? 'text-foreground font-medium' 
                        : 'text-foreground/20'
                  }`}>
                    {step}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const DocumentCanvas = ({ widget }: { widget: Widget }) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(widget.description || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (isCollapsed) {
    return (
      <div 
        onClick={() => setIsCollapsed(false)}
        className="my-4 flex items-center gap-4 p-4 border border-border-custom rounded-2xl bg-background hover:border-accent/30 transition-all cursor-pointer group shadow-sm max-w-xl w-full"
      >
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-foreground/80 truncate">{widget.title || 'Document Canvas'}</h4>
          <p className="text-xs text-foreground/40 mt-0.5">Click to expand document</p>
        </div>
        <ChevronDown className="w-5 h-5 text-foreground/20 group-hover:text-foreground/40 transition-colors" />
      </div>
    );
  }

  return (
    <div className="my-6 border border-border-custom/50 dark:border-border-custom/20 rounded-2xl bg-foreground/[0.05] dark:bg-foreground/[0.1] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700 max-w-4xl w-full border-t-4 border-t-accent/20">
      {/* Canvas Header */}
      <div className="px-6 py-4 border-b border-border-custom flex items-center justify-between bg-foreground/[0.02] backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 hover:bg-foreground/5 rounded-lg transition-colors group"
            title="Collapse document"
          >
            <ChevronUp className="w-4 h-4 text-foreground/40 group-hover:text-foreground" />
          </button>
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">{widget.title || 'Document Canvas'}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleCopy}
            className="text-[11px] font-bold text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3 h-3 text-accent" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`text-[11px] font-bold transition-colors flex items-center gap-1.5 ${isEditing ? 'text-accent' : 'text-foreground/40 hover:text-foreground'}`}
          >
            <Edit2 className="w-3 h-3" />
            {isEditing ? 'Preview' : 'Edit'}
          </button>
          <button 
            onClick={handleSave}
            className="text-[11px] font-bold text-foreground/40 hover:text-foreground transition-colors flex items-center gap-1.5"
          >
            {isSaved ? <Check className="w-3 h-3 text-accent" /> : <Save className="w-3 h-3" />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Canvas Content */}
      <div className="p-8 md:p-12 text-foreground/90 min-h-[400px]">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[600px] bg-transparent border-none outline-none resize-none font-sans text-[16px] leading-relaxed text-foreground/80 selection:bg-accent/20 placeholder:text-foreground/20"
            placeholder="Start typing your document..."
            autoFocus
          />
        ) : (
          <div className="markdown-content max-w-none">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-8 tracking-tight text-foreground border-b border-border-custom pb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-12 mb-6 tracking-tight text-foreground border-l-4 border-accent/30 pl-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-8 mb-4 tracking-tight text-foreground/90" {...props} />,
                p: ({node, ...props}) => <p className="text-[16px] leading-relaxed mb-6 text-foreground/70" {...props} />,
                ul: ({node, ...props}) => <ul className="space-y-3 mb-8 ml-4 list-disc marker:text-accent" {...props} />,
                li: ({node, ...props}) => <li className="text-[16px] text-foreground/70 pl-2" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatWidget = ({ widget, onPreview }: { widget: Widget, onPreview?: (w: Widget) => void }) => {
  const handleWhatsAppShare = (widget: Widget) => {
    // Basic WhatsApp share link - in a real app, you'd probably want to share a hosted PDF link
    const text = `Hi, here is your invoice for ${widget.title}: ${widget.description.substring(0, 100)}...`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="my-3 flex items-center gap-4 p-4 border border-border-custom/50 dark:border-border-custom/20 rounded-2xl bg-foreground/[0.05] dark:bg-foreground/[0.1] hover:border-accent/30 transition-all cursor-pointer group shadow-sm">
      <div className="w-16 h-16 rounded-xl bg-foreground/5 flex-shrink-0 flex items-center justify-center overflow-hidden border border-foreground/5 group-hover:bg-accent/5 transition-colors">
        {widget.imageUrl ? (
          <img src={widget.imageUrl} alt="" className="w-full h-full object-cover" />
        ) : widget.type === 'store_preview' ? (
          <Layout className="w-7 h-7 text-accent/60 group-hover:text-accent transition-colors" />
        ) : (
          <FileText className="w-7 h-7 text-foreground/20 group-hover:text-accent/40 transition-colors" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-foreground/80 truncate">
          {widget.type === 'store_preview' ? `Store Preview: ${widget.storeName}` : widget.title}
        </h4>
        <p className="text-xs text-foreground/40 mt-0.5 line-clamp-2 leading-relaxed">
          {widget.type === 'store_preview' ? 'Click to preview your newly built storefront and check out the design.' : widget.description}
        </p>
      </div>
      
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {widget.type === 'invoice' && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); onPreview?.(widget); }}
              className="p-2 rounded-lg bg-foreground/5 text-foreground/40 hover:text-accent hover:bg-accent/10 transition-all"
              title="Preview invoice"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleWhatsAppShare(widget); }}
              className="p-2 rounded-lg bg-foreground/5 text-foreground/40 hover:text-accent hover:bg-accent/10 transition-all"
              title="Share on WhatsApp"
            >
              <Send className="w-4 h-4" />
            </button>
          </>
        )}
        
        {widget.type === 'link' && (
          <a 
            href={widget.link} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg bg-foreground/5 text-foreground/40 hover:text-accent hover:bg-accent/10 transition-all"
            title="Open link"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

        {widget.type === 'store_preview' && (
          <a 
            href={widget.url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent text-white hover:bg-accent/90 transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-accent/20"
          >
            Preview Store <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};


const StorefrontWireframe = ({ template, products }: { template: any, products: any[] }) => {
  return (
    <div className="mt-6 border border-border-custom rounded-xl overflow-hidden bg-background shadow-2xl">
      {/* Hero Section */}
      <div className="h-32 bg-accent/5 flex flex-col items-center justify-center p-4 text-center border-b border-border-custom">
        <h3 className="text-lg font-bold text-foreground/90">{template?.copy_fields?.hero_title}</h3>
        <p className="text-[10px] text-foreground/50 mt-1">{template?.copy_fields?.hero_subtitle}</p>
      </div>
      
      {/* Product Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => {
          const product = products?.[i - 1];
          return (
            <div key={i} className="space-y-2">
              <div className="aspect-[4/5] bg-foreground/5 rounded-lg flex items-center justify-center border border-dashed border-foreground/10 group hover:border-accent/30 transition-colors">
                {product ? (
                   <span className="text-[10px] text-foreground/20 font-medium">Image Frame</span>
                ) : (
                  <Sparkles className="w-4 h-4 text-foreground/10" />
                )}
              </div>
              <div className="space-y-1">
                <div className="h-2.5 w-3/4 bg-foreground/10 rounded animate-pulse" />
                <div className="h-2 w-1/2 bg-foreground/5 rounded animate-pulse" />
              </div>
              {product && (
                <div className="pt-1">
                  <p className="text-[10px] font-bold text-foreground/80">{product.name}</p>
                  <p className="text-[9px] text-accent">₦{product.price}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* About Section */}
      <div className="p-4 bg-foreground/5 text-center">
        <h4 className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest">{template?.copy_fields?.about_title}</h4>
        <p className="text-[9px] text-foreground/50 mt-2 italic">"{template?.copy_fields?.about_content}"</p>
      </div>
    </div>
  );
};

interface ChatInterfaceProps {
  messages: Message[];
  onSend: (content: string) => void;
  isLoading: boolean;
  onMessageComplete?: (idx: number) => void;
  onTriggerDemo?: () => void;
}

export const ChatInterface = ({ messages, onSend, isLoading, onMessageComplete, onTriggerDemo }: ChatInterfaceProps) => {
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [greeting, setGreeting] = useState('Hello');
  const [activePreviewWidget, setActivePreviewWidget] = useState<Widget | null>(null);
  const { settings, fetchSettings } = useSettings();
  const { notifications } = useNotificationLogic();
  const [showNotification, setShowNotification] = useState(false);
  const [isNotificationCollapsed, setIsNotificationCollapsed] = useState(false);
  const [notificationIndex, setNotificationIndex] = useState(0);
  const router = useRouter();

  // Reset index when notifications change to ensure we don't go out of bounds
  // Only show notifications if there are actual notifications
  useEffect(() => {
    if (notifications.length > 0) {
      setNotificationIndex(0);
      setShowNotification(true);
    } else {
      setShowNotification(false);
    }
  }, [notifications.length]);

  const currentNotification = notifications.length > 0 ? notifications[notificationIndex] : null;

  const handleNotificationClose = () => {
    if (notifications.length <= 1) {
      setShowNotification(false);
      return;
    }
    
    setShowNotification(false);
    setTimeout(() => {
      setNotificationIndex((prev) => (prev + 1) % notifications.length);
      setShowNotification(true);
      setIsNotificationCollapsed(false);
    }, 1500);
  };

  const handleNotificationAction = (actionId: string) => {
    console.log('Action triggered:', actionId);
    
    if (actionId === 'connect-store') {
      router.push('/onboarding');
    } else if (actionId.includes('stock') || actionId.includes('product') || (actionId.startsWith('view-') && !actionId.includes('order') && !actionId.includes('profile'))) {
      // Navigate to product page or store
      const parts = actionId.split('-');
      const id = parts.length > 1 ? parts[parts.length - 1] : null;
      if (id) {
        router.push(`/store/products/${id}`);
      } else {
        router.push('/store');
      }
    } else if (actionId.includes('order') || actionId === 'send_reminder') {
      // Redirect to orders page
      router.push('/orders');
    } else if (actionId.includes('offer') || actionId.includes('email') || actionId.includes('profile')) {
      // Redirect to dashboard/customers
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReply = (text: string) => {
    setInput(prev => prev + `\n> ${text.slice(0, 50)}${text.length > 50 ? '...' : ''}\n`);
  };

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      const username = settings?.adminName?.split(' ')[0] || "there";
      const greetings = [
        `Hello ${username}`,
        "What's up today?"
      ];
      
      // Add time-based greeting
      if (hour < 12) greetings.unshift(`Good morning ${username}`);
      else if (hour < 18) greetings.unshift(`Good afternoon ${username}`);
      else greetings.unshift(`Good evening ${username}`);

      // Pick random greeting (weighted towards time-based)
      const random = Math.random();
      if (random < 0.6) {
        setGreeting(greetings[0]); // 60% chance for time-based
      } else {
        setGreeting(greetings[Math.floor(Math.random() * (greetings.length - 1)) + 1]);
      }
    };

    updateGreeting();
    // Update every minute
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, [settings]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent ${messages.length > 0 ? 'pb-64' : ''}`}>
        <div className={`max-w-3xl mx-auto w-full space-y-6 ${messages.length === 0 ? 'h-full flex flex-col justify-center' : ''}`}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
            <div className="space-y-2 max-w-lg">
              <h2 className="text-xl md:text-4xl font-sans font-medium text-foreground/90 tracking-tight">
                {greeting}
              </h2>
            </div>
            
            <div className="w-full space-y-4">
              <div className="w-full relative group flex flex-col items-center">
                {showNotification && currentNotification && (
                  <div className="w-full z-10 -mb-[1px]">
                    <NotificationCard
                      type={currentNotification.type}
                      title={currentNotification.title}
                      description=""
                      timestamp={currentNotification.timestamp}
                      isVisible={showNotification}
                      isCollapsed={isNotificationCollapsed}
                      onToggleCollapse={() => setIsNotificationCollapsed(!isNotificationCollapsed)}
                      onClose={handleNotificationClose}
                      actions={currentNotification.actions.map(action => ({
                        label: action.label,
                        onClick: () => handleNotificationAction(action.actionId),
                        variant: action.variant
                      }))}
                    />
                  </div>
                )}
                <form onSubmit={handleSubmit} className={`w-full bg-input-bg border-x border-b border-border-custom focus-within:border-foreground/10 transition-all ${showNotification && !isNotificationCollapsed ? 'rounded-b-3xl rounded-t-none border-t-0' : 'rounded-3xl border-t' } p-3`}>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type / for commands"
                    className="w-full bg-transparent border-none outline-none text-lg text-foreground/90 placeholder-foreground/40 resize-none min-h-[60px] px-2 pt-1"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <div className="flex items-center justify-between mt-1 px-1">
                    <button type="button" className="p-1.5 text-foreground/50 hover:text-foreground/70 hover:bg-foreground/5 rounded-xl transition-all">
                      <Plus className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <button type="button" className="flex items-center gap-2 px-2.5 py-1 text-xs text-foreground/50 hover:text-foreground/70 hover:bg-foreground/5 rounded-lg transition-all border border-border-custom">
                        Mia 2.0 <ChevronDown className="w-3 h-3" />
                      </button>
                      <button 
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="p-1.5 bg-accent/80 hover:bg-accent text-white rounded-xl transition-all shadow-lg disabled:opacity-30"
                      >
                        <ArrowUp className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-6 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div 
                 className={`py-2.5 px-4 rounded-2xl text-sm leading-relaxed relative group/msg ${
                   m.role === 'user' 
                     ? 'bg-foreground/[0.05] dark:bg-foreground/[0.1] text-foreground/80' 
                     : 'bg-transparent text-foreground/80'
                 }`}
               >
                {/* Action Buttons */}
                <div className={`absolute -top-3 ${m.role === 'user' ? '-left-16' : '-right-16'} flex flex-row gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity`}>
                  <button 
                    onClick={() => handleCopy(m.content, idx)}
                    className="p-1.5 rounded-lg bg-background border border-border-custom text-foreground/40 hover:text-accent transition-colors shadow-sm"
                    title="Copy message"
                  >
                    {copiedId === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    onClick={() => handleReply(m.content)}
                    className="p-1.5 rounded-lg bg-background border border-border-custom text-foreground/40 hover:text-accent transition-colors shadow-sm"
                    title="Reply to message"
                  >
                    <Reply className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Task Performing State / Steps - SHOWN BEFORE CONTENT */}
                {m.steps && m.steps.length > 0 && (
                  <ThinkingProcess 
                    steps={m.steps} 
                    isComplete={m.isComplete} 
                    onComplete={() => onMessageComplete?.(idx)} 
                  />
                )}

                {/* Content - ONLY SHOWN AFTER STEPS ARE COMPLETE (OR IF NO STEPS) */}
                {(m.isComplete || !m.steps || m.steps.length === 0) && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-500">
                    <div className="markdown-content">
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-foreground" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-md font-bold mb-1" {...props} />,
                          code: ({node, inline, ...props}: any) => (
                            <code className={`${inline ? 'bg-foreground/10 px-1 rounded' : 'block bg-foreground/10 p-2 rounded-lg my-2 overflow-x-auto'}`} {...props} />
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>

                {/* Widgets Rendering */}
                {m.widgets && m.widgets.length > 0 && (
                  <div className="mt-4">
                    {m.widgets.map((widget, wIdx) => (
                      widget.type === 'document' ? (
                        <DocumentCanvas key={wIdx} widget={widget} />
                      ) : (
                        <div key={wIdx} className="space-y-4">
                          <ChatWidget widget={widget} onPreview={setActivePreviewWidget} />
                        </div>
                      )
                    ))}
                  </div>
                )}

                    {/* Assets Rendering */}
                    {m.assets && m.assets.length > 0 && !m.template_data && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {m.assets.map((asset, aIdx) => (
                          <div key={aIdx} className="relative aspect-square rounded-lg overflow-hidden border border-border-custom group">
                            <img src={asset.url} alt={asset.type} className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                            <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-black/40 backdrop-blur-sm text-[10px] text-white">
                              {asset.type}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Storefront Wireframe */}
                    {m.template_data && m.intent !== 'store_setup' && (
                      <StorefrontWireframe template={m.template_data} products={m.products || []} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-6 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex max-w-[90%] gap-4">
              <ThinkingState />
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Persistent Input for active chat */}
      {messages.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 pt-20 pb-8 px-4 bg-gradient-to-t from-background via-background via-80% to-transparent pointer-events-none z-10">
          <div className="max-w-3xl mx-auto relative pointer-events-auto flex flex-col items-center">
            
            {showNotification && currentNotification && (
              <div className="w-full z-10 -mb-[1px]">
                <NotificationCard
                  type={currentNotification.type}
                  title={currentNotification.title}
                  description=""
                  timestamp={currentNotification.timestamp}
                  isVisible={showNotification}
                  isCollapsed={isNotificationCollapsed}
                  onToggleCollapse={() => setIsNotificationCollapsed(!isNotificationCollapsed)}
                  onClose={handleNotificationClose}
                  actions={currentNotification.actions.map(action => ({
                    label: action.label,
                    onClick: () => handleNotificationAction(action.actionId),
                    variant: action.variant
                  }))}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className={`w-full bg-input-bg border-x border-b border-border-custom focus-within:border-foreground/10 transition-all ${showNotification && !isNotificationCollapsed ? 'rounded-b-2xl rounded-t-none border-t-0' : 'rounded-2xl border-t' } p-2`}>
              <textarea
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     placeholder="Ask Mia anything..."
                     className="w-full bg-transparent border-none focus:ring-0 text-foreground/80 placeholder:text-foreground/30 resize-none py-3 px-4 min-h-[80px] max-h-[250px] text-base leading-relaxed outline-none"
                     rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="flex items-center justify-between mt-1 px-1">
                <button type="button" className="p-1.5 text-foreground/50 hover:text-foreground/70 hover:bg-foreground/5 rounded-xl transition-all">
                  <Plus className="w-5 h-5" />
                </button>
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-1.5 bg-accent/80 hover:bg-accent text-white rounded-xl transition-all shadow-lg disabled:opacity-30"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Widget Preview Modal */}
      {activePreviewWidget && (
        <WidgetModal 
          widget={activePreviewWidget} 
          onClose={() => setActivePreviewWidget(null)} 
        />
      )}
    </div>
  );
};
