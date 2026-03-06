import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { orders, orderItems, customers, products, storeSettings, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { Resend } from 'resend';

// Initialize Resend (Optional chaining for dev environment without key)
const resendUrl = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
      .update(body)
      .digest('hex');

    const signature = request.headers.get('x-paystack-signature');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { reference } = event.data;

      // Find the order by reference (orderNumber)
      const order = await db.query.orders.findFirst({
        where: eq(orders.orderNumber, reference),
        with: {
          customer: true,
          items: {
            with: { product: true }
          }
        }
      });

      if (order) {
        // Update order status to paid
        await db.update(orders)
          .set({
            status: 'paid',
            paymentMethod: 'paystack',
            updatedAt: new Date()
          })
          .where(eq(orders.id, order.id));

        console.log(`Order ${reference} updated to paid via webhook`);

        // ---------- AI COPILOT: DIGITAL DELIVERY CLERK ----------
        if (resendUrl && order.customer?.email && order.items?.length > 0) {
          try {
            // Get store context
            const store = order.userId ? await db.query.storeSettings.findFirst({
              where: eq(storeSettings.userId, order.userId)
            }) : null;
            const storeName = store?.storeName || 'Our Store';

            const productLinks = order.items.map(item =>
              `<li><strong>${item.product?.name}</strong>: <a href="${item.product?.imageUrl || '#'}">Download Here</a></li>`
            ).join('');

            await resendUrl.emails.send({
              from: `${storeName} <onboarding@resend.dev>`,
              to: [order.customer.email],
              subject: `Your download links for Order ${reference}`,
              html: `
                <div style="font-family: sans-serif; padding: 20px;">
                  <h2>Thank you for your purchase!</h2>
                  <p>Hi ${order.customer.fullName || 'there'},</p>
                  <p>Your payment has been successfully processed. As promised, here are your access links:</p>
                  <ul>${productLinks}</ul>
                  <p>If you have any issues accessing your files, please reply to this email.</p>
                  <br/>
                  <p>Best regards,<br/><strong>Pony (AI Copilot)</strong> & the ${storeName} team</p>
                </div>
              `
            });
            console.log(`[Pony: Delivery Clerk] Sent digital delivery email to ${order.customer.email}`);

            // ---------- AI COPILOT: ORDER CLERK ----------
            try {
              const sellerUser = order.userId ? await db.query.users.findFirst({
                where: eq(users.id, order.userId)
              }) : null;

              if (resendUrl && sellerUser?.email) {
                await resendUrl.emails.send({
                  from: `Pony Copilot <onboarding@resend.dev>`,
                  to: [sellerUser.email],
                  subject: `New Order: ${reference} - ₦${order.totalAmount}`,
                  html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                      <h2>Cha-ching! 🥳</h2>
                      <p>Hi ${sellerUser.name?.split(' ')[0] || 'there'},</p>
                      <p>Good news! <strong>${order.customer.fullName || 'Someone'}</strong> just bought <strong>${order.items.length} item(s)</strong> for ₦${order.totalAmount}.</p>
                      <br/>
                      <p><em>(I've already emailed them their download links. You don't need to do anything!)</em></p>
                      <br/>
                      <p>Keep up the great work,<br/><strong>Pony</strong></p>
                    </div>
                  `
                });
                console.log(`[Pony: Order Clerk] Sent notification to seller ${sellerUser.email}`);
              }
            } catch (clerkError) {
              console.error('[Pony: Order Clerk] Failed to send seller notification:', clerkError);
            }
          } catch (deliveryError) {
            console.error('[Pony: Delivery Clerk] Failed to send email:', deliveryError);
          }
        }
      } else {
        console.warn(`Order ${reference} not found during webhook processing`);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
