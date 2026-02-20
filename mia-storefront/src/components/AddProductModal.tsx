"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Package, Tag, DollarSign, Layers, Weight, Hash, ChevronDown, Upload, Image as ImageIcon, Loader2, Plus, Trash2, Sparkles, ChevronLeft } from 'lucide-react';

interface ProductVariant {
  id?: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
  imageUrl?: string;
}

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
    images: [] as string[],
    variants: [] as ProductVariant[],
    hasVariants: false
  });

  const [isGeneratingDescription, setIsGeneratingDescription] = React.useState(false);

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
        images: product.image ? [product.image] : [],
        variants: product.variants || [],
        hasVariants: (product.variants?.length > 0) || false
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
        images: [],
        variants: [],
        hasVariants: false
      });
    }
  }, [product, isOpen]);

  const generateAIDescription = async () => {
    if (!formData.name) {
      alert('Please enter a product name first.');
      return;
    }
    
    setIsGeneratingDescription(true);
    try {
      const response = await fetch('/api/mia/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate description');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, description: data.description }));
    } catch (error) {
      console.error('Error generating description:', error);
      // Fallback to local generation if backend is offline
      const mockDescription = `Experience the perfect blend of style and functionality with our ${formData.name}. Designed for those who appreciate quality, this ${formData.category || 'product'} features premium materials and expert craftsmanship. Perfect for daily use, it offers durability and performance that exceeds expectations. Elevate your lifestyle with this essential addition to your collection.`;
      setFormData(prev => ({ ...prev, description: mockDescription }));
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { name: '', sku: '', price: prev.price, stock: '0' }
      ]
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: string) => {
    setFormData(prev => {
      const newVariants = [...prev.variants];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: product?.id || Math.random().toString(36).substr(2, 9),
      price: parseFloat(formData.price) || 0,
      stock: formData.hasVariants 
        ? formData.variants.reduce((acc, v) => acc + (parseInt(v.stock) || 0), 0)
        : (parseInt(formData.stock) || 0),
      status: ((formData.hasVariants 
        ? formData.variants.reduce((acc, v) => acc + (parseInt(v.stock) || 0), 0)
        : (parseInt(formData.stock) || 0)) > 0) ? 'Active' : 'Out of Stock',
      image: formData.images[0] || '',
      variants: formData.hasVariants ? formData.variants : []
    });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[100] md:block hidden" />
        <Dialog.Content className="fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:max-w-[700px] bg-background md:border border-border-custom md:rounded-2xl z-[101] overflow-hidden flex flex-col h-full md:h-[70vh] inset-0 md:inset-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border-custom bg-background sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="md:hidden p-2 -ml-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <Dialog.Title className="text-lg font-bold text-foreground hidden md:block">
              {product ? 'Edit Product' : 'Add New Product'}
            </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button className="hidden md:block p-2 hover:bg-foreground/5 rounded-full transition-colors text-foreground/40 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
            <button 
              onClick={handleSubmit}
              className="md:hidden px-4 py-2 bg-foreground text-background rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide bg-background">
            <div className="w-full max-w-[560px] mx-auto flex flex-col gap-8 pb-10">
              
              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Basic Information</h3>
                <div className="grid gap-6">
                  <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Product Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Premium Cotton T-Shirt"
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                    />
                  </div>
                  <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">SKU Code (Optional)</label>
                    <input 
                      value={formData.sku}
                      onChange={e => setFormData({...formData, sku: e.target.value})}
                      placeholder="e.g. TSH-001"
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                    />
                  </div>
                  <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
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
                  <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-start gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80 pt-0 md:pt-2.5">Product Images</label>
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
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, hasVariants: !prev.hasVariants }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.hasVariants ? 'bg-accent' : 'bg-foreground/10'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.hasVariants ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="text-sm font-semibold text-foreground/80">This product has variants (e.g. size, color)</span>
                  </div>

                  {!formData.hasVariants ? (
                    <>
                      <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                        <label className="text-sm font-semibold text-foreground/80">Price (NGN)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-foreground/30">₦</span>
                          <input 
                            required={!formData.hasVariants}
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: e.target.value})}
                            placeholder="29.99"
                            className="w-full bg-foreground/5 border border-border-custom rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                        <label className="text-sm font-semibold text-foreground/80">Stock Quantity</label>
                        <input 
                          required={!formData.hasVariants}
                          type="number"
                          value={formData.stock}
                          onChange={e => setFormData({...formData, stock: e.target.value})}
                          placeholder="100"
                          className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-foreground/80">Product Variants</label>
                        <button
                          type="button"
                          onClick={addVariant}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-xs font-bold hover:bg-accent/20 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Variant
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.variants.map((variant, index) => (
                          <div key={index} className="flex flex-col md:grid md:grid-cols-[1fr_1fr_100px_80px_40px] gap-3 md:items-end bg-foreground/[0.02] p-3 rounded-xl border border-border-custom/50">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider ml-1">Variant Name</label>
                              <input
                                required
                                value={variant.name}
                                onChange={e => updateVariant(index, 'name', e.target.value)}
                                placeholder="Red / XL"
                                className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider ml-1">SKU</label>
                              <input
                                required
                                value={variant.sku}
                                onChange={e => updateVariant(index, 'sku', e.target.value)}
                                placeholder="SKU-001"
                                className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider ml-1">Price</label>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-foreground/30">₦</span>
                                <input
                                  required
                                  type="number"
                                  value={variant.price}
                                  onChange={e => updateVariant(index, 'price', e.target.value)}
                                  className="w-full bg-background border border-border-custom rounded-lg pl-5 pr-2 py-2 text-xs focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider ml-1">Stock</label>
                              <input
                                required
                                type="number"
                                value={variant.stock}
                                onChange={e => updateVariant(index, 'stock', e.target.value)}
                                className="w-full bg-background border border-border-custom rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="mb-1 p-2 text-foreground/30 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        
                        {formData.variants.length === 0 && (
                          <div className="text-center py-8 border-2 border-dashed border-border-custom/30 rounded-xl bg-foreground/[0.01]">
                            <Layers className="w-8 h-8 text-foreground/10 mx-auto mb-2" />
                            <p className="text-xs text-foreground/40 font-medium">No variants added yet. Click "Add Variant" to begin.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-6">Shipping & Details</h3>
                <div className="grid gap-6">
                  <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-center gap-2 md:gap-4">
                    <label className="text-sm font-semibold text-foreground/80">Weight (kg) (Optional)</label>
                    <input 
                      value={formData.weight}
                      onChange={e => setFormData({...formData, weight: e.target.value})}
                      placeholder="e.g. 0.5"
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all font-medium"
                    />
                  </div>
                  <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] md:items-start gap-2 md:gap-4">
                    <div className="flex flex-row md:flex-col gap-2 md:gap-1 pt-0 md:pt-2.5 items-center md:items-start justify-between md:justify-start">
                      <label className="text-sm font-semibold text-foreground/80">Description</label>
                      <button
                        type="button"
                        onClick={generateAIDescription}
                        disabled={isGeneratingDescription || !formData.name}
                        className="flex items-center gap-1.5 text-[10px] font-bold text-accent hover:text-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGeneratingDescription ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        AI GENERATE
                      </button>
                    </div>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Tell us about this product..."
                      rows={4}
                      className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 ring-accent/20 text-foreground transition-all resize-none font-medium"
                    />
                  </div>
                </div>
              </section>
            </div>
          </form>

          {/* Footer Actions */}
          <div className="hidden md:flex p-5 border-t border-border-custom bg-background items-center justify-end gap-3">
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
