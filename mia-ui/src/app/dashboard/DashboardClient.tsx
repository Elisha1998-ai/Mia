"use client";

import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { ChatInterface } from '@/components/ChatInterface';
import { Menu } from 'lucide-react';
import { ProductsPage } from '@/components/ProductsPage';
import { OrdersPage } from '@/components/OrdersPage';
import { CustomersPage } from '@/components/CustomersPage';
import { PreviewsPage } from '@/components/PreviewsPage';
import { AnalyticsPage } from '@/components/AnalyticsPage';
import { DiscountsPage } from '@/components/DiscountsPage';
import { ThemeEditorPage } from '@/components/ThemeEditorPage';
import { EmailTemplatesPage } from '@/components/EmailTemplatesPage';
import { IntegrationsPage } from '@/components/IntegrationsPage';
import { useChat } from '@/hooks/useChat';
import { useSearchParams } from 'next/navigation';
import { useSettings } from '@/hooks/useData';

export function DashboardClient() {
    const [mounted, setMounted] = React.useState(false);
    const searchParams = useSearchParams();
    const viewParam = searchParams.get('view') as 'chat' | 'products' | 'orders' | 'customers' | 'previews' | 'analytics' | 'discounts' | 'theme-editor' | 'email-templates' | 'integrations' | null;
    
    const { messages, sendMessage, isLoading, markMessageComplete, triggerDemoMode } = useChat();
    const [activeView, setActiveView] = React.useState<'chat' | 'products' | 'orders' | 'customers' | 'previews' | 'analytics' | 'discounts' | 'theme-editor' | 'email-templates' | 'integrations'>('chat');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
    const { settings, fetchSettings } = useSettings();

    React.useEffect(() => {
        setMounted(true);
        fetchSettings();
        if (viewParam && ['chat', 'products', 'orders', 'customers', 'previews', 'analytics', 'discounts', 'theme-editor', 'email-templates', 'integrations'].includes(viewParam)) {
            setActiveView(viewParam);
        }
    }, [viewParam]);

    const adminName = settings?.adminName || 'User';
    const initials = adminName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

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
            {/* Navigation Sidebar (Desktop) / Drawer (Mobile) */}
            <Sidebar
                activeView={activeView}
                onViewChange={setActiveView}
                isMobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-background transition-colors">
                {/* Mobile Top Header - App style */}
                <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-border-custom bg-background/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="p-1 -ml-1 text-foreground/60 hover:text-foreground transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent">
                        {initials}
                    </div>
                </header>

                <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
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
                    {activeView === 'discounts' && <DiscountsPage />}
                    {activeView === 'theme-editor' && <ThemeEditorPage />}
                    {activeView === 'email-templates' && <EmailTemplatesPage />}
                    {activeView === 'integrations' && <IntegrationsPage />}
                </main>
            </div>
        </div>
    );
}
