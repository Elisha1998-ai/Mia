"use client";

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { X, Upload, FileText } from 'lucide-react';
import type { DigitalProduct, DigitalProductType, DigitalProductStatus } from './DigitalProductsPage';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: DigitalProduct) => void;
    product?: DigitalProduct | null;
}

const PRODUCT_TYPES: { value: DigitalProductType; label: string }[] = [
    { value: 'ebook', label: 'Ebook' },
    { value: 'audio', label: 'Audio' },
    { value: 'video', label: 'Video' },
    { value: 'other', label: 'Other' },
];

const InputField = ({
    label,
    id,
    children,
    hint,
}: {
    label: string;
    id: string;
    children: React.ReactNode;
    hint?: string;
}) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-[13px] font-semibold text-foreground/60 uppercase tracking-wider">
            {label}
        </label>
        {children}
        {hint && <p className="text-[12px] text-foreground/30">{hint}</p>}
    </div>
);

export const AddDigitalProductModal = ({ isOpen, onClose, onSave, product }: Props) => {
    const isEdit = !!product;

    const [title, setTitle] = React.useState('');
    const [slug, setSlug] = React.useState('');
    const [productType, setProductType] = React.useState<DigitalProductType>('audio');
    const [price, setPrice] = React.useState('');
    const [compareAtPrice, setCompareAtPrice] = React.useState('');
    const [status, setStatus] = React.useState<DigitalProductStatus>('draft');
    const [coverImageUrl, setCoverImageUrl] = React.useState('');
    const [fileName, setFileName] = React.useState('');
    const [fileType, setFileType] = React.useState('');
    const [fileUrl, setFileUrl] = React.useState('');
    const [fileSizeBytes, setFileSizeBytes] = React.useState<number | undefined>();
    const [description, setDescription] = React.useState('');
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [uploadError, setUploadError] = React.useState('');

    // Sync form when editing
    React.useEffect(() => {
        if (product) {
            setTitle(product.title);
            setSlug(product.slug);
            setProductType(product.product_type);
            setPrice(product.price.toString());
            setCompareAtPrice(product.compare_at_price?.toString() || '');
            setStatus(product.status);
            setCoverImageUrl(product.cover_image_url || '');
            setFileName(product.file_name || '');
            setFileType(product.file_type || '');
            setFileUrl(product.file_url || '');
            setFileSizeBytes(product.file_size_bytes);
            setDescription(product.description || '');
        } else {
            setTitle('');
            setSlug('');
            setProductType('audio');
            setPrice('');
            setCompareAtPrice('');
            setStatus('draft');
            setCoverImageUrl('');
            setFileName('');
            setFileType('');
            setFileUrl('');
            setFileSizeBytes(undefined);
            setDescription('');
        }
    }, [product, isOpen]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setFileType(file.name.split('.').pop() || '');
        setFileSizeBytes(file.size);
        setIsUploading(true);
        setUploadProgress(0);
        setUploadError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'Bloume AI');

        try {
            const xhr = new XMLHttpRequest();
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dfr2gzbvc';
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/upload`, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percent);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    setFileUrl(response.secure_url);
                    setIsUploading(false);
                } else {
                    const response = JSON.parse(xhr.responseText);
                    setUploadError(response.error?.message || 'Upload failed');
                    setIsUploading(false);
                }
            };

            xhr.onerror = () => {
                setUploadError('Network error during upload');
                setIsUploading(false);
            };

            xhr.send(formData);
        } catch (error) {
            console.error('Upload error:', error);
            setUploadError('Failed to upload file');
            setIsUploading(false);
        }
    };

    // Auto-generate slug from title
    const handleTitleChange = (val: string) => {
        setTitle(val);
        if (!isEdit) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !price) return;
        onSave({
            id: product?.id || '',
            title: title.trim(),
            slug,
            product_type: productType,
            price: parseFloat(price),
            compare_at_price: compareAtPrice ? parseFloat(compareAtPrice) : undefined,
            currency: 'NGN',
            cover_image_url: coverImageUrl || undefined,
            status,
            description: description.trim(),
            file_name: fileName || undefined,
            file_type: fileType || undefined,
            file_url: fileUrl || undefined,
            file_size_bytes: fileSizeBytes,
            sales_count: product?.sales_count || 0,
            revenue: product?.revenue || 0,
            createdAt: product?.createdAt || new Date().toISOString(),
        });
        onClose(); // Ensure modal closes immediately
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] animate-in fade-in duration-200" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-background border border-border-custom rounded-2xl z-[201] animate-in fade-in zoom-in-95 duration-200 scrollbar-hide">
                    <VisuallyHidden>
                        <Dialog.Title>{isEdit ? 'Edit Digital Product' : 'Add Digital Product'}</Dialog.Title>
                        <Dialog.Description>Fill in the details to {isEdit ? 'update' : 'create'} a digital product.</Dialog.Description>
                    </VisuallyHidden>

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-border-custom sticky top-0 bg-background z-10">
                        <div className="flex flex-col">
                            <h2 className="text-[15px] font-bold text-foreground">
                                {isEdit ? 'Edit Product' : 'New Digital Product'}
                            </h2>
                            <p className="text-[12px] text-foreground/40 mt-0.5">
                                {isEdit ? 'Update your digital product details' : 'Sell ebooks, courses, templates & more'}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
                        {/* Type Selector */}
                        <InputField label="Product Type" id="product-type">
                            <div className="grid grid-cols-4 gap-2">
                                {PRODUCT_TYPES.map(t => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => setProductType(t.value)}
                                        className={`px-3 py-2 rounded-xl text-[12px] font-bold border transition-all ${productType === t.value
                                            ? 'bg-accent/10 border-accent text-accent'
                                            : 'border-border-custom text-foreground/40 hover:bg-foreground/5 hover:text-foreground hover:border-foreground/20'
                                            }`}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </InputField>

                        {/* Title */}
                        <InputField label="Product Title" id="digital-title">
                            <input
                                id="digital-title"
                                type="text"
                                placeholder="e.g. The Ultimate Email Marketing Guide"
                                value={title}
                                onChange={e => handleTitleChange(e.target.value)}
                                required
                                className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ring-accent/30 transition-all font-medium font-semibold"
                            />
                        </InputField>

                        {/* Description */}
                        <InputField label="Description" id="digital-description" hint="Detailed info about what the customer is buying.">
                            <textarea
                                id="digital-description"
                                rows={4}
                                placeholder="Write a few lines about this product..."
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ring-accent/30 transition-all font-medium resize-none shadow-sm"
                            />
                        </InputField>

                        {/* Slug */}
                        <InputField label="Slug (URL)" id="digital-slug" hint="Auto-generated from title. This is your product's public URL path.">
                            <div className="flex items-center gap-2 bg-foreground/5 border border-border-custom rounded-xl pl-4 overflow-hidden">
                                <span className="text-[12px] text-foreground/30 whitespace-nowrap">/shop/</span>
                                <input
                                    id="digital-slug"
                                    type="text"
                                    value={slug}
                                    onChange={e => setSlug(e.target.value)}
                                    className="flex-1 bg-transparent py-2.5 pr-4 text-sm text-foreground focus:outline-none font-medium"
                                />
                            </div>
                        </InputField>

                        {/* Pricing */}
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Price (₦)" id="digital-price">
                                <input
                                    id="digital-price"
                                    type="number"
                                    placeholder="5000"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    required
                                    min={0}
                                    className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ring-accent/30 transition-all font-medium"
                                />
                            </InputField>
                            <InputField label="Compare-at Price (₦)" id="digital-compare-price" hint="Shows as strikethrough">
                                <input
                                    id="digital-compare-price"
                                    type="number"
                                    placeholder="9000"
                                    value={compareAtPrice}
                                    onChange={e => setCompareAtPrice(e.target.value)}
                                    min={0}
                                    className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ring-accent/30 transition-all font-medium"
                                />
                            </InputField>
                        </div>

                        {/* Cover Image */}
                        <InputField label="Cover Image URL" id="digital-cover" hint="This image is what customers see on your storefront. Use a high-quality 1:1 ratio image.">
                            <div className="flex items-center gap-3">
                                {coverImageUrl && (
                                    <img src={coverImageUrl} alt="cover" className="w-12 h-12 rounded-xl object-cover border border-border-custom flex-shrink-0" />
                                )}
                                <input
                                    id="digital-cover"
                                    type="text"
                                    placeholder="https://..."
                                    value={coverImageUrl}
                                    onChange={e => setCoverImageUrl(e.target.value)}
                                    className="flex-1 bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ring-accent/30 transition-all font-medium"
                                />
                            </div>
                        </InputField>

                        {/* File Details */}
                        <div className="bg-foreground/[0.03] border border-border-custom rounded-xl p-4 flex flex-col gap-4">
                            <div className="flex items-center gap-2 text-[13px] font-bold text-foreground/50">
                                <FileText className="w-4 h-4" />
                                Downloadable File
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="File Name" id="digital-file-name">
                                    <input
                                        id="digital-file-name"
                                        type="text"
                                        placeholder="guide.pdf"
                                        value={fileName}
                                        onChange={e => setFileName(e.target.value)}
                                        className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ring-accent/30 transition-all font-medium"
                                    />
                                </InputField>
                                <InputField label="File Type" id="digital-file-type">
                                    <input
                                        id="digital-file-type"
                                        type="text"
                                        placeholder="pdf, zip, mp4..."
                                        value={fileType}
                                        onChange={e => setFileType(e.target.value)}
                                        className="w-full bg-foreground/5 border border-border-custom rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 ring-accent/30 transition-all font-medium"
                                    />
                                </InputField>
                            </div>

                            {fileUrl ? (
                                <div className="border border-border-custom bg-emerald-500/5 rounded-xl p-4 flex items-center justify-between text-emerald-500 mt-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="p-2.5 bg-emerald-500/10 rounded-lg flex-shrink-0"><FileText className="w-5 h-5" /></div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[14px] font-semibold truncate">{fileName || 'Uploaded File'}</span>
                                            <span className="text-[12px] opacity-70 mt-0.5">
                                                {fileSizeBytes ? `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB` : ''} • Ready for download
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setFileUrl(''); setFileName(''); setFileType(''); setFileSizeBytes(undefined); }}
                                        className="p-2.5 hover:bg-emerald-500/10 rounded-xl transition-colors flex-shrink-0"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="border-2 border-dashed border-border-custom rounded-xl p-8 flex flex-col items-center gap-3 hover:border-accent/30 hover:bg-foreground/[0.02] transition-colors cursor-pointer relative overflow-hidden group mt-2">
                                    <input type="file" className="hidden" aria-hidden="true" onChange={handleFileUpload} disabled={isUploading} />

                                    {isUploading ? (
                                        <>
                                            <div className="absolute inset-0 bg-accent/5 backdrop-blur-[1px]" />
                                            <div className="absolute top-0 left-0 h-1.5 bg-accent transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                            <Upload className="w-8 h-8 text-accent animate-bounce z-10" />
                                            <p className="text-[14px] font-bold text-accent z-10 mt-1">Uploading... {uploadProgress}%</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                                <Upload className="w-6 h-6 text-foreground/40 group-hover:text-accent transition-colors" />
                                            </div>
                                            <div className="text-center mt-1">
                                                <p className="text-[14px] font-bold text-foreground">Click to select product file</p>
                                                <p className="text-[12px] text-foreground/40 mt-1">PDF, ZIP, MP4, MP3 supported</p>
                                            </div>
                                        </>
                                    )}
                                </label>
                            )}
                            {uploadError && <div className="text-[12px] text-red-500 font-medium bg-red-500/10 px-3 py-2 rounded-lg">{uploadError}</div>}
                        </div>

                        {/* Status */}
                        <InputField label="Status" id="digital-status">
                            <div className="grid grid-cols-3 gap-2">
                                {(['draft', 'published', 'archived'] as DigitalProductStatus[]).map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setStatus(s)}
                                        className={`px-3 py-2 rounded-xl text-[12px] font-bold border transition-all capitalize ${status === s
                                            ? 'bg-accent/10 border-accent text-accent'
                                            : 'border-border-custom text-foreground/40 hover:bg-foreground/5 hover:text-foreground hover:border-foreground/20'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </InputField>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2 border-t border-border-custom">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-border-custom text-sm font-medium text-foreground/60 hover:bg-foreground/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:brightness-110 transition-all font-bold"
                            >
                                {isEdit ? 'Save Changes' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default AddDigitalProductModal;
