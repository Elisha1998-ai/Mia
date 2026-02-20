"use client";

import React from "react";
import { Sparkles, Check, Link2, MoreHorizontal, Clock, ArrowUp, ArrowRight } from "lucide-react";

// Simple theme helper
function t<T>(dark: boolean, d: T, l: T): T { return dark ? d : l; }

interface HeroMockupProps {
  dark?: boolean;
}

export function HeroMockup({ dark = false }: HeroMockupProps) {
  // Styles based on dark mode
  const bg = t(dark, "#1a1a1a", "#fff");
  const text = t(dark, "#fff", "#111");
  const border = t(dark, "#333", "#e5e7eb");
  const muted = t(dark, "#666", "#6b7280");
  
  return (
    <div className="hero-mockup" style={{ 
      width: "100%", 
      borderRadius: 20, 
      overflow: "hidden", 
      boxShadow: t(dark, "0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.6)", "0 20px 60px rgba(0,0,0,0.1)"), 
      fontFamily: "Inter, sans-serif", 
      background: bg,
      border: `1px solid ${border}`,
      position: "relative"
    }}>
      <style>{`
        @media (max-width: 640px) {
          .hero-mockup { border-radius: 12px !important; }
          .hm-header { padding: 12px 16px !important; }
          .hm-content { padding: 20px !important; min-height: auto !important; }
          .hm-tooltip { left: 50% !important; transform: translateX(-50%); top: -45px !important; width: max-content; }
          .hm-input { border-radius: 12px !important; }
        }
      `}</style>


      {/* Content */}
      <div className="hm-content" style={{ padding: "32px", minHeight: 400, position: "relative" }}>
        {/* Date */}
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: muted, marginBottom: 32 }}>Today 4:08 PM</div>

        {/* User Question */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
          <div style={{ background: t(dark, "#2a2a2a", "#f3f4f6"), borderRadius: "20px 20px 4px 20px", padding: "10px 20px", fontSize: 14, fontWeight: 500, color: text }}>
            How is my store performing today?
          </div>
        </div>

        {/* Bot Answer */}
        <div style={{ marginBottom: 24, position: "relative" }}>
           <div style={{ display: "flex", gap: 12, fontSize: 12, fontWeight: 700, color: muted, marginBottom: 4 }}>
             <span>1 / 2</span>
           </div>
           <div style={{ fontSize: 15, lineHeight: 1.7, color: t(dark, "#ccc", "#374151"), textAlign: "left" }}>
             Your store is <span style={{ fontWeight: 600, color: text }}>performing exceptionally well</span> <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 16, height: 16, background: "#8b5cf6", color: "#fff", borderRadius: "50%", fontSize: 10, fontWeight: 700 }}>1</span> today. Revenue is up <span style={{ color: "#8b5cf6", fontWeight: 600, background: t(dark, "rgba(139,92,246,0.1)", "#f5f3ff"), padding: "0 4px", borderRadius: 4 }}>18.5% compared to last week</span>, primarily driven by a surge in "Ankara Tote Bag" sales. I've also noticed your conversion rate has increased to 4.2% following the campaign launch.
           </div>
           
           {/* Tooltip */}
           <div className="hm-tooltip" style={{ position: "absolute", top: -40, left: 180, background: t(dark, "#fff", "#111"), color: t(dark, "#111", "#fff"), padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
             <span style={{ fontSize: 16 }}>❞</span> Reply
           </div>
        </div>

        {/* Follow-up / Input Card */}
        <div className="hm-input" style={{ 
          background: t(dark, "#222", "#fff"), 
          borderRadius: 16, 
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          border: `1px solid ${border}`,
          overflow: "hidden"
        }}>


          {/* Suggestions */}
          <div style={{ padding: "8px 0" }}>
             {[
               "Which products are driving the most revenue?",
               "Draft an email to customers who abandoned carts",
               "Should I increase ad spend on Instagram?",
               "What is my current inventory level?"
             ].map((q, i) => (
               <div key={i} style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: i === 1 ? t(dark, "#2a2a2a", "#f9fafb") : "transparent" }}>
                 <ArrowRight size={14} color={i === 1 ? text : muted} />
                 <span style={{ fontSize: 13, color: i === 1 ? text : muted, fontWeight: i === 1 ? 600 : 400 }}>{q}</span>
               </div>
             ))}
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${t(dark, "#333", "#f0f0f0")}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 2, height: 16, background: "#8b5cf6" }} />
              <span style={{ fontSize: 13, color: muted }}>Ask a question about this answer...</span>
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