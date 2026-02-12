"use client";

import React from 'react';
import { 
  MessageSquare, 
  Plus,
  Sun,
  Moon,
  Settings,
  Package,
  Layout,
  ShoppingCart,
  Users
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { SettingsModal } from './SettingsModal';

interface SidebarProps {
  activeView: 'chat' | 'products' | 'orders' | 'customers' | 'previews';
  onViewChange: (view: 'chat' | 'products' | 'orders' | 'customers' | 'previews') => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ activeView, onViewChange, isOpen, onClose }: SidebarProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const topIcons = [
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'orders', icon: ShoppingCart, label: 'Orders' },
    { id: 'customers', icon: Users, label: 'Customers' },
    { id: 'previews', icon: Layout, label: 'Design Previews' },
  ];

  const sidebarContent = (
    <>
      <div className="p-2 mb-2">
        <div className="w-5 h-5 rounded-full bg-accent animate-pulse" />
      </div>
      
      <div className="flex flex-col gap-2 w-full items-center">
        {topIcons.map((item) => (
          <button
            key={item.id}
            title={item.label}
            onClick={() => {
              if (['chat', 'products', 'orders', 'customers', 'previews'].includes(item.id)) {
                onViewChange(item.id as any);
                if (window.innerWidth < 768 && onClose) onClose();
              }
            }}
            className={`p-2.5 rounded-lg transition-all ${
              activeView === item.id 
                ? 'bg-foreground/10 text-foreground' 
                : 'text-foreground/40 hover:bg-foreground/5 hover:text-foreground'
            }`}
          >
            <item.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-lg transition-all hover:bg-foreground/5 text-foreground/40 hover:text-foreground"
          title="Toggle Theme"
        >
          {mounted && (theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 rounded-lg transition-all hover:bg-foreground/5 text-foreground/40 hover:text-foreground"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent cursor-pointer hover:ring-2 ring-accent/10 transition-all">
          EO
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[60px] border-r border-border-custom bg-sidebar flex-col items-center py-4 gap-4 z-50 transition-colors">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`md:hidden fixed top-0 left-0 bottom-0 w-[60px] border-r border-border-custom bg-sidebar flex flex-col items-center py-4 gap-4 z-[101] transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </aside>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};
