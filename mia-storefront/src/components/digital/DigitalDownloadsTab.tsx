"use client";

import React from "react";
import { Search, Download, AlertCircle, CheckCircle, Clock, RefreshCw, ChevronLeft, ChevronRight, ChevronDown, Loader2, AlertTriangle } from "lucide-react";
import { useDigitalDownloads } from "@/hooks/useDigitalDownloads";
import type { DigitalDownload } from "@/hooks/useDigitalDownloads";

const getDownloadStatus = (r: DigitalDownload) => {
    if (r.status === "expired") return { label: "Expired", icon: <AlertCircle className="w-4 h-4" />, cls: "text-foreground/40" };
    if (r.status === "exhausted") return { label: "Limit Reached", icon: <AlertCircle className="w-4 h-4" />, cls: "text-orange-500" };
    return { label: "Active", icon: <CheckCircle className="w-4 h-4" />, cls: "text-emerald-500" };
};

const ProgressBar = ({ count, max }: { count: number; max: number }) => (
    <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-foreground/10 overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{ width: `${(count / max) * 100}%` }} />
        </div>
        <span className="text-[12px] font-semibold text-foreground/50 whitespace-nowrap">{count}/{max}</span>
    </div>
);

const MobileDownloadCard = ({ record }: { record: DigitalDownload }) => {
    const [expanded, setExpanded] = React.useState(false);
    const status = getDownloadStatus(record);
    return (
        <div className="border-b border-border-custom last:border-b-0">
            <button className="w-full flex items-start gap-3 px-4 py-4 text-left" onClick={() => setExpanded(e => !e)}>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">{record.order_number ?? "—"}</span>
                        <div className={`flex items-center gap-1 text-[12px] font-medium ${status.cls}`}>{status.icon} {status.label}</div>
                    </div>
                    <p className="text-[14px] font-semibold text-foreground truncate">{record.product_title}</p>
                    <p className="text-[12px] text-foreground/40">{record.customer_name ?? record.customer_email}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[12px] text-foreground/40">{record.expires_at ? `exp: ${new Date(record.expires_at).toLocaleDateString()}` : "No expiry"}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-foreground/20 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </div>
            </button>
            {expanded && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-foreground/[0.03] rounded-xl p-3 mb-3 flex flex-col gap-2">
                        <div><p className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider mb-1">Downloads</p><ProgressBar count={record.download_count} max={record.max_downloads} /></div>
                        <p className="text-[12px] text-foreground/40">{record.customer_email}</p>
                        <p className="text-[12px] text-foreground/40">Last: {record.last_downloaded_at ? new Date(record.last_downloaded_at).toLocaleDateString() : "Never"}</p>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm font-semibold transition-colors">
                        <RefreshCw className="w-4 h-4" /> Reset Link
                    </button>
                </div>
            )}
        </div>
    );
};

