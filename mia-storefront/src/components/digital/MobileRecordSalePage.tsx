"use client";

import React from "react";
import { DollarSign, User, Mail, Package, Check, Search } from "lucide-react";

interface Props {
    onBack: () => void;
    onSave?: (data: any) => void;
}

const PRODUCT_OPTIONS = [
    "The Ultimate Email Marketing Playbook",
    "Ecommerce Mastery Course",
    "Social Media Content Pack",
    "Brand Strategy Consultation",
    "Premium Newsletter Membership",
];

const inputCls = "w-full bg-foreground/[0.04] border border-border-custom rounded-xl px-4 py-3 text-[15px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-1 ring-accent/30 transition-all font-medium";

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-bold text-foreground/50 uppercase tracking-wider">{label}</label>
        {children}
        {hint && <p className="text-[11px] text-foreground/30">{hint}</p>}
    </div>
);

export const MobileRecordSalePage = ({ onBack, onSave }: Props) => {
    const [customerName, setCustomerName] = React.useState("");
    const [customerEmail, setCustomerEmail] = React.useState("");
    const [productTitle, setProductTitle] = React.useState("");
    const [amountPaid, setAmountPaid] = React.useState("");
    const [paymentMethod, setPaymentMethod] = React.useState("Bank Transfer");
    const [note, setNote] = React.useState("");
    const [saved, setSaved] = React.useState(false);
    const [productSearchOpen, setProductSearchOpen] = React.useState(false);
    const [productSearch, setProductSearch] = React.useState("");

    const filteredProducts = PRODUCT_OPTIONS.filter(p => p.toLowerCase().includes(productSearch.toLowerCase()));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!customerName.trim() || !productTitle || !amountPaid) return;
        onSave?.({
            customerName: customerName.trim(),
            customerEmail: customerEmail.trim(),
            productTitle,
            amountPaid: parseFloat(amountPaid),
            paymentMethod,
            note: note.trim(),
            status: "paid",
            createdAt: new Date().toISOString(),
        });
        setSaved(true);
        setTimeout(() => { setSaved(false); onBack(); }, 800);
    };

    return (
        <div className="flex-1 overflow-auto scrollbar-hide bg-background animate-in fade-in slide-in-from-right-4 duration-300">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 pb-32">

                {/* Info banner */}
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                    <p className="text-[13px] font-semibold text-accent mb-0.5">Manual Sale Recording</p>
                    <p className="text-[12px] text-foreground/40 leading-relaxed">Use this to record orders from customers who paid via bank transfer or any offline method.</p>
                </div>

                {/* Customer Info */}
                <div className="bg-foreground/[0.02] border border-border-custom rounded-2xl p-4 flex flex-col gap-4">
                    <p className="text-[12px] font-bold text-foreground/40 uppercase tracking-wider">Customer Details</p>
                    <Field label="Full Name">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                            <input type="text" placeholder="Amaka Obi" value={customerName} onChange={e => setCustomerName(e.target.value)} required className={`${inputCls} pl-9`} />
                        </div>
                    </Field>
                    <Field label="Email Address">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                            <input type="email" placeholder="amaka@email.com" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className={`${inputCls} pl-9`} />
                        </div>
                    </Field>
                </div>

                {/* Product */}
                <Field label="Product Sold">
                    <div className="relative">
                        <button type="button" onClick={() => setProductSearchOpen(true)}
                            className={`${inputCls} text-left flex items-center gap-2 ${!productTitle ? "text-foreground/20" : "text-foreground"}`}
                        >
                            <Package className="w-4 h-4 text-foreground/20 flex-shrink-0" />
                            <span className="truncate">{productTitle || "Select a product..."}</span>
                        </button>
                    </div>
                    {productSearchOpen && (
                        <div className="border border-border-custom rounded-xl overflow-hidden bg-background shadow-xl">
                            <div className="flex items-center gap-2 px-3 py-2 border-b border-border-custom">
                                <Search className="w-4 h-4 text-foreground/30" />
                                <input autoFocus type="text" placeholder="Search products..." value={productSearch} onChange={e => setProductSearch(e.target.value)}
                                    className="flex-1 bg-transparent text-sm text-foreground focus:outline-none font-medium" />
                            </div>
                            <div className="max-h-48 overflow-auto">
                                {filteredProducts.map(p => (
                                    <button key={p} type="button" onClick={() => { setProductTitle(p); setProductSearchOpen(false); setProductSearch(""); }}
                                        className="w-full text-left px-4 py-3 text-[14px] text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors font-medium border-b border-border-custom last:border-b-0">
                                        {p}
                                    </button>
                                ))}
                                {filteredProducts.length === 0 && <p className="px-4 py-3 text-sm text-foreground/30">No products found</p>}
                            </div>
                        </div>
                    )}
                </Field>

                {/* Payment */}
                <div className="bg-foreground/[0.02] border border-border-custom rounded-2xl p-4 flex flex-col gap-4">
                    <p className="text-[12px] font-bold text-foreground/40 uppercase tracking-wider">Payment Details</p>
                    <Field label="Amount Paid (₦)">
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
                            <input type="number" placeholder="5000" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} required min={0}
                                className={`${inputCls} pl-9`} />
                        </div>
                    </Field>
                    <Field label="Payment Method">
                        <div className="grid grid-cols-3 gap-2">
                            {["Bank Transfer", "Cash", "Other"].map(m => (
                                <button key={m} type="button" onClick={() => setPaymentMethod(m)}
                                    className={`py-2.5 rounded-xl border text-[12px] font-bold transition-all ${paymentMethod === m ? "bg-accent/10 border-accent text-accent" : "border-border-custom text-foreground/40 hover:bg-foreground/5"
                                        }`}
                                >{m}</button>
                            ))}
                        </div>
                    </Field>
                </div>

                {/* Note */}
                <Field label="Note (Optional)" hint="Internal note for this order">
                    <textarea placeholder="e.g. Paid via GTBank, confirmed by receipt..." value={note} onChange={e => setNote(e.target.value)} rows={3}
                        className={`${inputCls} resize-none`} />
                </Field>
            </form>

            {/* Fixed Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border-custom md:hidden">
                <button
                    onClick={handleSubmit as any}
                    disabled={!customerName.trim() || !productTitle || !amountPaid}
                    className={`w-full py-4 rounded-2xl text-[15px] font-bold transition-all flex items-center justify-center gap-2 ${saved ? "bg-emerald-500 text-white" :
                            "bg-accent text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-accent/20 hover:brightness-110"
                        }`}
                >
                    {saved ? <><Check className="w-5 h-5" /> Sale Recorded!</> : "Record Sale"}
                </button>
            </div>
        </div>
    );
};
