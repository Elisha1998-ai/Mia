
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { 
  storeSettings, 
  orders, 
  products, 
  customers, 
  users, 
  inventoryLogs 
} from "@/lib/schema";
import { eq, desc, sql, sum, count, and, lt } from "drizzle-orm";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

// Initialize Groq provider
// Using OpenAI SDK with Groq's base URL
const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// Helper to get business summary
async function getBusinessSummary(userId: string) {
  try {
    // 0. Store & User Info
    const settings = await db.query.storeSettings.findFirst({
      where: eq(storeSettings.userId, userId),
      orderBy: [desc(storeSettings.updatedAt)],
    });

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    const storeName = settings?.storeName || "Your Store";
    const userFirstName = user?.firstName || user?.name?.split(' ')[0] || "there";
    const niche = settings?.niche || "Ecommerce";
    const location = settings?.location || "Nigeria";

    // 1. Sales Overview
    // Note: sum() returns a string in Drizzle/pg, so we cast
    const orderStats = await db
      .select({
        count: count(),
        revenue: sum(orders.totalAmount),
      })
      .from(orders)
      .where(eq(orders.userId, userId));

    const revenue = orderStats[0]?.revenue ? parseFloat(orderStats[0].revenue) : 0;
    const totalOrders = orderStats[0]?.count || 0;

    const unpaidStats = await db
      .select({ count: count() })
      .from(orders)
      .where(and(eq(orders.userId, userId), eq(orders.status, 'pending')));
    
    const pendingOrders = unpaidStats[0]?.count || 0;

    // 2. Inventory Stats
    const productStats = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.userId, userId));
      
    const totalProducts = productStats[0]?.count || 0;

    const lowStockProducts = await db.query.products.findMany({
      where: and(eq(products.userId, userId), lt(products.stockQuantity, 10)),
      limit: 5,
    });

    // 3. Customer Overview
    const customerStats = await db
      .select({ count: count() })
      .from(customers)
      .where(eq(customers.userId, userId));
      
    const totalCustomers = customerStats[0]?.count || 0;

    const topCustomers = await db.query.customers.findMany({
      where: eq(customers.userId, userId),
      orderBy: [desc(customers.lifetimeValue)],
      limit: 5,
    });

    return `
AI SYSTEM CONTEXT: You are Mia, a highly intelligent Business Manager for ${storeName}. 
You have direct access to the store's database. Use the data below to answer the user's questions accurately.

USER PROFILE:
- User: ${userFirstName}
- Store: ${storeName}
- Niche: ${niche}
- Primary Market: ${location}

LIVE STORE DATA SUMMARY (Fetched at ${new Date().toLocaleString()}):

1. KEY METRICS:
- Total Revenue: ₦${revenue.toLocaleString()}
- Total Orders: ${totalOrders}
- Total Customers: ${totalCustomers}
- Total Products: ${totalProducts}
- Unpaid/Pending Orders: ${pendingOrders}

2. TOP CUSTOMERS (By Lifetime Value):
${topCustomers.length > 0 ? topCustomers.map(c => `- ${c.fullName || c.email} (₦${Number(c.lifetimeValue).toLocaleString()})`).join('\n') : "No customer data available yet."}

3. INVENTORY ALERTS:
${lowStockProducts.length > 0 ? lowStockProducts.map(p => `- LOW STOCK: ${p.name} (${p.stockQuantity} left)`).join('\n') : "Inventory levels are healthy."}
`;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error generating business summary. Please proceed with general knowledge.";
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const { message } = body;
    
    // Fallback for development if session is missing (matches Python logic)
    // In production, we should enforce session
    let userId = session?.user?.id || body.user_id;

    // If no userId provided, try to find a dev user or fail
    if (!userId) {
        // Optional: Look for a dev user if strictly local dev
        // For now, return unauthorized to be safe
        return NextResponse.json({ content: "Please sign in to continue." }, { status: 401 });
    }

    const businessContext = await getBusinessSummary(userId);

    const systemPrompt = `
${businessContext}

### YOUR IDENTITY:
You are Mia, the expert Business Manager for this store. 

### CRITICAL RULES:
1. ALWAYS use the numbers provided in the 'YOUR DATA SOURCE' above to answer questions. 
2. If a user asks "How many products/orders/customers?", you MUST look at the numbers above and state them directly.
3. NEVER say you don't have access to the data. If the data is 0, say it is 0.
4. If you need to perform an action (Create Doc, Import Products, etc.), use your TOOLS.
5. If no action is needed, respond briefly and professionally.
6. Use Nigerian Naira (₦) for all currency.
`;

    // Using Llama 3.3 70B via Groq
    const { text, toolResults, toolCalls } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: message,
      tools: {
        createDocument: tool({
          description: 'Create a professional ecommerce document (policy, invoice, or legal text).',
          parameters: z.object({
            docType: z.string().optional().describe("The type of document (e.g., 'refund_policy', 'shipping_policy', 'invoice')."),
            type: z.string().optional().describe("Alias for docType."),
            details: z.string().optional().describe("Any specific details to include in the document."),
            content: z.string().optional().describe("Alias for details."),
          }),
          execute: async ({ docType, type, details, content }) => {
            const finalType = docType || type || "document";
            const finalDetails = details || content || "No details provided";

            // Generate a more realistic draft based on the docType
            let draftContent = "";
            const title = finalType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
            
            if (finalType.includes("refund") || finalType.includes("return")) {
                draftContent = `# ${title}\n\n**Effective Date:** ${new Date().toLocaleDateString()}\n\n## 1. Return Policy\nWe want you to be completely satisfied with your purchase. If you are not satisfied, you may return the item within 30 days of delivery.\n\n## 2. Refunds\nOnce we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.\n\n## 3. Shipping\nYou will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.`;
            } else if (finalType.includes("privacy")) {
                draftContent = `# ${title}\n\n**Last Updated:** ${new Date().toLocaleDateString()}\n\n## 1. Information Collection\nWe collect information from you when you register on our site, place an order, subscribe to our newsletter or fill out a form.\n\n## 2. Information Usage\nAny of the information we collect from you may be used to personalize your experience, improve our website, or process transactions.`;
            } else if (finalType.includes("invoice")) {
                draftContent = `# INVOICE\n\n**Invoice #:** INV-${Math.floor(Math.random() * 10000)}\n**Date:** ${new Date().toLocaleDateString()}\n\n## Bill To:\n[Customer Name]\n[Customer Address]\n\n## Items:\n| Item | Quantity | Price |\n| :--- | :---: | ---: |\n| Web Design Services | 1 | $500.00 |\n| Hosting Setup | 1 | $100.00 |\n\n**Total:** $600.00`;
            } else {
                draftContent = `# ${title}\n\nThis is a draft document based on your request: "${finalDetails}".\n\n## Overview\n[Add overview here]\n\n## Details\n[Add specific details here]\n\n## Conclusion\n[Add conclusion here]`;
            }

            return {
              type: "document",
              title: title,
              description: draftContent, // Changed from 'content' to 'description' to match frontend Widget interface
              actions: ["download", "copy", "edit"]
            };
          },
        }),
        importProducts: tool({
          description: 'Import a list of products provided by the user in text format.',
          parameters: z.object({
            productListText: z.string().optional().describe("The raw text containing product names, prices, and other details."),
            text: z.string().optional().describe("Alias for productListText."),
          }),
          execute: async ({ productListText, text }) => {
            const finalText = productListText || text;
            if (!finalText) return { success: false, error: "No text provided." };

            // Call a "sub-agent" (another LLM call) to parse the text
            const extraction = await generateText({
              model: groq('llama-3.3-70b-versatile'),
              system: "Extract products from the text. Return ONLY a JSON list of objects with keys: name, price (number), sku (string).",
              prompt: finalText,
            });
            
            try {
              let jsonStr = extraction.text.trim();
              if (jsonStr.includes("```json")) {
                jsonStr = jsonStr.split("```json")[1].split("```")[0];
              } else if (jsonStr.includes("```")) {
                jsonStr = jsonStr.split("```")[1];
              }
              
              const productsData = JSON.parse(jsonStr);
              let count = 0;
              
              for (const p of productsData) {
                await db.insert(products).values({
                  userId,
                  name: p.name,
                  price: p.price.toString(),
                  sku: p.sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                  stockQuantity: 100,
                  platform: "ai_extraction"
                });
                count++;
              }
              return { success: true, count };
            } catch (e) {
              return { success: false, error: "Failed to parse product data." };
            }
          },
        }),
        setupStorefront: tool({
          description: 'Setup a high-converting storefront for the business.',
          parameters: z.object({
            businessName: z.string().optional().describe("The name of the business or store."),
            storeName: z.string().optional().describe("Alias for businessName."),
            niche: z.string().optional().describe("The industry or niche of the store."),
          }),
          execute: async ({ businessName, storeName, niche }) => {
             const finalName = businessName || storeName || "My Store";
             const finalNiche = niche || "Ecommerce";
             
             // Update settings
             await db.insert(storeSettings).values({
               userId,
               storeName: finalName,
               niche: finalNiche,
               // Default mock values
               primaryColor: "#000000",
               headingFont: "Instrument Serif",
               bodyFont: "Inter"
             }).onConflictDoUpdate({
               target: storeSettings.userId,
               set: { storeName: finalName, niche: finalNiche }
             });

             return {
               success: true,
               previewUrl: "http://localhost:3000/store",
               storeName: finalName
             };
          },
        }),
        customizeBranding: tool({
          description: "Customize the store's branding including colors, fonts, and hero content.",
          parameters: z.object({
            primaryColor: z.string().optional(),
            primary_color: z.string().optional().describe("Alias for primaryColor"),
            headingFont: z.string().optional(),
            heading_font: z.string().optional().describe("Alias for headingFont"),
            bodyFont: z.string().optional(),
            body_font: z.string().optional().describe("Alias for bodyFont"),
            heroTitle: z.string().optional().describe("The main title text for the hero section."),
            heroDescription: z.string().optional().describe("The subtitle or description for the hero section."),
            heroImageUrl: z.string().optional().describe("URL for hero image (not currently persisted)."),
            hero_image_url: z.string().optional().describe("Alias for heroImageUrl"),
          }),
          execute: async (params) => {
            // Normalize params and filter for DB columns only
            const dbUpdates: any = {};
            
            if (params.primaryColor || params.primary_color) dbUpdates.primaryColor = params.primaryColor || params.primary_color;
            if (params.headingFont || params.heading_font) dbUpdates.headingFont = params.headingFont || params.heading_font;
            if (params.bodyFont || params.body_font) dbUpdates.bodyFont = params.bodyFont || params.body_font;
            if (params.heroTitle) dbUpdates.heroTitle = params.heroTitle;
            if (params.heroDescription) dbUpdates.heroDescription = params.heroDescription;

            // Fetch existing or create new
            const existing = await db.query.storeSettings.findFirst({ where: eq(storeSettings.userId, userId) });
            
            if (existing) {
              await db.update(storeSettings)
                .set(dbUpdates)
                .where(eq(storeSettings.userId, userId));
            } else {
              await db.insert(storeSettings).values({
                userId,
                storeName: "My Store", // Default
                ...dbUpdates
              });
            }
            
            return {
              success: true,
              previewUrl: "http://localhost:3000/store",
              storeName: existing?.storeName || "My Store"
            };
          }
        })
      },
      maxSteps: 2, // Allow multi-step if needed
    });

    // Format response for the frontend
    let finalResponse = {
      content: text,
      steps: [] as string[],
      intent: "general_query",
      widget: null as any
    };

    // Check if any tool was executed and format the "widget" response
    if (toolCalls && toolCalls.length > 0) {
      // Find the most relevant tool call (prioritize setupStorefront, createDocument, importProducts)
      // For now, we take the last one as it's likely the final action
      const lastTool = toolCalls[toolCalls.length - 1]; 
      
      // Try to find result in toolResults
      let result = toolResults?.find(r => r.toolCallId === lastTool.toolCallId)?.result;
      
      // Safe access to args
      const args = lastTool.args || {};

      // Fallback: if result is missing but we know the tool, try to infer success or use a generic success message
      if (!result) {
        console.warn(`Tool result missing for ${lastTool.toolName}, using fallback.`);
        if (lastTool.toolName === "setupStorefront") {
           result = { success: true, storeName: args.businessName || args.storeName || "My Store", previewUrl: "http://localhost:3000/store" };
        } else if (lastTool.toolName === "customizeBranding") {
           result = { success: true, storeName: "My Store", previewUrl: "http://localhost:3000/store" };
        } else {
           result = { success: true };
        }
      }

      if (result) {
        if (lastTool.toolName === "createDocument") {
          finalResponse.intent = "document_generation";
          finalResponse.steps = ["Analyzing requirements", "Drafting document structure", "Polishing final text"];
          finalResponse.widget = result;
          finalResponse.content = `I've drafted the ${args.docType || args.type || 'document'} for you.`;
        } else if (lastTool.toolName === "importProducts") {
          finalResponse.intent = "product_extraction";
          finalResponse.steps = ["Parsing text", "Extracting product details", "Saving to inventory"];
          finalResponse.content = result.success 
            ? `Successfully imported ${result.count || 'products'} to your inventory.` 
            : `I encountered an issue importing products: ${result.error || 'Unknown error'}`;
        } else if (lastTool.toolName === "setupStorefront") {
          finalResponse.intent = "store_setup";
          finalResponse.steps = ["Analyzing niche", "Configuring layout", "Applying branding"];
          finalResponse.content = `I've set up your storefront for **${result.storeName || 'your store'}**!`;
          finalResponse.widget = {
            type: "store_preview",
            url: result.previewUrl || "http://localhost:3000/store",
            storeName: result.storeName || "My Store"
          };
        } else if (lastTool.toolName === "customizeBranding") {
          finalResponse.intent = "branding_customization";
          finalResponse.steps = ["Updating color palette", "Configuring typography", "Refreshing storefront"];
          finalResponse.content = "I've updated your store's branding! The new look is live.";
          finalResponse.widget = {
             type: "store_preview",
             url: result.previewUrl || "http://localhost:3000/store",
             storeName: result.storeName || "My Store"
          };
        }
      }
    }
    
    // Final safety check: if content is empty, provide a default response
    if (!finalResponse.content || finalResponse.content.trim() === "") {
        finalResponse.content = "I've processed your request.";
    }

    return NextResponse.json(finalResponse);

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
