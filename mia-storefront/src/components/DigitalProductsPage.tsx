"use client";

import React from 'react';
import {
    Search,
    Plus,
    MoreHorizontal,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Edit2,
    Share2,
    Download,
    FileText,
    Video,
    Music,
    Package,
    Check,
    ShoppingBag,
    TrendingUp,
    DollarSign,
    Link,
    BookOpen,
} from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { AddDigitalProductModal } from './AddDigitalProductModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

export type DigitalProductType = 'ebook' | 'course' | 'membership' | 'service' | 'template' | 'audio' | 'video' | 'other';
export type DigitalProductStatus = 'published' | 'draft' | 'archived';

export interface DigitalProduct {
    id: string;
    title: string;
    slug: string;
    product_type: DigitalProductType;
    price: number;
    compare_at_price?: number;
    currency: string;
    cover_image_url?: string;
    status: DigitalProductStatus;
    sales_count: number;
    revenue: number;
    file_name?: string;
    file_type?: string;
    file_url?: string;
    file_size_bytes?: number;
    description?: string;
    createdAt: string;
}

const TYPE_ICONS: Record<DigitalProductType, React.ReactNode> = {
    ebook: <BookOpen className="w-4 h-4" />,
    audio: <Music className="w-4 h-4" />,
    video: <Video className="w-4 h-4" />,
    other: <FileText className="w-4 h-4" />,
} as any;

const TYPE_LABELS: Record<string, string> = {
    ebook: 'Ebook',
    audio: 'Audio',
    video: 'Video',
    other: 'Other',
};

const StatusBadge = ({ status }: { status: DigitalProductStatus }) => {
    const styles: Record<DigitalProductStatus, string> = {
        published: 'text-emerald-500 bg-emerald-500/10',
        draft: 'text-foreground/30 bg-foreground/5',
        archived: 'text-foreground/40 bg-foreground/5',
    };
    const dotColor = styles[status].split(' ')[0].replace('text-', 'bg-');
    return (
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
            <span className="text-[13px] font-medium capitalize">{status}</span>
        </div>
    );
};

const TypeBadge = ({ type }: { type: DigitalProductType }) => (
    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[11px] font-bold uppercase tracking-wider">
        {TYPE_ICONS[type]}
        {TYPE_LABELS[type]}
    </span>
);

