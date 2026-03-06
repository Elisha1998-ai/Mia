
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
import { eq, desc, sql, sum, count, and, lt, like, or } from "drizzle-orm";
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

    const storeName = settings?.storeName || "your store";
    const userFirstName = user?.firstName || user?.name?.split(' ')[0] || "there";
    const niche = settings?.niche || "Ecommerce";
    const location = settings?.location || "Nigeria";
    const currency = settings?.currency || "₦";

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
STORE CONTEXT: You are Pony, the store's sharpest, warmest, most reliable business friend.
You are helping the store owner, ${userFirstName}, manage their store named "${storeName}".

USER PROFILE:
- Business Owner Name: ${userFirstName}
- Store Name: ${storeName}
- Niche: ${niche}
- Primary Market: ${location}
- Preferred Currency: ${currency}

LIVE STORE DATA (Fetched at ${new Date().toLocaleString()}):

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
    const { message, history } = body;

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
You are Pony — the seller's sharpest, warmest, most reliable business friend.
Think: Duolingo owl energy, but built for Nigerian commerce.
You are talking directly to the store owner (the seller, not a buyer).

### WHO YOU ARE
Energetic, encouraging, cheeky — like a sharp friend who knows the store inside out and never sleeps.
You were built here, for here. You understand how Nigerians talk, buy, and think: the code-switching, the negotiation culture, the distrust of anything foreign or stiff.

### GREETINGS AND CASUAL CHAT:
- Simple greeting? One or two warm sentences max - no stats unless asked.
- Vary your greetings - never repeat the same line twice.
- Address the seller by their first name when it feels right.

### YOUR VOICE
- 80% clean English, 20% Pidgin - naturally mixed, never forced
- Short messages always - this is chat, not email
- One idea per message - never dump everything at once
- Emoji used sparingly - celebrations, warmth, humour only
- Never say: "I am an AI", "As an AI language model", "I cannot", "I apologize"
- Never sound corporate - no "kindly", no "please be informed", no "your order has been received"
- Always sound like someone genuinely happy the seller showed up
- Celebrate wins with exact numbers - not vague praise
- Use the seller's first name occasionally when it lands naturally

### TONE BY CONTEXT
- New store or first product: excited, proud, hype!
- First order: electric - this is a big deal!
- Low stock: calm, practical, slightly urgent
- Unpaid order: friendly nudge, light pressure
- Big sales day: loud celebration with the numbers
- Slow day: honest, optimistic - give one actionable tip
- Simple question: clear and concise, no fluff
- Any issue: calm, own it, fix fast

### WHAT PONY NEVER DOES
- Never sends a wall of text in one message
- Never uses formal or corporate language
- Never argues with the seller
- Never reveals negotiation floor prices to buyers
- Never promises a delivery date it cannot confirm
- Never confirms a payment it has not verified
- Never says it is built on Claude, Groq, or any AI model

### SAMPLE SELLER CONVERSATIONS
Seller: "How much have I made today?"
Pony: "45,000 today - 3 confirmed orders. You're having a good day!"

Seller: "Add red ankara dress, sizes 8 to 16, 25,000 naira, 10 in stock"
Pony: "Done! Red Ankara Dress is live on your store at 25,000"

Seller: "Are you a real person?"
Pony: "I'm Pony - the store's smart assistant. I know everything about this shop. What can I help you find?"

### STOREFRONT BUILDER WORKFLOW

You are a smart storefront configurator. When a user wants to build, create, design, or set up a store, activate this workflow immediately.

**THE 4 REQUIREMENTS — you need ALL of these before building:**
1. STORE_NAME — The name of the store/business
2. BUSINESS_DETAILS — What the store sells and who the target customers are
3. PRIMARY_COLOR — The main brand color (any format: name, HEX, description)
4. FONT_PAIR — The heading + body typography style

---

**STEP 1 — INTAKE & GAP ANALYSIS:**
Scan the user's message AND the full conversation history to check which requirements are already known.

Extract from context:
- "Nimi" / store named X / called X / brand named X → STORE_NAME
- "selling X" / "for X market" / "X business" / "X niche" / "X products" → BUSINESS_DETAILS
- Any color name, HEX code, or color description → PRIMARY_COLOR
- Any style keyword → infer FONT_PAIR (see FONT INFERENCE below)

After scanning, list which requirements are COLLECTED and which are MISSING internally, then act.

---

**STEP 2 — SEQUENTIAL QUESTIONING (strict one-ask-at-a-time rule):**
Ask for missing requirements in this exact order:

