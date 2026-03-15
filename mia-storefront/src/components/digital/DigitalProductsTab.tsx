"use client";

import React from "react";
import {
    Search, Plus, MoreHorizontal, ChevronDown, ChevronLeft, ChevronRight,
    Trash2, Edit2, Link, BookOpen, Video, Music, FileText, Package,
    ShoppingBag, Check, Download, DollarSign, TrendingUp, AlertTriangle, Loader2, ExternalLink
} from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { AddDigitalProductModal } from "@/components/AddDigitalProductModal";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import type { DigitalProduct, DigitalProductType, DigitalProductStatus } from "@/components/DigitalProductsPage";
import { useDigitalProducts } from "@/hooks/useDigitalProducts";

const TYPE_ICONS: Record<string, React.ReactNode> = {
    ebook: <BookOpen className="w-4 h-4" />,
    audio: <Music className="w-4 h-4" />,
    video: <Video className="w-4 h-4" />,
    other: <FileText className="w-4 h-4" />,
};

const TYPE_LABELS: Record<string, string> = {
    ebook: "Ebook", audio: "Audio", video: "Video", other: "Other",
};

const STATUS_STYLES: Record<DigitalProductStatus, string> = {
    published: "text-emerald-500 bg-emerald-500/10",
    draft: "text-foreground/40 bg-foreground/5",
    archived: "text-foreground/30 bg-foreground/5",
};

const StatusBadge = ({ status }: { status: DigitalProductStatus }) => {
    const dotColor = STATUS_STYLES[status].split(" ")[0].replace("text-", "bg-");
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className="text-[12px] font-medium capitalize">{status}</span>
        </div>
    );
};

const TypeBadge = ({ type }: { type: DigitalProductType }) => (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
        {TYPE_ICONS[type]} {TYPE_LABELS[type]}
    </span>
);

