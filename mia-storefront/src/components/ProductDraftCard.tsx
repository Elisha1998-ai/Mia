import React, { useState } from 'react';
import { Package, Check, X, Edit2, DollarSign, Tag, Layers, FileText, Loader2 } from 'lucide-react';
import { apiService } from '@/lib/api';

interface ProductDraftData {
  name: string;
  price: number;
  stock_quantity: number;
  description?: string;
  category?: string;
}

interface ProductDraftCardProps {
  initialData: ProductDraftData;
  onConfirm: (data: ProductDraftData) => Promise<void>;
  onCancel?: () => void;
}

export const ProductDraftCard = ({
  initialData,
  onConfirm,
  onCancel
}: ProductDraftCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleUpdateDraft = () => {
    setIsEditing(false);
  };

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      await onConfirm(data);
      setIsSaved(true);
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isSaved) {
    return (
      <div className="w-full max-w-md my-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Product Added!</h3>
          <p className="text-sm text-foreground/60">
            <span className="font-semibold text-foreground">{data.name}</span> has been successfully added to your store.
          </p>
          <div className="mt-2 text-xs text-foreground/40 bg-background/50 px-3 py-1 rounded-full border border-border-custom">
             stock: {data.stock_quantity} • price: ₦{data.price}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md my-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div className="bg-background border border-border-custom rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
        {/* Header */}
        <div className="bg-foreground/[0.03] border-b border-border-custom p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Package className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground/90">New Product Draft</h3>
              <p className="text-[10px] text-foreground/50">Review details before adding</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-foreground/5 rounded-lg text-foreground/40 hover:text-foreground transition-colors"
              title="Edit Draft"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 flex items-center gap-1.5">
              <Tag className="w-3 h-3" /> Product Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full bg-foreground/[0.03] border border-border-custom rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent/50 transition-colors"
                placeholder="e.g. Silk Summer Dress"
              />
            ) : (
              <p className="text-sm font-medium text-foreground">{data.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 flex items-center gap-1.5">
                <DollarSign className="w-3 h-3" /> Price (₦)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={data.price}
                  onChange={(e) => setData({ ...data, price: Number(e.target.value) })}
                  className="w-full bg-foreground/[0.03] border border-border-custom rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent/50 transition-colors"
                  placeholder="0.00"
                />
              ) : (
                <p className="text-sm font-medium text-foreground">₦{data.price.toLocaleString()}</p>
              )}
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 flex items-center gap-1.5">
                <Layers className="w-3 h-3" /> Stock
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={data.stock_quantity}
                  onChange={(e) => setData({ ...data, stock_quantity: Number(e.target.value) })}
                  className="w-full bg-foreground/[0.03] border border-border-custom rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent/50 transition-colors"
                  placeholder="0"
                />
              ) : (
                <p className="text-sm font-medium text-foreground">{data.stock_quantity} units</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> Description
            </label>
            {isEditing ? (
              <textarea
                value={data.description || ''}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                className="w-full bg-foreground/[0.03] border border-border-custom rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent/50 transition-colors min-h-[80px] resize-none"
                placeholder="Product description..."
              />
            ) : (
              <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
                {data.description || 'No description provided.'}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-foreground/[0.02] border-t border-border-custom flex items-center justify-end gap-3">
          {isEditing ? (
             <>
              <button
                onClick={() => {
                  setData(initialData);
                  setIsEditing(false);
                }}
                className="px-4 py-2 text-xs font-bold text-foreground/60 hover:text-foreground transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDraft}
                className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-bold hover:bg-accent/90 transition-all flex items-center gap-2"
              >
                <Check className="w-3 h-3" />
                Update Draft
              </button>
             </>
          ) : (
            <>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-xs font-bold text-foreground/60 hover:text-foreground transition-colors"
                >
                  Discard
                </button>
              )}
              <button
                onClick={handleConfirm}
                disabled={isSaving}
                className="px-6 py-2 bg-foreground text-background rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
              >
                {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                Confirm & Add Product
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
