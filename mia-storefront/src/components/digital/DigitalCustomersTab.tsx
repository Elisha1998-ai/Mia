"use client";

import React from "react";
import { Search, ChevronLeft, ChevronRight, Users, ShoppingBag, DollarSign, Mail, Eye, ChevronDown, Loader2, AlertTriangle } from "lucide-react";
import { useDigitalCustomers } from "@/hooks/useDigitalCustomers";
import type { DigitalCustomer } from "@/hooks/useDigitalCustomers";

const Avatar = ({ name }: { name: string }) => (
    <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-[12px] font-bold text-accent flex-shrink-0">
        {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
    </div>
);

const MobileCustomerCard = ({ customer }: { customer: DigitalCustomer }) => {
    const [expanded, setExpanded] = React.useState(false);
    return (
        <div className="border-b border-border-custom last:border-b-0">
            <button className="w-full flex items-center gap-3 px-4 py-4 text-left" onClick={() => setExpanded(e => !e)}>
                <Avatar name={customer.name} />
                <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground">{customer.name}</p>
                    <p className="text-[12px] text-foreground/40 truncate">{customer.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[14px] font-bold text-foreground">₦{customer.total_spent.toLocaleString()}</span>
                    <div className="flex items-center gap-1">
                        <span className="text-[11px] text-foreground/30">{customer.order_count} order{customer.order_count !== 1 ? "s" : ""}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-foreground/20 transition-transform ${expanded ? "rotate-180" : ""}`} />
                    </div>
                </div>
            </button>
            {expanded && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-foreground/[0.03] rounded-xl p-3 mb-3">
                        <p className="text-[12px] text-foreground/40">First order: {new Date(customer.first_order_at).toLocaleDateString()}</p>
                        <p className="text-[12px] text-foreground/40 mt-1">Last order: {new Date(customer.last_order_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm font-semibold">
                            <Mail className="w-4 h-4" /> Email
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm font-semibold">
                            <Eye className="w-4 h-4" /> View
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const DigitalCustomersTab = () => {
    const { customers, isLoading, error } = useDigitalCustomers();
    const [searchQuery, setSearchQuery] = React.useState("");
    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalRevenue = customers.reduce((s, c) => s + c.total_spent, 0);
    const totalOrders = customers.reduce((s, c) => s + c.order_count, 0);
    const avgLTV = customers.length > 0 ? totalRevenue / customers.length : 0;

    if (isLoading && customers.length === 0) return (
        <div className="flex-1 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="text-sm text-foreground/40 font-medium">Loading customers...</p>
            </div>
        </div>
    );

    if (error && customers.length === 0) return (
        <div className="flex-1 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3 text-foreground/40 text-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <p className="text-sm font-medium">Failed to load customers</p>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col bg-background h-full overflow-hidden animate-in fade-in duration-500">
            <div className="px-4 md:px-6 py-4 md:py-5 border-b border-border-custom">
                <h1 className="text-[16px] md:text-[18px] font-bold text-foreground">Customers</h1>
                <p className="text-[12px] text-foreground/40 mt-0.5 hidden md:block">Your digital product buyers</p>
            </div>

            <div className="flex md:grid md:grid-cols-3 gap-px bg-border-custom border-b border-border-custom overflow-x-auto md:overflow-visible">
                {[
                    { label: "Buyers", value: customers.length.toString(), icon: <Users className="w-4 h-4" />, color: "text-accent" },
                    { label: "Orders", value: totalOrders.toString(), icon: <ShoppingBag className="w-4 h-4" />, color: "text-blue-500" },
                    { label: "Avg LTV", value: `₦${Math.round(avgLTV / 1000)}k`, icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-500" },
                ].map(s => (
                    <div key={s.label} className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-background flex-shrink-0 min-w-[110px] md:min-w-0">
                        <div className={`hidden md:flex p-1.5 md:p-2 rounded-xl bg-foreground/5 ${s.color}`}>{s.icon}</div>
                        <div><p className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider">{s.label}</p><p className="text-[16px] md:text-[18px] font-bold text-foreground">{s.value}</p></div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 px-4 md:px-6 py-3 border-b border-border-custom">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                    <input type="text" placeholder="Search customers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-foreground/5 border-none rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 ring-foreground/10 text-foreground font-medium" />
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex-1 overflow-auto scrollbar-hide">
                {filtered.length === 0 ? <div className="flex flex-col items-center justify-center py-20 text-foreground/30 gap-2"><Users className="w-10 h-10 opacity-20" /><p className="text-sm">No customers yet</p></div>
                    : filtered.map(c => <MobileCustomerCard key={c.id} customer={c} />)}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block flex-1 overflow-auto scrollbar-hide">
                <table className="w-full border-collapse text-left min-w-[800px]">
                    <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border-custom">
                        <tr>{["Customer", "Purchases", "Total Spent", "Last Purchase", "First Purchase", ""].map((h, i) => (
                            <th key={i} className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider first:pl-6 last:pr-6 last:w-20">{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom">
                        {filtered.map(c => (
                            <tr key={c.id} className="group hover:bg-foreground/[0.02] transition-colors">
                                <td className="pl-6 px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={c.name} />
                                        <div><p className="text-[14px] font-medium text-foreground">{c.name}</p><p className="text-[12px] text-foreground/40">{c.email}</p></div>
                                    </div>
                                </td>
                                <td className="px-4 py-4"><span className="text-[14px] text-foreground/60">{c.order_count}</span></td>
                                <td className="px-4 py-4"><span className="text-[14px] font-semibold text-foreground">₦{c.total_spent.toLocaleString()}</span></td>
                                <td className="px-4 py-4"><span className="text-[13px] text-foreground/40">{new Date(c.last_order_at).toLocaleDateString()}</span></td>
                                <td className="px-4 py-4"><span className="text-[13px] text-foreground/40">{new Date(c.first_order_at).toLocaleDateString()}</span></td>
                                <td className="pr-6 px-4 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors"><Mail className="w-4 h-4" /></button>
                                        <button className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="flex flex-col items-center justify-center py-20 text-foreground/30 gap-2"><Users className="w-10 h-10 opacity-20" /><p className="text-sm">No customers</p></div>}
            </div>

            <div className="px-4 md:px-6 py-4 border-t border-border-custom flex items-center justify-between bg-background">
                <span className="text-sm text-foreground/40"><span className="text-foreground/60 font-semibold">{filtered.length}</span> of {customers.length}</span>
                <div className="flex items-center gap-1">
                    <button disabled className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 disabled:opacity-30 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                    <button className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </div>
            </div>
        </div>
    );
};
