import { NextResponse } from 'next/server';
import { paystack } from '@/lib/paystack';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount, reference } = body;

    if (!email || !amount || !reference) {
      return NextResponse.json(
        { error: 'Missing required fields: email, amount, reference' },
        { status: 400 }
      );
    }

    const result = await paystack.initialize(email, amount, reference);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Paystack initialization error:', error);
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    );
  }
}
