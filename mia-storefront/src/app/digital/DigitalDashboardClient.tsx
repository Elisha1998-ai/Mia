"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { DigitalSidebar } from "@/components/digital/DigitalSidebar";
import { DigitalProductsTab } from "@/components/digital/DigitalProductsTab";
import { DigitalOrdersTab } from "@/components/digital/DigitalOrdersTab";
import { DigitalDownloadsTab } from "@/components/digital/DigitalDownloadsTab";
import { DigitalCustomersTab } from "@/components/digital/DigitalCustomersTab";
import { DigitalAnalyticsTab } from "@/components/digital/DigitalAnalyticsTab";
import { MobileAddProductPage } from "@/components/digital/MobileAddProductPage";
import { MobileEditProductPage } from "@/components/digital/MobileEditProductPage";
import { MobileRecordSalePage } from "@/components/digital/MobileRecordSalePage";
import { RecordSalePanel } from "@/components/digital/RecordSalePanel";
import { WelcomeHero } from "@/components/digital/WelcomeHero";
import { ChatInterface } from "@/components/ChatInterface";
import { useChat } from "@/hooks/useChat";
import { ArrowLeft, Menu, MessageSquare } from "lucide-react";
import type { DigitalProduct } from "@/components/DigitalProductsPage";

export type DigitalView = "products" | "orders" | "downloads" | "customers" | "analytics";
export type MobileScreen = null | "chat" | "add-product" | "edit-product" | "record-sale";

const VIEW_LABELS: Record<DigitalView, string> = {
    products: "Products", orders: "Orders", downloads: "Downloads",
    customers: "Customers", analytics: "Analytics",
};
const MOBILE_SCREEN_LABELS: Record<Exclude<MobileScreen, null>, string> = {
    chat: "Agent Chat", "add-product": "New Product",
    "edit-product": "Edit Product", "record-sale": "Record Sale",
};

