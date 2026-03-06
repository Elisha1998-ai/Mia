"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, User, Bot, Sparkles, Plus, ArrowUp, ChevronDown, Copy, Reply, Check, Loader2, FileText, ChevronUp, Download, Eye, ExternalLink, X, Edit2, Save, Layout, Mic, AudioLines } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useSettings } from '@/hooks/useData';
import { useNotificationLogic } from '@/hooks/useNotificationLogic';
import { NotificationCard } from './NotificationCard';

interface Widget {
  type: 'invoice' | 'document' | 'link' | 'store_preview' | 'product_list' | 'font_picker' | 'digital_product_draft';
  title?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  url?: string;
  storeName?: string;
  products?: any[];
  product?: any; // Single product for drafts
  fonts?: { id: string; name: string; heading: string; body: string; description: string }[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
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
                  <a href={widget.url} download target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-accent text-white dark:text-black rounded-lg hover:bg-accent/90 transition-colors text-sm">
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                </div>
                <iframe src={widget.url} className="w-full h-full flex-1 rounded-lg border border-border-custom min-h-[500px]" title="Invoice PDF" />
              </div>
            ) : (
              <div className="bg-background text-foreground p-8 w-full max-w-md shadow-lg rounded-sm font-mono text-[10px] space-y-4 border border-border-custom">
                <div className="flex justify-between border-b border-border-custom pb-4">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-tighter">Pony Storefront</h2>
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
          <button className="flex items-center gap-2 px-5 py-2 bg-accent text-white dark:text-black rounded-xl text-sm font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
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
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-8 tracking-tight text-foreground border-b border-border-custom pb-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-12 mb-6 tracking-tight text-foreground border-l-4 border-accent/30 pl-4" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-8 mb-4 tracking-tight text-foreground/90" {...props} />,
                p: ({ node, ...props }) => <p className="text-[16px] leading-relaxed mb-6 text-foreground/70" {...props} />,
                ul: ({ node, ...props }) => <ul className="space-y-3 mb-8 ml-4 list-disc marker:text-accent" {...props} />,
                li: ({ node, ...props }) => <li className="text-[16px] text-foreground/70 pl-2" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
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

const FontPicker = ({ widget, onSelect }: { widget: Widget, onSelect: (font: any) => void }) => {
  return (
    <div className="my-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex items-center gap-3 px-1">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Layout className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground/80">{widget.title || "Select Typography"}</h4>
          <p className="text-[11px] text-foreground/40">{widget.description || "Choose a style for your store"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {widget.fonts?.map((font) => (
          <button
            key={font.id}
            onClick={() => onSelect(font)}
            className="group flex flex-col p-4 border border-border-custom rounded-2xl bg-foreground/[0.02] hover:border-accent/40 hover:bg-accent/5 transition-all text-left"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 group-hover:text-accent/60 transition-colors">
                {font.name}
              </span>
              <div className="w-6 h-6 rounded-full border border-border-custom flex items-center justify-center group-hover:border-accent/40 transition-colors">
                <ArrowUp className="w-3 h-3 text-foreground/20 group-hover:text-accent rotate-45" />
              </div>
            </div>

            <div className="space-y-1 mb-3">
              <p style={{ fontFamily: font.heading }} className="text-xl font-bold text-foreground/90">
                Heading Font
              </p>
              <p style={{ fontFamily: font.body }} className="text-sm text-foreground/50">
                This is how your body text will look.
              </p>
            </div>

            <p className="text-[11px] text-foreground/30 group-hover:text-foreground/50 italic">
              {font.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

const ChatWidget = ({ widget, onPreview, onAction }: { widget: Widget, onPreview?: (w: Widget) => void, onAction?: (action: string, w: Widget) => void }) => {
  const handleWhatsAppShare = (widget: Widget) => {
    // Basic WhatsApp share link - in a real app, you'd probably want to share a hosted PDF link
    const text = `Hi, here is your invoice for ${widget.title}: ${widget.description?.substring(0, 100)}...`;
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
        ) : widget.type === 'digital_product_draft' ? (
          <div className="flex flex-col items-center justify-center">
            <div className="text-[10px] font-bold text-accent mb-1 uppercase tracking-widest">{(widget as any).products?.product_type || 'DIGITAL'}</div>
            <FileText className="w-5 h-5 text-accent/60 group-hover:text-accent transition-colors" />
          </div>
        ) : (
          <FileText className="w-7 h-7 text-foreground/20 group-hover:text-accent/40 transition-colors" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-foreground/80 truncate">
          {widget.type === 'store_preview' ? `Store Preview: ${(widget as any).storeName}` : widget.type === 'digital_product_draft' ? `Draft: ${(widget as any).products?.title || widget.title}` : widget.title}
        </h4>
        <p className="text-xs text-foreground/40 mt-0.5 line-clamp-2 leading-relaxed">
          {widget.type === 'store_preview' ? 'Click to preview your newly built storefront and check out the design.' : widget.type === 'digital_product_draft' ? `₦${widget.product?.price || 0} — ${widget.description}` : widget.description}
        </p>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {widget.type === 'digital_product_draft' && (
          <button
            onClick={(e) => { e.stopPropagation(); onAction?.('add_product', widget); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent text-white dark:text-black hover:bg-accent/90 transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-accent/20"
          >
            Edit & Add <Plus className="w-3.5 h-3.5" />
          </button>
        )}
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent text-white dark:text-black hover:bg-accent/90 transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-accent/20"
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
  const { settings, fetchSettings } = useSettings();
  const [activePreviewWidget, setActivePreviewWidget] = useState<Widget | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isNotificationCollapsed, setIsNotificationCollapsed] = useState(false);
  const [isStackExpanded, setIsStackExpanded] = useState(false);
  const router = useRouter();

  const {
    notifications,
    markAsRead,
    handleAction
  } = useNotificationLogic(settings?.adminName);

  useEffect(() => {
    fetchSettings();
    const storedPrompt = localStorage.getItem('pony_onboarding_prompt');
    if (storedPrompt) {
      setInput(storedPrompt);
      localStorage.removeItem('pony_onboarding_prompt');
    }
  }, []);

  useEffect(() => {
    if (notifications.length <= 1 && isStackExpanded) {
      setIsStackExpanded(false);
    }
  }, [notifications.length]);

  const handleNotificationClose = (id: string) => {
    markAsRead(id);
  };

  const handleNotificationAction = (id: string, actionId: string, chatMessage?: string) => {
    handleAction(id, actionId);
    if (chatMessage) {
      onSend(chatMessage);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedId(idx);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch (error) {
      console.error('Failed to copy message:', error);
      // Fail silently but log the error
    }
  };

  const handleReply = (text: string) => {
    setInput(prev => prev + `\n> ${text.slice(0, 50)}${text.length > 50 ? '...' : ''}\n`);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validImages = files.filter(file => file.type.startsWith('image/'));
      setSelectedImages(prev => [...prev, ...validImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent, customInput?: string) => {
    e.preventDefault();
    const messageContent = customInput || input;

    if ((!messageContent?.trim() && selectedImages.length === 0) && !customInput) return;
    if (isLoading || isUploading) return;

    if (selectedImages.length > 0) {
      setIsUploading(true);
      try {
        const imageUrls: string[] = [];

        // Parallel uploads for speed
        const uploadPromises = selectedImages.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);

          try {
            const response = await fetch('/api/cloudinary/upload', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              return data.base64 || data.secure_url || data.url;
            }
          } catch (err) {
            console.error("Upload failed", err);
            return null;
          }
        });

        const results = await Promise.all(uploadPromises);
        results.forEach(url => {
          if (url) imageUrls.push(url);
        });

        if (imageUrls.length > 0) {
          const visionPayload = JSON.stringify(imageUrls);
          // Use the exact tool trigger format: [ANALYZE_IMAGES] ["url1", "url2"]
          const visionMessage = `[ANALYZE_IMAGES] ${visionPayload}`;

          const fullMessage = messageContent?.trim()
            ? `${messageContent}\n\n${visionMessage}`
            : `I'm uploading ${imageUrls.length} product image(s). Please analyze them and draft product details.\n\n${visionMessage}`;

          onSend(fullMessage);
        } else {
          // Fallback if all uploads failed
          onSend("I tried to upload images but they failed. Please try again.");
        }

        setSelectedImages([]);
        setInput('');
      } catch (error) {
        console.error("Error in submission flow:", error);
      } finally {
        setIsUploading(false);
      }
    } else {
      onSend(messageContent);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pb-64`}>
        <div className={`max-w-3xl mx-auto w-full space-y-6 ${messages.length === 0 ? 'h-full flex flex-col justify-center' : ''}`}>

          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-6 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div
                  className={`py-2.5 px-4 rounded-2xl text-sm leading-relaxed relative group/msg ${m.role === 'user'
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

                  {/* Content */}
                  <div className="animate-in fade-in slide-in-from-top-1 duration-500">
                    <div className="markdown-content">
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-bold text-foreground" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-lg font-bold mb-2" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-md font-bold mb-1" {...props} />,
                          code: ({ node, inline, ...props }: any) => (
                            <code className={`${inline ? 'bg-foreground/10 px-1 rounded' : 'block bg-foreground/10 p-2 rounded-lg my-2 overflow-x-auto'}`} {...props} />
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>

                    {m.widgets && m.widgets.length > 0 && (
                      <div className="mt-4">
                        {m.widgets.map((widget, wIdx) => (
                          widget.type === 'document' ? (
                            <DocumentCanvas key={wIdx} widget={widget} />
                          ) : widget.type === 'font_picker' ? (
                            <FontPicker key={wIdx} widget={widget} onSelect={(font) => onSend(`I've chosen the ${font.name} style for my store.`)} />
                          ) : (
                            <ChatWidget key={wIdx} widget={widget} onPreview={setActivePreviewWidget} onAction={(action, w) => {
                              if (action === 'add_product' && w.product) {
                                onSend(`Looks great! Please add the product named "${w.product.title}" to my store and set the price to ₦${w.product.price}.`);
                              }
                            }} />
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
      <div className="absolute bottom-0 left-0 right-0 pt-20 pb-8 px-4 bg-gradient-to-t from-background via-background via-80% to-transparent pointer-events-none z-10">
        <div className="max-w-3xl mx-auto relative pointer-events-auto flex flex-col items-center">

          <div className="w-full bg-surface rounded-2xl p-1 flex flex-col relative overflow-hidden transition-all duration-300 shadow-xl border border-border-custom">
            {notifications.length > 0 && (
              <div className="w-full flex flex-col transition-all duration-500 ease-in-out px-2 py-1.5">
                {notifications.slice(0, isStackExpanded ? 3 : 1).map((notification, index) => (
                  <div key={notification.id} className="w-full flex items-center justify-between pb-1 pt-0.5">
                    <span className="text-[11px] text-foreground/80 font-medium">
                      {notification.title} {notification.description}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      {notification.actions.map(action => (
                        <button
                          key={action.label}
                          type="button"
                          onClick={(e) => { e.preventDefault(); handleNotificationAction(notification.id, action.actionId, action.chatMessage); }}
                          className="bg-foreground/5 hover:bg-foreground/10 text-foreground px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors border border-border-custom"
                        >
                          {action.label}
                        </button>
                      ))}
                      <button type="button" onClick={() => handleNotificationClose(notification.id)} className="text-foreground/40 hover:text-foreground/80 transition-colors p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full bg-input-bg rounded-xl p-1.5 flex flex-col border border-border-custom">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything"
                className="w-full bg-transparent border-none focus:ring-0 text-foreground/90 placeholder:text-foreground/40 resize-none py-1.5 px-2 min-h-[90px] max-h-[350px] text-base leading-relaxed outline-none scrollbar-hide"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 text-foreground/40 hover:text-foreground/90 rounded-lg transition-all"
                    title="Upload images"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />

                  {(!input.trim() && selectedImages.length === 0) && (
                    <button type="button" className="p-1.5 text-foreground/40 hover:text-foreground/90 rounded-lg transition-all hidden sm:flex">
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {(!input.trim() && selectedImages.length === 0) ? (
                    <button type="button" className="w-7 h-7 bg-foreground text-background hover:opacity-90 rounded-xl transition-all flex items-center justify-center pointer-events-none">
                      <AudioLines className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading || isUploading}
                      className="w-7 h-7 bg-accent hover:bg-accent/90 text-white dark:text-black rounded-xl transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      {isUploading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <ArrowUp className="w-4 h-4 stroke-[2.5px]" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Selected Images Preview */}
              {selectedImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto max-w-[200px] py-1 px-11">
                  {selectedImages.map((file, idx) => (
                    <div key={idx} className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

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
