"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X, User, Mail, Package, Search, Check, Loader2, AlertCircle } from "lucide-react";
import { useDigitalProducts } from "@/hooks/useDigitalProducts";
import { useDigitalOrders } from "@/hooks/useDigitalOrders";
import type { DigitalProduct } from "@/components/DigitalProductsPage";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const inputCls = "w-full bg-foreground/[0.04] border border-border-custom rounded-xl px-4 py-3 text-[15px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 ring-accent/30 transition-all font-medium";

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-bold text-foreground/50 uppercase tracking-wider">{label}</label>
        {children}
        {hint && <p className="text-[11px] text-foreground/30">{hint}</p>}
    </div>
);

export const RecordSalePanel = ({ isOpen, onClose }: Props) => {
    const { products, isLoading: productsLoading } = useDigitalProducts();
    const { recordSale, mutate: mutateOrders } = useDigitalOrders();

    const [customerName, setCustomerName] = React.useState("");
    const [customerEmail, setCustomerEmail] = React.useState("");
    const [selectedProduct, setSelectedProduct] = React.useState<DigitalProduct | null>(null);
    const [amountPaid, setAmountPaid] = React.useState("");
    const [paymentMethod, setPaymentMethod] = React.useState("Bank Transfer");
    const [note, setNote] = React.useState("");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState("");
    const [saved, setSaved] = React.useState(false);
    const [productSearch, setProductSearch] = React.useState("");
    const [productSearchOpen, setProductSearchOpen] = React.useState(false);

    const reset = () => {
        setCustomerName(""); setCustomerEmail(""); setSelectedProduct(null);
        setAmountPaid(""); setPaymentMethod("Bank Transfer"); setNote("");
        setProductSearch(""); setProductSearchOpen(false); setError("");
    };

    const handleClose = () => { reset(); onClose(); };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.slug.toLowerCase().includes(productSearch.toLowerCase())
    );

    const handleSelectProduct = (p: DigitalProduct) => {
        setSelectedProduct(p);
        setAmountPaid(p.price.toString());
        setProductSearchOpen(false);
        setProductSearch("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName.trim() || !customerEmail.trim() || !selectedProduct || !amountPaid) {
            setError("Please fill in all required fields.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            await recordSale({
                product_id: selectedProduct.id,
                customer_name: customerName.trim(),
                customer_email: customerEmail.trim(),
                amount_paid: parseFloat(amountPaid),
                payment_method: paymentMethod,
                note: note.trim() || undefined,
            });
            setSaved(true);
            setTimeout(() => {
                setSaved(false);
                handleClose();
            }, 1200);
        } catch (err: any) {
            setError(err.message || "Failed to record sale");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] animate-in fade-in duration-200" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border-custom rounded-2xl z-[201] animate-in fade-in zoom-in-95 duration-200 scrollbar-hide flex flex-col">
                    <VisuallyHidden>
                        <Dialog.Title>Record a Sale</Dialog.Title>
                        <Dialog.Description>Log an offline or manual transaction</Dialog.Description>
                    </VisuallyHidden>

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-border-custom sticky top-0 bg-background z-10">
                        <div>
                            <h2 className="text-[16px] font-bold text-foreground">Record a Sale</h2>
                            <p className="text-[12px] text-foreground/40 mt-0.5">Log an offline or manual transaction</p>
                        </div>
                        <button onClick={handleClose} className="p-2 rounded-xl hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-500">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-[13px] font-medium">{error}</p>
                            </div>
                        )}

                        <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                            <p className="text-[13px] font-semibold text-accent mb-0.5">Manual Sale</p>
                            <p className="text-[12px] text-foreground/40 leading-relaxed">
                                Recording this will generate a download link for the customer and
                                increment your store analytics.
                            </p>
                        </div>

                        {/* Customer */}
                        <div className="bg-foreground/[0.02] border border-border-custom rounded-2xl p-5 flex flex-col gap-5">
                            <p className="text-[12px] font-bold text-foreground/40 uppercase tracking-wider">Customer Details</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Full Name">
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                                        <input type="text" placeholder="Amaka Obi" value={customerName} onChange={e => setCustomerName(e.target.value)} required className={`${inputCls} pl-10`} />
                                    </div>
                                </Field>
                                <Field label="Email Address">
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                                        <input type="email" placeholder="amaka@email.com" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} required className={`${inputCls} pl-10`} />
                                    </div>
                                </Field>
                            </div>
                        </div>

                        {/* Product Selection */}
                        <Field label="Product Sold" hint="Search for an existing digital product in your inventory">
                            <div className="relative">
                                <button type="button" onClick={() => setProductSearchOpen(v => !v)}
                                    className={`${inputCls} text-left flex items-center gap-2 pr-10 ${!selectedProduct ? "text-foreground/20" : "text-foreground font-semibold"}`}>
                                    <Package className="w-4.5 h-4.5 text-foreground/20 flex-shrink-0" />
                                    <span className="truncate">{selectedProduct?.title || "Search products..."}</span>
                                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                                </button>

                                {productSearchOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 border border-border-custom rounded-2xl overflow-hidden bg-background shadow-2xl z-[220] animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="flex items-center gap-2 px-4 py-3 border-b border-border-custom bg-foreground/[0.02]">
                                            <Search className="w-4 h-4 text-foreground/30" />
                                            <input autoFocus type="text" placeholder="Search by name or slug..." value={productSearch} onChange={e => setProductSearch(e.target.value)}
                                                className="flex-1 bg-transparent text-sm text-foreground focus:outline-none font-medium placeholder:text-foreground/20" />
                                        </div>
                                        <div className="max-h-60 overflow-y-auto scrollbar-hide">
                                            {productsLoading ? (
                                                <div className="px-4 py-6 flex flex-col items-center gap-2 text-foreground/30">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span className="text-xs font-medium">Loading products...</span>
                                                </div>
                                            ) : filteredProducts.length === 0 ? (
                                                <p className="px-4 py-6 text-center text-sm text-foreground/30 font-medium italic">No products matched your search</p>
                                            ) : (
                                                filteredProducts.map(p => (
                                                    <button key={p.id} type="button" onClick={() => handleSelectProduct(p)}
                                                        className="w-full text-left px-5 py-3.5 hover:bg-foreground/5 transition-colors border-b border-border-custom last:border-b-0 group">
                                                        <p className="text-[14px] font-bold text-foreground group-hover:text-accent transition-colors">{p.title}</p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <span className="text-[12px] text-foreground/30">/shop/{p.slug}</span>
                                                            <span className="text-[13px] font-bold text-foreground/60">₦{p.price.toLocaleString()}</span>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Field>

                        {/* Payment Details */}
                        <div className="bg-foreground/[0.02] border border-border-custom rounded-2xl p-5 flex flex-col gap-5">
                            <p className="text-[12px] font-bold text-foreground/40 uppercase tracking-wider">Payment Details</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Field label="Amount Paid">
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30 font-bold text-sm">₦</div>
                                        <input type="number" placeholder="0" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} required min={0} className={`${inputCls} pl-10`} />
                                    </div>
                                </Field>
                                <Field label="Payment Method">
                                    <div className="grid grid-cols-3 gap-2">
                                        {["Bank Transfer", "Cash", "Other"].map(m => (
                                            <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                                                className={`py-2.5 rounded-xl border text-[12px] font-bold transition-all ${paymentMethod === m
                                                    ? "bg-accent/10 border-accent text-accent"
                                                    : "border-border-custom text-foreground/40 hover:bg-foreground/5 hover:border-foreground/20"
                                                    }`}>{m}</button>
                                        ))}
                                    </div>
                                </Field>
                            </div>
                        </div>

                        <Field label="Internal Note (Optional)" hint="This note is only visible to you in the dashboard.">
                            <textarea placeholder="e.g. Paid via GTBank mobile app, confirmed receipt manually." value={note} onChange={e => setNote(e.target.value)} rows={3}
                                className={`${inputCls} resize-none py-3`} />
                        </Field>

                        <div className="pt-2 border-t border-border-custom">
                            <button type="submit" disabled={isSubmitting || !selectedProduct || !customerName || !customerEmail || !amountPaid}
                                className={`w-full py-4 rounded-2xl text-[16px] font-bold transition-all flex items-center justify-center gap-2 ${saved ? "bg-emerald-500 text-white" :
                                        isSubmitting ? "bg-accent/70 text-white cursor-not-allowed" :
                                            "bg-accent text-white disabled:opacity-40 hover:brightness-110 active:scale-[0.98]"
                                    }`}>
                                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Recording...</> :
                                    saved ? <><Check className="w-5 h-5 shadow-sm" /> Sale Recorded!</> : "Record Manual Sale"}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

const ChevronDown = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m6 9 6 6 6-6" />
    </svg>
);