export function DigitalDashboardClient() {
    const [mounted, setMounted] = React.useState(false);
    const [activeView, setActiveView] = React.useState<DigitalView>("products");
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
    const [mobileScreen, setMobileScreen] = React.useState<MobileScreen>(null);
    const [isRecordSalePanelOpen, setIsRecordSalePanelOpen] = React.useState(false);

    // Shared product state — lifted here so mobile pages can mutate it
    const [products, setProducts] = React.useState<DigitalProduct[]>([]);
    const [editingProduct, setEditingProduct] = React.useState<DigitalProduct | null>(null);
    const [chatWidth, setChatWidth] = React.useState(30);
    const isResizing = React.useRef(false);

    React.useEffect(() => {
        const savedWidth = localStorage.getItem('chat-width');
        if (savedWidth) setChatWidth(Number(savedWidth));
    }, []);

    const startResizing = (e: React.MouseEvent) => {
        isResizing.current = true;
        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'col-resize';
    };

    const stopResizing = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', stopResizing);
        document.body.style.cursor = 'default';
    };

    const handleResizeMove = (e: MouseEvent) => {
        if (!isResizing.current) return;
        const width = (e.clientX / window.innerWidth) * 100;
        if (width > 20 && width < 45) {
            setChatWidth(width);
            localStorage.setItem('chat-width', width.toString());
        }
    };

    const searchParams = useSearchParams();
    const { messages, sendMessage, isLoading, markMessageComplete, triggerDemoMode } = useChat();

    React.useEffect(() => {
        setMounted(true);
        const v = searchParams.get("view") as DigitalView | null;
        if (v && ["products", "orders", "downloads", "customers", "analytics"].includes(v)) {
            setActiveView(v);
        }
    }, [searchParams]);

    React.useEffect(() => {
        if (mounted) {
            const storedPrompt = localStorage.getItem('pony_onboarding_prompt');
            if (storedPrompt) {
                localStorage.removeItem('pony_onboarding_prompt');
                // Tiny delay ensures chat is fully mounted before sending
                setTimeout(() => {
                    sendMessage(storedPrompt);
                }, 500);
            }
        }
    }, [mounted, sendMessage]);

    if (!mounted) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading Digital Hub...</p>
                </div>
            </div>
        );
    }

    const handleMobileAdd = () => setMobileScreen("add-product");
    const handleMobileEdit = (product: DigitalProduct) => {
        setEditingProduct(product);
        setMobileScreen("edit-product");
    };
    const handleMobileRecordSale = () => setMobileScreen("record-sale");

    // Desktop Record Sale opens a slide-over panel instead
    const handleDesktopRecordSale = () => setIsRecordSalePanelOpen(true);

    const handleViewChange = (v: DigitalView) => {
        setActiveView(v);
        setMobileScreen(null); // always reset mobile screen on nav
        setIsMobileSidebarOpen(false);
    };

    const renderView = () => {
        switch (activeView) {
            case "products": return (
                <DigitalProductsTab
                    sharedProducts={products}
                    onSharedProductsChange={setProducts}
                    onMobileAdd={handleMobileAdd}
                    onMobileEdit={handleMobileEdit}
                />
            );
            case "orders": return (
                <DigitalOrdersTab
                    onMobileRecordSale={handleMobileRecordSale}
                    onDesktopRecordSale={handleDesktopRecordSale}
                />
            );
            case "downloads": return <DigitalDownloadsTab />;
            case "customers": return <DigitalCustomersTab />;
            case "analytics": return <DigitalAnalyticsTab />;
        }
    };

    // Determine if we should show the welcome screen
    // We show it if: there are no products, and only the initial AI greeting message exists
    const showWelcome = products.length === 0 && messages.length <= 1;

    if (showWelcome) {
        return (
            <div className="flex h-screen w-full bg-background overflow-hidden relative">
                {/* Background Blobs for styling */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

                <WelcomeHero
                    onSend={sendMessage}
                    isAnalyzing={isLoading}
                />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">

            {/* ── DESKTOP: 3-col layout ── */}
            <div className="hidden md:grid w-full h-full overflow-hidden"
                style={{ gridTemplateColumns: `${chatWidth}% 1fr 64px` }}>
                <div className="border-r border-border-custom h-full overflow-hidden bg-background relative group/resize">
                    {/* Resize Handle */}
                    <div
                        onMouseDown={startResizing}
                        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-accent/40 transition-colors z-[100] active:bg-accent" />
                    <ChatInterface messages={messages} onSend={sendMessage} isLoading={isLoading}
                        onMessageComplete={markMessageComplete} onTriggerDemo={triggerDemoMode} />
                </div>
                <main className="h-full flex flex-col min-h-0 overflow-hidden relative bg-background">
                    {renderView()}
                </main>
                <div className="border-l border-border-custom h-full bg-sidebar">
                    <DigitalSidebar activeView={activeView} onViewChange={handleViewChange} className="w-full h-full border-none" />
                </div>
            </div>

            {/* Desktop Record Sale Slide-over */}
            <RecordSalePanel isOpen={isRecordSalePanelOpen} onClose={() => setIsRecordSalePanelOpen(false)} />

            {/* ── MOBILE: Full-screen navigation stack ── */}
            <div className="md:hidden flex flex-col h-full w-full">

                {/* Mobile Header */}
                <header className="flex items-center justify-between px-4 py-3.5 border-b border-border-custom bg-background sticky top-0 z-40">
                    {mobileScreen ? (
                        <button onClick={() => { setMobileScreen(null); setEditingProduct(null); }}
                            className="flex items-center gap-2 -ml-1 p-1 text-foreground/60 hover:text-foreground transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-[14px] font-semibold">Back</span>
                        </button>
                    ) : (
                        <button onClick={() => setIsMobileSidebarOpen(true)} className="p-2 -ml-2 text-foreground/60 hover:text-foreground transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                    )}

                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            <span className="text-[13px] font-bold text-foreground">
                                {mobileScreen ? MOBILE_SCREEN_LABELS[mobileScreen] : "Digital Hub"}
                            </span>
                        </div>
                        {!mobileScreen && <span className="text-[11px] text-foreground/40 font-medium">{VIEW_LABELS[activeView]}</span>}
                    </div>

                    {!mobileScreen ? (
                        <button onClick={() => setMobileScreen("chat")} className="p-2 -mr-2 rounded-xl bg-accent/10 text-accent transition-colors">
                            <MessageSquare className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="w-9" />
                    )}
                </header>

                {/* Mobile Screen Router */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    {mobileScreen === "chat" ? (
                        <ChatInterface messages={messages} onSend={sendMessage} isLoading={isLoading}
                            onMessageComplete={markMessageComplete} onTriggerDemo={triggerDemoMode} />
                    ) : mobileScreen === "add-product" ? (
                        <MobileAddProductPage
                            onBack={() => setMobileScreen(null)}
                            onSave={(data) => {
                                setProducts(prev => [{ ...data, id: crypto.randomUUID(), sales_count: 0, revenue: 0, createdAt: new Date().toISOString() }, ...prev]);
                                setMobileScreen(null);
                            }}
                        />
                    ) : mobileScreen === "edit-product" && editingProduct ? (
                        <MobileEditProductPage
                            product={editingProduct}
                            onBack={() => { setMobileScreen(null); setEditingProduct(null); }}
                            onSave={(data) => {
                                setProducts(prev => prev.map(p => p.id === data.id ? data : p));
                                setMobileScreen(null);
                                setEditingProduct(null);
                            }}
                        />
                    ) : mobileScreen === "record-sale" ? (
                        <MobileRecordSalePage onBack={() => setMobileScreen(null)} />
                    ) : (
                        renderView()
                    )}
                </div>

                {!mobileScreen && (
                    <DigitalSidebar
                        activeView={activeView}
                        onViewChange={handleViewChange}
                        isMobileOpen={isMobileSidebarOpen}
                        onMobileClose={() => setIsMobileSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}
