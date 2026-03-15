import { handlers } from "@/auth"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    try {
        return await handlers.GET(req)
    } catch (error: any) {
        console.error("Auth GET error:", error)
        return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}

export async function POST(req: NextRequest) {
    try {
        return await handlers.POST(req)
    } catch (error: any) {
        console.error("Auth POST error:", error)
        return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
