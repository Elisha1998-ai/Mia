"use client";

import React from 'react';
import { 
  Mail, 
  Send, 
  Bell, 
  Settings2, 
  Edit2, 
  Eye, 
  ChevronRight,
  Package,
  CheckCircle2,
  Truck,
  RotateCcw,
  X,
  Upload,
  Globe,
  MessageSquare,
  ChevronLeft
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: 'Order Confirmation' | 'Shipping Update' | 'Welcome' | 'Abandoned Cart';
  status: 'Active' | 'Draft';
  lastModified: string;
  icon: any;
}

const GlobalEmailSettingsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
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
              <Dialog.Title className="text-lg font-bold text-foreground">
                Global Email Settings
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="hidden md:block p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
            <button 
              onClick={onClose}
              className="md:hidden px-4 py-2 bg-foreground text-background rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide bg-background">
            <div className="w-full max-w-[560px] mx-auto flex flex-col gap-8 pb-10">
              
              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Sender Information</h3>
                <div className="grid gap-6">
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Sender Name</label>
                    <input 
                      type="text" 
                      defaultValue="Mia Store" 
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium" 
                    />
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Reply-to Email</label>
                    <input 
                      type="email" 
                      defaultValue="support@miastore.com" 
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium" 
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Email Branding</h3>
                <div className="grid gap-6">
                  <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                    <label className="text-sm font-semibold text-foreground/80 pt-2.5">Store Logo</label>
                    <div className="border-2 border-dashed border-border-custom rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 group hover:border-accent/30 hover:bg-accent/[0.02] transition-all cursor-pointer bg-foreground/[0.02]">
                      <div className="w-12 h-12 rounded-2xl bg-foreground/5 text-foreground/20 group-hover:bg-accent/10 group-hover:text-accent flex items-center justify-center transition-all">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Upload Store Logo</h4>
                        <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        defaultValue="#6366f1" 
                        className="w-10 h-10 rounded-xl border border-border-custom bg-transparent cursor-pointer overflow-hidden p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none" 
                      />
                      <span className="text-sm font-mono text-foreground/60 font-bold">#6366f1</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Footer Information</h3>
                <div className="grid gap-6">
                  <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                    <label className="text-sm font-semibold text-foreground/80 pt-2.5">Address</label>
                    <textarea 
                      rows={3} 
                      defaultValue="123 Commerce St, Suite 100&#10;Lagos, Nigeria" 
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium resize-none" 
                    />
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Facebook URL</label>
                    <input 
                      type="text" 
                      placeholder="https://facebook.com/..." 
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium" 
                    />
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Instagram URL</label>
                    <input 
                      type="text" 
                      placeholder="https://instagram.com/..." 
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium" 
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-border-custom bg-background flex items-center justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-foreground/40 hover:text-foreground transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onClose}
              className="bg-accent hover:bg-accent/90 text-white px-8 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent/20"
            >
              Save Settings
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export const EmailTemplatesPage = () => {
  const [selectedTemplate, setSelectedTemplate] = React.useState<EmailTemplate | null>(null);
  const [isGlobalSettingsOpen, setIsGlobalSettingsOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isSendingTest, setIsSendingTest] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Template changes saved successfully!');
    }, 1000);
  };

  const handleSendTest = () => {
    setIsSendingTest(true);
    setTimeout(() => {
      setIsSendingTest(false);
      alert(`Test email for "${selectedTemplate?.name}" sent to your store email!`);
    }, 1500);
  };

  const templates: EmailTemplate[] = [
    { 
      id: '1', 
      name: 'Order Confirmation', 
      subject: 'Thank you for your order! #{{order_number}}', 
      type: 'Order Confirmation', 
      status: 'Active', 
      lastModified: '2 days ago',
      icon: CheckCircle2
    },
    { 
      id: '2', 
      name: 'Shipping Update', 
      subject: 'Your order is on its way!', 
      type: 'Shipping Update', 
      status: 'Active', 
      lastModified: '5 days ago',
      icon: Truck
    },
    { 
      id: '3', 
      name: 'Welcome Email', 
      subject: 'Welcome to our community!', 
      type: 'Welcome', 
      status: 'Draft', 
      lastModified: '1 week ago',
      icon: Bell
    },
    { 
      id: '4', 
      name: 'Abandoned Cart', 
      subject: 'You left something behind...', 
      type: 'Abandoned Cart', 
      status: 'Active', 
      lastModified: '3 days ago',
      icon: Package
    },
  ];

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
      <header className="px-8 py-6 border-b border-border-custom flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Email Templates</h1>
          <p className="text-sm text-foreground/40 font-medium mt-1">Customize automated customer notifications</p>
        </div>
        <button 
          onClick={() => setIsGlobalSettingsOpen(true)}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent/20 active:scale-95"
        >
          <Settings2 className="w-4 h-4" />
          Global Email Settings
        </button>
      </header>

      <GlobalEmailSettingsModal 
        isOpen={isGlobalSettingsOpen} 
        onClose={() => setIsGlobalSettingsOpen(false)} 
      />

      <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto">
        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider px-1">Automated Workflows</h2>
          {templates.map((template) => (
            <div 
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`group p-5 rounded-2xl border transition-all cursor-pointer ${selectedTemplate?.id === template.id ? 'bg-accent/5 border-accent shadow-sm' : 'border-border-custom hover:border-foreground/20 bg-foreground/[0.01]'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${selectedTemplate?.id === template.id ? 'bg-accent text-white' : 'bg-foreground/5 text-foreground/40 group-hover:text-foreground'}`}>
                    <template.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-foreground">{template.name}</h3>
                    <p className="text-[13px] text-foreground/40 font-medium line-clamp-1">{template.subject}</p>
                    <div className="flex items-center gap-3 pt-1">
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${template.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-foreground/10 text-foreground/40'}`}>
                        {template.status}
                      </span>
                      <span className="text-[11px] text-foreground/20 font-bold uppercase tracking-wider">
                        Modified {template.lastModified}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 transition-all ${selectedTemplate?.id === template.id ? 'text-accent translate-x-1' : 'text-foreground/10'}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-foreground/[0.01] border border-border-custom rounded-3xl p-8 flex flex-col min-h-[600px] relative overflow-hidden">
          {selectedTemplate ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{selectedTemplate.name}</h2>
                    <p className="text-[13px] text-foreground/40 font-medium">Edit email content and styling</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-xl border border-border-custom text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all" title="Reset to Default">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 rounded-xl border border-border-custom text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all" title="Preview Email">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-foreground/60 px-1">Email Subject</label>
                  <input 
                    type="text" 
                    defaultValue={selectedTemplate.subject}
                    className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 ring-accent/20 focus:border-accent"
                  />
                </div>

                <div className="space-y-2 flex-1 flex flex-col">
                  <label className="text-[13px] font-bold text-foreground/60 px-1">Email Body (HTML Supported)</label>
                  <textarea 
                    className="flex-1 w-full bg-background border border-border-custom rounded-2xl px-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 ring-accent/20 focus:border-accent resize-none font-mono"
                    defaultValue={`<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="color: #6366f1;">Thank you for your order!</h1>
  <p>Hello {{customer_name}},</p>
  <p>We've received your order <strong>#{{order_number}}</strong> and are getting it ready for shipment.</p>
  
  <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
    <h3 style="margin-top: 0;">Order Summary</h3>
    {{order_items}}
  </div>
  
  <p>We'll notify you as soon as your package ships!</p>
</div>`}
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border-custom flex items-center justify-between">
                <button 
                  onClick={handleSendTest}
                  disabled={isSendingTest}
                  className="flex items-center gap-2 text-[13px] font-bold text-foreground/40 hover:text-foreground transition-colors disabled:opacity-50"
                >
                  <Send className={`w-4 h-4 ${isSendingTest ? 'animate-bounce' : ''}`} />
                  {isSendingTest ? 'Sending...' : 'Send Test Email'}
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <RotateCcw className="w-4 h-4 animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-foreground/[0.03] flex items-center justify-center text-foreground/10">
                <Mail className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Select a Template</h3>
                <p className="text-sm text-foreground/40 font-medium max-w-[240px] mx-auto mt-2">
                  Choose a template from the left to start customizing your customer emails.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
