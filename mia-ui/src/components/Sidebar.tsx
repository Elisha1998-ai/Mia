"use client";

import React from 'react';
import { 
  MessageSquare, 
  Plus,
  Sun,
  Moon,
  BarChart3,
  Settings,
  Package,
  Layout,
  ShoppingCart,
  Users,
  Ticket,
  Palette,
  Mail,
  Share2,
  Menu,
  X as CloseIcon
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { SettingsModal } from './SettingsModal';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useSettings } from '@/hooks/useData';

interface SidebarProps {
  activeView: 'chat' | 'products' | 'orders' | 'customers' | 'previews' | 'analytics' | 'discounts' | 'theme-editor' | 'email-templates' | 'integrations';
  onViewChange: (view: 'chat' | 'products' | 'orders' | 'customers' | 'previews' | 'analytics' | 'discounts' | 'theme-editor' | 'email-templates' | 'integrations') => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar = ({ activeView, onViewChange, isMobileOpen, onMobileClose }: SidebarProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, fetchSettings } = useSettings();

  useEffect(() => {
    setMounted(true);
    fetchSettings();
  }, []);

  const adminName = settings?.adminName || 'User';
  const initials = adminName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const topIcons = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'customers', icon: Users, label: 'Customers' },
    { id: 'discounts', icon: Ticket, label: 'Discounts' },
    { id: 'theme-editor', icon: Palette, label: 'Theme Editor' },
    { id: 'email-templates', icon: Mail, label: 'Emails' },
    { id: 'integrations', icon: Share2, label: 'Integrations' },
    { id: 'previews', icon: Layout, label: 'Design Previews' },
  ];

  const sidebarContent = (
    <>
      <div className="p-2 mb-2">
        <div className="w-5 h-5 rounded-full bg-accent animate-pulse" />
      </div>
      
      <div className="flex flex-col gap-2 w-full items-center overflow-y-auto no-scrollbar py-2">
        {topIcons.map((item) => (
          <div key={item.id} className="relative group">
            <button
              onClick={() => {
                onViewChange(item.id as any);
              }}
              className={`p-2.5 rounded-lg transition-all shrink-0 relative ${
                activeView === item.id 
                  ? 'bg-foreground/10 text-foreground shadow-sm' 
                  : 'text-foreground/40 hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {activeView === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-accent rounded-r-full" />
              )}
            </button>
            
            {/* Custom Styled Tooltip */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-background border border-border-custom rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-foreground">{item.label}</span>
                {activeView === item.id && (
                  <div className="w-1 h-1 rounded-full bg-accent" />
                )}
              </div>
              {/* Arrow */}
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-background border-l border-b border-border-custom rotate-45" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-4">
        <div className="relative group">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2.5 rounded-lg transition-all hover:bg-foreground/5 text-foreground/40 hover:text-foreground"
          >
            {mounted && (theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-background border border-border-custom rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
            <span className="text-[13px] font-bold text-foreground">Theme</span>
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-background border-l border-b border-border-custom rotate-45" />
          </div>
        </div>

        <div className="relative group">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-lg transition-all hover:bg-foreground/5 text-foreground/40 hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-background border border-border-custom rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
            <span className="text-[13px] font-bold text-foreground">Settings</span>
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-background border-l border-b border-border-custom rotate-45" />
          </div>
        </div>

        <div className="relative group">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent cursor-pointer hover:ring-2 ring-accent/10 transition-all">
            {initials}
          </div>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-background border border-border-custom rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
            <span className="text-[13px] font-bold text-foreground">Profile</span>
            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-background border-l border-b border-border-custom rotate-45" />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[72px] border-r border-border-custom bg-sidebar flex-col items-center py-6 gap-6 z-50 transition-colors">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      <Dialog.Root open={isMobileOpen} onOpenChange={(open) => !open && onMobileClose?.()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] md:hidden animate-in fade-in duration-300" />
          <Dialog.Content className="fixed top-0 left-0 bottom-0 w-[280px] bg-sidebar border-r border-border-custom z-[151] md:hidden animate-in slide-in-from-left duration-300 flex flex-col">
            <VisuallyHidden>
              <Dialog.Title>Navigation Menu</Dialog.Title>
              <Dialog.Description>Access all dashboard sections and settings</Dialog.Description>
            </VisuallyHidden>
            <div className="p-6 flex items-center justify-between border-b border-border-custom">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                <span className="font-bold tracking-tight">Mia Admin</span>
              </div>
              <Dialog.Close asChild>
                <button className="p-2 hover:bg-foreground/5 rounded-lg transition-colors text-foreground/40 hover:text-foreground">
                  <CloseIcon className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
              {topIcons.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id as any);
                    onMobileClose?.();
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeView === item.id 
                      ? 'bg-accent/10 text-accent font-semibold shadow-sm' 
                      : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-accent' : 'text-foreground/40'}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="p-4 mt-auto border-t border-border-custom bg-foreground/[0.02] flex flex-col gap-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              >
                {mounted && (theme === 'dark' ? <Sun className="w-5 h-5 text-foreground/40" /> : <Moon className="w-5 h-5 text-foreground/40" />)}
                <span className="text-sm">Switch Theme</span>
              </button>
              
              <button
                onClick={() => {
                  setIsSettingsOpen(true);
                  onMobileClose?.();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              >
                <Settings className="w-5 h-5 text-foreground/40" />
                <span className="text-sm">Settings</span>
              </button>

              <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-foreground/60 hover:bg-foreground/5">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent">
                  {initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{adminName}</span>
                  <span className="text-[11px] text-foreground/40">{settings?.adminRole || 'Store Owner'}</span>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};
