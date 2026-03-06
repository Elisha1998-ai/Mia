"use client";

import React from "react";
import {
    Package,
    ShoppingCart,
    Download,
    Users,
    BarChart3,
    Settings,
    Sun,
    Moon,
    ArrowLeft,
    ExternalLink,
    Globe,
    X as CloseIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import type { DigitalView } from "@/app/digital/DigitalDashboardClient";

interface DigitalSidebarProps {
    activeView: DigitalView;
    onViewChange: (view: DigitalView) => void;
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
    className?: string;
}

const navItems: { id: DigitalView; icon: React.ElementType; label: string }[] = [
    { id: "products", icon: Package, label: "Products" },
    { id: "orders", icon: ShoppingCart, label: "Orders" },
    { id: "downloads", icon: Download, label: "Downloads" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "analytics", icon: BarChart3, label: "Analytics" },
];

export const DigitalSidebar = ({
    activeView,
    onViewChange,
    isMobileOpen,
    onMobileClose,
    className,
}: DigitalSidebarProps) => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const sidebarContent = (
        <>
            {/* Top Store Preview */}
            <div className="flex flex-col items-center gap-1 mb-1">
                <div className="p-1">
                    <div className="w-5 h-5 rounded-full bg-accent animate-pulse" />
                </div>
                <div className="relative group">
                    <Link
                        href="/shop"
                        target="_blank"
                        className="p-2.5 rounded-lg transition-all text-foreground/20 hover:text-foreground/40"
                    >
                        <Globe className="w-5 h-5" />
                    </Link>
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-background border border-border-custom rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
                        <span className="text-[13px] font-bold text-foreground">Preview Store</span>
                        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-background border-l border-b border-border-custom rotate-45" />
                    </div>
                </div>
            </div>

            {/* Nav items */}
            <div className="flex flex-col gap-2 w-full items-center overflow-y-auto no-scrollbar py-2">
                {navItems.map((item) => (
                    <div key={item.id} className="relative group">
                        <button
                            onClick={() => onViewChange(item.id)}
                            className={`p-2.5 rounded-lg transition-all shrink-0 relative ${activeView === item.id
                                ? "text-foreground"
                                : "text-foreground/20 hover:text-foreground/40"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                        </button>
                        {/* Tooltip */}
                        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-background border border-border-custom rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-bold text-foreground">{item.label}</span>
                                {activeView === item.id && <div className="w-1 h-1 rounded-full bg-accent" />}
                            </div>
                            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-background border-l border-b border-border-custom rotate-45" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom */}
            <div className="mt-auto flex flex-col items-center gap-4">
                {/* Back to main dashboard */}
                <div className="relative group">
                    <Link
                        href="/dashboard"
                        className="p-2.5 rounded-lg transition-all hover:bg-foreground/5 text-foreground/40 hover:text-foreground flex items-center justify-center"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-background border border-border-custom rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
                        <span className="text-[13px] font-bold text-foreground">Main Dashboard</span>
                        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-background border-l border-b border-border-custom rotate-45" />
                    </div>
                </div>

                {/* Theme toggle */}
                <div className="relative group">
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2.5 rounded-lg transition-all hover:bg-foreground/5 text-foreground/40 hover:text-foreground"
                    >
                        {mounted && (theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
                    </button>
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-background border border-border-custom rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
                        <span className="text-[13px] font-bold text-foreground">Theme</span>
                        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-background border-l border-b border-border-custom rotate-45" />
                    </div>
                </div>

                {/* View Store */}
                <div className="relative group p-2 mb-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shadow-lg shadow-accent/20 hover:scale-105 transition-all"
                    >
                        <ExternalLink className="w-5 h-5" />
                    </Link>
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-background border border-border-custom rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap pointer-events-none translate-x-[-10px] group-hover:translate-x-0">
                        <span className="text-[13px] font-bold text-foreground">View Store</span>
                        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-background border-l border-b border-border-custom rotate-45" />
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop */}
            <aside className={`hidden md:flex flex-col items-center py-6 gap-6 z-50 transition-colors bg-sidebar ${className || "w-[64px] border-r border-border-custom"}`}>
                {sidebarContent}
            </aside>

            {/* Mobile Drawer */}
            <Dialog.Root open={isMobileOpen} onOpenChange={(open) => !open && onMobileClose?.()}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] md:hidden animate-in fade-in duration-300" />
                    <Dialog.Content className="fixed top-0 left-0 bottom-0 w-[280px] bg-sidebar border-r border-border-custom z-[151] md:hidden animate-in slide-in-from-left duration-300 flex flex-col">
                        <VisuallyHidden>
                            <Dialog.Title>Digital Hub Navigation</Dialog.Title>
                            <Dialog.Description>Navigate between digital product sections</Dialog.Description>
                        </VisuallyHidden>
                        <div className="p-6 flex items-center justify-between border-b border-border-custom">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                                <span className="font-bold tracking-tight">Digital Hub</span>
                            </div>
                            <Dialog.Close asChild>
                                <button className="p-2 hover:bg-foreground/5 rounded-lg transition-colors text-foreground/40 hover:text-foreground">
                                    <CloseIcon className="w-5 h-5" />
                                </button>
                            </Dialog.Close>
                        </div>

                        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { onViewChange(item.id); onMobileClose?.(); }}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id
                                        ? "bg-accent/10 text-accent font-semibold shadow-sm"
                                        : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${activeView === item.id ? "text-accent" : "text-foreground/40"}`} />
                                    <span className="text-sm">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="p-4 mt-auto border-t border-border-custom bg-foreground/[0.02] flex flex-col gap-2">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-all"
                            >
                                <ArrowLeft className="w-5 h-5 text-foreground/40" />
                                <span className="text-sm">Main Dashboard</span>
                            </Link>
                            <button
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                            >
                                {mounted && (theme === "dark" ? <Sun className="w-5 h-5 text-foreground/40" /> : <Moon className="w-5 h-5 text-foreground/40" />)}
                                <span className="text-sm">Switch Theme</span>
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
};
