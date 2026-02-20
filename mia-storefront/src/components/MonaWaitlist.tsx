"use client";

import React, { useState, useEffect } from "react";
import { Store, Package, BarChart2, FileText, ArrowRight, Zap, Target, MessageCircle, Sun, Moon, Check, Link2, MoreHorizontal, Sparkles, Clock, ArrowUp, X, ChevronDown } from "lucide-react";
import { HeroMockup } from "./mockups/HeroMockup";

const WHATSAPP_LINK = "https://chat.whatsapp.com/YOUR_INVITE_LINK_HERE";

// ── THEME ────────────────────────────────────────────────────────────────────
function t<T>(dark: boolean, d: T, l: T): T { return dark ? d : l; }



// ── BUTTONS ──────────────────────────────────────────────────────────────────
interface WAButtonProps {
  large?: boolean;
  dark?: boolean;
}

function WAButton({ large }: WAButtonProps) {
  const [hov, setHov] = useState(false);
  return (
    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center",
        padding: large ? "12px 24px" : "9px 18px",
        fontSize: large ? 14 : 13, fontWeight: 500, fontFamily: "Inter, sans-serif",
        borderRadius: 8, textDecoration: "none", cursor: "pointer",
        background: hov ? "#1d4ed8" : "#2563eb",
        color: "#fff",
        border: "none",
        transition: "background 0.15s",
      }}>
      Get early access
    </a>
  );
}

interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
}

function ThemeToggle({ dark, onToggle }: ThemeToggleProps) {
  return (
    <button onClick={onToggle} style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 36, height: 36, borderRadius: 8, cursor: "pointer",
      background: t(dark, "#1a1a1a", "#f3f4f6"),
      border: `1px solid ${t(dark, "#333", "#e5e7eb")}`,
      color: t(dark, "#aaa", "#555"),
      transition: "all 0.2s",
    }}>
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

// ── SHARED STYLES ─────────────────────────────────────────────────────────────
const F = "Inter, sans-serif";
const C: React.CSSProperties = { maxWidth: 1040, margin: "0 auto", padding: "0 32px" };

interface HeadingProps {
  dark: boolean;
  children: React.ReactNode;
}

function H1({ dark, children }: HeadingProps) {
  return (
    <h1 style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", fontWeight: 600, letterSpacing: "-3px", lineHeight: 1.05, color: t(dark, "#fff", "#111"), fontFamily: F, margin: "0 auto 24px", maxWidth: 760 }}>
      {children}
    </h1>
  );
}

interface H2Props extends HeadingProps {
  maxWidth?: number | string;
}

function H2({ dark, children, maxWidth }: H2Props) {
  return (
    <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)", fontWeight: 600, letterSpacing: "-1.5px", lineHeight: 1.15, color: t(dark, "#fff", "#111"), fontFamily: F, maxWidth: maxWidth || "none" }}>
      {children}
    </h2>
  );
}

function Label({ dark, children }: HeadingProps) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: t(dark, "#555", "#9ca3af"), marginBottom: 14, fontFamily: F }}>
      {children}
    </p>
  );
}

function Divider({ dark }: { dark: boolean }) {
  return <div style={{ borderTop: `1px solid ${t(dark, "#111", "#f3f4f6")}` }} />;
}

const features = [
  { Icon: Store,     title: "Set up your store",   desc: "Tell Mona your business name and what you sell. She handles branding, colors, and layout in minutes." },
  { Icon: Package,   title: "Manage products",     desc: "Add, edit, or remove products by chatting. Bulk upload a list and Mona handles the rest." },
  { Icon: BarChart2, title: "Business insights",   desc: "Ask how your business is doing. Mona answers in plain English — no dashboards to decode." },
  { Icon: FileText,  title: "Generate invoices",   desc: "Need an invoice? Just ask. Mona creates and sends professional PDF invoices instantly." },
  { Icon: Zap,       title: "Email marketing",     desc: "Tell Mona to email your customers about a sale. She writes and sends it — you just approve." },
  { Icon: Target,    title: "Order management",    desc: "View orders, update statuses, and track fulfilment — all from a single conversation." },
];

const proof = [
  { quote: "This is exactly what I've been looking for. Managing my store on Shopify is a headache — Mona sounds like a lifesaver.", name: "Temi A.", role: "Fashion Seller, Lagos", initials: "TA" },
  { quote: "I can't believe you can just chat to manage your whole store. This is going to be big for Nigerian sellers.", name: "Chidi O.", role: "Entrepreneur, Abuja", initials: "CO" },
  { quote: "I run my whole business on Instagram DMs. If Mona can manage everything in one place, I'm in.", name: "Amaka F.", role: "Beauty Brand Owner, Port Harcourt", initials: "AF" },
];

