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
import { DigitalProductsPage } from '@/components/DigitalProductsPage';
import { useChat } from '@/hooks/useChat';
import { useStoreBuilder } from '@/hooks/useStoreBuilder';
import { StoreBuilderChat } from '@/components/StoreBuilderChat';
import { useSettings } from '@/hooks/useData';

export function DashboardClient({ defaultView }: { defaultView?: 'chat' | 'products' | 'digital-products' | 'orders' | 'customers' | 'previews' | 'analytics' | 'discounts' | 'theme-editor' | 'email-templates' | 'store-builder' }) {
    const [mounted, setMounted] = React.useState(false);
    const searchParams = useSearchParams();
    const viewParam = searchParams.get('view') as 'chat' | 'products' | 'digital-products' | 'orders' | 'customers' | 'previews' | 'analytics' | 'discounts' | 'theme-editor' | 'email-templates' | 'store-builder' | null;

    const { messages, sendMessage, isLoading, markMessageComplete, triggerDemoMode } = useChat();
    const storeBuilder = useStoreBuilder();
    const [activeView, setActiveView] = React.useState<'chat' | 'products' | 'digital-products' | 'orders' | 'customers' | 'previews' | 'analytics' | 'discounts' | 'theme-editor' | 'email-templates' | 'store-builder'>(defaultView || 'chat');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
    const { settings, fetchSettings } = useSettings();
    const [chatWidth, setChatWidth] = React.useState(30); // Width in percentage
    const isResizing = React.useRef(false);

    React.useEffect(() => {
        const savedWidth = localStorage.getItem('chat-width');
        if (savedWidth) setChatWidth(Number(savedWidth));
    }, []);

    const startResizing = (e: React.MouseEvent) => {
        isResizing.current = true;
        document.addEventListener('mousemove', handleHighlightMove);
        document.addEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none'; // Prevent text selection
    };

    const stopResizing = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleHighlightMove);
        document.removeEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto'; // Re-enable text selection
    };

    const handleHighlightMove = (e: MouseEvent) => {
        if (!isResizing.current) return;
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 20 && newWidth < 45) { // Constraints
            setChatWidth(newWidth);
            localStorage.setItem('chat-width', newWidth.toString());
        }
    };

    React.useEffect(() => {
        setMounted(true);
        fetchSettings();
        if (viewParam && ['products', 'digital-products', 'orders', 'customers', 'previews', 'analytics', 'discounts', 'theme-editor', 'email-templates', 'store-builder'].includes(viewParam)) {
            setActiveView(viewParam);
        } else if (defaultView) {
            setActiveView(defaultView);
        }
    }, [viewParam, defaultView]);

    React.useEffect(() => {
        if (mounted) {
            const storedPrompt = localStorage.getItem('pony_onboarding_prompt');
            if (storedPrompt) {
                // Switch to chat view if not already there, unless it's store-builder which has its own chat
                if (activeView !== 'store-builder') {
                    setActiveView('chat');
                }
            }
        }
    }, [mounted, activeView]);

    const adminName = settings?.adminName || 'User';
    const initials = adminName
        .split(' ')
        .map((n: string) => n[0])
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

    // Shared StoreBuilderChat props
    const storeBuilderChatProps = {
        messages: storeBuilder.messages,
        isLoading: storeBuilder.isLoading,
        isBuilding: storeBuilder.isBuilding,
        buildProgress: storeBuilder.buildProgress,
        builtStoreUrl: storeBuilder.builtStoreUrl,
        PROGRESS_STEPS: storeBuilder.PROGRESS_STEPS,
        sendMessage: storeBuilder.sendMessage,
        handleFontSelection: storeBuilder.handleFontSelection,
        reset: storeBuilder.reset,
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden transition-colors relative">
            {/* Desktop Layout (3 Columns) */}
            <div className="hidden md:grid w-full h-full overflow-hidden" style={{ gridTemplateColumns: `${chatWidth}% 1fr 80px` }}>
                {/* Col 1: Chat Interface (Resizable) */}
                <div className="border-r border-border-custom h-full overflow-hidden bg-background relative group/resize">
                    {/* Resize Handle */}
                    <div
                        onMouseDown={startResizing}
                        className="absolute right-0 top-0 bottom-0 w-[4px] cursor-col-resize hover:bg-accent/40 active:bg-accent/60 transition-colors z-[100] group-active/resize:bg-accent/60" />

                    {/* Visual separation line */}
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-border-custom" />

                    {activeView === 'store-builder' ? (
                        <StoreBuilderChat {...storeBuilderChatProps} />
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

                {/* Col 2: Main Content */}
                <main className="h-full flex flex-col min-h-0 overflow-hidden relative bg-background">
                    {activeView === 'products' && <ProductsPage />}
                    {activeView === 'digital-products' && <DigitalProductsPage />}
                    {activeView === 'orders' && <OrdersPage />}
                    {activeView === 'customers' && <CustomersPage />}
                    {activeView === 'previews' && <PreviewsPage />}
                    {activeView === 'analytics' && <AnalyticsPage />}
                    {activeView === 'discounts' && <DiscountsPage />}
                    {activeView === 'theme-editor' && <ThemeEditorPage />}
                    {activeView === 'email-templates' && <EmailTemplatesPage />}
                    {/* Store builder: show a placeholder / live preview panel */}
                    {activeView === 'store-builder' && (
                        <div className="h-full flex flex-col items-center justify-center gap-4 text-center p-8">
                            <div className="w-20 h-20 rounded-3xl bg-foreground/5 border border-border flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-9 h-9 text-foreground/30" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground/60">Your store preview will appear here</h3>
                                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                                    Chat with Pony on the left to build your storefront step by step.
                                </p>
                            </div>
                            {storeBuilder.builtStoreUrl && (
                                <a
                                    href={storeBuilder.builtStoreUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 px-4 py-2 bg-foreground text-background text-xs font-medium rounded-xl hover:opacity-80 transition-opacity"
                                >
                                    Preview Store →
                                </a>
                            )}
                        </div>
                    )}
                    {/* Fallback for 'chat' view on desktop */}
                    {(activeView === 'chat' || !activeView) && <ProductsPage />}
                </main>

                {/* Col 3: Sidebar */}
                <div className="border-l border-border-custom h-full bg-sidebar">
                    <Sidebar
                        activeView={activeView}
                        onViewChange={setActiveView}
                        className="w-full h-full border-none"
                        showChat={false}
                    />
                </div>
            </div>

            {/* Mobile Layout */}
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
                    {activeView === 'digital-products' && <DigitalProductsPage />}
                    {activeView === 'orders' && <OrdersPage />}
                    {activeView === 'customers' && <CustomersPage />}
                    {activeView === 'previews' && <PreviewsPage />}
                    {activeView === 'analytics' && <AnalyticsPage />}
                    {activeView === 'discounts' && <DiscountsPage />}
                    {activeView === 'theme-editor' && <ThemeEditorPage />}
                    {activeView === 'email-templates' && <EmailTemplatesPage />}
                    {activeView === 'store-builder' && (
                        <StoreBuilderChat {...storeBuilderChatProps} />
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
