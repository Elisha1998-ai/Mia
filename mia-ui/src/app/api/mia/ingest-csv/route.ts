import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_KEY = process.env.MIA_API_KEY || "change_me_in_prod";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const headers: Record<string, string> = {
      "x-api-key": API_KEY,
    };

    // Forwarding query parameters (like type and user_id) if they are in the URL?
    // The original request uses formData for file, but query params for type/user_id.
    // Let's check how the frontend calls it.
    
    // In ProductsPage.tsx:
    // const response = await fetch('http://localhost:8000/mia/ingest-csv?type=products&user_id=user_123', { ... })
    
    // So we need to forward the query string too.
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const backendEndpoint = `${BACKEND_URL}/mia/ingest-csv?${searchParams}`;

    const response = await fetch(backendEndpoint, {
      method: "POST",
      headers, 
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error ingesting CSV:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
