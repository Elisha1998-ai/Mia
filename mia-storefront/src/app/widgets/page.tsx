import { HeroMockup } from "@/components/mockups/HeroMockup";
import { InvoiceMockup } from "@/components/mockups/InvoiceMockup";
import { ProductImportMockup } from "@/components/mockups/ProductImportMockup";
import { EmailMarketingMockup } from "@/components/mockups/EmailMarketingMockup";
import { StoreBuilderMockup } from "@/components/mockups/StoreBuilderMockup";

export default function WidgetsPage() {
  return (
    <div style={{ padding: 40, background: "#f9fafb", minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>UI Widgets</h1>
      
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#666" }}>Hero Mockup (Light)</h2>
        <div style={{ 
          maxWidth: 880, 
          padding: "8px 8px 0",
          background: "rgba(0,0,0,0.025)",
          border: "1px solid rgba(0,0,0,0.07)",
          borderBottom: "none",
          borderRadius: "16px 16px 0 0",
        }}>
           <HeroMockup dark={false} />
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#666" }}>Invoice Generation Mockup (Mobile View)</h2>
        <div style={{ 
          maxWidth: 375, 
          padding: "8px 8px 0",
          background: "rgba(0,0,0,0.025)",
          border: "1px solid rgba(0,0,0,0.07)",
          borderBottom: "none",
          borderRadius: "16px 16px 0 0",
        }}>
           <InvoiceMockup dark={false} />
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#666" }}>Product Import Mockup</h2>
        <div style={{ 
          maxWidth: 375, 
          padding: "8px 8px 0",
          background: "rgba(0,0,0,0.025)",
          border: "1px solid rgba(0,0,0,0.07)",
          borderBottom: "none",
          borderRadius: "16px 16px 0 0",
        }}>
           <ProductImportMockup dark={false} />
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#666" }}>Email Marketing Mockup</h2>
        <div style={{ 
          maxWidth: 375, 
          padding: "8px 8px 0",
          background: "rgba(0,0,0,0.025)",
          border: "1px solid rgba(0,0,0,0.07)",
          borderBottom: "none",
          borderRadius: "16px 16px 0 0",
        }}>
           <EmailMarketingMockup dark={false} />
        </div>
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#666" }}>Store Builder Mockup</h2>
        <div style={{ 
          maxWidth: 375, 
          padding: "8px 8px 0",
          background: "rgba(0,0,0,0.025)",
          border: "1px solid rgba(0,0,0,0.07)",
          borderBottom: "none",
          borderRadius: "16px 16px 0 0",
        }}>
           <StoreBuilderMockup dark={false} />
        </div>
      </div>
    </div>
  );
}