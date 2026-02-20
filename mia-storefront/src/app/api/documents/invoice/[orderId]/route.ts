import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, storeSettings } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { renderToStream } from '@react-pdf/renderer';
import { InvoiceTemplate } from '@/components/documents/InvoiceTemplate';
import React from 'react';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    // Fetch Order with relations
    const order = await db.query.orders.findFirst({
      where: (orders, { eq, or }) => or(
        eq(orders.id, orderId),
        eq(orders.orderNumber, orderId)
      ),
      with: {
        customer: true,
        items: {
          with: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Fetch Store Settings
    const settings = await db.query.storeSettings.findFirst({
      where: eq(storeSettings.userId, order.userId!)
    });

    // Generate PDF Stream
    const stream = await renderToStream(
      <InvoiceTemplate 
        order={order} 
        items={order.items} 
        storeSettings={settings} 
        customer={order.customer} 
      />
    );

    // Convert NodeJS stream to Web ReadableStream
    // @ts-ignore
    const readableStream = new ReadableStream({
      start(controller) {
        stream.on('data', (chunk) => controller.enqueue(chunk));
        stream.on('end', () => controller.close());
        stream.on('error', (err) => controller.error(err));
      }
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${order.orderNumber}.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}