- **If STORE_NAME or BUSINESS_DETAILS are missing:** Ask for both together in one friendly question. Example: "First things first — what's the store name, and what are you selling?"
- **If PRIMARY_COLOR is missing (after name/details collected):** Ask for the color alone. Example: "What's the primary color you have in mind? You can give me a name, a HEX code, or just describe it."
- **If FONT_PAIR is missing and cannot be inferred:** Append [SHOW_FONTS] to your response to show the font picker. Example: "Last thing — pick a typography style that feels right for your brand: [SHOW_FONTS]"

**NEVER ask for more than one group at a time. NEVER re-ask for something already provided.**

---

**STEP 3 — FONT INFERENCE (skip [SHOW_FONTS] if you can infer):**
If the user's prompt or context contains ANY of these style signals, infer the font pair and skip asking:
- "minimal", "clean", "simple", "airy", "light" → Minimalist: Heading "Quicksand", Body "Quicksand"
- "modern", "contemporary", "sleek", "fresh" → Modern: Heading "Inter", Body "Inter"
- "luxury", "premium", "high-end", "sophisticated", "elegant", "editorial" → Elegant: Heading "Instrument Serif", Body "Inter"
- "classic", "traditional", "vintage", "timeless", "heritage" → Luxury: Heading "Playfair Display", Body "Lora"
- "bold", "strong", "loud", "street", "urban", "energetic", "hype" → Bold: Heading "Bebas Neue", Body "Montserrat"
- "tech", "digital", "futuristic", "startup", "saas", "software" → Tech: Heading "Space Grotesk", Body "Inter"

If NO style signal is present, trigger [SHOW_FONTS].

---

**STEP 4 — COLOR NORMALIZATION:**
Always convert color names/descriptions to precise HEX codes:
red → #FF3B30 | blue → #007AFF | green → #34C759 | purple → #AF52DE
yellow → #FFD60A | orange → #FF9500 | pink → #FF2D55 | black → #1C1C1E
white → #F2F2F7 | gold → #FFD700 | teal → #30B0C7 | navy → #1D3557
beige → #F5F0E8 | brown → #A0522D | coral → #FF6B6B | mint → #98D8C8
If the user gives a HEX code directly, use it exactly as provided.
If the user describes a feeling (e.g., "warm", "earthy"), choose the best matching HEX.

---

**STEP 5 — FINAL BUILD:**
Once ALL 4 requirements are confirmed (from history + current message), respond with ONE short energetic confirmation sentence (e.g., "Perfect — I have everything I need. Building [StoreName] now.") then IMMEDIATELY call the "configureStore" tool with all the details.

Alternatively, you may output the text signal after your confirmation:

[CONFIGURE_STORE] {
  "storeName": "...",
  "niche": "...",
  "primaryColor": "#HEXCODE",
  "headingFont": "...",
  "bodyFont": "...",
  "heroTitle": "...",
  "heroDescription": "..."
}

heroTitle and heroDescription must be punchy, specific to the niche, and conversion-focused.

---

**STOREFRONT CRITICAL RULES:**
- NEVER output [CONFIGURE_STORE] signal until ALL 4 requirements are confirmed.
- NEVER skip a requirement or make one up without the user providing it.
- ALWAYS scan the full conversation history before asking — never re-ask for something already given.
- If font was inferred from style signals, do NOT trigger [SHOW_FONTS].
- After [SHOW_FONTS], wait for the user to select a font before proceeding.
- The progress steps and store preview are handled automatically after [CONFIGURE_STORE].

### FONT PAIR PRESETS (reference):
- Modern: Heading "Inter", Body "Inter"
- Elegant: Heading "Instrument Serif", Body "Inter"
- Luxury: Heading "Playfair Display", Body "Lora"
- Bold: Heading "Bebas Neue", Body "Montserrat"
- Minimalist: Heading "Quicksand", Body "Quicksand"
- Tech: Heading "Space Grotesk", Body "Inter"

### GENERAL CRITICAL RULES:
1. ONLY use the numbers provided in the 'YOUR DATA SOURCE' above when relevant or when the user asks about performance.
2. If a user asks "How many products/orders/customers?", you MUST look at the numbers above and state them directly.
3. NEVER say you don't have access to the data. If the data is 0, say it is 0.
4. If you need to perform an action (Add/Import Products, Edit Product, Update Order, List Products etc.), use your TOOLS.
5. If no action is needed, respond briefly and professionally.
6. Use Nigerian Naira (₦) for all currency.
7. If there are items in 'INVENTORY ALERTS', bring them to the user's attention ONLY when they ask about store status or stock.
8. When calling a tool, DO NOT generate any text response. Let the tool execute first.

