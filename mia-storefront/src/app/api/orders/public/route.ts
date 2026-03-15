import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders as ordersTable, customers as customersTable, orderItems as orderItemsTable, products as productsTable, storeSettings as storeSettingsTable } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { OrderReceiptEmail } from '@/components/documents/OrderReceiptEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/orders/public - Create a new order from the public storefront
export async function POST(request: Request) {
  try {
    const host = request.headers.get('host') || '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
    const baseDomain = isLocal ? 'localhost' : 'bloume.shop';
    const isSubdomain = host.includes(`.${baseDomain}`) && !host.startsWith(`www.${baseDomain}`);

    if (!isSubdomain) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const subdomain = host.split(`.${baseDomain}`)[0];
    const settings = await db.query.storeSettings.findFirst({
      where: eq(storeSettingsTable.storeDomain, subdomain)
    });

    if (!settings) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const userId = settings.userId;
    const storeName = settings.storeName || 'Pony Store';
    const currency = settings.currency?.includes('₦') || settings.currency?.toLowerCase().includes('naira') ? '₦' : '$';

    const body = await request.json();
    const {
      order_number,
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      total_amount,
      status = 'pending',
      external_id,
      shipping_address,
      shipping_method,
      payment_method,
      items = []
    } = body;

    // In Drizzle, we handle transactions for nested creations
    const result = await db.transaction(async (tx) => {
      let finalCustomerId = customer_id;

      // Create a new customer if one doesn't exist but a name was provided
      if (!finalCustomerId && customer_name) {
        const finalEmail = customer_email || `customer_${Date.now()}@mia-auto.ai`;

        // Check if customer with this email already exists
        const [existingCustomer] = await tx.select()
          .from(customersTable)
          .where(and(
            eq(customersTable.userId, userId),
            eq(customersTable.email, finalEmail)
          ))
          .limit(1);

        if (existingCustomer) {
          finalCustomerId = existingCustomer.id;
        } else {
          const [newCustomer] = await tx.insert(customersTable).values({
            userId: userId,
            fullName: customer_name,
            email: finalEmail,
            phone: customer_phone || null,
          }).returning();
          finalCustomerId = newCustomer.id;
        }
      }

      // 1. Create the order
      const [order] = await tx.insert(ordersTable).values({
        userId: userId,
        orderNumber: order_number || `ORD-${Math.floor(1000 + Math.random() * 90000)}`,
        customerId: finalCustomerId,
        totalAmount: (total_amount !== undefined && total_amount !== null) ? total_amount.toString() : '0',
        status: status, // Initially 'pending' for Direct Transfer
        externalId: external_id,
        shippingAddress: shipping_address,
        shippingMethod: shipping_method,
        paymentMethod: payment_method || 'whatsapp'
      }).returning();

      if (items && Array.isArray(items) && items.length > 0) {
        // 1. Insert order items
        await tx.insert(orderItemsTable).values(
          items.map((item: any) => ({
            orderId: order.id,
            productId: item.product_id,
            quantity: item.quantity || 1,
            price: (item.price !== undefined && item.price !== null) ? item.price.toString() : '0'
          }))
        );

        // 2. Reduce stock for each product
        for (const item of items) {
          if (item.product_id && !item.isDigital) {
            const qty = parseInt(item.quantity?.toString() || "0");
            if (qty > 0) {
              await tx.update(productsTable)
                .set({
                  stockQuantity: sql`${productsTable.stockQuantity} - ${qty}`,
                  updatedAt: new Date()
                })
                .where(eq(productsTable.id, item.product_id));
            }
          }
        }
      }

      return order;
    });

    if (!result) {
      throw new Error("Order creation failed - no result returned");
    }

    // Fire off the email receipt asynchronously
    if (customer_email && process.env.RESEND_API_KEY) {
      try {
        const htmlBody = await render(OrderReceiptEmail({
          storeName: storeName,
          orderNumber: result.orderNumber,
          customerName: customer_name || 'Customer',
          totalAmount: Number(result.totalAmount),
          currency: currency,
          paymentMethod: result.paymentMethod || 'standard',
          items: items.map((i: any) => ({
            name: i.name || 'Product',
            quantity: i.quantity || 1,
            price: Number(i.price) || 0
          }))
        }));

        await resend.emails.send({
          from: `${storeName} <orders@bloume.shop>`, // Using configured Resend domain
          to: customer_email,
          subject: `Order Confirmed: #${result.orderNumber} from ${storeName}`,
          html: htmlBody,
        });
        console.log(`Receipt sent to ${customer_email}`);
      } catch (err) {
        console.error("Failed to send receipt email:", err);
        // We don't fail the request if the email fails, we still want the order to complete
      }
    }

    return NextResponse.json({
      success: true,
      order: {
        id: result.id,
        order_number: result.orderNumber,
        total_amount: Number(result.totalAmount),
        status: result.status,
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating public order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
