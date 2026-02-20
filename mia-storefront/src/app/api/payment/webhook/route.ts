import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { orders } from '@/lib/schema';
import { eq } from 'drizzle-orm';

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
        where: eq(orders.orderNumber, reference)
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
