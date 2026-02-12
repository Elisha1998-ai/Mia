"use client";

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { ProductsPage } from '@/components/ProductsPage';
import { OrdersPage } from '@/components/OrdersPage';
import { CustomersPage } from '@/components/CustomersPage';
import { PreviewsPage } from '@/components/PreviewsPage';
import { AnalyticsPage } from '@/components/AnalyticsPage';
import { useChat } from '@/hooks/useChat';

export function DashboardClient() {
    const [mounted, setMounted] = React.useState(false);
    const { messages, sendMessage, isLoading, markMessageComplete, triggerDemoMode } = useChat();
    const [activeView, setActiveView] = React.useState<'chat' | 'products' | 'orders' | 'customers' | 'previews' | 'analytics'>('chat');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden transition-colors relative">
            {/* Navigation Sidebar */}
            <Sidebar
                activeView={activeView}
                onViewChange={setActiveView}
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-background transition-colors">
                {/* Mobile Sidebar Toggle - Only visible on mobile */}
                <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="md:hidden absolute top-4 left-4 z-40 p-2.5 rounded-xl bg-background border border-border-custom shadow-sm text-foreground/60 hover:text-foreground transition-all"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                {activeView === 'chat' && (
                    <ChatInterface
                        messages={messages}
                        onSend={sendMessage}
                        isLoading={isLoading}
                        onMessageComplete={markMessageComplete}
                        onTriggerDemo={triggerDemoMode}
                    />
                )}
                {activeView === 'products' && <ProductsPage />}
                {activeView === 'orders' && <OrdersPage />}
                {activeView === 'customers' && <CustomersPage />}
                {activeView === 'previews' && <PreviewsPage />}
                {activeView === 'analytics' && <AnalyticsPage />}
            </div>
        </div>
    );
}
