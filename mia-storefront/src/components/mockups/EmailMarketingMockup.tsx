"use client";

import React from "react";
import { Sparkles, Check, Link2, MoreHorizontal, Clock, ArrowUp, ArrowRight, Mail, Send } from "lucide-react";

// Simple theme helper
function t<T>(dark: boolean, d: T, l: T): T { return dark ? d : l; }

interface EmailMarketingMockupProps {
  dark?: boolean;
}

export function EmailMarketingMockup({ dark = false }: EmailMarketingMockupProps) {
  // Styles based on dark mode
  const bg = t(dark, "#1a1a1a", "#fff");
  const text = t(dark, "#fff", "#111");
  const border = t(dark, "#333", "#e5e7eb");
  const muted = t(dark, "#666", "#6b7280");
  const primaryBlue = "#0070E0"; // Primary Blue
  
  return (
    <div className="email-marketing-mockup" style={{ 
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
      <div className="emm-content" style={{ padding: "20px", minHeight: "auto", position: "relative" }}>
        {/* Date */}
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: muted, marginBottom: 32 }}>Today 3:45 PM</div>

        {/* User Question */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
          <div style={{ background: t(dark, "#2a2a2a", "#f3f4f6"), borderRadius: "20px 20px 4px 20px", padding: "10px 20px", fontSize: 14, fontWeight: 500, color: text }}>
            Email my top customers about the Summer Sale.
          </div>
        </div>

        {/* Bot Answer */}
        <div style={{ marginBottom: 24, position: "relative" }}>
           <div style={{ display: "flex", gap: 12, fontSize: 12, fontWeight: 700, color: muted, marginBottom: 4 }}>
             <span>1 / 1</span>
           </div>
           <div style={{ fontSize: 15, lineHeight: 1.7, color: t(dark, "#ccc", "#374151"), textAlign: "left", marginBottom: 16 }}>
             I've drafted a campaign for <span style={{ fontWeight: 600, color: text }}>150 'Top Customers'</span> who spent over ₦50k this year. Here is a preview:
           </div>

           {/* Email Preview Card */}
           <div style={{ 
             background: t(dark, "#111", "#fff"), 
             border: `1px solid ${border}`, 
             borderRadius: 8, 
             overflow: "hidden",
             padding: 16,
             boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
           }}>
             <div style={{ borderBottom: `1px solid ${border}`, paddingBottom: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: muted, marginBottom: 4 }}>Subject</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: text }}>Exclusive Early Access: Summer Sale ☀️</div>
             </div>
             <div style={{ fontSize: 13, lineHeight: 1.6, color: t(dark, "#ccc", "#4b5563") }}>
               <p style={{ marginBottom: 12 }}>Hi {`{{first_name}}`},</p>
               <p style={{ marginBottom: 12 }}>Our biggest sale of the year starts this Friday, but because you're one of our best customers, we're giving you <strong>24-hour early access</strong>.</p>
               <div style={{ background: t(dark, "#222", "#f9fafb"), padding: 12, borderRadius: 6, display: "flex", gap: 12, alignItems: "center", border: `1px solid ${border}` }}>
                  <div style={{ width: 40, height: 40, background: "#e5e7eb", borderRadius: 4 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: text }}>Summer Collection</div>
                    <div style={{ fontSize: 11, color: muted }}>Up to 40% off</div>
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, color: primaryBlue }}>Shop Now →</div>
               </div>
             </div>
           </div>
           
           {/* Tooltip */}
           <div className="emm-tooltip" style={{ position: "absolute", top: -45, left: "50%", transform: "translateX(-50%)", width: "max-content", background: t(dark, "#fff", "#111"), color: t(dark, "#111", "#fff"), padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
             <Mail size={14} /> Send test email
           </div>
        </div>

        {/* Follow-up / Input Card */}
        <div className="emm-input" style={{ 
          background: t(dark, "#222", "#fff"), 
          borderRadius: 12, 
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          border: `1px solid ${border}`,
          overflow: "hidden"
        }}>


          {/* Suggestions */}
          <div style={{ padding: "8px 0" }}>
             {[
               "Send to all 150 customers",
               "Change subject to 'VIP Access'",
               "Add a discount code",
               "Schedule for tomorrow 9 AM"
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
