"use client";

import React from "react";
import { BookOpen, Video, Package, ShoppingBag, FileText, Music, DollarSign, Check } from "lucide-react";
import type { DigitalProduct, DigitalProductType, DigitalProductStatus } from "@/components/DigitalProductsPage";

interface Props {
    product: DigitalProduct;
    onBack: () => void;
    onSave: (data: DigitalProduct) => void;
}

const PRODUCT_TYPES: { value: DigitalProductType; label: string; icon: React.ReactNode }[] = [
    { value: "ebook", label: "Ebook", icon: <BookOpen className="w-5 h-5" /> },
    { value: "course", label: "Course", icon: <Video className="w-5 h-5" /> },
    { value: "membership", label: "Membership", icon: <Package className="w-5 h-5" /> },
    { value: "service", label: "Service", icon: <ShoppingBag className="w-5 h-5" /> },
    { value: "template", label: "Template", icon: <FileText className="w-5 h-5" /> },
    { value: "audio", label: "Audio", icon: <Music className="w-5 h-5" /> },
    { value: "video", label: "Video", icon: <Video className="w-5 h-5" /> },
    { value: "other", label: "Other", icon: <FileText className="w-5 h-5" /> },
];

const inputCls = "w-full bg-foreground/[0.04] border border-border-custom rounded-xl px-4 py-3 text-[15px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-1 ring-accent/30 transition-all font-medium";
const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-bold text-foreground/50 uppercase tracking-wider">{label}</label>
        {children}
        {hint && <p className="text-[11px] text-foreground/30">{hint}</p>}
    </div>
);

export const MobileEditProductPage = ({ product, onBack, onSave }: Props) => {
    const [productType, setProductType] = React.useState<DigitalProductType>(product.product_type);
    const [title, setTitle] = React.useState(product.title);
    const [slug, setSlug] = React.useState(product.slug);
    const [price, setPrice] = React.useState(product.price.toString());
    const [comparePrice, setComparePrice] = React.useState(product.compare_at_price?.toString() || "");
    const [coverImageUrl, setCoverImageUrl] = React.useState(product.cover_image_url || "");
    const [fileName, setFileName] = React.useState(product.file_name || "");
    const [fileType, setFileType] = React.useState(product.file_type || "");
    const [status, setStatus] = React.useState<DigitalProductStatus>(product.status);
    const [saved, setSaved] = React.useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !price) return;
        onSave({
            ...product,
            title: title.trim(), slug, product_type: productType,
            price: parseFloat(price),
            compare_at_price: comparePrice ? parseFloat(comparePrice) : undefined,
            cover_image_url: coverImageUrl || undefined, status,
            file_name: fileName || undefined, file_type: fileType || undefined,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 800);
    };

    return (
        <div className="flex-1 overflow-auto scrollbar-hide bg-background animate-in fade-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 pb-32">

                <Field label="Product Type">
                    <div className="grid grid-cols-4 gap-2">
                        {PRODUCT_TYPES.map(t => (
                            <button key={t.value} type="button" onClick={() => setProductType(t.value)}
                                className={`flex flex-col items-center gap-1 px-2 py-3 rounded-xl border transition-all ${productType === t.value ? "bg-accent/10 border-accent text-accent" : "border-border-custom text-foreground/30 hover:bg-foreground/5 hover:text-foreground"
                                    }`}>
                                <span className="w-5 h-5 flex-shrink-0">{t.icon}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wide leading-none">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </Field>

                <Field label="Product Title">
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className={inputCls} />
                </Field>

                <Field label="URL Slug">
                    <div className="flex items-center gap-2 bg-foreground/[0.04] border border-border-custom rounded-xl pl-4 overflow-hidden">
                        <span className="text-[12px] text-foreground/20 whitespace-nowrap">/shop/</span>
                        <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                            className="flex-1 bg-transparent py-3 pr-4 text-[15px] text-foreground focus:outline-none font-medium" />
                    </div>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                    <Field label="Price (₦)">
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min={0} className={`${inputCls} pl-9`} />
                        </div>
                    </Field>
                    <Field label="Compare-at (₦)">
                        <input type="number" value={comparePrice} onChange={e => setComparePrice(e.target.value)} min={0} className={inputCls} />
                    </Field>
                </div>

                <Field label="Cover Image URL">
                    {coverImageUrl && <img src={coverImageUrl} alt="cover" className="w-full h-40 object-cover rounded-xl border border-border-custom mb-2" />}
                    <input type="text" placeholder="https://..." value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)} className={inputCls} />
                </Field>

                <div className="bg-foreground/[0.03] border border-border-custom rounded-2xl p-4 flex flex-col gap-4">
                    <p className="text-[12px] font-bold text-foreground/40 uppercase tracking-wider">File Info</p>
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="File Name">
                            <input type="text" value={fileName} onChange={e => setFileName(e.target.value)} className={inputCls} />
                        </Field>
                        <Field label="File Type">
                            <input type="text" placeholder="pdf, zip, mp4" value={fileType} onChange={e => setFileType(e.target.value)} className={inputCls} />
                        </Field>
                    </div>
                </div>

                <Field label="Status">
                    <div className="grid grid-cols-3 gap-2">
                        {(["draft", "published", "archived"] as DigitalProductStatus[]).map(s => (
                            <button key={s} type="button" onClick={() => setStatus(s)}
                                className={`py-3 rounded-xl border text-[12px] font-bold capitalize transition-all ${status === s ? "bg-accent/10 border-accent text-accent" : "border-border-custom text-foreground/40 hover:bg-foreground/5"
                                    }`}>{s}</button>
                        ))}
                    </div>
                </Field>
            </form>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border-custom md:hidden">
                <button onClick={handleSubmit as any} disabled={!title.trim() || !price}
                    className={`w-full py-4 rounded-2xl text-[15px] font-bold transition-all flex items-center justify-center gap-2 ${saved ? "bg-emerald-500 text-white" : "bg-accent text-white disabled:opacity-40 shadow-xl shadow-accent/20 hover:brightness-110"
                        }`}>
                    {saved ? <><Check className="w-5 h-5" /> Saved!</> : "Save Changes"}
                </button>
            </div>
        </div>
    );
};
