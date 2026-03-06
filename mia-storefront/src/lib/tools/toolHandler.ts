import { eq, and, desc, or, like } from 'drizzle-orm';
import { db } from '@/lib/db';
import { products, orders, customers, conversations } from '@/lib/schema';

export async function handleToolCall(
    toolName: string,
    toolArgs: any,
    shopSlug: string,
    userId: string,
    sessionId: string
) {
    switch (toolName) {
        case 'add_product': {
            if (!toolArgs.name || !toolArgs.price || toolArgs.total_stock === undefined) {
                return { success: false, error: 'Missing required fields — name, price, and stock are required' };
            }

            // We'll store variants in aiNotes just for reference if needed, as Drizzle schema 
            // has a separate table for variants. For now, simple product creation:
            const newProduct = await db.insert(products).values({
                userId,
                name: toolArgs.name,
                description: toolArgs.description || '',
                price: toolArgs.price.toString(),
                stockQuantity: toolArgs.total_stock,
                isActive: true,
                sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                aiNotes: toolArgs.variants ? `Variants (Requested via AI): ${toolArgs.variants}` : null
            }).returning({ id: products.id, name: products.name, price: products.price });

            const product = newProduct[0];
            return {
                success: true,
                product,
                message: `Product "${toolArgs.name}" added successfully at ₦${Number(product.price).toLocaleString()}`
            };
        }

        case 'update_product_price': {
            const existingProduct = await db.query.products.findFirst({
                where: and(eq(products.id, toolArgs.product_id), eq(products.userId, userId))
            });

            if (!existingProduct) {
                return { success: false, error: 'Product not found in your store' };
            }

            await db.update(products)
                .set({ price: Number(toolArgs.new_price).toString(), updatedAt: new Date() })
                .where(eq(products.id, toolArgs.product_id));

            return {
                success: true,
                message: `Price updated to ₦${Number(toolArgs.new_price).toLocaleString()} for "${existingProduct.name}"`
            };
        }

        case 'update_product_stock': {
            const existingProduct = await db.query.products.findFirst({
                where: and(eq(products.id, toolArgs.product_id), eq(products.userId, userId))
            });

            if (!existingProduct) {
                return { success: false, error: 'Product not found in your store' };
            }

            await db.update(products)
                .set({ stockQuantity: Number(toolArgs.new_stock), updatedAt: new Date() })
                .where(eq(products.id, toolArgs.product_id));

            return {
                success: true,
                message: `Stock updated to ${Number(toolArgs.new_stock)} units for "${existingProduct.name}"`
            };
        }

        case 'remove_product': {
            const existingProduct = await db.query.products.findFirst({
                where: and(eq(products.id, toolArgs.product_id), eq(products.userId, userId))
            });

            if (!existingProduct) {
                return { success: false, error: 'Product not found in your store' };
            }

            await db.update(products)
                .set({ isActive: false, updatedAt: new Date() })
                .where(eq(products.id, toolArgs.product_id));

            return {
                success: true,
                message: `"${existingProduct.name}" has been removed/hidden from your store`
            };
        }

        case 'confirm_payment': {
            const order = await db.query.orders.findFirst({
                where: and(eq(orders.orderNumber, toolArgs.order_reference), eq(orders.userId, userId)),
                with: {
                    customer: true
                }
            });

            if (!order) {
                return { success: false, error: `No order found with reference ${toolArgs.order_reference}` };
            }

            if (order.paymentStatus === 'confirmed') {
                return { success: false, error: 'This payment has already been confirmed' };
            }

            await db.update(orders)
                .set({ paymentStatus: 'confirmed', status: 'confirmed', updatedAt: new Date() })
                .where(eq(orders.id, order.id));

            const buyerName = order.customer?.fullName || 'Customer';

            if (order.sessionId) {
                await db.insert(conversations).values({
                    sessionId: order.sessionId,
                    storeDomain: shopSlug,
                    role: 'assistant',
                    content: `Payment confirmed! ✅🎉\n\nYour order is locked in.\n${buyerName}, your order will be delivered to you soon.\n\nWe'll notify you once it ships! 🚀`,
                });
            }

            return {
                success: true,
                message: `Payment confirmed for order ${toolArgs.order_reference}. Buyer has been notified.`,
                buyerName: buyerName,
                amount: order.totalAmount
            };
        }

        case 'update_order_status': {
            const [orderRow] = await db
                .select({
                    id: orders.id,
                    orderNumber: orders.orderNumber,
                    status: orders.status,
                    sessionId: orders.sessionId,
                    buyerName: customers.fullName,
                    buyerEmail: customers.email,
                })
                .from(orders)
                .leftJoin(customers, eq(orders.customerId, customers.id))
                .where(and(eq(orders.userId, userId), eq(orders.orderNumber, toolArgs.order_reference)))
                .limit(1);

            if (!orderRow) {
                return { success: false, error: `No order found with reference ${toolArgs.order_reference}` };
            }

            const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
            if (!validStatuses.includes(toolArgs.new_status)) {
                return { success: false, error: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}` };
            }

            if (orderRow.status === toolArgs.new_status) {
                return { success: false, error: `Order ${toolArgs.order_reference} is already marked as ${toolArgs.new_status}.` };
            }

            const updateData: any = { status: toolArgs.new_status, updatedAt: new Date() };
            if (toolArgs.new_status === 'shipped') {
                updateData.shippedAt = new Date();
            }

            await db.update(orders)
                .set(updateData)
                .where(eq(orders.id, orderRow.id));

            const buyerName = orderRow.buyerName || orderRow.buyerEmail || 'there';

            let messageToBuyer = '';
            if (toolArgs.new_status === 'processing') {
                messageToBuyer = `Hi ${buyerName}, your order is now being processed! We are preparing it for shipment.`;
            } else if (toolArgs.new_status === 'shipped') {
                messageToBuyer = toolArgs.tracking_info
                    ? `Great news! 🚚 Your order has been shipped!\n\nTracking info: ${toolArgs.tracking_info}\n\nExpect delivery in 1-3 business days.`
                    : `Great news! 🚚 Your order is on its way!\n\nExpect delivery in 1-3 business days. We'll update you when it arrives.`;
            } else if (toolArgs.new_status === 'delivered') {
                messageToBuyer = `Yay! 🎉 Your order has been delivered. We hope you love it!`;
            }

            if (orderRow.sessionId && messageToBuyer) {
                await db.insert(conversations).values({
                    sessionId: orderRow.sessionId,
                    storeDomain: shopSlug,
                    role: 'assistant',
                    content: messageToBuyer,
                });
            }

            return {
                success: true,
                message: `Order ${toolArgs.order_reference} successfully marked as ${toolArgs.new_status}.${orderRow.sessionId && messageToBuyer ? ' Buyer has been notified.' : ''}`
            };
        }

        case 'list_orders': {
            const statusFilter = (toolArgs.status || 'all') as string;
            const search = (toolArgs.search || '') as string;
            const limitNum = Number(toolArgs.limit) || 10;

            // Use leftJoin to get customer data without relying on Drizzle relations
            const rows = await db
                .select({
                    id: orders.id,
                    orderNumber: orders.orderNumber,
                    totalAmount: orders.totalAmount,
                    status: orders.status,
                    paymentStatus: orders.paymentStatus,
                    createdAt: orders.createdAt,
                    buyerName: customers.fullName,
                    buyerEmail: customers.email,
                })
                .from(orders)
                .leftJoin(customers, eq(orders.customerId, customers.id))
                .where(eq(orders.userId, userId))
                .orderBy(desc(orders.createdAt))
                .limit(50);

            let filtered = rows;

            if (statusFilter !== 'all') {
                filtered = filtered.filter(o => o.status === statusFilter);
            }

            if (search) {
                const q = search.toLowerCase();
                filtered = filtered.filter(o =>
                    o.orderNumber?.toLowerCase().includes(q) ||
                    o.buyerName?.toLowerCase().includes(q) ||
                    o.buyerEmail?.toLowerCase().includes(q)
                );
            }

            const sliced = filtered.slice(0, limitNum);

            if (sliced.length === 0) {
                return {
                    success: true,
                    count: 0,
                    message: statusFilter === 'all' ? 'No orders found.' : `No ${statusFilter} orders found.`,
                    orders: []
                };
            }

            return {
                success: true,
                count: sliced.length,
                orders: sliced.map(o => ({
                    ref: o.orderNumber,
                    buyer: o.buyerName || o.buyerEmail || 'Unknown',
                    amount: `₦${Number(o.totalAmount).toLocaleString()}`,
                    status: o.status,
                    payment: o.paymentStatus,
                    date: o.createdAt?.toLocaleDateString('en-NG')
                })),
                message: `Found ${sliced.length} ${statusFilter !== 'all' ? statusFilter + ' ' : ''}order(s).`
            };
        }

        case 'cancel_order': {
            // Fetch order without relational 'with' to avoid relation issues
            const [orderRow] = await db
                .select({
                    id: orders.id,
                    orderNumber: orders.orderNumber,
                    totalAmount: orders.totalAmount,
                    status: orders.status,
                    buyerName: customers.fullName,
                    buyerEmail: customers.email,
                })
                .from(orders)
                .leftJoin(customers, eq(orders.customerId, customers.id))
                .where(and(eq(orders.userId, userId), eq(orders.orderNumber, toolArgs.order_reference)))
                .limit(1);

            if (!orderRow) {
                return { success: false, error: `No order found with reference ${toolArgs.order_reference}` };
            }

            if (orderRow.status === 'cancelled') {
                return { success: false, error: `Order ${toolArgs.order_reference} is already cancelled.` };
            }

            await db.update(orders)
                .set({ status: 'cancelled', updatedAt: new Date() })
                .where(eq(orders.id, orderRow.id));

            const buyerName = orderRow.buyerName || orderRow.buyerEmail || 'the buyer';

            return {
                success: true,
                message: `Order ${toolArgs.order_reference} (${buyerName}, ₦${Number(orderRow.totalAmount).toLocaleString()}) has been cancelled.${toolArgs.reason ? ` Reason: ${toolArgs.reason}` : ''}`
            };
        }

        default:
            return { success: false, error: `Unknown tool: ${toolName}` };
    }
}
