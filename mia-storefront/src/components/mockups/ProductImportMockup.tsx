"use client";

import React from "react";
import { Sparkles, Check, Link2, MoreHorizontal, Clock, ArrowUp, ArrowRight, FileSpreadsheet, AlertCircle } from "lucide-react";

// Simple theme helper
function t<T>(dark: boolean, d: T, l: T): T { return dark ? d : l; }

interface ProductImportMockupProps {
  dark?: boolean;
}

export function ProductImportMockup({ dark = false }: ProductImportMockupProps) {
  // Styles based on dark mode
  const bg = t(dark, "#1a1a1a", "#fff");
  const text = t(dark, "#fff", "#111");
  const border = t(dark, "#333", "#e5e7eb");
  const muted = t(dark, "#666", "#6b7280");
  const primaryBlue = "#0070E0"; // Primary Blue
  
  return (
    <div className="product-import-mockup" style={{ 
      width: "100%", 
      borderRadius: 12, 
      overflow: "hidden", 
      boxShadow: t(dark, "0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.6)", "0 20px 60px rgba(0,0,0,0.1)"), 
      fontFamily: "Inter, sans-serif", 
      background: bg,
      border: `1px solid ${border}`,
      position: "relative"
    }}>


      {/* Content */}
      <div className="pim-content" style={{ padding: "20px", minHeight: "auto", position: "relative" }}>
        {/* Date */}
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: muted, marginBottom: 32 }}>Today 2:15 PM</div>

        {/* User Question */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
          <div style={{ background: t(dark, "#2a2a2a", "#f3f4f6"), borderRadius: "20px 20px 4px 20px", padding: "10px 20px", fontSize: 14, fontWeight: 500, color: text, display: "flex", alignItems: "center", gap: 10 }}>
            <span>Add products from this file</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: t(dark, "#111", "#fff"), padding: "4px 8px", borderRadius: 6, border: `1px solid ${t(dark, "#333", "#e5e7eb")}` }}>
              <FileSpreadsheet size={12} color={primaryBlue} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>inventory_v2.csv</span>
            </div>
          </div>
        </div>

        {/* Bot Answer */}
        <div style={{ marginBottom: 24, position: "relative" }}>
           <div style={{ display: "flex", gap: 12, fontSize: 12, fontWeight: 700, color: muted, marginBottom: 4 }}>
             <span>1 / 1</span>
           </div>
           <div style={{ fontSize: 15, lineHeight: 1.7, color: t(dark, "#ccc", "#374151"), textAlign: "left", marginBottom: 16 }}>
             I've processed <span style={{ fontWeight: 600, color: text }}>inventory_v2.csv</span> and drafted <span style={{ color: primaryBlue, fontWeight: 600, background: t(dark, "rgba(0,112,224,0.1)", "#eff6ff"), padding: "0 4px", borderRadius: 4 }}>24 new products</span>. Here's a preview of what I found:
           </div>

           {/* Preview Table */}
           <div style={{ 
             background: t(dark, "#111", "#f9fafb"), 
             border: `1px solid ${border}`, 
             borderRadius: 8, 
             overflow: "hidden",
             fontSize: 13
           }}>
             <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "8px 12px", borderBottom: `1px solid ${border}`, background: t(dark, "#222", "#f3f4f6"), fontWeight: 600, color: muted }}>
               <span>Product</span>
               <span>Price</span>
               <span>Stock</span>
             </div>
             {[
               { name: "Ankara Tote Bag", price: "₦15,000", stock: "45" },
               { name: "Lagos Vibes Tee", price: "₦8,500", stock: "120" },
               { name: "Adire Silk Scarf", price: "₦12,000", stock: "30" },
             ].map((p, i) => (
               <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "8px 12px", borderBottom: i < 2 ? `1px solid ${border}` : "none", color: text }}>
                 <span>{p.name}</span>
                 <span>{p.price}</span>
                 <span>{p.stock}</span>
               </div>
             ))}
             <div style={{ padding: "8px 12px", borderTop: `1px solid ${border}`, background: t(dark, "#1a1a1a", "#fff"), color: muted, fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
               <AlertCircle size={12} color="#f59e0b" />
               <span>3 items are missing images</span>
             </div>
           </div>
           
           {/* Tooltip */}
           <div className="pim-tooltip" style={{ position: "absolute", top: -45, left: "50%", transform: "translateX(-50%)", width: "max-content", background: t(dark, "#fff", "#111"), color: t(dark, "#111", "#fff"), padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
             <Check size={14} /> Ready to import
           </div>
        </div>

        {/* Follow-up / Input Card */}
        <div className="pim-input" style={{ 
          background: t(dark, "#222", "#fff"), 
          borderRadius: 12, 
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          border: `1px solid ${border}`,
          overflow: "hidden"
        }}>


          {/* Suggestions */}
          <div style={{ padding: "8px 0" }}>
             {[
               "Publish all 24 products",
               "Edit missing images first",
               "Show me the full list",
               "Change prices by +10%"
             ].map((q, i) => (
               <div key={i} style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: i === 0 ? t(dark, "#2a2a2a", "#f9fafb") : "transparent" }}>
                 <ArrowRight size={14} color={i === 0 ? text : muted} />
                 <span style={{ fontSize: 13, color: i === 0 ? text : muted, fontWeight: i === 0 ? 600 : 400 }}>{q}</span>
               </div>
             ))}
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${t(dark, "#333", "#f0f0f0")}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 2, height: 16, background: primaryBlue }} />
              <span style={{ fontSize: 13, color: muted }}>Ask a question...</span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                <Clock size={14} color={muted} />
                <div style={{ width: 24, height: 24, borderRadius: 12, background: t(dark, "#333", "#f3f4f6"), display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <ArrowUp size={12} color={muted} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
