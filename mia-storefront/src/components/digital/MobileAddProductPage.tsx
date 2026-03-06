"use client";

import React from "react";
import { BookOpen, Video, Package, ShoppingBag, FileText, Music, Upload, DollarSign, Check } from "lucide-react";
import type { DigitalProductType, DigitalProductStatus } from "@/components/DigitalProductsPage";

interface Props {
    onBack: () => void;
    onSave?: (data: any) => void;
}

const PRODUCT_TYPES: { value: DigitalProductType; label: string; icon: React.ReactNode }[] = [
    { value: "ebook", label: "Ebook", icon: <BookOpen className="w-5 h-5" /> },
    { value: "audio", label: "Audio", icon: <Music className="w-5 h-5" /> },
    { value: "video", label: "Video", icon: <Video className="w-5 h-5" /> },
    { value: "other", label: "Other", icon: <FileText className="w-5 h-5" /> },
];

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-bold text-foreground/50 uppercase tracking-wider">{label}</label>
        {children}
        {hint && <p className="text-[11px] text-foreground/30">{hint}</p>}
    </div>
);

const inputCls = "w-full bg-foreground/[0.04] border border-border-custom rounded-xl px-4 py-3 text-[15px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-1 ring-accent/30 transition-all font-medium";

export const MobileAddProductPage = ({ onBack, onSave }: Props) => {
    const [productType, setProductType] = React.useState<DigitalProductType>("ebook");
    const [title, setTitle] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [comparePrice, setComparePrice] = React.useState("");
    const [coverImageUrl, setCoverImageUrl] = React.useState("");
    const [fileName, setFileName] = React.useState("");
    const [fileType, setFileType] = React.useState("");
    const [fileUrl, setFileUrl] = React.useState("");
    const [fileSizeBytes, setFileSizeBytes] = React.useState<number | undefined>();
    const [description, setDescription] = React.useState("");
    const [status, setStatus] = React.useState<DigitalProductStatus>("draft");
    const [saved, setSaved] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [uploadProgress, setUploadProgress] = React.useState(0);
    const [uploadError, setUploadError] = React.useState("");

    const handleTitleChange = (val: string) => {
        setTitle(val);
        setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setFileType(file.name.split('.').pop() || '');
        setFileSizeBytes(file.size);
        setIsUploading(true);
        setUploadProgress(0);
        setUploadError("");

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !price) return;
        onSave?.({
            title: title.trim(), slug, product_type: productType,
            price: parseFloat(price),
            compare_at_price: comparePrice ? parseFloat(comparePrice) : undefined,
            currency: "NGN", cover_image_url: coverImageUrl || undefined,
            status, description: description.trim(),
            file_name: fileName || undefined, file_type: fileType || undefined,
            file_url: fileUrl || undefined, file_size_bytes: fileSizeBytes,
            sales_count: 0, revenue: 0, createdAt: new Date().toISOString(),
        });
        setSaved(true);
        setTimeout(() => { setSaved(false); onBack(); }, 800);
    };

    return (
        <div className="flex-1 overflow-auto scrollbar-hide bg-background animate-in fade-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 pb-32">

                {/* Type Selector */}
                <Field label="Product Type">
                    <div className="grid grid-cols-4 gap-2">
                        {PRODUCT_TYPES.map(t => (
                            <button key={t.value} type="button" onClick={() => setProductType(t.value)}
                                className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border transition-all ${productType === t.value ? "bg-accent/10 border-accent text-accent" : "border-border-custom text-foreground/30 hover:bg-foreground/5 hover:text-foreground"
                                    }`}
                            >
                                <span className="w-5 h-5 flex-shrink-0">{t.icon}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wide leading-none">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </Field>

                {/* Title */}
                <Field label="Product Title">
                    <input type="text" placeholder="e.g. The Ultimate Email Marketing Guide" value={title} onChange={e => handleTitleChange(e.target.value)} required className={inputCls} />
                </Field>

                {/* Description */}
                <Field label="Description">
                    <textarea
                        placeholder="What is this product about?"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className={`${inputCls} min-h-[100px] resize-none py-3`}
                    />
                </Field>

                {/* Slug */}
                <Field label="URL Slug" hint="Auto-generated. This is your product's public URL.">
                    <div className="flex items-center gap-2 bg-foreground/[0.04] border border-border-custom rounded-xl pl-4 overflow-hidden">
                        <span className="text-[12px] text-foreground/20 whitespace-nowrap">/shop/</span>
                        <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                            className="flex-1 bg-transparent py-3 pr-4 text-[15px] text-foreground placeholder:text-foreground/20 focus:outline-none font-medium" />
                    </div>
                </Field>

                {/* Price */}
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Price (₦)">
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                            <input type="number" placeholder="5000" value={price} onChange={e => setPrice(e.target.value)} required min={0}
                                className={`${inputCls} pl-9`} />
                        </div>
                    </Field>
                    <Field label="Compare-at (₦)" hint="Shows as strikethrough">
                        <input type="number" placeholder="9000" value={comparePrice} onChange={e => setComparePrice(e.target.value)} min={0} className={inputCls} />
                    </Field>
                </div>

                {/* Cover Image */}
                <Field label="Cover Image URL">
                    <div className="flex flex-col gap-3">
                        {coverImageUrl && (
                            <img src={coverImageUrl} alt="cover" className="w-full h-40 object-cover rounded-xl border border-border-custom" />
                        )}
                        <input type="text" placeholder="https://..." value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)} className={inputCls} />
                    </div>
                </Field>

                {/* File Info */}
                <div className="bg-foreground/[0.03] border border-border-custom rounded-2xl p-4 flex flex-col gap-4">
                    <p className="text-[12px] font-bold text-foreground/40 uppercase tracking-wider">Downloadable File</p>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="File Name">
                            <input type="text" placeholder="guide.pdf" value={fileName} onChange={e => setFileName(e.target.value)} className={inputCls} />
                        </Field>
                        <Field label="File Type">
                            <input type="text" placeholder="pdf, zip, mp4" value={fileType} onChange={e => setFileType(e.target.value)} className={inputCls} />
                        </Field>
                    </div>
                    {fileUrl ? (
                        <div className="border border-border-custom bg-emerald-500/5 rounded-xl p-4 flex items-center justify-between text-emerald-500">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="p-2.5 bg-emerald-500/10 rounded-lg flex-shrink-0"><FileText className="w-5 h-5" /></div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[14px] font-semibold truncate">{fileName || 'Uploaded File'}</span>
                                    <span className="text-[12px] opacity-70 mt-0.5">
                                        {fileSizeBytes ? `${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB` : ''} • Ready
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => { setFileUrl(''); setFileName(''); setFileType(''); setFileSizeBytes(undefined); }}
                                className="p-2.5 hover:bg-emerald-500/10 rounded-xl transition-colors flex-shrink-0"
                            >
                                <Check className="w-4 h-4 opacity-0" />
                                <span className="absolute text-sm font-bold">X</span>
                            </button>
                        </div>
                    ) : (
                        <label className="border-2 border-dashed border-border-custom rounded-xl p-8 flex flex-col items-center gap-3 hover:border-accent/30 hover:bg-foreground/[0.02] transition-colors cursor-pointer relative overflow-hidden group">
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
                                        <p className="text-[14px] font-bold text-foreground">Tap to upload file</p>
                                        <p className="text-[12px] text-foreground/40 mt-1">PDF, ZIP, MP4, MP3</p>
                                    </div>
                                </>
                            )}
                        </label>
                    )}
                    {uploadError && <div className="text-[12px] text-red-500 font-medium bg-red-500/10 px-3 py-2 rounded-lg">{uploadError}</div>}
                </div>

                {/* Status */}
                <Field label="Status">
                    <div className="grid grid-cols-3 gap-2">
                        {(["draft", "published", "archived"] as DigitalProductStatus[]).map(s => (
                            <button key={s} type="button" onClick={() => setStatus(s)}
                                className={`py-3 rounded-xl border text-[12px] font-bold capitalize transition-all ${status === s ? "bg-accent/10 border-accent text-accent" : "border-border-custom text-foreground/40 hover:bg-foreground/5"
                                    }`}
                            >{s}</button>
                        ))}
                    </div>
                </Field>
            </form>

            {/* Fixed Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border-custom md:hidden">
                <button
                    onClick={handleSubmit as any}
                    disabled={!title.trim() || !price}
                    className={`w-full py-4 rounded-2xl text-[15px] font-bold transition-all flex items-center justify-center gap-2 ${saved ? "bg-emerald-500 text-white" :
                        "bg-accent text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-accent/20 hover:brightness-110"
                        }`}
                >
                    {saved ? <><Check className="w-5 h-5" /> Saved!</> : "Create Product"}
                </button>
            </div>
        </div>
    );
};
