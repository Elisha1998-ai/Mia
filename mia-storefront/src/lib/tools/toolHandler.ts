import { eq, and, desc, or, like, gte, lt } from 'drizzle-orm';
import { db } from '@/lib/db';
import { products, orders, orderItems, customers, conversations } from '@/lib/schema';

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

        case 'report_earnings':
        case 'get_profit_and_loss':
        case 'calculate_tax_liability': {
            const period = toolArgs.period as string || 'month';
            const rate = toolArgs.rate as number || 7.5; // for tax

            const now = new Date();
            let startDate = new Date(0); // all
            if (period === 'today') {
                startDate = new Date(now.setHours(0, 0, 0, 0));
            } else if (period === 'week') {
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                startDate = new Date(now.setDate(diff));
                startDate.setHours(0, 0, 0, 0);
            } else if (period === 'month') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            } else if (period === 'year') {
                startDate = new Date(now.getFullYear(), 0, 1);
            }

            const ordersData = await db.query.orders.findMany({
                where: and(
                    eq(orders.userId, userId),
                    gte(orders.createdAt, startDate),
                    or(eq(orders.status, 'completed'), eq(orders.status, 'delivered'), eq(orders.status, 'shipped'), eq(orders.status, 'processing'), eq(orders.status, 'pending'))
                ),
                with: {
                    items: {
                        with: { product: true }
                    }
                }
            });

            let revenue = 0;
            let expectedCOGS = 0;

            for (const order of ordersData) {
                revenue += Number(order.totalAmount || 0);
                for (const item of order.items) {
                    const cogs = Number(item.product?.costOfGoods || 0);
                    expectedCOGS += cogs * item.quantity;
                }
            }

            const grossProfit = revenue - expectedCOGS;

            if (toolName === 'report_earnings') {
                return {
                    success: true,
                    period,
                    orderCount: ordersData.length,
                    revenue: `₦${revenue.toLocaleString()}`,
                    message: `You've made ₦${revenue.toLocaleString()} from ${ordersData.length} orders ${period === 'all' ? 'in total' : `this ${period}`}.`
                };
            }

            if (toolName === 'get_profit_and_loss') {
                return {
                    success: true,
                    period,
                    revenue: `₦${revenue.toLocaleString()}`,
                    expenses_and_cogs: `₦${expectedCOGS.toLocaleString()}`,
                    grossProfit: `₦${grossProfit.toLocaleString()}`,
                    message: `For ${period === 'all' ? 'all time' : `this ${period}`}:\nRevenue: ₦${revenue.toLocaleString()}\nEstimated COGS (Expenses): ₦${expectedCOGS.toLocaleString()}\nGross Profit: ₦${grossProfit.toLocaleString()}`
                };
            }

            if (toolName === 'calculate_tax_liability') {
                const tax = revenue * (rate / 100);
                return {
                    success: true,
                    period,
                    taxRate: `${rate}%`,
                    taxableIncome: `₦${revenue.toLocaleString()}`,
                    taxOwed: `₦${tax.toLocaleString()}`,
                    message: `Your estimated tax liability for ${period === 'all' ? 'all time' : `this ${period}`} (at ${rate}%) is ₦${tax.toLocaleString()} on a taxable revenue of ₦${revenue.toLocaleString()}.`
                };
            }

            break;
        }

        case 'export_store_data': {
            const type = toolArgs.data_type as string || 'orders';
            const exportUrl = `/analytics?export=${type}`;
            return {
                success: true,
                message: `I've prepared your ${type} export! You can download it directly here: [Download ${type.charAt(0).toUpperCase() + type.slice(1)} CSV](${exportUrl})`
            };
        }

        case 'get_low_stock_products': {
            const threshold = toolArgs.threshold || 5;
            const lowProducts = await db.query.products.findMany({
                where: and(eq(products.userId, userId), eq(products.isActive, true), lt(products.stockQuantity, threshold)),
                orderBy: desc(products.stockQuantity),
                limit: 10
            });

            if (lowProducts.length === 0) {
                return { success: true, message: `Great! None of your products are running low (below ${threshold} units).` };
            }

            return {
                success: true,
                count: lowProducts.length,
                products: lowProducts.map(p => ({
                    name: p.name,
                    stock: p.stockQuantity,
                    price: `₦${Number(p.price).toLocaleString()}`
                })),
                message: `You have ${lowProducts.length} product(s) running low on stock.`
            };
        }

        case 'get_best_selling_time': {
            const allOrders = await db.query.orders.findMany({
                where: eq(orders.userId, userId),
                columns: { createdAt: true }
            });

            if (allOrders.length === 0) {
                return { success: true, message: "Not enough data yet to determine best selling times." };
            }

            const dayCounts: Record<number, number> = {};
            const hourCounts: Record<number, number> = {};

            allOrders.forEach(o => {
                const date = new Date(o.createdAt);
                const day = date.getDay();
                const hr = date.getHours();
                dayCounts[day] = (dayCounts[day] || 0) + 1;
                hourCounts[hr] = (hourCounts[hr] || 0) + 1;
            });

            const bestDay = parseInt(Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0]);
            const bestHour = parseInt(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0]);

            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            return {
                success: true,
                bestDay: daysOfWeek[bestDay],
                bestHour: `${bestHour}:00`,
                message: `Your peak sales occur mostly on **${daysOfWeek[bestDay]}s** around **${bestHour > 12 ? bestHour - 12 + 'PM' : bestHour + 'AM'}**.`
            };
        }

        case 'suggest_price_adjustments': {
            // Find products that are old and have lot of stock
            const stagnantProducts = await db.query.products.findMany({
                where: and(eq(products.userId, userId), eq(products.isActive, true), gte(products.stockQuantity, 10)),
                orderBy: desc(products.createdAt),
                limit: 3
            });

            if (stagnantProducts.length === 0) {
                return { success: true, message: "Your inventory looks healthy right now. No price drop suggestions." };
            }

            return {
                success: true,
                suggestions: stagnantProducts.map(p => ({
                    product: p.name,
                    currentPrice: `₦${Number(p.price).toLocaleString()}`,
                    suggestedPrice: `₦${(Number(p.price) * 0.9).toLocaleString()}` // 10% discount suggestion
                })),
                message: `I found ${stagnantProducts.length} older item(s) with high stock. Consider dropping their price by 10% to move them quickly.`
            };
        }

        case 'segment_customers': {
            const allCustomers = await db.query.customers.findMany({
                where: eq(customers.userId, userId),
                with: { orders: { columns: { id: true } } }
            });

            if (allCustomers.length === 0) {
                return { success: true, message: "You don't have any customers to segment yet." };
            }

            let bigSpenders = 0;
            let frequent = 0;
            let oneTime = 0;

            allCustomers.forEach(c => {
                const spent = Number(c.lifetimeValue);
                if (spent > 50000) bigSpenders++;

                const count = c.orders.length;
                if (count >= 3) frequent++;
                else if (count === 1) oneTime++;
            });

            return {
                success: true,
                total: allCustomers.length,
                segments: {
                    bigSpenders,
                    frequentBuyers: frequent,
                    oneTimeBuyers: oneTime
                },
                message: `Out of ${allCustomers.length} total customers, you have:\n- ${bigSpenders} Big Spenders (over ₦50k)\n- ${frequent} Frequent Buyers (3+ orders)\n- ${oneTime} One-Time Buyers.`
            };
        }

        case 'get_top_customers': {
            const limit = toolArgs.limit || 5;
            const topCustomers = await db.query.customers.findMany({
                where: eq(customers.userId, userId),
                orderBy: desc(customers.lifetimeValue),
                limit: limit
            });

            if (topCustomers.length === 0) {
                return { success: true, message: "No customers found yet." };
            }

            return {
                success: true,
                customers: topCustomers.map(c => ({
                    name: c.fullName || c.email,
                    totalSpent: `₦${Number(c.lifetimeValue).toLocaleString()}`
                })),
                message: `Here are your top ${topCustomers.length} most valuable customers based on total amount spent.`
            };
        }

        case 'forecast_revenue': {
            const period = toolArgs.period || 'week'; // week or month

            // basic logic: grab last 30 days orders, get average daily, multiply by 7 or 30
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const recentOrders = await db.query.orders.findMany({
                where: and(eq(orders.userId, userId), gte(orders.createdAt, thirtyDaysAgo), eq(orders.status, 'completed'))
            });

            const totalRecentRev = recentOrders.reduce((acc, o) => acc + Number(o.totalAmount), 0);
            const dailyAvg = totalRecentRev / 30;

            const multiplier = period === 'week' ? 7 : 30;
            const forecasted = dailyAvg * multiplier;

            if (totalRecentRev === 0) {
                return { success: true, message: `Not enough recent sales data to forecast next ${period}'s revenue reliably.` };
            }

            return {
                success: true,
                period,
                forecast: `₦${forecasted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
                baseAvg: `₦${dailyAvg.toLocaleString(undefined, { maximumFractionDigits: 0 })}/day`,
                message: `Based on your sales velocity over the last 30 days, I forecast you'll make roughly **₦${forecasted.toLocaleString(undefined, { maximumFractionDigits: 0 })}** next ${period}.`
            };
        }

        case 'get_store_performance': {
            const allOrdersData = await db.query.orders.findMany({
                where: eq(orders.userId, userId),
                columns: { totalAmount: true }
            });
            const allCustomersCount = await db.query.customers.findMany({
                where: eq(customers.userId, userId),
                columns: { id: true }
            });

            const totalRev = allOrdersData.reduce((acc, o) => acc + Number(o.totalAmount), 0);

            return {
                success: true,
                performance: {
                    totalOrders: allOrdersData.length,
                    totalRevenue: `₦${totalRev.toLocaleString()}`,
                    totalCustomers: allCustomersCount.length
                },
                message: `Overall, your store has generated **₦${totalRev.toLocaleString()}** across **${allOrdersData.length}** orders from **${allCustomersCount.length}** unique customers.`
            };
        }

        case 'get_idle_customers': {
            const idleDays = toolArgs.days || 30;
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - idleDays);

            // Get all customers with orders, find those whose latest order is older than cutoff
            const allCustomers = await db.query.customers.findMany({
                where: eq(customers.userId, userId),
                with: {
                    orders: {
                        columns: { createdAt: true },
                        orderBy: desc(orders.createdAt),
                        limit: 1
                    }
                }
            });

            const idle = allCustomers.filter(c => {
                if (c.orders.length === 0) return true;
                return new Date(c.orders[0].createdAt) < cutoff;
            });

            if (idle.length === 0) {
                return { success: true, message: `All your customers have placed an order in the last ${idleDays} days.` };
            }

            return {
                success: true,
                count: idle.length,
                customers: idle.map(c => ({
                    name: c.fullName || c.email,
                    email: c.email,
                    lastOrderDaysAgo: c.orders.length > 0
                        ? Math.floor((Date.now() - new Date(c.orders[0].createdAt).getTime()) / 86400000)
                        : 'Never ordered'
                })),
                message: `${idle.length} customer(s) haven't ordered in over ${idleDays} days and are worth nudging.`
            };
        }

        case 'get_orders_needing_reviews': {
            const daysSinceDelivery = toolArgs.days_since_delivery || 7;
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - daysSinceDelivery);

            const deliveredOrders = await db.query.orders.findMany({
                where: and(
                    eq(orders.userId, userId),
                    eq(orders.status, 'delivered'),
                    lt(orders.updatedAt, cutoff)
                ),
                with: {
                    customer: { columns: { fullName: true, email: true } },
                    items: {
                        with: { product: { columns: { name: true } } },
                        limit: 1
                    }
                },
                limit: 10
            });

            if (deliveredOrders.length === 0) {
                return { success: true, message: `No delivered orders are old enough to request a review yet (threshold: ${daysSinceDelivery} days).` };
            }

            return {
                success: true,
                count: deliveredOrders.length,
                orders: deliveredOrders.map(o => ({
                    orderRef: o.orderNumber,
                    buyer: o.customer?.fullName || o.customer?.email || 'Unknown',
                    product: o.items[0]?.product?.name || 'N/A',
                    deliveredOn: new Date(o.updatedAt).toLocaleDateString('en-NG')
                })),
                message: `${deliveredOrders.length} order(s) were delivered over ${daysSinceDelivery} days ago and the buyers haven't been asked for a review yet.`
            };
        }

        case 'get_unconfirmed_deliveries': {
            const daysSinceShipped = toolArgs.days_since_shipped || 5;
            const cutoff = new Date();
            cutoff.setDate(cutoff.getDate() - daysSinceShipped);

            const shippedOrders = await db.query.orders.findMany({
                where: and(
                    eq(orders.userId, userId),
                    eq(orders.status, 'shipped'),
                    lt(orders.shippedAt, cutoff)
                ),
                with: {
                    customer: { columns: { fullName: true, email: true, phone: true } }
                },
                limit: 10
            });

            if (shippedOrders.length === 0) {
                return { success: true, message: `No overdue shipments found. All shipped orders are within the ${daysSinceShipped}-day window.` };
            }

            return {
                success: true,
                count: shippedOrders.length,
                orders: shippedOrders.map(o => ({
                    orderRef: o.orderNumber,
                    buyer: o.customer?.fullName || o.customer?.email || 'Unknown',
                    contact: o.customer?.phone || o.customer?.email || 'No contact',
                    shippedOn: o.shippedAt ? new Date(o.shippedAt).toLocaleDateString('en-NG') : 'Unknown',
                    amount: `₦${Number(o.totalAmount).toLocaleString()}`
                })),
                message: `${shippedOrders.length} order(s) were shipped over ${daysSinceShipped} days ago but haven't been confirmed as delivered. You may want to follow up with those buyers.`
            };
        }

        case 'get_abandoned_carts': {
            const hours = toolArgs.hours || 1;
            const cutoff = new Date();
            cutoff.setHours(cutoff.getHours() - hours);

            // An "abandoned cart" is an order that is still pending payment and was created over X hours ago
            const abandonedOrders = await db.query.orders.findMany({
                where: and(
                    eq(orders.userId, userId),
                    eq(orders.paymentStatus, 'pending'),
                    lt(orders.createdAt, cutoff)
                ),
                with: {
                    customer: { columns: { fullName: true, email: true, phone: true } },
                    items: {
                        with: { product: { columns: { name: true } } }
                    }
                },
                orderBy: desc(orders.createdAt),
                limit: 10
            });

            if (abandonedOrders.length === 0) {
                return { success: true, message: `No abandoned carts found in the last ${hours > 24 ? Math.floor(hours / 24) + ' day(s)' : hours + ' hour(s)'}.` };
            }

            return {
                success: true,
                count: abandonedOrders.length,
                totalValue: `₦${abandonedOrders.reduce((acc, o) => acc + Number(o.totalAmount), 0).toLocaleString()}`,
                carts: abandonedOrders.map(o => ({
                    orderRef: o.orderNumber,
                    buyer: o.customer?.fullName || o.customer?.email || 'Guest',
                    contact: o.customer?.phone || o.customer?.email || 'No contact',
                    items: o.items.map(i => i.product?.name || 'Unknown').join(', '),
                    value: `₦${Number(o.totalAmount).toLocaleString()}`,
                    createdAt: new Date(o.createdAt).toLocaleDateString('en-NG')
                })),
                message: `${abandonedOrders.length} cart(s) were abandoned with a combined value of ₦${abandonedOrders.reduce((acc, o) => acc + Number(o.totalAmount), 0).toLocaleString()}. These buyers started checkout but never paid.`
            };
        }

        case 'generate_social_caption': {
            const productName = toolArgs.product_name as string;
            const platform = (toolArgs.platform as string || 'instagram').toLowerCase();
            const tone = (toolArgs.tone as string || 'hype').toLowerCase();

            // Find the product in the DB for extra context (price, description)
            const product = await db.query.products.findFirst({
                where: and(
                    eq(products.userId, userId),
                    like(products.name, `%${productName}%`)
                )
            });

            const price = product ? `₦${Number(product.price).toLocaleString()}` : 'DM for price';
            const description = product?.description || '';

            // Build a structured prompt context to return to the AI
            // The actual creative writing is done by the LLM in its follow-up response
            return {
                success: true,
                productName,
                price,
                description,
                platform,
                tone,
                // This message is the instruction for the LLM to write the actual caption
                message: `CAPTION_BRIEF: Write a ${tone} ${platform} caption for "${productName}" priced at ${price}. ${description ? `Product description: ${description}.` : ''} Include relevant hashtags. Make it feel native to ${platform}. ${platform === 'tiktok' ? 'Use a hook in the first line.' : 'Use line breaks for readability.'} Return ONLY the caption text, nothing else.`
            };
        }

        case 'generate_invoice': {
            const rawRef = (toolArgs.order_reference as string).trim();

            // Build a list of candidate references to try in order:
            // 1. Exactly as given (e.g. "ORD-3392")
            // 2. Strip any leading "ORD-" then re-add (normalise casing/spacing)
            // 3. Just the numeric part with the standard prefix
            const digits = rawRef.replace(/[^0-9]/g, '');
            const candidates = [
                rawRef,
                `ORD-${digits}`,
                digits
            ].filter(Boolean);

            let order: any = null;
            for (const candidate of candidates) {
                order = await db.query.orders.findFirst({
                    where: and(
                        eq(orders.userId, userId),
                        or(
                            eq(orders.orderNumber, candidate),
                            like(orders.orderNumber, `%${digits}%`)
                        )
                    ),
                    with: {
                        customer: { columns: { fullName: true, email: true } }
                    }
                });
                if (order) break;
            }

            if (!order) {
                return { success: false, error: `No order found matching "${rawRef}". Double-check the order reference and try again.` };
            }

            const buyerName = order.customer?.fullName || order.customer?.email || 'the buyer';
            const downloadUrl = `/api/documents/invoice/${order.orderNumber}`;

            return {
                success: true,
                orderNumber: order.orderNumber,
                buyerName,
                totalAmount: `₦${Number(order.totalAmount).toLocaleString()}`,
                downloadUrl,
                invoiceWidget: true,
                message: `Invoice for ${order.orderNumber} (${buyerName}, ₦${Number(order.totalAmount).toLocaleString()}) is ready. [Download Invoice](${downloadUrl})`
            };
        }

        default:
            return { success: false, error: `Unknown tool: ${toolName}` };
    }
}
