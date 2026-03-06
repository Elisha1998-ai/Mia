"use client";

import React from "react";
import { TrendingUp, DollarSign, ShoppingBag, Users, BookOpen, Video, Package, FileText, Music, Loader2, AlertTriangle } from "lucide-react";
import { useDigitalAnalytics } from "@/hooks/useDigitalAnalytics";

const TYPE_ICONS: Record<string, React.ReactNode> = {
    ebook: <BookOpen className="w-4 h-4" />,
    course: <Video className="w-4 h-4" />,
    membership: <Package className="w-4 h-4" />,
    service: <Package className="w-4 h-4" />,
    template: <FileText className="w-4 h-4" />,
    audio: <Music className="w-4 h-4" />,
    video: <Video className="w-4 h-4" />,
    other: <FileText className="w-4 h-4" />,
};

const TYPE_COLORS = ["bg-accent", "bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-orange-500"];

const MiniBarChart = ({ data }: { data: { day: string; revenue: number }[] }) => {
    const max = Math.max(...data.map(d => d.revenue), 1);
    return (
        <div className="flex items-end gap-1.5 md:gap-2 h-20 md:h-24">
            {data.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                    <div
                        className="w-full rounded-t-lg bg-accent/20 hover:bg-accent/40 transition-all cursor-default relative group"
                        style={{ height: `${(d.revenue / max) * 100}%`, minHeight: "4px" }}
                    >
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-foreground text-background text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none">
                            ₦{(d.revenue / 1000).toFixed(0)}k
                        </div>
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold text-foreground/30">{d.day}</span>
                </div>
            ))}
        </div>
    );
};

