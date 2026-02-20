"use client";

import React from "react";
import { Sparkles, ArrowRight, Layout, Palette, ShoppingBag, Globe, Clock, ArrowUp } from "lucide-react";

// Simple theme helper
function t<T>(dark: boolean, d: T, l: T): T { return dark ? d : l; }

interface StoreBuilderMockupProps {
  dark?: boolean;
}

export function StoreBuilderMockup({ dark = false }: StoreBuilderMockupProps) {
  // Styles based on dark mode
  const bg = t(dark, "#1a1a1a", "#fff");
  const text = t(dark, "#fff", "#111");
  const border = t(dark, "#333", "#e5e7eb");
  const muted = t(dark, "#666", "#6b7280");
  const primaryBlue = "#0070E0"; // Primary Blue
  
  return (
    <div className="store-builder-mockup" style={{ 
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
      <div className="sbm-content" style={{ padding: "20px", minHeight: "auto", position: "relative" }}>
        {/* Date */}
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: muted, marginBottom: 32 }}>Today 4:30 PM</div>

        {/* User Question */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
          <div style={{ background: t(dark, "#2a2a2a", "#f3f4f6"), borderRadius: "20px 20px 4px 20px", padding: "10px 20px", fontSize: 14, fontWeight: 500, color: text }}>
            Build a modern store for my handmade ceramics.
          </div>
        </div>

        {/* Bot Answer */}
        <div style={{ marginBottom: 24, position: "relative" }}>
           <div style={{ display: "flex", gap: 12, fontSize: 12, fontWeight: 700, color: muted, marginBottom: 4 }}>
             <span>1 / 1</span>
           </div>
           <div style={{ fontSize: 15, lineHeight: 1.7, color: t(dark, "#ccc", "#374151"), textAlign: "left", marginBottom: 16 }}>
             I've created a store for <span style={{ fontWeight: 600, color: text }}>Earth & Clay</span>. Here is the homepage design:
           </div>

           {/* Store Preview Card */}
           <div style={{ 
             background: t(dark, "#111", "#fff"), 
             border: `1px solid ${border}`, 
             borderRadius: 8, 
             overflow: "hidden",
             boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
           }}>
             {/* Fake Browser Header */}
             <div style={{ background: t(dark, "#222", "#f9fafb"), padding: "8px 12px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 8 }}>
               <div style={{ display: "flex", gap: 4 }}>
                 <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
                 <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
                 <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
               </div>
               <div style={{ flex: 1, background: t(dark, "#111", "#fff"), borderRadius: 4, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: muted, border: `1px solid ${border}` }}>
                 earthandclay.shop
               </div>
             </div>

             {/* Store Content */}
             <div style={{ padding: 0 }}>
               {/* Hero */}
               <div style={{ height: 120, background: t(dark, "#2a2a2a", "#e5e7eb"), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
                 <div style={{ fontSize: 16, fontWeight: 700, color: text, marginBottom: 4 }}>Earth & Clay</div>
                 <div style={{ fontSize: 11, color: muted }}>Handcrafted with love</div>
                 <div style={{ position: "absolute", bottom: 12, padding: "4px 12px", background: primaryBlue, color: "#fff", borderRadius: 4, fontSize: 10, fontWeight: 600 }}>Shop Collection</div>
               </div>
               
               {/* Products Grid */}
               <div style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                 {[1, 2, 3].map((i) => (
                   <div key={i}>
                     <div style={{ aspectRatio: "1/1", background: t(dark, "#222", "#f3f4f6"), borderRadius: 4, marginBottom: 4 }} />
                     <div style={{ height: 8, width: "80%", background: t(dark, "#333", "#e5e7eb"), borderRadius: 2, marginBottom: 2 }} />
                     <div style={{ height: 8, width: "40%", background: t(dark, "#333", "#e5e7eb"), borderRadius: 2 }} />
                   </div>
                 ))}
               </div>
             </div>
           </div>
           
           {/* Tooltip */}
           <div className="sbm-tooltip" style={{ position: "absolute", top: -45, left: "50%", transform: "translateX(-50%)", width: "max-content", background: t(dark, "#fff", "#111"), color: t(dark, "#111", "#fff"), padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
             <Globe size={14} /> Visit live site
           </div>
        </div>

        {/* Follow-up / Input Card */}
        <div className="sbm-input" style={{ 
          background: t(dark, "#222", "#fff"), 
          borderRadius: 12, 
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          border: `1px solid ${border}`,
          overflow: "hidden"
        }}>

          {/* Suggestions */}
          <div style={{ padding: "8px 0" }}>
             {[
               "Connect payment gateway",
               "Add 'About Us' page",
               "Change theme colors",
               "Upload product images"
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
