import { NextResponse } from "next/server";

const BACKEND_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_KEY = process.env.MIA_API_KEY || "change_me_in_prod";

export async function forwardToBackend(request: Request, endpoint: string) {
  try {
    const body = await request.json().catch(() => ({}));
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    };

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ error: `Backend error: ${response.status}`, details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error forwarding to ${endpoint}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function forwardFormDataToBackend(request: Request, endpoint: string) {
    try {
        const formData = await request.formData();
        
        // We need to construct a new FormData or send it as is.
        // Node's fetch supports FormData.
        
        const headers: Record<string, string> = {
            "x-api-key": API_KEY,
        };

        const response = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: "POST",
            headers, // Do NOT set Content-Type for FormData, let fetch handle boundary
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: `Backend error: ${response.status}`, details: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(`Error forwarding FormData to ${endpoint}:`, error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
