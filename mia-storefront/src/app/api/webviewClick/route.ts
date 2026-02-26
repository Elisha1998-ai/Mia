import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  try {
    const _ = await request.text();
  } catch {}
  return NextResponse.json({ ok: true });
}
