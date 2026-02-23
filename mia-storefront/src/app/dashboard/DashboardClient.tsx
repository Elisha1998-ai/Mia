"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
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
import { useChat } from '@/hooks/useChat';
import { useStoreBuilder } from '@/hooks/useStoreBuilder';
import { StoreBuilderChat } from '@/components/StoreBuilderChat';
import { StoreBuilderPreview } from '@/components/StoreBuilderPreview';
import { useSettings } from '@/hooks/useData';

export function DashboardClient({ defaultView }: { defaultView?: 'chat' | 'products' | 'orders' | 'customers' | 'previews' | 'analytics' | 'discounts' | 'theme-editor' | 'email-templates' | 'store-builder' }) {
    const [mounted, setMounted] = React.useState(false);
    const searchParams = useSearchParams();
    const viewParam = searchParams.get('view') as 'chat' | 'products' | 'orders' | 'customers' | 'previews' | 'analytics' | 'discounts' | 'theme-editor' | 'email-templates' | 'store-builder' | null;
    
    const { messages, sendMessage, isLoading, markMessageComplete, triggerDemoMode } = useChat();
    const storeBuilder = useStoreBuilder();
    const [activeView, setActiveView] = React.useState<'chat' | 'products' | 'orders' | 'customers' | 'previews' | 'analytics' | 'discounts' | 'theme-editor' | 'email-templates' | 'store-builder'>(defaultView || 'products');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
    const { settings, fetchSettings } = useSettings();

    React.useEffect(() => {
        setMounted(true);
        fetchSettings();
        if (viewParam && ['products', 'orders', 'customers', 'previews', 'analytics', 'discounts', 'theme-editor', 'email-templates', 'store-builder'].includes(viewParam)) {
            setActiveView(viewParam);
        } else if (defaultView) {
            setActiveView(defaultView);
        }
    }, [viewParam, defaultView]);

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
            {/* Desktop Layout (3 Columns) */}
            <div className="hidden md:grid md:grid-cols-[30%_1fr_80px] w-full h-full">
                {/* Col 1: Chat Interface (30%) */}
                <div className="border-r border-border-custom h-full overflow-hidden bg-background">
                    {activeView === 'store-builder' ? (
                        <StoreBuilderChat 
                            messages={storeBuilder.messages}
                            isGenerating={storeBuilder.isGenerating}
                            prompt={storeBuilder.prompt}
                            setPrompt={storeBuilder.setPrompt}
                            handleGenerate={storeBuilder.handleGenerate}
                            handleFontSelection={storeBuilder.handleFontSelection}
                            stage={storeBuilder.stage}
                            progressStep={storeBuilder.progressStep}
                            PROGRESS_STEPS={storeBuilder.PROGRESS_STEPS}
                        />
                    ) : (
                        <ChatInterface
                            messages={messages}
                            onSend={sendMessage}
                            isLoading={isLoading}
                            onMessageComplete={markMessageComplete}
                            onTriggerDemo={triggerDemoMode}
                        />
                    )}
                </div>

                {/* Col 2: Main Content (60%) */}
                <main className="h-full flex flex-col min-h-0 overflow-hidden relative bg-background">
                    {activeView === 'products' && <ProductsPage />}
                    {activeView === 'orders' && <OrdersPage />}
                    {activeView === 'customers' && <CustomersPage />}
                    {activeView === 'previews' && <PreviewsPage />}
                    {activeView === 'analytics' && <AnalyticsPage />}
                    {activeView === 'discounts' && <DiscountsPage />}
                    {activeView === 'theme-editor' && <ThemeEditorPage />}
                    {activeView === 'email-templates' && <EmailTemplatesPage />}
                    {activeView === 'store-builder' && (
                        <StoreBuilderPreview 
                            config={storeBuilder.config}
                            currentView={storeBuilder.currentView}
                            setCurrentView={storeBuilder.setCurrentView}
                            regenerateVariant={storeBuilder.regenerateVariant}
                            onUpdateConfig={storeBuilder.setConfig}
                        />
                    )}
                    {/* Fallback for 'chat' view on desktop or others */}
                    {(activeView === 'chat' || !activeView) && <ProductsPage />}
                </main>

                {/* Col 3: Sidebar (10%) */}
                <div className="border-l border-border-custom h-full bg-sidebar">
                    <Sidebar
                        activeView={activeView}
                        onViewChange={setActiveView}
                        className="w-full h-full border-none"
                        showChat={false}
                    />
                </div>
            </div>

            {/* Mobile Layout (Original Stack) */}
            <div className="md:hidden flex flex-col h-full w-full">
                <header className="flex items-center justify-between px-6 py-4 border-b border-border-custom bg-background/80 backdrop-blur-md sticky top-0 z-40">
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
                    {activeView === 'store-builder' && (
                        <StoreBuilderChat 
                            messages={storeBuilder.messages}
                            isGenerating={storeBuilder.isGenerating}
                            prompt={storeBuilder.prompt}
                            setPrompt={storeBuilder.setPrompt}
                            handleGenerate={storeBuilder.handleGenerate}
                            handleFontSelection={storeBuilder.handleFontSelection}
                            stage={storeBuilder.stage}
                            progressStep={storeBuilder.progressStep}
                            PROGRESS_STEPS={storeBuilder.PROGRESS_STEPS}
                        />
                    )}
                </main>

                <Sidebar
                    activeView={activeView}
                    onViewChange={setActiveView}
                    isMobileOpen={isMobileSidebarOpen}
                    onMobileClose={() => setIsMobileSidebarOpen(false)}
                    showChat={true}
                />
            </div>
        </div>
    );
}
