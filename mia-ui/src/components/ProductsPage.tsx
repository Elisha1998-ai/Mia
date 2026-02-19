"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Settings2,
  Check,
  ChevronDown,
  Trash2,
  Edit2,
  Share2,
  Package,
  Upload,
  Layers,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

import { AddProductModal } from './AddProductModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import * as Popover from '@radix-ui/react-popover';
import { useProducts } from '@/hooks/useData';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: 'Active' | 'Out of Stock' | 'Low Stock' | 'Draft' | 'AI Suggested';
  weight?: string;
  createdAt: string;
  image?: string;
  variants?: any[];
}

const ActionPopover = ({ product, onDelete, onEdit, onShare }: { product: Product, onDelete: (id: string) => void, onEdit: (product: Product) => void, onShare: (product: Product) => void }) => {
    return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-all">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 min-w-[140px] animate-in fade-in zoom-in-95 duration-100"
          sideOffset={5}
          align="end"
        >
          <button 
            onClick={() => onEdit(product)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit Product
          </button>
          <button 
            onClick={() => onShare(product)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-colors font-medium"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <div className="h-px bg-border-custom my-1" />
          <button 
            onClick={() => onDelete(product.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-red-500 hover:bg-red-500/10 transition-colors font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

const StatusBadge = ({ status }: { status: Product['status'] }) => {
  const styles = {
    Active: 'text-emerald-500 bg-emerald-500/10',
    'Out of Stock': 'text-foreground/40 bg-foreground/5',
    'Low Stock': 'text-orange-500 bg-orange-500/10',
    Draft: 'text-foreground/30 bg-foreground/5',
    'AI Suggested': 'text-accent bg-accent/10',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${styles[status].split(' ')[0].replace('text-', 'bg-')}`} />
      <span className="text-[13px] font-medium">{status}</span>
    </div>
  );
};

const MobileProductCard = ({ 
  product, 
  isExpanded, 
  onToggle, 
  onDelete, 
  onEdit 
}: { 
  product: Product; 
  isExpanded: boolean; 
  onToggle: () => void; 
  onDelete: (id: string) => void;
  onEdit: (product: Product) => void;
}) => {
  return (
    <div className={`border-b border-border-custom transition-colors ${isExpanded ? 'bg-foreground/[0.02]' : ''}`}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-foreground/5 overflow-hidden border border-border-custom flex-shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-foreground/20">
                <Package className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground line-clamp-1">{product.name}</span>
            <span className="text-[12px] text-foreground/40 font-medium">{product.sku}</span>
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
              <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Stock</span>
              <span className={`text-sm font-bold ${product.stock === 0 ? 'text-red-500' : 'text-foreground/60'}`}>
                {product.stock} units
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Category</span>
              <span className="text-sm font-bold text-foreground/60">{product.category}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-foreground/30 uppercase tracking-wider">Weight</span>
              <span className="text-sm font-bold text-foreground/60">{product.weight || '—'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(product)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl text-sm font-bold transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button 
              onClick={() => onDelete(product.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-500 rounded-xl text-sm font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const ProductsPage = () => {
  const { data: session } = useSession();
  const { products: apiProducts, loading, fetchProducts, deleteProduct, createProduct, updateProduct } = useProducts();
  const [products, setProducts] = React.useState<Product[]>([]);
  
  React.useEffect(() => {
    fetchProducts();
  }, []);

  React.useEffect(() => {
    if (apiProducts) {
      const mappedProducts: Product[] = apiProducts.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: p.price,
        stock: p.stock_quantity,
        category: p.platform || 'General',
        status: p.stock_quantity === 0 ? 'Out of Stock' : p.stock_quantity < 10 ? 'Low Stock' : 'Active',
        createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Recently',
        image: p.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
        variants: p.variants || []
      }));
      setProducts(mappedProducts);
    }
  }, [apiProducts]);

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('All Status');
  const [sortBy, setSortBy] = React.useState<string>('Newest');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [expandedProductId, setExpandedProductId] = React.useState<string | null>(null);
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; id: string | null; isBulk: boolean }>({
    isOpen: false,
    id: null,
    isBulk: false
  });

  const handleExport = () => {
    if (filteredProducts.length === 0) return;
    
    const headers = ['Name', 'SKU', 'Price', 'Stock', 'Category', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(p => [
        `"${p.name}"`,
        `"${p.sku}"`,
        p.price,
        p.stock,
        `"${p.category}"`,
        `"${p.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'products');
    
    if (session?.user?.id) {
      formData.append('user_id', session.user.id);
    }

    try {
      // Use proxy route to handle authentication and CORS
      const response = await fetch(`/api/mia/ingest-csv?type=products${session?.user?.id ? `&user_id=${session.user.id}` : ''}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Import failed');
      
      const result = await response.json();
      alert(`Successfully imported ${result.imported_count} products!`);
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error('Import error:', error);
      alert('Failed to import products. Make sure the backend is running.');
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);



  const filteredProducts = React.useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'Newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'Price: Low to High') return a.price - b.price;
        if (sortBy === 'Price: High to Low') return b.price - a.price;
        if (sortBy === 'Stock: Low to High') return a.stock - b.stock;
        return 0;
      });
  }, [products, searchQuery, statusFilter, sortBy]);

  const toggleAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteModal({ isOpen: true, id, isBulk: false });
  };

  const handleBulkDelete = () => {
    setDeleteModal({ isOpen: true, id: null, isBulk: true });
  };

  const confirmDelete = async () => {
    if (deleteModal.isBulk) {
      try {
        await Promise.all(selectedIds.map(id => deleteProduct(id)));
        setProducts(products.filter(p => !selectedIds.includes(p.id)));
        setSelectedIds([]);
      } catch (error) {
        console.error('Failed to delete products:', error);
      }
    } else if (deleteModal.id) {
      try {
        await deleteProduct(deleteModal.id);
        setProducts(products.filter(p => p.id !== deleteModal.id));
        setSelectedIds(selectedIds.filter(i => i !== deleteModal.id));
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
    setDeleteModal({ isOpen: false, id: null, isBulk: false });
  };

  const handleBulkStatusUpdate = async (newStatus: Product['status']) => {
    try {
      await Promise.all(selectedIds.map(id => updateProduct(id, { status: newStatus })));
      setProducts(products.map(p => selectedIds.includes(p.id) ? { ...p, status: newStatus } : p));
      setSelectedIds([]);
    } catch (error) {
      console.error('Failed to update products status:', error);
    }
  };

  const inventoryStats = React.useMemo(() => {
    const lowStock = products.filter(p => p.status === 'Low Stock').length;
    const outOfStock = products.filter(p => p.status === 'Out of Stock').length;
    return { lowStock, outOfStock };
  }, [products]);

  const handleAddProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, {
          name: productData.name,
          sku: productData.sku,
          price: productData.price,
          stock_quantity: productData.stock,
          description: productData.description,
          platform: productData.category,
          image_url: productData.image,
          variants: productData.variants?.map((v: any) => ({
            name: v.name,
            sku: v.sku,
            price: parseFloat(v.price) || null,
            stock_quantity: parseInt(v.stock) || 0,
            image_url: v.image_url
          }))
        });
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
      } else {
        const created = await createProduct({
          name: productData.name,
          sku: productData.sku,
          price: productData.price,
          stock_quantity: productData.stock,
          description: productData.description,
          platform: productData.category,
          image_url: productData.image,
          variants: productData.variants?.map((v: any) => ({
            name: v.name,
            sku: v.sku,
            price: parseFloat(v.price) || null,
            stock_quantity: parseInt(v.stock) || 0,
            image_url: v.image_url
          }))
        });
        setProducts([created, ...products]);
      }
      setIsAddModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product. Please check your connection.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleShare = (product: Product) => {
    const shareUrl = `${window.location.origin}/storefront/products/${product.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Product link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading Products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleAddProduct}
        product={editingProduct}
      />
      
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null, isBulk: false })}
        onConfirm={confirmDelete}
        title={deleteModal.isBulk ? 'Delete Multiple Products' : 'Delete Product'}
        description={deleteModal.isBulk 
          ? `Are you sure you want to delete ${selectedIds.length} products? This action cannot be undone.`
          : 'Are you sure you want to delete this product? This action cannot be undone.'
        }
      />
      
      <div className="flex-1 flex flex-col bg-background h-full overflow-hidden animate-in fade-in duration-500">
        {/* Inventory Alerts Banner */}
        {(inventoryStats.lowStock > 0 || inventoryStats.outOfStock > 0) && (
          <div className="px-6 py-2 bg-orange-500/5 border-b border-orange-500/10 flex items-center gap-6 overflow-x-auto no-scrollbar">
            <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider flex-shrink-0">Inventory Alerts:</span>
            {inventoryStats.outOfStock > 0 && (
              <div 
                className="flex items-center gap-2 px-2 py-1 rounded-lg bg-red-500/10 text-red-500 cursor-pointer hover:bg-red-500/20 transition-all flex-shrink-0"
                onClick={() => setStatusFilter('Out of Stock')}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[12px] font-bold">{inventoryStats.outOfStock} Out of Stock</span>
              </div>
            )}
            {inventoryStats.lowStock > 0 && (
              <div 
                className="flex items-center gap-2 px-2 py-1 rounded-lg bg-orange-500/10 text-orange-500 cursor-pointer hover:bg-orange-500/20 transition-all flex-shrink-0"
                onClick={() => setStatusFilter('Low Stock')}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[12px] font-bold">{inventoryStats.lowStock} Low Stock</span>
              </div>
            )}
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border-custom">
          <div className="flex items-center gap-4 flex-1 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
              <input 
                type="text" 
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-foreground/5 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 ring-foreground/10 text-foreground transition-all font-medium"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors whitespace-nowrap font-medium">
                    {statusFilter}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 w-[160px]" align="start" sideOffset={8}>
                    {['All Status', 'Active', 'Low Stock', 'Out of Stock', 'AI Suggested'].map((status) => (
                      <button 
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors font-medium"
                      >
                        {status}
                      </button>
                    ))}
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>

              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors whitespace-nowrap font-medium">
                    Sort: {sortBy}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 w-[180px]" align="start" sideOffset={8}>
                    {['Newest', 'Price: Low to High', 'Price: High to Low', 'Stock: Low to High'].map((sort) => (
                      <button 
                        key={sort}
                        onClick={() => setSortBy(sort)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors font-medium"
                      >
                        {sort}
                      </button>
                    ))}
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 pl-2 border-l border-border-custom animate-in slide-in-from-left-2 duration-200">
                <span className="text-[12px] font-bold text-foreground/30 uppercase tracking-wider mr-2">{selectedIds.length} Selected:</span>
                
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-bold hover:bg-foreground/5 text-foreground/60 transition-colors">
                      Update Status
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </Popover.Trigger>
                  <Popover.Portal>
                    <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 w-[140px]" align="start" sideOffset={8}>
                      {['Active', 'Draft', 'Archived'].map((status) => (
                        <button 
                          key={status}
                          onClick={() => handleBulkStatusUpdate(status as any)}
                          className="w-full text-left px-3 py-2 text-[13px] hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-colors font-medium"
                        >
                          {status}
                        </button>
                      ))}
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>

                <button 
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-foreground/5 text-foreground/60 transition-colors font-medium"
            >
              <Upload className="w-4 h-4" />
              Import
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                accept=".csv" 
                className="hidden" 
              />
            </button>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:brightness-110 transition-all shadow-lg shadow-accent/10 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Product
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-foreground/5 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                />
              </div>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddModalOpen(true);
                }}
                className="p-2.5 bg-accent text-white rounded-xl shadow-lg shadow-accent/20 flex-shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 text-[12px] font-bold text-foreground/60 whitespace-nowrap">
                    {statusFilter}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] py-1 w-[160px]" align="start" sideOffset={4}>
                    {['All Status', 'Active', 'Low Stock', 'Out of Stock', 'AI Suggested'].map((status) => (
                      <button 
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 font-medium"
                      >
                        {status}
                      </button>
                    ))}
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>

              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 text-[12px] font-bold text-foreground/60 whitespace-nowrap">
                    Sort: {sortBy}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content className="bg-background border border-border-custom rounded-xl shadow-xl z-[110] py-1 w-[180px]" align="start" sideOffset={4}>
                    {['Newest', 'Price: Low to High', 'Price: High to Low', 'Stock: Low to High'].map((sort) => (
                      <button 
                        key={sort}
                        onClick={() => setSortBy(sort)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-foreground/5 text-foreground/60 font-medium"
                      >
                        {sort}
                      </button>
                    ))}
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            </div>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block flex-1 overflow-auto scrollbar-hide">
          <table className="w-full border-collapse text-left min-w-[1000px]">
            <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border-custom">
              <tr>
                <th className="pl-6 py-4 w-12">
                  <button 
                    onClick={toggleAll}
                    className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                      selectedIds.length === filteredProducts.length && filteredProducts.length > 0
                        ? 'bg-accent border-accent text-white' 
                        : 'border-border-custom hover:border-foreground/30'
                    }`}
                  >
                    {selectedIds.length === filteredProducts.length && filteredProducts.length > 0 && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                </th>
                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Product Name</th>
                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">SKU</th>
                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Price</th>
                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Category</th>
                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Weight</th>
                <th className="px-4 py-4 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">Status</th>
                <th className="pr-6 py-4 w-16 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-custom">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-foreground/40">
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-foreground/30">
                      <Package className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-sm">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                <tr 
                  key={product.id}
                  className={`group transition-colors hover:bg-foreground/[0.02] ${
                    selectedIds.includes(product.id) ? 'bg-foreground/[0.03]' : ''
                  }`}
                >
                  <td className="pl-6 py-4">
                    <button 
                      onClick={() => toggleOne(product.id)}
                      className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                        selectedIds.includes(product.id) 
                          ? 'bg-accent border-accent text-white' 
                          : 'border-border-custom group-hover:border-foreground/30'
                      }`}
                    >
                      {selectedIds.includes(product.id) && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-foreground/5 overflow-hidden border border-border-custom flex-shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-foreground/20">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-medium text-foreground">{product.name}</span>
                          {product.variants && product.variants.length > 0 && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider">
                              <Layers className="w-2.5 h-2.5" />
                              {product.variants.length} Variants
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-foreground/40">{product.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 rounded-lg bg-foreground/5 text-[11px] font-bold text-foreground/60 uppercase tracking-wider border border-border-custom">
                      {product.sku}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[14px] font-medium text-foreground/80">₦{product.price.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-[14px] ${product.stock === 0 ? 'text-red-500 font-medium' : 'text-foreground/60'}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[14px] text-foreground/60">{product.category}</span>
                </td>
                  <td className="px-4 py-4">
                    <span className="text-[14px] text-foreground/60">{product.weight || '—'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="pr-6 py-4 text-right">
                    <ActionPopover product={product} onDelete={handleDelete} onEdit={handleEdit} onShare={handleShare} />
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden flex-1 overflow-auto scrollbar-hide">
          <div className="flex items-center justify-between px-4 py-4 border-b border-border-custom bg-foreground/[0.02]">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">
              Product <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground/40 uppercase tracking-wider">
              Status <ChevronDown className="w-3 h-3" />
            </div>
          </div>
          <div className="flex flex-col">
            {filteredProducts.map((product) => (
              <MobileProductCard 
                key={product.id} 
                product={product} 
                isExpanded={expandedProductId === product.id}
                onToggle={() => setExpandedProductId(expandedProductId === product.id ? null : product.id)}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-foreground/30">
                <Package className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination Footer (Desktop) */}
        <div className="hidden md:flex px-6 py-4 border-t border-border-custom items-center justify-between bg-background">
          <div className="text-sm text-foreground/40 font-medium">
            Showing <span className="font-medium text-foreground/60">{filteredProducts.length}</span> of {products.length} products
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 disabled:opacity-30 disabled:hover:bg-transparent transition-colors font-medium" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 transition-colors font-medium">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pagination Footer (Mobile) */}
      <div className="md:hidden px-4 py-6 border-t border-border-custom flex items-center justify-center bg-background">
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-foreground/40 disabled:opacity-30">
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg text-foreground/40 disabled:opacity-30">
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1 mx-2">
            {[1, 2, 3].map((page) => (
              <button 
                key={page}
                className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-all ${
                  page === 1 
                    ? 'bg-foreground/[0.05] text-foreground border border-border-custom' 
                    : 'text-foreground/40 hover:text-foreground/60'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-foreground/30">...</span>
            <button className="w-8 h-8 rounded-lg text-[13px] font-medium text-foreground/40">16</button>
          </div>

          <button className="p-2 rounded-lg text-foreground/40 hover:text-foreground">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-foreground/40 hover:text-foreground">
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      </div>
    </>
  );
};

export default ProductsPage;