const ActionPopover = ({
    product,
    onEdit,
    onDelete,
    onCopyLink,
}: {
    product: DigitalProduct;
    onEdit: (p: DigitalProduct) => void;
    onDelete: (id: string) => void;
    onCopyLink: (p: DigitalProduct) => void;
}) => (
    <Popover.Root>
        <Popover.Trigger asChild>
            <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-all">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </Popover.Trigger>
        <Popover.Portal>
            <Popover.Content
                className="bg-background border border-border-custom rounded-xl z-[110] overflow-hidden py-1 min-w-[150px] animate-in fade-in zoom-in-95 duration-100 shadow-none"
                sideOffset={5}
                align="end"
            >
                <button
                    onClick={() => onEdit(product)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors font-medium"
                >
                    <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button
                    onClick={() => onCopyLink(product)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors font-medium"
                >
                    <Link className="w-4 h-4" /> Copy Link
                </button>
                <div className="h-px bg-border-custom my-1" />
                <button
                    onClick={() => onDelete(product.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-500/10 transition-colors font-medium"
                >
                    <Trash2 className="w-4 h-4" /> Delete
                </button>
            </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
);

const MobileProductCard = ({
    product,
    isExpanded,
    onToggle,
    onEdit,
    onDelete,
}: {
    product: DigitalProduct;
    isExpanded: boolean;
    onToggle: () => void;
    onEdit: (p: DigitalProduct) => void;
    onDelete: (id: string) => void;
}) => (
    <div className={`border-b border-border-custom transition-colors ${isExpanded ? 'bg-foreground/[0.02]' : ''}`}>
        <div className="flex items-center justify-between p-4 cursor-pointer" onClick={onToggle}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-foreground/5 overflow-hidden border border-border-custom flex-shrink-0 flex items-center justify-center text-foreground/30">
                    {product.cover_image_url
                        ? <img src={product.cover_image_url} alt={product.title} className="w-full h-full object-cover" />
                        : TYPE_ICONS[product.product_type]
                    }
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground line-clamp-1">{product.title}</span>
                    <TypeBadge type={product.product_type} />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <StatusBadge status={product.status} />
                <ChevronDown className={`w-4 h-4 text-foreground/20 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
        </div>
        {isExpanded && (
            <div className="px-4 pb-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 gap-4 bg-foreground/[0.03] rounded-xl p-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Price</span>
                        <span className="text-sm font-bold text-foreground">₦{product.price.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Sales</span>
                        <span className="text-sm font-bold text-foreground/60">{product.sales_count}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Revenue</span>
                        <span className="text-sm font-bold text-foreground/60">₦{product.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">File</span>
                        <span className="text-sm font-bold text-foreground/60 uppercase">{product.file_type || '—'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(product)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm font-bold transition-colors"
                    >
                        <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                        onClick={() => onDelete(product.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-xl text-sm font-bold transition-colors"
                    >
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                </div>
            </div>
        )}
    </div>
);

// --- Mock data for UI demonstration (replace with real API calls) ---
const MOCK_PRODUCTS: DigitalProduct[] = [
    {
        id: '1',
        title: 'The Ultimate Email Marketing Playbook',
        slug: 'email-marketing-playbook',
        product_type: 'ebook',
        price: 5000,
        compare_at_price: 9000,
        currency: 'NGN',
        status: 'published',
        sales_count: 47,
        revenue: 235000,
        file_name: 'email-marketing-playbook.pdf',
        file_type: 'pdf',
        description: 'The definitive guide to building an email list that converts.',
        createdAt: '2026-02-01',
    },
    {
        id: '2',
        title: 'Ecommerce Mastery Course',
        slug: 'ecommerce-mastery-course',
        product_type: 'course',
        price: 25000,
        currency: 'NGN',
        status: 'published',
        sales_count: 12,
        revenue: 300000,
        file_type: 'mp4',
        createdAt: '2026-02-10',
    },
    {
        id: '3',
        title: 'Premium Newsletter Membership',
        slug: 'premium-newsletter',
        product_type: 'membership',
        price: 2500,
        currency: 'NGN',
        status: 'draft',
        sales_count: 0,
        revenue: 0,
        createdAt: '2026-02-20',
    },
    {
        id: '4',
        title: 'Social Media Content Pack',
        slug: 'social-media-content-pack',
        product_type: 'template',
        price: 3500,
        currency: 'NGN',
        status: 'published',
        sales_count: 23,
        revenue: 80500,
        file_name: 'content-pack.zip',
        file_type: 'zip',
        createdAt: '2026-01-28',
    },
];

export const DigitalProductsPage = () => {
    const [products, setProducts] = React.useState<DigitalProduct[]>(MOCK_PRODUCTS);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [typeFilter, setTypeFilter] = React.useState('All Types');
    const [statusFilter, setStatusFilter] = React.useState('All Status');
    const [sortBy, setSortBy] = React.useState('Newest');
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState<DigitalProduct | null>(null);
    const [expandedId, setExpandedId] = React.useState<string | null>(null);
    const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string | null; isBulk: boolean }>({
        isOpen: false, id: null, isBulk: false,
    });

    const filteredProducts = React.useMemo(() => {
        return products
            .filter(p => {
                const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.slug.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesType = typeFilter === 'All Types' || p.product_type === typeFilter.toLowerCase();
                const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter.toLowerCase();
                return matchesSearch && matchesType && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === 'Newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                if (sortBy === 'Price: Low to High') return a.price - b.price;
                if (sortBy === 'Price: High to Low') return b.price - a.price;
                if (sortBy === 'Revenue: High to Low') return b.revenue - a.revenue;
                return 0;
            });
    }, [products, searchQuery, typeFilter, statusFilter, sortBy]);

    const totalRevenue = React.useMemo(() => products.reduce((s, p) => s + p.revenue, 0), [products]);
    const totalSales = React.useMemo(() => products.reduce((s, p) => s + p.sales_count, 0), [products]);
    const publishedCount = React.useMemo(() => products.filter(p => p.status === 'published').length, [products]);

    const toggleAll = () => {
        setSelectedIds(selectedIds.length === filteredProducts.length ? [] : filteredProducts.map(p => p.id));
    };
    const toggleOne = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleEdit = (product: DigitalProduct) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setDeleteModal({ isOpen: true, id, isBulk: false });
    };

    const handleBulkDelete = () => {
        setDeleteModal({ isOpen: true, id: null, isBulk: true });
    };

    const confirmDelete = () => {
        if (deleteModal.isBulk) {
            setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
        } else if (deleteModal.id) {
            setProducts(prev => prev.filter(p => p.id !== deleteModal.id));
        }
        setDeleteModal({ isOpen: false, id: null, isBulk: false });
    };

    const handleCopyLink = async (product: DigitalProduct) => {
        const url = `${window.location.origin}/shop/${product.slug}`;
        try {
            await navigator.clipboard.writeText(url);
            alert('Product link copied!');
        } catch {
            alert(`Link: ${url}`);
        }
    };

    const handleSave = (data: DigitalProduct) => {
        if (editingProduct) {
            setProducts(prev => prev.map(p => p.id === data.id ? data : p));
        } else {
            setProducts(prev => [{ ...data, id: crypto.randomUUID(), sales_count: 0, revenue: 0, createdAt: new Date().toISOString() }, ...prev]);
        }
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <>
            <AddDigitalProductModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
                onSave={handleSave}
                product={editingProduct}
            />
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null, isBulk: false })}
                onConfirm={confirmDelete}
                title={deleteModal.isBulk ? 'Delete Multiple Products' : 'Delete Product'}
                description={
                    deleteModal.isBulk
                        ? `Delete ${selectedIds.length} digital products? This cannot be undone.`
                        : 'Delete this digital product? This cannot be undone.'
                }
            />

            <div className="flex-1 flex flex-col bg-background h-full overflow-hidden animate-in fade-in duration-500">

                {/* Stats Bar */}
                <div className="hidden md:grid grid-cols-3 gap-px border-b border-border-custom bg-border-custom">
                    {[
                        { label: 'Total Revenue', value: `₦${totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-4 h-4" />, color: 'text-emerald-500' },
                        { label: 'Total Sales', value: totalSales.toString(), icon: <TrendingUp className="w-4 h-4" />, color: 'text-accent' },
                        { label: 'Live Products', value: publishedCount.toString(), icon: <ShoppingBag className="w-4 h-4" />, color: 'text-blue-500' },
                    ].map(stat => (
                        <div key={stat.label} className="flex items-center gap-3 px-6 py-4 bg-background">
                            <div className={`hidden md:flex p-2 rounded-xl bg-foreground/5 ${stat.color}`}>{stat.icon}</div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">{stat.label}</span>
                                <span className="text-[18px] font-bold text-foreground">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border-custom">
                    <div className="flex items-center gap-4 flex-1 max-w-3xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                            <input
                                type="text"
                                placeholder="Search products by name or slug..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-foreground/5 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 ring-foreground/10 text-foreground transition-all font-medium"
                            />
                        </div>

                        {/* Type Filter */}
                        <Popover.Root>
                            <Popover.Trigger asChild>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors whitespace-nowrap">
                                    {typeFilter} <ChevronDown className="w-4 h-4" />
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 w-[160px]" align="start" sideOffset={8}>
                                    {['All Types', 'Ebook', 'Audio', 'Video', 'Other'].map(t => (
                                        <button key={t} onClick={() => setTypeFilter(t)} className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors font-medium">{t}</button>
                                    ))}
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>

                        {/* Status Filter */}
                        <Popover.Root>
                            <Popover.Trigger asChild>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors whitespace-nowrap">
                                    {statusFilter} <ChevronDown className="w-4 h-4" />
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 w-[160px]" align="start" sideOffset={8}>
                                    {['All Status', 'Published', 'Draft', 'Archived'].map(s => (
                                        <button key={s} onClick={() => setStatusFilter(s)} className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors font-medium">{s}</button>
                                    ))}
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>

                        {/* Sort */}
                        <Popover.Root>
                            <Popover.Trigger asChild>
                                <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors whitespace-nowrap">
                                    Sort: {sortBy} <ChevronDown className="w-4 h-4" />
                                </button>
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 w-[200px]" align="start" sideOffset={8}>
                                    {['Newest', 'Price: Low to High', 'Price: High to Low', 'Revenue: High to Low'].map(s => (
                                        <button key={s} onClick={() => setSortBy(s)} className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors font-medium">{s}</button>
                                    ))}
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>

                        {selectedIds.length > 0 && (
                            <div className="flex items-center gap-2 pl-2 border-l border-border-custom animate-in slide-in-from-left-2 duration-200">
                                <span className="text-[12px] font-bold text-foreground/30 uppercase tracking-wider mr-2">{selectedIds.length} Selected:</span>
                                <button onClick={handleBulkDelete} className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-500/10 transition-colors">
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors">
                            <Download className="w-4 h-4" /> Export
                        </button>
                        <button
                            onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:brightness-110 transition-all"
                        >
                            <Plus className="w-4 h-4" /> Add Product
                        </button>
                    </div>
                </div>

                {/* Mobile Header */}
                <div className="md:hidden flex flex-col bg-background border-b border-border-custom">
                    <div className="px-4 py-4 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full bg-foreground/5 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                                />
                            </div>
                            <button
                                onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                                className="p-2.5 bg-accent text-white rounded-xl flex-shrink-0"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Mobile stats */}
                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-foreground/[0.03] rounded-xl p-3 flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider">Revenue</span>
                                <span className="text-sm font-bold text-foreground">₦{(totalRevenue / 1000).toFixed(0)}k</span>
                            </div>
                            <div className="bg-foreground/[0.03] rounded-xl p-3 flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider">Sales</span>
                                <span className="text-sm font-bold text-foreground">{totalSales}</span>
                            </div>
                            <div className="bg-foreground/[0.03] rounded-xl p-3 flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-wider">Live</span>
                                <span className="text-sm font-bold text-foreground">{publishedCount}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block flex-1 overflow-auto scrollbar-hide">
                    <table className="w-full border-collapse text-left min-w-[900px]">
                        <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border-custom">
                            <tr>
                                <th className="pl-6 py-4 w-12">
                                    <button
                                        onClick={toggleAll}
                                        className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedIds.length === filteredProducts.length && filteredProducts.length > 0
                                            ? 'bg-accent border-accent text-white'
                                            : 'border-border-custom hover:border-foreground/30'
                                            }`}
                                    >
                                        {selectedIds.length === filteredProducts.length && filteredProducts.length > 0 && <Check className="w-3 h-3 stroke-[3]" />}
                                    </button>
                                </th>
                                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Product</th>
                                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Type</th>
                                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Price</th>
                                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Sales</th>
                                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Revenue</th>
                                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">File</th>
                                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Status</th>
                                <th className="pr-6 py-4 w-16 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-custom">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center min-h-[300px] text-foreground/30">
                                            <Download className="w-12 h-12 mb-4 opacity-20" />
                                            <p className="text-sm">No digital products found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(product => (
                                    <tr
                                        key={product.id}
                                        className={`group transition-colors hover:bg-foreground/[0.02] ${selectedIds.includes(product.id) ? 'bg-foreground/[0.03]' : ''}`}
                                    >
                                        <td className="pl-6 py-4">
                                            <button
                                                onClick={() => toggleOne(product.id)}
                                                className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedIds.includes(product.id)
                                                    ? 'bg-accent border-accent text-white'
                                                    : 'border-border-custom group-hover:border-foreground/30'
                                                    }`}
                                            >
                                                {selectedIds.includes(product.id) && <Check className="w-3 h-3 stroke-[3]" />}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-16 rounded-xl bg-foreground/5 overflow-hidden border border-border-custom flex-shrink-0 flex items-center justify-center text-foreground/30 ring-1 ring-border-custom/50">
                                                    {product.cover_image_url
                                                        ? <img src={product.cover_image_url} alt={product.title} className="w-full h-full object-cover block" />
                                                        : <div className="p-3 opacity-40">{TYPE_ICONS[product.product_type]}</div>
                                                    }
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-medium text-foreground">{product.title}</span>
                                                    <span className="text-[12px] text-foreground/40">{product.slug}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <TypeBadge type={product.product_type} />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-medium text-foreground/80">₦{product.price.toLocaleString()}</span>
                                                {product.compare_at_price && (
                                                    <span className="text-[12px] text-foreground/30 line-through">₦{product.compare_at_price.toLocaleString()}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-[14px] text-foreground/60">{product.sales_count}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-[14px] font-medium text-foreground/80">₦{product.revenue.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="px-2 py-1 rounded-lg bg-foreground/5 text-[11px] font-bold text-foreground/60 uppercase tracking-wider border border-border-custom">
                                                {product.file_type || '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <StatusBadge status={product.status} />
                                        </td>
                                        <td className="pr-6 py-4 text-right">
                                            <ActionPopover product={product} onEdit={handleEdit} onDelete={handleDelete} onCopyLink={handleCopyLink} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile List */}
                <div className="md:hidden flex-1 overflow-auto scrollbar-hide">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border-custom bg-foreground/[0.02]">
                        <span className="text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Product</span>
                        <span className="text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Status</span>
                    </div>
                    {filteredProducts.map(product => (
                        <MobileProductCard
                            key={product.id}
                            product={product}
                            isExpanded={expandedId === product.id}
                            onToggle={() => setExpandedId(expandedId === product.id ? null : product.id)}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-foreground/30">
                            <Download className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-sm">No digital products found</p>
                        </div>
                    )}
                </div>

                {/* Pagination Footer */}
                <div className="hidden md:flex px-6 py-4 border-t border-border-custom items-center justify-between bg-background">
                    <div className="text-sm text-foreground/40 font-medium">
                        Showing <span className="font-medium text-foreground/60">{filteredProducts.length}</span> of {products.length} products
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 disabled:opacity-30 disabled:hover:bg-transparent transition-colors" disabled>
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DigitalProductsPage;