export const DigitalDownloadsTab = () => {
    const { downloads, isLoading, error } = useDigitalDownloads();
    const [searchQuery, setSearchQuery] = React.useState("");
    const filtered = downloads.filter(r =>
        (r.customer_name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.product_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.order_number ?? "").toLowerCase().includes(searchQuery.toLowerCase())
    );
    const active = downloads.filter(r => r.status === "active").length;
    const expired = downloads.filter(r => r.status === "expired").length;
    const exhausted = downloads.filter(r => r.status === "exhausted").length;

    if (isLoading && downloads.length === 0) return (
        <div className="flex-1 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <p className="text-sm text-foreground/40 font-medium">Loading downloads...</p>
            </div>
        </div>
    );

    if (error && downloads.length === 0) return (
        <div className="flex-1 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3 text-foreground/40 text-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <p className="text-sm font-medium">Failed to load downloads</p>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col bg-background h-full overflow-hidden animate-in fade-in duration-500">
            <div className="px-4 md:px-6 py-4 md:py-5 border-b border-border-custom">
                <h1 className="text-[16px] md:text-[18px] font-bold text-foreground">Downloads</h1>
                <p className="text-[12px] text-foreground/40 mt-0.5 hidden md:block">Monitor tokens, limits, and expiry</p>
            </div>

            <div className="flex md:grid md:grid-cols-3 gap-px bg-border-custom border-b border-border-custom overflow-x-auto md:overflow-visible">
                {[
                    { label: "Active", value: active.toString(), color: "text-emerald-500", icon: <CheckCircle className="w-4 h-4" /> },
                    { label: "Expired", value: expired.toString(), color: "text-foreground/40", icon: <Clock className="w-4 h-4" /> },
                    { label: "Limit Hit", value: exhausted.toString(), color: "text-orange-500", icon: <AlertCircle className="w-4 h-4" /> },
                ].map(s => (
                    <div key={s.label} className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-background flex-shrink-0 min-w-[110px] md:min-w-0">
                        <div className={`hidden md:flex p-1.5 md:p-2 rounded-xl bg-foreground/5 ${s.color}`}>{s.icon}</div>
                        <div><p className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider">{s.label}</p><p className={`text-[16px] md:text-[18px] font-bold ${s.color}`}>{s.value}</p></div>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2 px-4 md:px-6 py-3 border-b border-border-custom">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                    <input type="text" placeholder="Search downloads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full bg-foreground/5 border-none rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 ring-foreground/10 text-foreground font-medium" />
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex-1 overflow-auto scrollbar-hide">
                {filtered.length === 0 ? <div className="flex flex-col items-center justify-center py-20 text-foreground/30 gap-2"><Download className="w-10 h-10 opacity-20" /><p className="text-sm">No records</p></div>
                    : filtered.map(r => <MobileDownloadCard key={r.id} record={r} />)}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block flex-1 overflow-auto scrollbar-hide">
                <table className="w-full border-collapse text-left min-w-[900px]">
                    <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border-custom">
                        <tr>{["Order", "Product", "Customer", "Downloads", "Expires", "Last Activity", "Status", ""].map((h, i) => (
                            <th key={i} className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider first:pl-6 last:pr-6 last:w-16">{h}</th>
                        ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom">
                        {filtered.map(r => {
                            const status = getDownloadStatus(r);
                            return (
                                <tr key={r.id} className="group hover:bg-foreground/[0.02] transition-colors">
                                    <td className="pl-6 px-4 py-4"><span className="px-2 py-1 rounded-lg bg-foreground/5 text-[11px] font-bold text-foreground/60 uppercase border border-border-custom">{r.order_number ?? "—"}</span></td>
                                    <td className="px-4 py-4"><span className="text-[14px] font-medium text-foreground line-clamp-1">{r.product_title}</span></td>
                                    <td className="px-4 py-4"><div className="flex flex-col"><span className="text-[14px] font-medium">{r.customer_name ?? r.customer_email}</span><span className="text-[12px] text-foreground/40">{r.customer_email}</span></div></td>
                                    <td className="px-4 py-4 w-[140px]"><ProgressBar count={r.download_count} max={r.max_downloads} /></td>
                                    <td className="px-4 py-4"><span className={`text-[13px] font-medium ${r.status === "expired" ? "text-red-400" : "text-foreground/60"}`}>{r.expires_at ? new Date(r.expires_at).toLocaleDateString() : "Never"}</span></td>
                                    <td className="px-4 py-4"><span className="text-[13px] text-foreground/40">{r.last_downloaded_at ? new Date(r.last_downloaded_at).toLocaleDateString() : "Never"}</span></td>
                                    <td className={`px-4 py-4`}><div className={`flex items-center gap-1.5 ${status.cls}`}>{status.icon}<span className="text-[13px] font-medium">{status.label}</span></div></td>
                                    <td className="pr-6 px-4 py-4 text-right"><button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-all"><RefreshCw className="w-4 h-4" /></button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="flex flex-col items-center justify-center py-20 text-foreground/30 gap-2"><Download className="w-10 h-10 opacity-20" /><p className="text-sm">No downloads</p></div>}
            </div>

            <div className="px-4 md:px-6 py-4 border-t border-border-custom flex items-center justify-between bg-background">
                <span className="text-sm text-foreground/40"><span className="text-foreground/60 font-semibold">{filtered.length}</span> of {downloads.length}</span>
                <div className="flex items-center gap-1">
                    <button disabled className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 disabled:opacity-30 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                    <button className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                </div>
            </div>
        </div>
    );
};
