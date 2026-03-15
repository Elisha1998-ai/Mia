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
  X as CloseIcon,
  Sparkles,
  Download
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { SettingsModal } from './SettingsModal';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useSettings } from '@/hooks/useData';
import Link from 'next/link';

interface SidebarProps {
  activeView: 'chat' | 'products' | 'orders' | 'customers' | 'previews' | 'analytics' | 'discounts' | 'theme-editor' | 'email-templates' | 'store-builder';
  onViewChange: (view: 'chat' | 'products' | 'orders' | 'customers' | 'previews' | 'analytics' | 'discounts' | 'theme-editor' | 'email-templates' | 'store-builder') => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  className?: string;
  showChat?: boolean;
}

export const Sidebar = ({ activeView, onViewChange, isMobileOpen, onMobileClose, className, showChat = true }: SidebarProps) => {
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
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'customers', icon: Users, label: 'Customers' },
  ];

  const HoverTooltip = ({ children, label, isActive }: { children: React.ReactNode, label: string, isActive: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} onFocus={() => setIsOpen(true)} onBlur={() => setIsOpen(false)}>
          {children}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content 
            className="z-[100] px-3 py-1.5 bg-background border border-border-custom rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200" 
            side="right" 
            sideOffset={10}
            align="center"
          >
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-bold text-foreground">{label}</span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              )}
            </div>
            <Popover.Arrow className="fill-border-custom" width={10} height={5} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  };

  const sidebarContent = (
    <>
      <div className="flex flex-col gap-2 w-full items-center overflow-y-auto no-scrollbar py-2">
        {topIcons.map((item) => (
          <HoverTooltip key={item.id} label={item.label} isActive={activeView === item.id}>
            <button
              onClick={() => {
                onViewChange(item.id as any);
              }}
              className={`p-1 rounded-lg transition-all shrink-0 relative outline-none ${activeView === item.id
                ? 'text-black bg-transparent'
                : 'text-foreground/60 hover:text-foreground'
                }`}
            >
              <item.icon className="w-5 h-5" />
            </button>
          </HoverTooltip>
        ))}

        {/* Separator for external link */}
        <div className="w-6 h-px bg-border-custom my-1" />

        {/* Shop External Link (In-app Preview) */}
        <HoverTooltip label="View Shop" isActive={activeView === 'previews'}>
          <button
            onClick={() => onViewChange('previews')}
            className={`p-1 rounded-lg transition-all shrink-0 relative outline-none ${activeView === 'previews'
              ? 'text-black bg-transparent'
              : 'text-foreground/60 hover:text-foreground'
              }`}
          >
            <Layout className="w-5 h-5" />
          </button>
        </HoverTooltip>
      </div>

      <div className="mt-auto flex flex-col items-center gap-4 py-2">
        <HoverTooltip label="Settings" isActive={false}>
          <div
            onClick={() => setIsSettingsOpen(true)}
            className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-[9px] font-bold text-accent cursor-pointer hover:ring-2 ring-accent/10 transition-all outline-none">
            {initials}
          </div>
        </HoverTooltip>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col items-center py-2 gap-4 z-50 transition-colors bg-sidebar w-full h-full overflow-hidden ${className || ''}`}
      >
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
            <div className="p-4" />

            <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
              {topIcons.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id as any);
                    onMobileClose?.();
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id
                    ? 'bg-gray-200 text-black font-semibold'
                    : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'
                    }`}
                >
                  <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-black' : 'text-foreground/40'}`} />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}

              <a
                href={settings?.storeDomain ? (
                    window.location.hostname.includes('localhost') 
                      ? `http://${settings.storeDomain}.localhost:3000` 
                      : `https://${settings.storeDomain}.bloume.shop`
                ) : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
              >
                <Layout className="w-5 h-5 text-foreground/40" />
                <span className="text-sm">View Shop</span>
              </a>
            </div>

            <div className="p-4 mt-auto border-t border-border-custom bg-foreground/[0.02] flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsSettingsOpen(true);
                  onMobileClose?.();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-foreground/60 hover:bg-foreground/5 text-left w-full"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">{adminName}</span>
                  <span className="text-[11px] text-foreground/40">{settings?.adminRole || 'Store Owner'}</span>
                </div>
              </button>
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
