"use client";

import React from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, Eye, Mail, Download, DollarSign, ShoppingBag, TrendingDown, Loader2, AlertTriangle } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { useDigitalOrders } from "@/hooks/useDigitalOrders";
import type { DigitalOrder } from "@/hooks/useDigitalOrders";

type OrderStatus = "completed" | "refunded" | "disputed";

const STATUS_MAP: Record<OrderStatus, { dot: string; text: string; badge: string }> = {
    completed: { dot: "bg-emerald-500", text: "text-emerald-500", badge: "bg-emerald-500/10 text-emerald-500" },
    disputed: { dot: "bg-orange-500", text: "text-orange-500", badge: "bg-orange-500/10 text-orange-500" },
    refunded: { dot: "bg-foreground/30", text: "text-foreground/40", badge: "bg-foreground/5 text-foreground/40" },
};

const StatusBadge = ({ status }: { status: OrderStatus }) => (
    <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${STATUS_MAP[status].dot}`} />
        <span className={`text-[12px] font-medium capitalize ${STATUS_MAP[status].text}`}>{status}</span>
    </div>
);

const MobileOrderCard = ({ order, onView }: { order: DigitalOrder; onView: (o: DigitalOrder) => void }) => {
    const [expanded, setExpanded] = React.useState(false);
    const status = (order.status ?? "completed") as OrderStatus;
    return (
        <div className="border-b border-border-custom last:border-b-0">
            <button className="w-full flex items-start gap-3 px-4 py-4 text-left" onClick={() => setExpanded(e => !e)}>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">{order.order_number}</span>
                        <StatusBadge status={status} />
                    </div>
                    <p className="text-[14px] font-semibold text-foreground truncate">{order.customer_name}</p>
                    <p className="text-[12px] text-foreground/40 truncate">{order.product_title}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[15px] font-bold text-foreground">₦{order.amount_paid.toLocaleString()}</span>
                    <span className="text-[11px] text-foreground/30">{new Date(order.createdAt).toLocaleDateString()}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-foreground/20 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </div>
            </button>
            {expanded && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-foreground/[0.03] rounded-xl p-3 mb-3 flex flex-col gap-1.5">
                        <p className="text-[12px] text-foreground/40">{order.customer_email}</p>
                        <p className="text-[12px] text-foreground/40">Product type: <span className="text-foreground/60 font-medium">{order.product_type}</span></p>
                        {order.payment_method && <p className="text-[12px] text-foreground/40">Payment: <span className="text-foreground/60 font-medium">{order.payment_method}</span></p>}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onView(order)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm font-semibold transition-colors"
                        >
                            <Eye className="w-4 h-4" /> View
                        </button>
                        <a
                            href={`mailto:${order.customer_email}?subject=Order ${order.order_number} Inquiry`}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm font-semibold transition-colors"
                        >
                            <Mail className="w-4 h-4" /> Email
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export const DigitalOrdersTab = ({ onMobileRecordSale, onDesktopRecordSale }: { onMobileRecordSale?: () => void; onDesktopRecordSale?: () => void }) => {
    const { orders, isLoading, error } = useDigitalOrders();
    const [searchQuery, setSearchQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("All Status");
    const [viewOrder, setViewOrder] = React.useState<DigitalOrder | null>(null);

    const filtered = orders.filter(o => {
        const matchSearch = o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.product_title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === "All Status" || o.status === statusFilter.toLowerCase();
        return matchSearch && matchStatus;
    });

    const totalRevenue = orders.reduce((s, o) => s + (o.status === "completed" ? o.amount_paid : 0), 0);
    const paidCount = orders.filter(o => o.status === "completed").length;
    const refundCount = orders.filter(o => o.status === "refunded").length;

    if (isLoading && orders.length === 0) return (
        <div className="flex-1 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="text-sm text-foreground/40 font-medium">Loading orders...</p>
            </div>
        </div>
    );

    if (error && orders.length === 0) return (
        <div className="flex-1 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3 text-foreground/40 text-center max-w-xs">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <p className="text-sm font-medium">Failed to load orders</p>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col bg-background h-full overflow-hidden animate-in fade-in duration-500">
            <div className="px-4 md:px-6 py-4 md:py-5 border-b border-border-custom flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-[16px] md:text-[18px] font-bold text-foreground">Orders</h1>
                    <p className="text-[12px] text-foreground/40 mt-0.5 hidden md:block">Track every sale and payment</p>
                </div>
                <button
                    onClick={() => {
                        if (typeof window !== 'undefined' && window.innerWidth < 768) {
                            onMobileRecordSale?.();
                        } else {
                            onDesktopRecordSale?.();
                        }
                    }}
                    className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-accent/10">
                    <span className="hidden sm:inline">+ Record Sale</span><span className="sm:hidden">+ Record Sales</span>
                </button>
            </div>

            {/* Stats */}
            <div className="flex md:grid md:grid-cols-3 gap-px bg-border-custom border-b border-border-custom overflow-x-auto md:overflow-visible">
                {[
                    { label: "Revenue", value: `₦${(totalRevenue / 1000).toFixed(0)}k`, color: "text-emerald-500", icon: <DollarSign className="w-4 h-4" /> },
                    { label: "Paid", value: paidCount.toString(), color: "text-accent", icon: <ShoppingBag className="w-4 h-4" /> },
                    { label: "Refunded", value: refundCount.toString(), color: "text-red-400", icon: <TrendingDown className="w-4 h-4" /> },
                ].map(s => (
                    <div key={s.label} className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-background flex-shrink-0 min-w-[110px] md:min-w-0">
                        <div className={`hidden md:flex p-1.5 md:p-2 rounded-xl bg-foreground/5 ${s.color}`}>{s.icon}</div>
                        <div>
                            <p className="text-[10px] md:text-[11px] font-bold text-foreground/30 uppercase tracking-wider">{s.label}</p>
                            <p className={`text-[16px] md:text-[18px] font-bold ${s.color}`}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 px-4 md:px-6 py-3 border-b border-border-custom">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                    <input type="text" placeholder="Search orders..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-foreground/5 border-none rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 ring-foreground/10 text-foreground font-medium" />
                </div>
                <Popover.Root>
                    <Popover.Trigger asChild>
                        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 border border-border-custom whitespace-nowrap">
                            <span className="hidden sm:inline">{statusFilter}</span><span className="sm:hidden">Filter</span> <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 w-[150px]" align="end" sideOffset={8}>
                            {["All Status", "Completed", "Refunded", "Disputed"].map(s => (
                                <button key={s} onClick={() => setStatusFilter(s)} className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 hover:text-foreground font-medium">{s}</button>
                            ))}
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex-1 overflow-auto scrollbar-hide">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-foreground/30 gap-2">
                        <Download className="w-10 h-10 opacity-20" /><p className="text-sm">No orders found</p>
                    </div>
                ) : filtered.map(o => <MobileOrderCard key={o.id} order={o} onView={setViewOrder} />)}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block flex-1 overflow-auto scrollbar-hide">
                <table className="w-full border-collapse text-left min-w-[800px]">
                    <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border-custom">
                        <tr>{["Order", "Product", "Customer", "Amount", "Status", "Date", ""].map((h, i) => (
                            <th key={i} className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider first:pl-6 last:pr-6 last:w-16">{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom">
                        {filtered.map(order => (
                            <tr key={order.id} className="group hover:bg-foreground/[0.02] transition-colors">
                                <td className="pl-6 px-4 py-4"><span className="px-2 py-1 rounded-lg bg-foreground/5 text-[11px] font-bold text-foreground/60 uppercase tracking-wider border border-border-custom">{order.order_number}</span></td>
                                <td className="px-4 py-4"><div className="flex flex-col"><span className="text-[14px] font-medium text-foreground line-clamp-1">{order.product_title}</span><span className="text-[12px] text-foreground/40">{order.product_type}</span></div></td>
                                <td className="px-4 py-4"><div className="flex flex-col"><span className="text-[14px] font-medium text-foreground">{order.customer_name}</span><span className="text-[12px] text-foreground/40">{order.customer_email}</span></div></td>
                                <td className="px-4 py-4"><span className="text-[14px] font-semibold text-foreground">₦{order.amount_paid.toLocaleString()}</span></td>
                                <td className="px-4 py-4"><StatusBadge status={(order.status ?? "completed") as OrderStatus} /></td>
                                <td className="px-4 py-4"><span className="text-[13px] text-foreground/40">{new Date(order.createdAt).toLocaleDateString()}</span></td>
                                <td className="pr-6 px-4 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => setViewOrder(order)}
                                            className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <a
                                            href={`mailto:${order.customer_email}?subject=Order ${order.order_number} Inquiry`}
                                            className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors"
                                        >
                                            <Mail className="w-4 h-4" />
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="flex flex-col items-center justify-center py-20 text-foreground/30 gap-2"><Download className="w-10 h-10 opacity-20" /><p className="text-sm">No orders</p></div>}
            </div>

            {/* View Order Detail Basic Modal */}
            {viewOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-background border border-border-custom w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 border-b border-border-custom flex items-center justify-between">
                            <h3 className="text-lg font-bold text-foreground">Order Details</h3>
                            <button onClick={() => setViewOrder(null)} className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 flex flex-col gap-6">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Order Reference</span>
                                    <span className="text-[14px] font-semibold text-foreground">{viewOrder.order_number}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Date</span>
                                    <span className="text-[14px] font-semibold text-foreground">{new Date(viewOrder.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Customer</span>
                                    <span className="text-[14px] font-semibold text-foreground">{viewOrder.customer_name}</span>
                                    <span className="text-[12px] text-foreground/40">{viewOrder.customer_email}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Product</span>
                                    <span className="text-[14px] font-semibold text-foreground">{viewOrder.product_title}</span>
                                    <span className="text-[12px] text-foreground/40 leading-none">{viewOrder.product_type}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Payment Status</span>
                                    <StatusBadge status={(viewOrder.status ?? "completed") as OrderStatus} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Amount Paid</span>
                                    <span className="text-[16px] font-bold text-emerald-500">₦{viewOrder.amount_paid.toLocaleString()}</span>
                                </div>
                            </div>
                            {viewOrder.note && (
                                <div className="bg-foreground/[0.03] border border-border-custom rounded-xl p-4">
                                    <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider mb-1 block">Note</span>
                                    <p className="text-[13px] text-foreground/70 italic leading-relaxed">"{viewOrder.note}"</p>
                                </div>
                            ) || (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Payment Method</span>
                                        <span className="text-[14px] font-medium text-foreground/60">{viewOrder.payment_method || "N/A"}</span>
                                    </div>
                                )}
                        </div>
                        <div className="p-4 border-t border-border-custom bg-foreground/[0.01] flex gap-3">
                            <a
                                href={`mailto:${viewOrder.customer_email}?subject=Order ${viewOrder.order_number} Information`}
                                className="flex-1 py-3 rounded-xl bg-accent text-white text-sm font-bold text-center hover:brightness-110 transition-all shadow-lg shadow-accent/20"
                            >
                                Contact Customer
                            </a>
                            <button onClick={() => setViewOrder(null)} className="flex-1 py-3 rounded-xl bg-foreground/5 text-foreground/60 text-sm font-semibold hover:bg-foreground/10 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
const X = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M18 6 6 18M6 6l12 12" />
    </svg>
);