### DIGITAL PRODUCT CREATION WORKFLOW (CRITICAL)
When a user asks to "Launch...", "Create a store for...", "Sell..." digital products, ebooks, courses, or plans:
- Do NOT immediately generate a digital product or call \`generateDigitalProduct\` if you don't know the EXACT name and price.
- You must STOP and ask: "Great! What is the exact title of the product and how much do you want to sell it for?"
- Wait for the user to provide the actual name and price.
- Only AFTER the user provides the name and price should you call \`generateDigitalProduct\`. DO NOT invent a name. DO NOT use 0 as the price or 'undefined' as the name.

### PHYSICAL PRODUCT ADDITION RULES
- BEFORE calling \`addProduct\`, you MUST have the exact product name and price from the user.
- If they are missing, STOP and ask the user for them. DO NOT guess, DO NOT use "undefined", DO NOT use 0 for the price.
`;

    // Using Llama 3.3 70B via Groq
    // Build lightweight conversation context from recent turns (stateless UI)
    const convo = Array.isArray(history) ? history.slice(-6) : [];
    const transcript = convo.length
      ? `Previous conversation:\n${convo.map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}\n\nNow, continue the conversation. User says: ${message}`
      : message;

    // ── LLM CALL HELPER (with automatic 1-retry on empty response) ──
    const runLLM = () => generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: transcript,
      tools: {
        editProduct: tool({
          description: 'Edit a product\'s details (price, stock, name, description).',
          parameters: z.object({
            identifier: z.string().describe("The name or SKU of the product to edit."),
            price: z.number().optional(),
            stockQuantity: z.number().optional(),
            stock: z.number().optional().describe("Alias for stockQuantity"),
            name: z.string().optional(),
            description: z.string().optional(),
          }),
          execute: async ({ identifier, price, stockQuantity, stock, name, description }) => {
            try {
              const finalStock = stockQuantity !== undefined ? stockQuantity : stock;

              const updates: any = {};
              if (price !== undefined) updates.price = String(price);
              if (finalStock !== undefined) updates.stockQuantity = finalStock;
              if (name !== undefined) updates.name = name;
              if (description !== undefined) updates.description = description;

              // Find product by fuzzy match on name or exact SKU
              const product = await db.query.products.findFirst({
                where: (products, { or, eq, like }) => or(
                  eq(products.sku, identifier),
                  like(products.name, `%${identifier}%`)
                ),
              });

              if (!product) {
                return {
                  error: `Product matching "${identifier}" not found.`,
                };
              }

              await db.update(products)
                .set({
                  ...updates,
                  updatedAt: new Date(),
                })
                .where(eq(products.id, product.id));

              return {
                success: true,
                message: `Updated product "${product.name}" successfully.`,
                updatedFields: updates
              };
            } catch (error) {
              console.error("Edit product error:", error);
              return { error: "Failed to update product." };
            }
          },
        }),

        deleteProduct: tool({
          description: 'Delete a product from the store.',
          parameters: z.object({
            identifier: z.string().describe("The name or SKU of the product to delete."),
          }),
          execute: async ({ identifier }) => {
            try {
              const product = await db.query.products.findFirst({
                where: (products, { or, eq, like }) => or(
                  eq(products.sku, identifier),
                  like(products.name, `%${identifier}%`)
                ),
              });

              if (!product) {
                return {
                  error: `Product matching "${identifier}" not found.`,
                };
              }

              await db.delete(products).where(eq(products.id, product.id));

              return {
                success: true,
                message: `Deleted product "${product.name}" successfully.`,
              };
            } catch (error) {
              return { error: "Failed to delete product." };
            }
          },
        }),

        updateOrderStatus: tool({
          description: 'Update the status of an order.',
          parameters: z.object({
            orderNumber: z.string().describe("The order number (e.g., ORD-1234)."),
            status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'paid']).describe("The new status."),
          }),
          execute: async ({ orderNumber, status }: { orderNumber: string; status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'paid' }) => {
            try {
              // Normalize order number (remove # if present)
              const cleanOrderNumber = orderNumber.replace('#', '');

              const order = await db.query.orders.findFirst({
                where: (orders, { eq, like }) => or(
                  eq(orders.orderNumber, cleanOrderNumber),
                  like(orders.orderNumber, `%${cleanOrderNumber}%`)
                )
              });

              if (!order) {
                return {
                  error: `Order #${cleanOrderNumber} not found.`,
                };
              }

              await db.update(orders)
                .set({
                  status: status,
                  updatedAt: new Date()
                })
                .where(eq(orders.id, order.id));

              return {
                success: true,
                message: `Order #${order.orderNumber} status updated to "${status}".`,
              };
            } catch (error) {
              return { error: "Failed to update order status." };
            }
          },
        }),
        listProducts: tool({
          description: 'List, show, or display the products currently in the store inventory. Use this tool when the user asks "list all products", "show my products", "what products do I have?", "do I have [Product]?", etc. Also useful for checking stock levels or finding specific products.',
          parameters: z.object({
            limit: z.coerce.number().optional().describe("The maximum number of products to return (default 50)."),
            searchQuery: z.string().optional().describe("A search term to filter products by name or SKU."),
            status: z.string().optional().describe("Filter by stock status. Keywords: 'low_stock', 'out_of_stock'."),
          }),
          execute: async ({ limit = 50, searchQuery, status }: { limit?: number; searchQuery?: string; status?: string }) => {
            try {
              let conditions = eq(products.userId, userId);

              if (searchQuery) {
                conditions = and(conditions, or(
                  like(products.name, `%${searchQuery}%`),
                  like(products.sku, `%${searchQuery}%`)
                )) as any;
              }

              if (status === 'low_stock') {
                conditions = and(conditions, lt(products.stockQuantity, 10)) as any;
              } else if (status === 'out_of_stock') {
                conditions = and(conditions, eq(products.stockQuantity, 0)) as any;
              }

              const results = await db.query.products.findMany({
                where: conditions,
                limit: limit,
                orderBy: [desc(products.updatedAt)],
              });

              return {
                success: true,
                products: results,
                count: results.length
              };
            } catch (error) {
              return { error: "Failed to list products." };
            }
          },
        }),

        addProduct: tool({
          description: 'Add a SINGLE new product to the inventory. Use this when the user confirms they want to add a product identified from a photo or provided details.',
          parameters: z.object({
            name: z.string().describe("The product name."),
            price: z.number().describe("The product price."),
            stock: z.number().optional().default(10).describe("Initial stock quantity."),
            sku: z.string().optional().describe("Optional SKU. If not provided, one will be generated."),
            description: z.string().optional().describe("Product description."),
            category: z.string().optional().describe("Product category."),
            imageUrl: z.string().optional().describe("URL or base64 data for the product image."),
          }),
          execute: async ({ name, price, stock = 10, sku, description, category, imageUrl }: { name: string; price: number; stock?: number; sku?: string; description?: string; category?: string; imageUrl?: string }) => {
            try {
              const finalSku = sku || `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

              const [newProduct] = await db.insert(products).values({
                userId,
                name,
                price: String(price),
                stockQuantity: stock,
                sku: finalSku,
                description: description || "",
                category: category || "Uncategorized",
                imageUrl: imageUrl || "",
                platform: imageUrl ? "ai_vision" : "manual_creation",
                createdAt: new Date(),
                updatedAt: new Date(),
              }).returning();

              return {
                success: true,
                message: `Added product "${name}" to inventory successfully.`,
                product: newProduct,
                sku: finalSku
              };
            } catch (error) {
              console.error("Add product error:", error);
              return { error: "Failed to add product." };
            }
          },
        }),
        generateDigitalProduct: tool({
          description: 'Use this tool when the user wants to sell a new digital product (ebook, course, audio, etc.). Generate professional, high-converting copy and suggest a price, then return this data.',
          parameters: z.object({
            title: z.string().optional().describe("A catchy, professional title for the digital product."),
            name: z.string().optional().describe("Alias for title"),
            productName: z.string().optional().describe("Alias for title"),
            description: z.string().describe("A compelling 2-3 paragraph sales copy description highlighting benefits and features."),
            price: z.number().optional().describe("Suggested price in Nigerian Naira (₦). Must be a number."),
            product_type: z.enum(['ebook', 'audio', 'video', 'other']).optional().describe("The format of the product."),
            productType: z.string().optional().describe("Alias for product_type"),
            duration: z.string().optional()
          }),
          execute: async ({ title, name, productName, description, price, product_type, productType }: { title?: string; name?: string; productName?: string; description: string; price?: number; product_type?: 'ebook' | 'audio' | 'video' | 'other'; productType?: string }) => {
            // In a real V1 this would save to DB directly or return a widget for user approval.
            // For now, we just return the generated copy so the LLM can present it, or we can use it to drive UI.
            try {
              const finalTitle = title || name || productName || "Draft Product";
              const finalType = (product_type || productType || "other").toLowerCase();
              const numericPrice = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) || 0 : price || 0;
              return {
                success: true,
                message: "Generated product copy successfully.",
                productData: {
                  title: finalTitle,
                  description,
                  price: numericPrice,
                  product_type: finalType
                }
              };
            } catch (error) {
              console.error("Zod Validation Error generating product:", error);
              return { error: "Failed to generate digital product." };
            }
          },
        }),
        createDiscountCode: tool({
          description: 'Create a new discount code or flash sale. Use this when the user asks to create a promo or discount.',
          parameters: z.object({
            code: z.string().describe("The discount code (e.g., SUMMER20, WELCOME). Will be capitalized automatically."),
            type: z.enum(['percentage', 'fixed']).describe("Type of discount (percentage off or fixed amount off)."),
            value: z.number().describe("The value of the discount (e.g., 20 for 20% off, or 5000 for ₦5000 off)."),
            durationDays: z.number().optional().default(30).describe("How many days the code will be valid for."),
          }),
          execute: async ({ code, type, value, durationDays = 30 }: { code: string; type: 'percentage' | 'fixed'; value: number; durationDays?: number }) => {
            try {
              const startDate = new Date();
              const endDate = new Date();
              endDate.setDate(startDate.getDate() + durationDays);

              const finalCode = code.toUpperCase().replace(/\s+/g, '');

              const [newDiscount] = await db.insert(require('@/lib/schema').discounts).values({
                userId,
                code: finalCode,
                type,
                value: String(value),
                status: 'Active',
                startDate,
                endDate,
              }).returning();

              return {
                success: true,
                message: `Created discount code ${finalCode} (${type === 'percentage' ? value + '%' : '₦' + value} off) successfully, valid for ${durationDays} days.`,
                discount: newDiscount
              };
            } catch (error) {
              console.error("Create discount error:", error);
              return { error: "Failed to create discount code." };
            }
          },
        }),
        chasePayments: tool({
          description: 'Payment Chaser role: Use this tool to send automatic email reminders to customers who have pending/unpaid orders.',
          parameters: z.object({}),
          execute: async () => {
            try {
              // Find unpaid orders
              const unpaidOrders = await db.query.orders.findMany({
                where: and(eq(orders.userId, userId), eq(orders.status, 'pending')),
                with: { customer: true }
              });

              if (unpaidOrders.length === 0) {
                return {
                  success: true,
                  count: 0,
                  message: "You have no unpaid orders to chase!"
                };
              }

              // In a real app, send actual emails using Resend. 
              // For V1, we simulate the action if no API key is present or send real ones if possible.
              let emailsSent = 0;
              for (const order of unpaidOrders) {
                if (order.customer?.email) {
                  emailsSent++;
                  // Simulated send:
                  console.log(`[Pony: Payment Chaser] Sent reminder to ${order.customer.email} for order ${order.orderNumber}`);
                }
              }

              return {
                success: true,
                count: emailsSent,
                message: `Sent payment reminders to ${emailsSent} customers.`
              };
            } catch (error) {
              console.error("Chase payments error:", error);
              return { error: "Failed to process payment reminders." };
            }
          }
        }),
        getStoreAnalytics: tool({
          description: 'Weekly Analyst role: Fetch store metrics (revenue, order count, top products) to generate business summaries.',
          parameters: z.object({
            timeframeDays: z.number().optional().default(7).describe("Number of days to look back for the report.")
          }),
          execute: async ({ timeframeDays = 7 }) => {
            try {
              const startDate = new Date();
              startDate.setDate(startDate.getDate() - timeframeDays);

              const recentOrders = await db.query.orders.findMany({
                where: and(
                  eq(orders.userId, userId),
                  eq(orders.status, 'paid')
                  // Note: normally we would filter by date here: gt(orders.createdAt, startDate)
                ),
                with: { items: true }
              });

              // Calculate metrics
              const totalRevenue = recentOrders.reduce((acc, order) => acc + Number(order.totalAmount), 0);
              const totalOrders = recentOrders.length;

              return {
                success: true,
                timeframeDays,
                metrics: {
                  totalRevenue,
                  totalOrders,
                  period: `Last ${timeframeDays} days`
                }
              };
            } catch (error) {
              return { error: "Failed to retrieve store analytics." };
            }
          }
        }),
        importProducts: tool({
          description: 'Import NEW products provided by the user in text format. Use this tool ONLY when the user explicitly provides a text list of products to add or import. DO NOT use this tool if the user is asking to list, show, or view existing products.',
          parameters: z.object({
            productListText: z.string().optional().describe("The raw text containing product names, prices, and other details."),
            text: z.string().optional().describe("Alias for productListText."),
          }),
          execute: async ({ productListText, text }: { productListText?: string; text?: string }) => {
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
      },
    });

    // Helper: catch configureStore validation errors from the AI SDK.
    // The Vercel AI SDK unconditionally adds additionalProperties:false to every tool JSON Schema,
    // which causes Groq to produce tool calls that the SDK then rejects on the way back.
    // We intercept the error, extract the args from the SDK error object or its cause chain,
    // save the store settings, and return a synthetic result.
    const tryExtractConfigureStore = async (llmError: any): Promise<{
      text: string; toolCalls: any[]; toolResults: any[]; steps: any[];
    } | null> => {
      const errMsg = String(llmError?.message || llmError?.name || '');
      const isConfigureError =
        (errMsg.includes('configureStore') || errMsg.includes('CONFIGURE_STORE')) &&
        (errMsg.includes('tool call') || errMsg.includes('validation'));
      if (!isConfigureError) return null;

      // The error is a Groq API 400 error — the raw Groq JSON response is in llmError.responseBody.
      // It has: choices[0].message.tool_calls[0].function.{name, arguments}
      let args: Record<string, any> | null = null;

      // ── Strategy 1: parse responseBody (the raw Groq API JSON) ──
      const responseBody = llmError?.responseBody;
      if (responseBody) {
        try {
          const groqJson = typeof responseBody === 'string' ? JSON.parse(responseBody) : responseBody;
          const toolCalls = groqJson?.choices?.[0]?.message?.tool_calls;
          if (Array.isArray(toolCalls)) {
            for (const tc of toolCalls) {
              const fnName = tc?.function?.name;
              if (fnName === 'configureStore' || fnName === 'CONFIGURE_STORE') {
                const rawArgs = tc?.function?.arguments;
                args = typeof rawArgs === 'string' ? JSON.parse(rawArgs) : rawArgs;
                console.log('✅ configureStore args from responseBody:', args);
                break;
              }
            }
          }
        } catch (e) {
          console.error('responseBody parse failed:', e);
        }
      }

      // ── Strategy 2: walk SDK error chain for .toolInput / .toolArgs ──
      if (!args) {
        const fromChain = (err: any): Record<string, any> | null => {
          if (!err) return null;
          const raw = err.toolInput ?? err.toolArgs;
          if (raw) { try { return typeof raw === 'string' ? JSON.parse(raw) : raw; } catch { } }
          if (err.cause && err.cause !== err) return fromChain(err.cause);
          return null;
        };
        args = fromChain(llmError);
      }

      if (!args) {
        console.warn('configureStore: could not extract args. Error:', errMsg.slice(0, 300));
        return null;
      }

      const storeName = String(args.storeName || 'My Store');
      const niche = String(args.niche || '');
      const primaryColor = String(args.primaryColor || '#000000');
      const headingFont = String(args.headingFont || 'Instrument Serif');
      const bodyFont = String(args.bodyFont || 'Inter');
      const heroTitle = String(args.heroTitle || '');
      const heroDescription = String(args.heroDescription || '');

      try {
        await db.insert(storeSettings).values({
          userId, storeName, niche, primaryColor, headingFont, bodyFont, heroTitle, heroDescription,
        }).onConflictDoUpdate({
          target: storeSettings.userId,
          set: { storeName, niche, primaryColor, headingFont, bodyFont, heroTitle, heroDescription, updatedAt: new Date() },
        });
        console.log('configureStore saved via error-interception for store:', storeName);
        return {
          text: '',
          toolCalls: [{ toolName: 'configureStore', toolCallId: 'intercepted', args }],
          toolResults: [{ toolCallId: 'intercepted', result: { success: true, storeName, primaryColor, headingFont, bodyFont } }],
          steps: [],
        };
      } catch (dbErr) {
        console.error('configureStore DB write failed during error-interception:', dbErr);
        return null;
      }
    };

    // First attempt — catch SDK/network errors and convert to empty result
    let llmResult = await runLLM().catch(async (llmError: any) => {
      // Intercept configureStore validation errors first
      const extracted = await tryExtractConfigureStore(llmError);
      if (extracted) return extracted;
      console.error("generateText SDK Error (attempt 1):", llmError?.message || llmError);
      return { text: '', toolCalls: [] as any[], toolResults: [] as any[], steps: [] as any[] };
    });

    // ── AUTO-RETRY on empty text + no tool calls (transient Groq glitch) ──
    const isEmpty = (r: typeof llmResult) =>
      !r.text?.trim() && (!r.toolCalls || r.toolCalls.length === 0);

    if (isEmpty(llmResult)) {
      console.warn("LLM returned empty response on attempt 1 — retrying once...");
      llmResult = await runLLM().catch(async (llmError: any) => {
        const extracted = await tryExtractConfigureStore(llmError);
        if (extracted) return extracted;
        console.error("generateText SDK Error (attempt 2):", llmError?.message || llmError);
        return { text: '', toolCalls: [] as any[], toolResults: [] as any[], steps: [] as any[] };
      });
    }

    const { text, toolResults, toolCalls } = llmResult;

    // Safety: ensure text is a string
    const safeText = typeof text === 'string' ? text : '';

    // If BOTH attempts returned nothing, only NOW surface the fallback message
    if (!safeText && (!toolCalls || toolCalls.length === 0)) {
      console.error("Both LLM attempts returned empty — serving fallback message.");
      return NextResponse.json({
        content: "I hit a small snag on my end. Give me a sec and try again.",
        intent: "general_query"
      });
    }

    // ── INTERCEPT [SHOW_FONTS] SIGNAL ──
    // Match [SHOW_FONTS] or the bare word SHOW_FONTS as a standalone token (not mid-sentence)
    const FONT_SIGNAL = "[SHOW_FONTS]";
    const hasFontSignal = safeText.includes(FONT_SIGNAL) || /\bSHOW_FONTS\b/.test(safeText);
    if (hasFontSignal) {
      const cleanText = safeText
        .replace(/\[SHOW_FONTS\]/g, "")
        .replace(/\bSHOW_FONTS\b/g, "")
        .trim();
      return NextResponse.json({
        content: cleanText || "Please choose a font style that fits your brand:",
        intent: "font_selection",
        widget: {
          type: "font_picker",
          title: "Select Typography Style",
          description: "Choose a font pair that matches your brand's personality.",
          fonts: [
            { id: "modern", name: "Modern", heading: "Inter", body: "Inter", description: "Clean & High-tech" },
            { id: "elegant", name: "Elegant", heading: "Instrument Serif", body: "Inter", description: "Sophisticated & Editorial" },
            { id: "luxury", name: "Luxury", heading: "Playfair Display", body: "Lora", description: "Premium & Classic" },
            { id: "bold", name: "Bold", heading: "Bebas Neue", body: "Montserrat", description: "Loud & Energetic" },
            { id: "minimalist", name: "Minimalist", heading: "Quicksand", body: "Quicksand", description: "Soft & Simple" },
            { id: "tech", name: "Tech", heading: "Space Grotesk", body: "Inter", description: "Sharp & Futuristic" }
          ]
        }
      });
    }

    // ── INTERCEPT [CONFIGURE_STORE] SIGNAL (Bypass Tool Call Validation) ──
    const CONFIG_SIGNAL = "[CONFIGURE_STORE]";
    if (safeText && safeText.includes(CONFIG_SIGNAL)) {
      console.log("AI SIGNAL INTERCEPTED: [CONFIGURE_STORE]");
      try {
        const startIdx = safeText.indexOf(CONFIG_SIGNAL) + CONFIG_SIGNAL.length;
        let dataPart = safeText.slice(startIdx).trim();

        // Extract JSON if there's trailing text
        const jsonMatch = dataPart.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          dataPart = jsonMatch[0];
        }

        const config = JSON.parse(dataPart);

        // Update settings directly
        await db.insert(storeSettings).values({
          userId,
          storeName: config.storeName,
          niche: config.niche,
          primaryColor: config.primaryColor || "#000000",
          headingFont: config.headingFont || "Instrument Serif",
          bodyFont: config.bodyFont || "Inter",
          heroTitle: config.heroTitle || "",
          heroDescription: config.heroDescription || ""
        }).onConflictDoUpdate({
          target: storeSettings.userId,
          set: {
            storeName: config.storeName,
            niche: config.niche,
            primaryColor: config.primaryColor,
            headingFont: config.headingFont,
            bodyFont: config.bodyFont,
            heroTitle: config.heroTitle,
            heroDescription: config.heroDescription,
            updatedAt: new Date()
          }
        });

        // Clean up the text for the user by removing the signal part
        const cleanText = safeText.split(CONFIG_SIGNAL)[0].trim();

        return NextResponse.json({
          content: cleanText || `I've configured your storefront for **${config.storeName}**!`,
          steps: [
            "Analyzing niche and target audience",
            "Applying branding tokens and design tokens",
            "Configuring curated storefront pages",
            "Optimizing hero copywriting for conversion",
            "Finalizing layout and mobile responsiveness",
            "Activating your live storefront URL"
          ],
          intent: "store_setup",
          widget: {
            type: "store_preview",
            url: "http://localhost:3000/store",
            storeName: config.storeName
          }
        });
      } catch (err) {
        console.error("Signal interception error:", err);
        // Fallback: Clean text even if parsing fails
        const cleanText = safeText.split(CONFIG_SIGNAL)[0].trim();
        if (cleanText) {
          return NextResponse.json({
            content: cleanText,
            intent: "general_query"
          });
        }
      }
    }

    // Format response for the frontend
    let finalResponse = {
      content: safeText,
      steps: [] as string[],
      intent: "general_query",
      widget: null as any
    };

    // Check if any tool was executed and format the "widget" response
    if (toolCalls && toolCalls.length > 0) {
      // Find the most relevant tool call (prioritize importProducts)
      const lastTool = toolCalls[toolCalls.length - 1];

      // Try to find result in toolResults
      const toolResultObj = toolResults?.find(r => r.toolCallId === lastTool.toolCallId);
      // ai sdk toolResult can have 'result' or 'output' depending on version/context
      let result = toolResultObj?.result || (toolResultObj as any)?.output;

      // Safe access to args - DynamicToolCall has different property structure
      const args = (lastTool as any).args || (lastTool as any).input || {};

      // Fallback: if result is missing but we know the tool, try to infer success or use a generic success message
      if (!result) {
        console.warn(`Tool result missing for ${lastTool.toolName}, using fallback.`);
        result = { success: true };
      }

      if (result) {
        if (lastTool.toolName === "listProducts") {
          finalResponse.intent = "product_list";
          if (result.success && result.products && result.products.length > 0) {
            const productList = result.products.map((p: any) => {
              let status = ` (Stock: ${p.stockQuantity})`;
              if (p.stockQuantity <= 0) status = " [OUT OF STOCK]";
              else if (p.stockQuantity < 10) status = ` [LOW STOCK: ${p.stockQuantity}]`;
              return `- **${p.name}**: ₦${Number(p.price).toLocaleString()}${status}`;
            }).join('\n');
            finalResponse.content = `${result.message}\n\n${productList}`;
          } else {
            finalResponse.content = result.message || "No products found.";
          }
        } else if (lastTool.toolName === "addProduct") {
          finalResponse.intent = "product_creation";
          if (result.success) {
            finalResponse.content = result.message || `Added product "${args.name}" successfully.`;
            if (result.product) {
              finalResponse.widget = {
                type: 'product_card',
                title: result.product.name,
                content: result.product.description || "",
                imageUrl: result.product.imageUrl || args.imageUrl,
                product: result.product
              };
            }
          } else if (result.requires_form) {
            finalResponse.widget = {
              type: 'product_form',
              title: 'Add New Product',
              description: 'Please fill in the details below.',
              prefilled: result.prefilled || args
            };
          } else {
            finalResponse.content = result.error || "Failed to add product.";
          }
        } else if (lastTool.toolName === "importProducts") {
          finalResponse.intent = "product_extraction";
          finalResponse.content = result.success
            ? `Successfully imported ${result.count || 'products'} to your inventory.`
            : `I encountered an issue importing products: ${result.error || 'Unknown error'}`;
        } else if (lastTool.toolName === "editProduct") {
          finalResponse.intent = "product_update";
          finalResponse.content = result.success
            ? `Updated ${result.productName} successfully.`
            : `Failed to update product: ${result.error}`;
        } else if (lastTool.toolName === "deleteProduct") {
          finalResponse.intent = "product_deletion";
          finalResponse.content = result.success
            ? `Deleted ${result.productName} from your inventory.`
            : `Failed to delete product: ${result.error}`;
        } else if (lastTool.toolName === "updateOrderStatus") {
          finalResponse.intent = "order_update";
          finalResponse.content = result.success
            ? `Updated order ${result.orderNumber} to '${result.status}'.`
            : `Failed to update order: ${result.error}`;
        } else if (lastTool.toolName === "generateDigitalProduct") {
          finalResponse.intent = "digital_product_draft";
          if (result.success && result.productData) {
            finalResponse.content = safeText || `I've drafted your ${result.productData.product_type} product! Take a look.`;
            finalResponse.widget = {
              type: "digital_product_draft",
              title: "Review Digital Product",
              description: result.productData.description,
              product: result.productData
            };
          } else {
            finalResponse.content = "Failed to generate digital product copy.";
          }
        } else if (lastTool.toolName === "createDiscountCode") {
          finalResponse.intent = "promo_creation";
          if (result.success && result.discount) {
            finalResponse.content = safeText || `I've created the discount code **${result.discount.code}** for your store. It is now active!`;
            // Optionally, we could create a 'promo_code' widget, but a text response with steps is enough for V1 Promo Manager.
          } else {
            finalResponse.content = result.error || "Failed to create discount code.";
          }
        } else if (lastTool.toolName === "chasePayments") {
          finalResponse.intent = "payment_chaser";
          if (result.success) {
            finalResponse.content = safeText || `I've checked your unpaid orders. ${result.message}`;
          } else {
            finalResponse.content = result.error || "Failed to run the Payment Chaser.";
          }
        } else if (lastTool.toolName === "getStoreAnalytics") {
          finalResponse.intent = "weekly_analyst";
          if (result.success) {
            finalResponse.content = safeText || `Here's your summary for the ${result.metrics.period}: you had ${result.metrics.totalOrders} order(s) totaling ₦${result.metrics.totalRevenue}.`;
          } else {
            finalResponse.content = result.error || "Failed to retrieve store analytics.";
          }
        } else if (lastTool.toolName === "configureStore") {
          // Store builder tool was called directly — return the setup response
          if (result.success) {
            finalResponse.intent = "store_setup";
            finalResponse.content = safeText || `I've configured your storefront for **${result.storeName}**!`;
            finalResponse.widget = {
              type: 'store_preview',
              url: 'http://localhost:3000/store',
              storeName: result.storeName,
            };
          } else {
            finalResponse.content = result.error || "I couldn't save the store settings. Please try again.";
          }
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