// ── MAIN ──────────────────────────────────────────────────────────────────────
export function MonaWaitlist() {
  const dark = false; // Force light mode
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const bg       = t(dark, "#000",    "#fff");
  const border   = t(dark, "#111",    "#f3f4f6");
  const bodyCol  = t(dark, "#666",    "#6b7280");
  const mutedCol = t(dark, "#555",    "#9ca3af");
  const cardBg   = t(dark, "#000",    "#fff");
  const cardBdr  = t(dark, "#1a1a1a", "#e5e7eb");
  const dimBg    = t(dark, "#0a0a0a", "#f9fafb");
  const iconBdr  = t(dark, "#222",    "#e5e7eb");
  const iconCol  = t(dark, "#888",    "#6b7280");

  return (
    <div style={{ fontFamily: F, background: bg, color: t(dark, "#fff", "#111"), lineHeight: 1.6, transition: "background 0.3s, color 0.3s" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes tdot { 0%,80%,100%{transform:translateY(0);opacity:0.3} 40%{transform:translateY(-4px);opacity:1} }
        @keyframes appear { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes appearZoom { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .appear { animation: appear 0.6s ease forwards; opacity: 0; }
        .appear-zoom { animation: appearZoom 0.7s ease forwards; opacity: 0; }
        .d0   { animation-delay: 0ms; }
        .d100 { animation-delay: 150ms; }
        .d200 { animation-delay: 300ms; }
        .d400 { animation-delay: 500ms; }
        .d700 { animation-delay: 750ms; }
        .d1000{ animation-delay: 1100ms; }

        @media (max-width: 640px) {
          .hero-mockup { border-radius: 12px !important; }
          .hm-header { padding: 12px 16px !important; }
          .hm-content { padding: 20px !important; min-height: auto !important; }
          .hm-tooltip { left: 50% !important; transform: translateX(-50%); top: -45px !important; width: max-content; }
          .hm-input { border-radius: 12px !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, borderBottom: scrolled ? `1px solid ${t(dark,"#1a1a1a","#e5e7eb")}` : "1px solid transparent", background: scrolled ? t(dark,"rgba(0,0,0,0.92)","rgba(255,255,255,0.92)") : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", transition: "all 0.2s" }}>
        <div style={{ ...C, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px" }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: t(dark,"#fff","#111"), letterSpacing: "-0.5px" }}>mona.</span>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/auth/signin" style={{ fontSize: 14, fontWeight: 600, color: t(dark, "#ccc", "#444"), textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = t(dark, "#fff", "#000")} onMouseLeave={(e) => e.currentTarget.style.color = t(dark, "#ccc", "#444")}>
              Log in
            </a>
            <WAButton dark={dark} />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 140, paddingBottom: 0, textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Dot grid background */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `radial-gradient(${t(dark,"rgba(255,255,255,0.06)","rgba(0,0,0,0.06)")} 1px, transparent 1px)`, backgroundSize: "28px 28px", maskImage: "radial-gradient(ellipse 70% 55% at 50% 0%, black 40%, transparent 100%)" }} />

        <div style={{ ...C, position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Badge */}
          <div className="appear d0" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1px solid ${t(dark,"#2a2a2a","#e5e7eb")}`, borderRadius: 100, padding: "5px 16px", fontSize: 12, color: mutedCol, marginBottom: 28, fontFamily: F, background: t(dark,"rgba(255,255,255,0.03)","rgba(0,0,0,0.02)") }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "blink 2s infinite" }} />
            Now accepting early access signups
          </div>

          {/* Gradient headline */}
          <h1 className="appear d100" style={{
            fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
            fontWeight: 600,
            letterSpacing: "-3.5px",
            lineHeight: 1.04,
            marginBottom: 24,
            fontFamily: F,
            maxWidth: 780,
            backgroundImage: t(dark,
              "linear-gradient(180deg, #ffffff 40%, rgba(255,255,255,0.35) 100%)",
              "linear-gradient(180deg, #111111 40%, rgba(17,17,17,0.35) 100%)"
            ),
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Your store,<br />managed by AI.
          </h1>

          {/* Description */}
          <p className="appear d200" style={{ fontSize: 18, color: bodyCol, maxWidth: 460, lineHeight: 1.75, fontFamily: F, fontWeight: 400, marginBottom: 36 }}>
            Stop managing your business manually. Tell Mona what you need — she handles the rest.
          </p>

          {/* CTA */}
          <div className="appear d400" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 72 }}>
            <WAButton large />
            <span style={{ fontSize: 12, color: mutedCol, fontFamily: F }}>Free to join · No credit card</span>
          </div>
        </div>

        {/* Mockup frame + glow */}
        <div style={{ ...C, position: "relative", display: "flex", justifyContent: "center" }}>
          {/* MockupFrame */}
          <div className="appear-zoom d700" style={{
            position: "relative", zIndex: 1,
            background: t(dark, "rgba(255,255,255,0.035)", "rgba(0,0,0,0.025)"),
            border: `1px solid ${t(dark,"rgba(255,255,255,0.07)","rgba(0,0,0,0.07)")}`,
            borderBottom: "none",
            borderRadius: "16px 16px 0 0",
            padding: "8px 8px 0",
            width: "100%",
            maxWidth: 880,
            maskImage: "linear-gradient(to bottom, black 95%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 95%, transparent 100%)",
          }}>
            <HeroMockup dark={dark} />
          </div>
        </div>
      </section>

      <Divider dark={dark} />

      {/* PROBLEM */}
      <section style={{ padding: "100px 0" }}>
        <div style={C}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "start" }}>
            <div>
              <Label dark={dark}>The Problem</Label>
              <H2 dark={dark}>You're running a business on willpower alone.</H2>
            </div>
            <div>
              <p style={{ fontSize: 16, color: bodyCol, lineHeight: 1.8, fontFamily: F, marginBottom: 32 }}>
                Orders in your DMs. Payments tracked in your head. Invoices made at midnight. Nigerian merchants deserve better tools — built for them.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  "Managing orders across Instagram, WhatsApp, and email at once",
                  "Building a professional store without technical knowledge",
                  "Tracking revenue, products, and customers without a dashboard",
                  "Creating invoices, policies, and brand assets from scratch",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", border: `1px solid ${t(dark,"#333","#d1d5db")}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: t(dark,"#444","#d1d5db") }} />
                    </div>
                    <p style={{ fontSize: 14, color: bodyCol, lineHeight: 1.6, fontFamily: F }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider dark={dark} />

      {/* SOLUTION */}
      <section style={{ padding: "100px 0" }}>
        <div style={C}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>
            <div>
              <Label dark={dark}>The Solution</Label>
              <H2 dark={dark} maxWidth={420}>Just tell Mona what you need.</H2>
              <p style={{ fontSize: 15, color: bodyCol, lineHeight: 1.8, fontFamily: F, marginTop: 16, marginBottom: 32 }}>
                Mona is an AI agent that runs your store for you. No dashboards, no settings pages, no learning curve. A simple chat interface that does everything.
              </p>
            </div>
            <div style={{ background: dimBg, border: `1px solid ${cardBdr}`, borderRadius: 16, padding: 24, transition: "background 0.3s" }}>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.15em", color: mutedCol, marginBottom: 16, fontFamily: F }}>What you say to Mona</p>
              {[
                '"Set up my store. I sell handmade jewelry."',
                '"How many orders did I get this week?"',
                '"Generate an invoice for Fatima\'s order."',
                '"Add 20 products from this spreadsheet."',
                '"Write a description for my ankara bags."',
                '"Email my customers about today\'s sale."',
              ].map((cmd, i, arr) => (
                <div key={i} style={{ padding: "11px 0", fontSize: 13, color: t(dark,"#aaa","#374151"), borderBottom: i < arr.length - 1 ? `1px solid ${cardBdr}` : "none", fontFamily: F, display: "flex", alignItems: "center", gap: 10 }}>
                  <ArrowRight size={12} color={mutedCol} style={{ flexShrink: 0 }} />
                  {cmd}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider dark={dark} />

      {/* FEATURES */}
      <section style={{ padding: "100px 0" }}>
        <div style={C}>
          <Label dark={dark}>Features</Label>
          <H2 dark={dark} maxWidth={480}>Everything your business needs, in one chat.</H2>
          <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, border: `1px solid ${cardBdr}`, borderRadius: 16, overflow: "hidden" }}>
            {features.map(({ Icon, title, desc }) => (
              <div key={title} style={{ padding: "32px 28px", borderRight: `1px solid ${cardBdr}`, borderBottom: `1px solid ${cardBdr}`, background: cardBg, transition: "background 0.3s" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${iconBdr}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon size={16} color={iconCol} />
                </div>
                <div style={{ fontWeight: 500, fontSize: 14, color: t(dark,"#fff","#111"), marginBottom: 8, fontFamily: F }}>{title}</div>
                <div style={{ fontSize: 13, color: bodyCol, lineHeight: 1.7, fontFamily: F }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider dark={dark} />

      {/* SOCIAL PROOF */}
      <section style={{ padding: "100px 0" }}>
        <div style={C}>
          <Label dark={dark}>Early Reactions</Label>
          <H2 dark={dark} maxWidth={480}>What merchants are saying.</H2>
          <div style={{ marginTop: 56, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {proof.map(p => (
              <div key={p.name} style={{ border: `1px solid ${cardBdr}`, borderRadius: 16, padding: 28, background: cardBg, transition: "background 0.3s" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#2563eb"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: bodyCol, lineHeight: 1.8, marginBottom: 24, fontFamily: F }}>"{p.quote}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 20, borderTop: `1px solid ${cardBdr}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: t(dark,"#1a1a1a","#f3f4f6"), border: `1px solid ${cardBdr}`, display: "flex", alignItems: "center", justifyContent: "center", color: t(dark,"#fff","#111"), fontWeight: 700, fontSize: 12, flexShrink: 0, fontFamily: F }}>{p.initials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: t(dark,"#fff","#111"), fontFamily: F }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: mutedCol, fontFamily: F }}>{p.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider dark={dark} />

      {/* PRICING */}
      <section style={{ padding: "100px 0" }}>
        <div style={C}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>
            <div>
              <Label dark={dark}>Early Access</Label>
              <H2 dark={dark} maxWidth={400}>Join early.<br />Pay less. Forever.</H2>
              <p style={{ fontSize: 15, color: bodyCol, lineHeight: 1.8, fontFamily: F, marginTop: 16, marginBottom: 32, maxWidth: 400 }}>
                Mona will be a paid product — but our first 100 merchants get founding member pricing locked in for life.
              </p>
            </div>
            <div style={{ border: `1px solid ${cardBdr}`, borderRadius: 16, overflow: "hidden" }}>
              {[
                { plan: "Founding Member", price: "Locked for life", desc: "First 100 merchants only", highlight: true },
                { plan: "Growth",          price: "Coming soon",     desc: "For scaling merchants",    highlight: false },
                { plan: "Pro",             price: "Coming soon",     desc: "For high-volume stores",   highlight: false },
              ].map((tier, i, arr) => (
                <div key={tier.plan} style={{ padding: "22px 28px", borderBottom: i < arr.length - 1 ? `1px solid ${cardBdr}` : "none", background: tier.highlight ? t(dark,"#0d1a3a","#eff6ff") : cardBg, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background 0.3s" }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14, color: tier.highlight ? t(dark,"#fff","#1d4ed8") : mutedCol, marginBottom: 4, fontFamily: F }}>{tier.plan}</div>
                    <div style={{ fontSize: 12, color: tier.highlight ? t(dark,"#6b9eff","#3b82f6") : t(dark,"#333","#d1d5db"), fontFamily: F }}>{tier.desc}</div>
                  </div>
                  <div style={{ fontWeight: 500, fontSize: 13, color: tier.highlight ? "#2563eb" : mutedCol, fontFamily: F }}>{tier.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Divider dark={dark} />

      {/* FINAL CTA */}
      <section style={{ padding: "120px 0", textAlign: "center", background: "#000", color: "#fff" }}>
        <div style={C}>
          <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", fontWeight: 600, letterSpacing: "-2.5px", lineHeight: 1.05, color: "#fff", marginBottom: 20, fontFamily: F }}>
            Your business deserves<br />a manager.
          </h2>
          <p style={{ fontSize: 16, color: "#9ca3af", maxWidth: 440, margin: "0 auto 40px", lineHeight: 1.8, fontFamily: F }}>
            Stop doing everything alone. Let Mona handle the heavy lifting while you focus on growth.
          </p>
          <WAButton large />
          <p style={{ fontSize: 12, color: "#555", marginTop: 16, fontFamily: F }}>No credit card required · No spam · Early access only</p>
        </div>
      </section>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid #111", padding: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, transition: "border 0.3s", background: "#000", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: "-50px", left: "50%", transform: "translateX(-50%)", width: "60%", height: "100px", background: "radial-gradient(circle, rgba(37,99,235,0.4) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
        <span style={{ fontWeight: 800, fontSize: 16, color: "#fff", letterSpacing: "-0.5px", fontFamily: F, zIndex: 1 }}>mona.</span>
        <p style={{ fontSize: 12, color: "#555", fontFamily: F, zIndex: 1 }}>© 2025 Mona. Built for African merchants. 🇳🇬</p>
        <p style={{ fontSize: 12, color: "#555", fontFamily: F, zIndex: 1 }}>Nigeria · Lagos</p>
      </div>
    </div>
  );
}
