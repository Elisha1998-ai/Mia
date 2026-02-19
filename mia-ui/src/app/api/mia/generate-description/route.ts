import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_KEY = process.env.MIA_API_KEY || "change_me_in_prod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    };

    const response = await fetch(`${BACKEND_URL}/mia/generate-description`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error generating description:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
