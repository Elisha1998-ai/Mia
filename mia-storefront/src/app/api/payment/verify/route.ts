import { NextResponse } from 'next/server';
import { paystack } from '@/lib/paystack';
import { db } from '@/lib/db';
import { orders } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: 'Missing required field: reference' },
        { status: 400 }
      );
    }

    // Verify transaction with Paystack
    const result = await paystack.verify(reference);

    if (result.status && result.data.status === 'success') {
      // Find order by orderNumber (which we used as reference) or ID?
      // In initialize, we passed 'reference'. Let's assume we used the order ID or Order Number as reference.
      // Let's verify what we use in checkout. We'll use order.id or order.orderNumber.
      
      // Paystack reference is usually what we sent.
      const orderRef = result.data.reference;

      // Update order status
      // We need to find the order where orderNumber matches reference OR id matches reference
      // Let's try finding by orderNumber first, then id
      
      // Note: In our schema, orderNumber is unique.
      const order = await db.query.orders.findFirst({
        where: eq(orders.orderNumber, orderRef)
      });

      if (order) {
        await db.update(orders)
          .set({ 
            status: 'paid', // or 'processing'
            paymentMethod: 'paystack'
          })
          .where(eq(orders.id, order.id));
          
        return NextResponse.json({ success: true, order });
      } else {
          // Try finding by ID if reference was ID
          const orderById = await db.query.orders.findFirst({
            where: eq(orders.id, orderRef)
          });
          
          if (orderById) {
            await db.update(orders)
              .set({ 
                status: 'paid', // or 'processing'
                paymentMethod: 'paystack' 
              })
              .where(eq(orders.id, orderById.id));
            return NextResponse.json({ success: true, order: orderById });
          }
      }
      
      return NextResponse.json({ error: 'Order not found for reference' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Payment verification failed', details: result }, { status: 400 });
  } catch (error) {
    console.error('Paystack verification error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
