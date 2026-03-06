import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { eq, desc, sql, and } from 'drizzle-orm';
import { storeSettings, products, orders, conversations, users } from '@/lib/schema';
import { callGroq } from '@/lib/groq';
import { adminTools } from '@/lib/tools/adminTools';
import { handleToolCall } from '@/lib/tools/toolHandler';
import { buildAdminPrompt } from '@/lib/prompts/adminPrompt';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
        }

        const { message, shopSlug } = await req.json();

        // Find user
        const user = await db.query.users.findFirst({
            where: eq(users.email, session.user.email)
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch seller data — look up by userId, not shopSlug, so it always works
        // even if storeDomain hasn't been set or the client sends an undefined slug
        const seller = await db.query.storeSettings.findFirst({
            where: eq(storeSettings.userId, user.id)
        });

        if (!seller) {
            return NextResponse.json({ error: 'Store not found — please complete your store setup first.' }, { status: 404 });
        }

        // Fetch products
        const storeProducts = await db.query.products.findMany({
            where: eq(products.userId, user.id),
            orderBy: [desc(products.createdAt)],
            columns: { id: true, name: true, price: true, stockQuantity: true, isActive: true }
        });

        // Fetch recent orders
        const recentOrders = await db.query.orders.findMany({
            where: eq(orders.userId, user.id),
            orderBy: [desc(orders.createdAt)],
            limit: 10,
            columns: { orderNumber: true, totalAmount: true, status: true, paymentStatus: true, createdAt: true }
        });

        // Fetch stats using raw Drizzle SQL for aggregations
        const statsResult = await db.execute(sql`
      SELECT
        COALESCE(SUM(CASE WHEN "paymentStatus" = 'confirmed' THEN "totalAmount" ELSE 0 END), 0) as total_earnings,
        COALESCE(SUM(CASE WHEN "paymentStatus" = 'confirmed' AND "createdAt" >= NOW() - INTERVAL '7 days' THEN "totalAmount" ELSE 0 END), 0) as week_earnings,
        COALESCE(SUM(CASE WHEN "paymentStatus" = 'confirmed' AND "createdAt" >= NOW() - INTERVAL '1 day' THEN "totalAmount" ELSE 0 END), 0) as today_earnings,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders
      FROM "order" WHERE "userId" = ${user.id}
    `);

        const statsRow = statsResult[0] as any || {};

        const lowStockResult = await db.execute(sql`
      SELECT COUNT(*) as count FROM product WHERE "userId" = ${user.id} AND "stockQuantity" < 5 AND "isActive" = true
    `);

        const stats = {
            totalEarnings: Number(statsRow.total_earnings || 0),
            weekEarnings: Number(statsRow.week_earnings || 0),
            todayEarnings: Number(statsRow.today_earnings || 0),
            pendingOrders: Number(statsRow.pending_orders || 0),
            shippedOrders: Number(statsRow.shipped_orders || 0),
            lowStockProducts: Number((lowStockResult[0] as any)?.count || 0)
        };

        // Fetch conversation history
        // Use seller.storeDomain (from DB) — never shopSlug from client, which can be undefined
        const resolvedDomain = seller.storeDomain;
        const adminSessionId = `admin-${resolvedDomain}`;
        const historyResult = await db.query.conversations.findMany({
            where: and(eq(conversations.sessionId, adminSessionId), eq(conversations.storeDomain, resolvedDomain)),
            orderBy: [desc(conversations.createdAt)],
            limit: 20
        });
        const history = historyResult.reverse();

        // Build the messages array for Groq
        const systemPrompt = buildAdminPrompt(seller, storeProducts, recentOrders, stats);

        const messages: ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            ...history.map(h => ({ role: h.role as 'user' | 'assistant' | 'system' | 'tool', content: h.content })),
            { role: 'user', content: message }
        ];

        // Call Groq with tools
        let aiMessage = await callGroq(messages, adminTools);

        // Handle tool calls — this is the critical loop
        if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
            // Add AI's tool call decision to messages
            messages.push(aiMessage as ChatCompletionMessageParam);

            // Execute each tool call
            for (const toolCall of aiMessage.tool_calls) {
                const toolName = toolCall.function.name;
                let toolArgs;
                try {
                    toolArgs = JSON.parse(toolCall.function.arguments);
                } catch (e) {
                    toolArgs = {};
                }

                const result = await handleToolCall(toolName, toolArgs, resolvedDomain, user.id, adminSessionId);

                // Add tool result to messages
                messages.push({
                    role: 'tool',
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(result)
                });
            }

            // Get AI's natural language response after tools executed
            aiMessage = await callGroq(messages, adminTools);
        }

        const finalResponse = aiMessage.content;

        // Save this turn to conversation history
        await db.insert(conversations).values({
            sessionId: adminSessionId,
            storeDomain: resolvedDomain,
            role: 'user',
            content: message
        });

        await db.insert(conversations).values({
            sessionId: adminSessionId,
            storeDomain: resolvedDomain,
            role: 'assistant',
            content: finalResponse || ''
        });

        return NextResponse.json({ message: finalResponse });
    } catch (error: any) {
        console.error('Error in AI admin chat:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            detail: error?.message || String(error)
        }, { status: 500 });
    }
}
