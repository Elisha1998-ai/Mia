"use client";

import React from "react";
import { Sparkles, Check, Link2, MoreHorizontal, Clock, ArrowUp, ArrowRight, FileText } from "lucide-react";

// Simple theme helper
function t<T>(dark: boolean, d: T, l: T): T { return dark ? d : l; }

interface InvoiceMockupProps {
  dark?: boolean;
}

export function InvoiceMockup({ dark = false }: InvoiceMockupProps) {
  // Styles based on dark mode
  const bg = t(dark, "#1a1a1a", "#fff");
  const text = t(dark, "#fff", "#111");
  const border = t(dark, "#333", "#e5e7eb");
  const muted = t(dark, "#666", "#6b7280");
  const primaryBlue = "#0070E0"; // Primary Blue
  
  return (
    <div className="invoice-mockup" style={{ 
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
      <div className="im-content" style={{ padding: "20px", minHeight: "auto", position: "relative" }}>
        {/* Date */}
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: muted, marginBottom: 32 }}>Today 10:23 AM</div>

        {/* User Question */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
          <div style={{ background: t(dark, "#2a2a2a", "#f3f4f6"), borderRadius: "20px 20px 4px 20px", padding: "10px 20px", fontSize: 14, fontWeight: 500, color: text }}>
            Create an invoice for Simi Adebayo for the Ankara Tote Bag order.
          </div>
        </div>

        {/* Bot Answer */}
        <div style={{ marginBottom: 24, position: "relative" }}>
           <div style={{ display: "flex", gap: 12, fontSize: 12, fontWeight: 700, color: muted, marginBottom: 4 }}>
             <span>1 / 1</span>
           </div>
           <div style={{ fontSize: 15, lineHeight: 1.7, color: t(dark, "#ccc", "#374151"), textAlign: "left" }}>
             I've created <span style={{ fontWeight: 600, color: text }}>Invoice #1024</span> for <span style={{ fontWeight: 600, color: text }}>Simi Adebayo</span>. The total amount is <span style={{ color: primaryBlue, fontWeight: 600, background: t(dark, "rgba(0,112,224,0.1)", "#eff6ff"), padding: "0 4px", borderRadius: 4 }}>₦45,000</span>. I've sent a draft to your email for approval before sending it to the customer.
           </div>
           
           {/* Tooltip */}
           <div className="im-tooltip" style={{ position: "absolute", top: -45, left: "50%", transform: "translateX(-50%)", width: "max-content", background: t(dark, "#fff", "#111"), color: t(dark, "#111", "#fff"), padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
             <FileText size={14} /> View PDF
           </div>
        </div>

        {/* Follow-up / Input Card */}
        <div className="im-input" style={{ 
          background: t(dark, "#222", "#fff"), 
          borderRadius: 12, 
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          border: `1px solid ${border}`,
          overflow: "hidden"
        }}>


          {/* Suggestions */}
          <div style={{ padding: "8px 0" }}>
             {[
               "Send to simi.adebayo@gmail.com",
               "Download PDF invoice",
               "Mark as paid",
               "Add a 10% discount"
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