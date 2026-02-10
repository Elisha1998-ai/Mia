"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Package, Tag, DollarSign, Layers, Weight, Hash, ChevronDown, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  product?: any; // Add this for editing
}

const CustomSelect = ({ value, onChange, options, icon: Icon }: { 
  value: string, 
  onChange: (val: string) => void, 
  options: string[],
  icon?: any
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground hover:border-foreground/20 transition-all font-medium"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-foreground/40" />}
          <span>{value}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-foreground/30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border-custom rounded-xl shadow-xl z-[110] overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors font-medium ${
                value === option 
                  ? 'bg-foreground/5 text-foreground' 
                  : 'text-foreground/60 hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ImageUpload = ({ images, onChange }: { images: string[], onChange: (images: string[]) => void }) => {
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 5 - images.length;
    if (remainingSlots <= 0) {
      alert('You can only upload up to 5 images.');
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
        
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Cloudinary Error Detail:', errorData);
          throw new Error(errorData.error?.message || 'Upload failed');
        }
        const data = await response.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload one or more images. Please check your Cloudinary configuration.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="grid grid-cols-5 gap-3">
      {images.map((img, index) => (
        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-border-custom group bg-foreground/5">
          <img src={img} alt="Product" className="w-full h-full object-cover" />
          <button 
            type="button"
            onClick={() => removeImage(index)}
            className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      {images.length < 5 && (
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-xl border-2 border-dashed border-border-custom hover:border-accent/40 hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-1 text-foreground/40 hover:text-accent disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Upload</span>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </button>
      )}

      {/* Placeholder slots to show the "row" structure if empty */}
      {Array.from({ length: Math.max(0, 4 - images.length - (uploading ? 0 : 0)) }).map((_, i) => (
        <div key={`empty-${i}`} className="aspect-square rounded-xl border border-dashed border-border-custom/30 bg-foreground/[0.01]" />
      ))}
    </div>
  );
};

export const AddProductModal = ({ isOpen, onClose, onSave, product }: AddProductModalProps) => {
  const [formData, setFormData] = React.useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
    category: '',
    weight: '',
    description: '',
    images: [] as string[]
  });

  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        category: product.category || '',
        weight: product.weight || '',
        description: product.description || '',
        images: product.image ? [product.image] : []
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        price: '',
        stock: '',
        category: '',
        weight: '',
        description: '',
        images: []
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: product?.id || Math.random().toString(36).substr(2, 9),
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      status: (parseInt(formData.stock) || 0) > 0 ? 'Active' : 'Out of Stock',
      image: formData.images[0] || '' // Use the first image as the main image
    });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[700px] bg-background border border-border-custom rounded-2xl z-[101] overflow-hidden flex flex-col h-[70vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-custom bg-background">
            <Dialog.Title className="text-lg font-bold text-foreground">
              {product ? 'Edit Product' : 'Add New Product'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-background">
            <div className="max-w-[560px] mx-auto flex flex-col gap-8">
              
              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Basic Information</h3>
                <div className="grid gap-6">
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Product Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Premium Cotton T-Shirt"
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">SKU Code (Optional)</label>
                    <input 
                      value={formData.sku}
                      onChange={e => setFormData({...formData, sku: e.target.value})}
                      placeholder="e.g. TSH-001"
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Category</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                      <input 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        placeholder="e.g. Apparel"
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                    <label className="text-sm font-semibold text-foreground/80 pt-2.5">Product Images</label>
                    <ImageUpload 
                      images={formData.images}
                      onChange={imgs => setFormData({...formData, images: imgs})}
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Pricing & Inventory</h3>
                <div className="grid gap-6">
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Price (NGN)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-foreground/30">₦</span>
                      <input 
                        required
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        placeholder="29.99"
                        className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Stock Quantity</label>
                    <input 
                      required
                      type="number"
                      value={formData.stock}
                      onChange={e => setFormData({...formData, stock: e.target.value})}
                      placeholder="100"
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Shipping & Details</h3>
                <div className="grid gap-6">
                  <div className="grid grid-cols-[140px_1fr] items-center gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Weight (kg) (Optional)</label>
                    <input 
                      value={formData.weight}
                      onChange={e => setFormData({...formData, weight: e.target.value})}
                      placeholder="e.g. 0.5"
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-start gap-4">
                    <label className="text-sm font-semibold text-foreground/80 pt-2.5">Description</label>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Tell us about this product..."
                      rows={3}
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all resize-none font-medium"
                    />
                  </div>
                </div>
              </section>
            </div>
          </form>

          {/* Footer */}
          <div className="p-5 border-t border-border-custom flex justify-end gap-3 bg-background">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-sm font-medium text-foreground/60 hover:bg-foreground/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 rounded-xl text-sm font-bold bg-accent text-white hover:brightness-110 transition-all shadow-lg shadow-accent/10 font-medium"
            >
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