export const DigitalAnalyticsTab = () => {
    const { analytics, isLoading, error } = useDigitalAnalytics();

    if (isLoading && !analytics) return (
        <div className="flex-1 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="text-sm text-foreground/40 font-medium">Loading analytics...</p>
            </div>
        </div>
    );

    if (error && !analytics) return (
        <div className="flex-1 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3 text-foreground/40 text-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <p className="text-sm font-medium">Failed to load analytics</p>
            </div>
        </div>
    );

    const ov = analytics?.overview ?? { total_revenue: 0, total_orders: 0, unique_customers: 0, total_downloads: 0 };
    const topProducts = analytics?.top_products ?? [];
    const revenueByType = analytics?.revenue_by_type ?? [];
    const weeklyChart = analytics?.weekly_chart ?? [];
    const totalTypeRevenue = revenueByType.reduce((s, r) => s + r.revenue, 0) || 1;

    return (
        <div className="flex-1 flex flex-col bg-background h-full overflow-hidden animate-in fade-in duration-500">
            <div className="px-4 md:px-6 py-4 md:py-5 border-b border-border-custom">
                <h1 className="text-[16px] md:text-[18px] font-bold text-foreground">Analytics</h1>
                <p className="text-[12px] text-foreground/40 mt-0.5 hidden md:block">Performance overview of your digital store</p>
            </div>

            <div className="flex-1 overflow-auto scrollbar-hide">
                <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {[
                            { label: "Revenue", value: `₦${(ov.total_revenue / 1000).toFixed(0)}k`, icon: <DollarSign className="w-4 h-4 md:w-5 md:h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                            { label: "Sales", value: ov.total_orders.toString(), icon: <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />, color: "text-accent", bg: "bg-accent/10" },
                            { label: "Customers", value: ov.unique_customers.toString(), icon: <Users className="w-4 h-4 md:w-5 md:h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
                            { label: "Downloads", value: ov.total_downloads.toString(), icon: <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />, color: "text-purple-500", bg: "bg-purple-500/10" },
                        ].map(kpi => (
                            <div key={kpi.label} className="bg-foreground/[0.02] border border-border-custom rounded-xl md:rounded-2xl p-3 md:p-5 flex flex-col gap-2 md:gap-3 hover:border-foreground/10 transition-colors">
                                <div className={`hidden md:flex w-8 h-8 md:w-10 md:h-10 rounded-xl ${kpi.bg} ${kpi.color} items-center justify-center`}>
                                    {kpi.icon}
                                </div>
                                <div>
                                    <p className="text-[10px] md:text-[11px] font-bold text-foreground/30 uppercase tracking-wider">{kpi.label}</p>
                                    <p className="text-[20px] md:text-[24px] font-bold text-foreground mt-0.5">{kpi.value}</p>
                                    {analytics?.last_30_days && (
                                        <p className="text-[11px] md:text-[12px] font-semibold text-foreground/40 mt-0.5">
                                            Last 30d: ₦{(analytics.last_30_days.revenue / 1000).toFixed(0)}k
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Weekly Chart */}
                    <div className="bg-foreground/[0.02] border border-border-custom rounded-xl md:rounded-2xl p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <div>
                                <h3 className="text-[14px] md:text-[15px] font-bold text-foreground">Revenue — Last 7 Days</h3>
                                <p className="text-[11px] md:text-[12px] text-foreground/40 mt-0.5">Daily breakdown</p>
                            </div>
                            <span className="text-[12px] md:text-[13px] font-bold text-emerald-500">
                                ₦{(ov.total_revenue / 1000).toFixed(0)}k total
                            </span>
                        </div>
                        {weeklyChart.length > 0 ? (
                            <MiniBarChart data={weeklyChart} />
                        ) : (
                            <div className="h-20 flex items-center justify-center text-foreground/20 text-sm">
                                No sales this week yet
                            </div>
                        )}
                    </div>

                    {/* Bottom: Top Products + Revenue by Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-foreground/[0.02] border border-border-custom rounded-xl md:rounded-2xl p-4 md:p-6">
                            <h3 className="text-[14px] md:text-[15px] font-bold text-foreground mb-3 md:mb-4">Top Products</h3>
                            <div className="flex flex-col gap-3 md:gap-4">
                                {topProducts.length === 0 ? (
                                    <p className="text-sm text-foreground/30">No products yet</p>
                                ) : topProducts.map((p, i) => {
                                    const maxRevenue = topProducts[0].revenue || 1;
                                    return (
                                        <div key={p.id} className="flex flex-col gap-1.5 md:gap-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] font-bold text-foreground/20 w-4">{i + 1}</span>
                                                    <div className="p-1.5 rounded-lg bg-accent/10 text-accent flex-shrink-0">
                                                        {TYPE_ICONS[p.product_type] ?? <FileText className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-[12px] md:text-[13px] font-semibold text-foreground line-clamp-1">{p.title}</p>
                                                        <p className="text-[10px] md:text-[11px] text-foreground/40">{p.sales_count} sales</p>
                                                    </div>
                                                </div>
                                                <span className="text-[12px] md:text-[13px] font-bold text-foreground/80 ml-2 whitespace-nowrap">
                                                    ₦{(p.revenue / 1000).toFixed(0)}k
                                                </span>
                                            </div>
                                            <div className="h-1 rounded-full bg-foreground/10 overflow-hidden">
                                                <div className="h-full bg-accent/40 rounded-full" style={{ width: `${(p.revenue / maxRevenue) * 100}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-foreground/[0.02] border border-border-custom rounded-xl md:rounded-2xl p-4 md:p-6">
                            <h3 className="text-[14px] md:text-[15px] font-bold text-foreground mb-3 md:mb-4">Revenue by Type</h3>
                            <div className="flex flex-col gap-3">
                                {revenueByType.length === 0 ? (
                                    <p className="text-sm text-foreground/30">No sales data yet</p>
                                ) : revenueByType.map((item, i) => {
                                    const pct = Math.round((item.revenue / totalTypeRevenue) * 100);
                                    return (
                                        <div key={item.product_type} className="flex flex-col gap-1.5">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[12px] md:text-[13px] font-semibold text-foreground/70 capitalize">{item.product_type}s</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] md:text-[12px] text-foreground/40">₦{(item.revenue / 1000).toFixed(0)}k</span>
                                                    <span className="text-[11px] md:text-[12px] font-bold text-foreground/60">{pct}%</span>
                                                </div>
                                            </div>
                                            <div className="h-1.5 md:h-2 rounded-full bg-foreground/10 overflow-hidden">
                                                <div className={`h-full rounded-full ${TYPE_COLORS[i % TYPE_COLORS.length]} opacity-60`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