const ActionPopover = ({ product, onEdit, onDelete, onCopyLink }: {
    product: DigitalProduct; onEdit: (p: DigitalProduct) => void;
    onDelete: (id: string) => void; onCopyLink: (p: DigitalProduct) => void;
}) => (
    <Popover.Root>
        <Popover.Trigger asChild>
            <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-all">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </Popover.Trigger>
        <Popover.Portal>
            <Popover.Content className="bg-background border border-border-custom rounded-xl z-[110] overflow-hidden py-1 min-w-[170px] animate-in fade-in zoom-in-95 duration-100 shadow-xl" sideOffset={5} align="end">
                <a href={`/shop/${product.slug}`} target="_blank" className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors font-medium border-b border-border-custom/50 mb-1 pb-2">
                    <ExternalLink className="w-4 h-4 text-accent" /> View Page
                </a>
                <button onClick={() => onEdit(product)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors font-medium"><Edit2 className="w-4 h-4" /> Edit</button>
                <button onClick={() => onCopyLink(product)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors font-medium"><Link className="w-4 h-4" /> Copy Link</button>
                <div className="h-px bg-border-custom my-1" />
                <button onClick={() => onDelete(product.id)} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-500/10 transition-colors font-medium"><Trash2 className="w-4 h-4" /> Delete</button>
            </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
);

// ── Mobile Card ──────────────────────────────────────────────────────────────
const MobileProductCard = ({ product, onEdit, onDelete, onCopyLink }: {
    product: DigitalProduct;
    onEdit: (p: DigitalProduct) => void;
    onDelete: (id: string) => void;
    onCopyLink: (p: DigitalProduct) => void;
}) => {
    const [expanded, setExpanded] = React.useState(false);
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    return (
        <div className="border-b border-border-custom last:border-b-0">
            <button className="w-full flex items-center gap-3 px-4 py-4 text-left" onClick={() => setExpanded(e => !e)}>
                <div className="w-11 h-11 rounded-xl bg-foreground/5 border border-border-custom flex-shrink-0 flex items-center justify-center text-foreground/30 overflow-hidden">
                    {product.cover_image_url
                        ? <img src={product.cover_image_url} alt={product.title} className="w-full h-full object-cover" />
                        : TYPE_ICONS[product.product_type]}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground truncate">{product.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <TypeBadge type={product.product_type} />
                        <StatusBadge status={product.status} />
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-[14px] font-bold text-foreground">₦{product.price.toLocaleString()}</span>
                    <ChevronDown className={`w-4 h-4 text-foreground/20 transition-transform ${expanded ? "rotate-180" : ""}`} />
                </div>
            </button>

            {expanded && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-3 gap-3 bg-foreground/[0.03] rounded-xl p-3 mb-3">
                        <div>
                            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider">Sales</p>
                            <p className="text-[14px] font-bold text-foreground mt-0.5">{product.sales_count}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider">Revenue</p>
                            <p className="text-[14px] font-bold text-foreground mt-0.5">₦{(product.revenue / 1000).toFixed(0)}k</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider">File</p>
                            <p className="text-[12px] font-bold text-foreground/50 mt-0.5 uppercase">{product.file_type || "—"}</p>
                        </div>
                    </div>

                    {!confirmDelete ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <a href={`/shop/${product.slug}`} target="_blank" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-accent text-white rounded-xl text-sm font-bold shadow-lg shadow-accent/20">
                                    <ExternalLink className="w-4 h-4" /> View Page
                                </a>
                                <button onClick={() => onCopyLink(product)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-foreground/5 text-foreground rounded-xl text-sm font-semibold">
                                    <Link className="w-4 h-4" /> Copy
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => onEdit(product)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm font-semibold transition-colors">
                                    <Edit2 className="w-4 h-4" /> Edit
                                </button>
                                <button onClick={() => setConfirmDelete(true)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-xl text-sm font-semibold transition-colors">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-red-500">
                                <AlertTriangle className="w-4 h-4" />
                                <p className="text-[13px] font-bold">Delete this product?</p>
                            </div>
                            <p className="text-[12px] text-foreground/40">This cannot be undone.</p>
                            <div className="flex gap-2">
                                <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 rounded-xl bg-foreground/5 text-foreground/60 text-sm font-semibold">Cancel</button>
                                <button onClick={() => onDelete(product.id)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold">Delete</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


export const DigitalProductsTab = ({
    sharedProducts,
    onSharedProductsChange,
    onMobileAdd,
    onMobileEdit,
}: {
    sharedProducts?: DigitalProduct[];
    onSharedProductsChange?: (products: DigitalProduct[]) => void;
    onMobileAdd?: () => void;
    onMobileEdit?: (product: DigitalProduct) => void;
}) => {
    const { products: apiProducts, isLoading, error, createProduct, updateProduct, deleteProduct } = useDigitalProducts();

    // Local state for UI
    const [searchQuery, setSearchQuery] = React.useState("");
    const [typeFilter, setTypeFilter] = React.useState("All Types");
    const [statusFilter, setStatusFilter] = React.useState("All Status");
    const [sortBy, setSortBy] = React.useState("Newest");
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState<DigitalProduct | null>(null);
    const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string | null; isBulk: boolean }>({ isOpen: false, id: null, isBulk: false });

    // Sync shared state with API data
    React.useEffect(() => {
        if (apiProducts.length > 0) onSharedProductsChange?.(apiProducts);
    }, [apiProducts]);

    const products = apiProducts.length > 0 ? apiProducts : (sharedProducts ?? []);

    const filtered = React.useMemo(() => products.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchType = typeFilter === "All Types" || p.product_type === typeFilter.toLowerCase();
        const matchStatus = statusFilter === "All Status" || p.status === statusFilter.toLowerCase();
        return matchSearch && matchType && matchStatus;
    }).sort((a, b) => {
        if (sortBy === "Newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "Price: Low to High") return a.price - b.price;
        if (sortBy === "Price: High to Low") return b.price - a.price;
        if (sortBy === "Revenue: High to Low") return b.revenue - a.revenue;
        return 0;
    }), [products, searchQuery, typeFilter, statusFilter, sortBy]);

    const totalRevenue = products.reduce((s, p) => s + p.revenue, 0);
    const totalSales = products.reduce((s, p) => s + p.sales_count, 0);
    const published = products.filter(p => p.status === "published").length;

    const toggleAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(p => p.id));
    const toggleOne = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

    const handleSave = async (data: DigitalProduct) => {
        try {
            if (editingProduct) {
                await updateProduct(data.id, data);
            } else {
                await createProduct(data);
            }
            setIsModalOpen(false);
            setEditingProduct(null);
        } catch (e: any) {
            alert(e.message ?? "Failed to save product");
        }
    };

    const confirmDelete = async () => {
        try {
            if (deleteModal.isBulk) {
                await Promise.all(selectedIds.map(id => deleteProduct(id)));
                setSelectedIds([]);
            } else if (deleteModal.id) {
                await deleteProduct(deleteModal.id);
            }
        } catch (e: any) {
            alert(e.message ?? "Failed to delete");
        }
        setDeleteModal({ isOpen: false, id: null, isBulk: false });
    };

    // Mobile inline delete — no modal
    const handleMobileDelete = async (id: string) => {
        try { await deleteProduct(id); } catch (e: any) { alert(e.message ?? "Failed to delete"); }
    };

    const [copyStatus, setCopyStatus] = React.useState<string | null>(null);

    const copyLink = async (p: DigitalProduct) => {
        const url = `${window.location.origin}/shop/${p.slug}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopyStatus(p.id);
            setTimeout(() => setCopyStatus(null), 2000);
        } catch {
            alert(`Link: ${url}`);
        }
    };

    // Loading state
    if (isLoading && products.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3 text-foreground/30">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    <p className="text-sm font-medium">Loading products...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && products.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3 text-foreground/40 max-w-xs text-center">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                    <p className="text-sm font-medium">Failed to load products</p>
                    <p className="text-[12px]">Check your connection and try refreshing.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <AddDigitalProductModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} onSave={handleSave} product={editingProduct} />
            <DeleteConfirmationModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, id: null, isBulk: false })} onConfirm={confirmDelete}
                title={deleteModal.isBulk ? "Delete Multiple" : "Delete Product"} description={deleteModal.isBulk ? `Delete ${selectedIds.length} products?` : "Delete this product? This cannot be undone."} />

            <div className="flex-1 flex flex-col bg-background h-full overflow-hidden animate-in fade-in duration-500">

                {/* Header */}
                <div className="px-4 md:px-6 py-4 md:py-5 border-b border-border-custom flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-[16px] md:text-[18px] font-bold text-foreground">Products</h1>
                        <p className="text-[12px] text-foreground/40 mt-0.5 hidden md:block">Manage your digital listings</p>
                    </div>
                    <button onClick={() => { if (typeof window !== 'undefined' && window.innerWidth < 768 && onMobileAdd) { onMobileAdd(); } else { setEditingProduct(null); setIsModalOpen(true); } }}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:brightness-110 transition-all">
                        <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Product</span><span className="sm:hidden">Add</span>
                    </button>
                </div>

                {/* Stats — mobile horizontal scroll, desktop grid */}
                <div className="flex md:grid md:grid-cols-3 gap-px bg-border-custom border-b border-border-custom overflow-x-auto md:overflow-visible">
                    {[
                        { label: "Revenue", value: `₦${(totalRevenue / 1000).toFixed(0)}k`, icon: <DollarSign className="w-4 h-4" />, color: "text-emerald-500" },
                        { label: "Sales", value: totalSales.toString(), icon: <TrendingUp className="w-4 h-4" />, color: "text-accent" },
                        { label: "Live", value: published.toString(), icon: <ShoppingBag className="w-4 h-4" />, color: "text-blue-500" },
                    ].map(s => (
                        <div key={s.label} className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 bg-background flex-shrink-0 min-w-[110px] md:min-w-0">
                            <div className={`hidden md:flex p-1.5 md:p-2 rounded-xl bg-foreground/5 ${s.color}`}>{s.icon}</div>
                            <div>
                                <p className="text-[10px] md:text-[11px] font-bold text-foreground/30 uppercase tracking-wider">{s.label}</p>
                                <p className="text-[16px] md:text-[18px] font-bold text-foreground">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search + Filters */}
                <div className="px-4 md:px-6 py-3 border-b border-border-custom flex items-center gap-2 md:gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                        <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-foreground/5 border-none rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 ring-foreground/10 text-foreground font-medium" />
                    </div>
                    {[
                        { label: typeFilter, options: ["All Types", "Ebook", "Audio", "Video", "Other"], set: setTypeFilter },
                        { label: statusFilter, options: ["All Status", "Published", "Draft", "Archived"], set: setStatusFilter },
                    ].map((f, i) => (
                        <Popover.Root key={i}>
                            <Popover.Trigger asChild>
                                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors whitespace-nowrap border border-border-custom">
                                    <span className="hidden sm:inline">{f.label}</span><span className="sm:hidden">Filter</span> <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content className="bg-background border border-border-custom rounded-xl z-[110] overflow-hidden py-1 min-w-[160px] shadow-none" align="end" sideOffset={8}>
                                    {f.options.map(o => <button key={o} onClick={() => f.set(o)} className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors font-medium">{o}</button>)}
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    ))}
                    {selectedIds.length > 0 && (
                        <button onClick={() => setDeleteModal({ isOpen: true, id: null, isBulk: true })} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors whitespace-nowrap">
                            <Trash2 className="w-4 h-4" /><span className="hidden sm:inline">Delete {selectedIds.length}</span>
                        </button>
                    )}
                </div>

                {/* ── MOBILE: Card list ── */}
                <div className="md:hidden flex-1 overflow-auto scrollbar-hide">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-foreground/30 gap-3">
                            <p className="text-sm">No products found</p>
                        </div>
                    ) : filtered.map(product => (
                        <MobileProductCard key={product.id} product={product}
                            onEdit={p => onMobileEdit ? onMobileEdit(p) : (setEditingProduct(p), setIsModalOpen(true))}
                            onDelete={handleMobileDelete}
                            onCopyLink={copyLink}
                        />
                    ))}
                </div>

                {/* ── DESKTOP: Table ── */}
                <div className="hidden md:block flex-1 overflow-auto scrollbar-hide">
                    <table className="w-full border-collapse text-left min-w-[900px]">
                        <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border-custom">
                            <tr>
                                <th className="pl-6 py-4 w-12">
                                    <button onClick={toggleAll} className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedIds.length === filtered.length && filtered.length > 0 ? "bg-accent border-accent text-white" : "border-border-custom hover:border-foreground/30"}`}>
                                        {selectedIds.length === filtered.length && filtered.length > 0 && <Check className="w-3 h-3 stroke-[3]" />}
                                    </button>
                                </th>
                                {["Product", "Type", "Price", "Sales", "Revenue", "File", "Status", ""].map((h, i) => (
                                    <th key={i} className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-custom">
                            {filtered.length === 0 ? (
                                <tr><td colSpan={9} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3 text-foreground/30">
                                        <Download className="w-10 h-10 opacity-20" />
                                        <p className="text-sm">No digital products found</p>
                                    </div>
                                </td></tr>
                            ) : filtered.map(product => (
                                <tr key={product.id} className={`group transition-colors hover:bg-foreground/[0.02] ${selectedIds.includes(product.id) ? "bg-foreground/[0.03]" : ""}`}>
                                    <td className="pl-6 py-4">
                                        <button onClick={() => toggleOne(product.id)} className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedIds.includes(product.id) ? "bg-accent border-accent text-white" : "border-border-custom group-hover:border-foreground/30"}`}>
                                            {selectedIds.includes(product.id) && <Check className="w-3 h-3 stroke-[3]" />}
                                        </button>
                                    </td>
                                    <td className="px-4 py-4 min-w-[300px]">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-16 h-16 rounded-xl bg-foreground/5 border border-border-custom flex-shrink-0 flex items-center justify-center text-foreground/30 overflow-hidden ring-1 ring-border-custom/50">
                                                {product.cover_image_url
                                                    ? <img src={product.cover_image_url} alt={product.title} className="w-full h-full object-cover block" />
                                                    : <div className="p-3 opacity-40">{TYPE_ICONS[product.product_type]}</div>
                                                }
                                            </div>
                                            <div className="flex flex-col gap-0.5 min-w-0">
                                                <a href={`/shop/${product.slug}`} target="_blank" className="text-[14px] font-bold text-foreground leading-tight hover:text-accent transition-colors truncate">
                                                    {product.title}
                                                </a>
                                                <p className="text-[12px] text-foreground/40 font-medium truncate flex items-center gap-1">
                                                    mia.com/shop/{product.slug}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4"><TypeBadge type={product.product_type} /></td>
                                    <td className="px-4 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-medium text-foreground/80">₦{product.price.toLocaleString()}</span>
                                            {product.compare_at_price && <span className="text-[12px] text-foreground/30 line-through">₦{product.compare_at_price.toLocaleString()}</span>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4"><span className="text-[14px] text-foreground/60">{product.sales_count}</span></td>
                                    <td className="px-4 py-4"><span className="text-[14px] font-medium text-foreground/80">₦{product.revenue.toLocaleString()}</span></td>
                                    <td className="px-4 py-4"><span className="px-2 py-1 rounded-lg bg-foreground/5 text-[11px] font-bold text-foreground/60 uppercase tracking-wider border border-border-custom">{product.file_type || "—"}</span></td>
                                    <td className="px-4 py-4"><StatusBadge status={product.status} /></td>
                                    <td className="pr-6 py-4 text-right relative">
                                        <div className="flex items-center justify-end gap-2">
                                            {copyStatus === product.id && (
                                                <span className="absolute right-20 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg animate-in fade-in slide-in-from-right-2 duration-300">
                                                    Copied!
                                                </span>
                                            )}
                                            <ActionPopover product={product} onEdit={p => { setEditingProduct(p); setIsModalOpen(true); }} onDelete={id => setDeleteModal({ isOpen: true, id, isBulk: false })} onCopyLink={copyLink} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 md:px-6 py-4 border-t border-border-custom flex items-center justify-between bg-background">
                    <span className="text-sm text-foreground/40 font-medium"><span className="text-foreground/60 font-semibold">{filtered.length}</span> of {products.length}</span>
                    <div className="flex items-center gap-1">
                        <button disabled className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 disabled:opacity-30 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                        <button className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>
            </div>
        </>
    );
};
