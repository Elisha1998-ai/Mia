import { handlers } from "@/auth"

const { GET: AuthGET, POST: AuthPOST } = handlers

export const GET = async (req: Request) => {
  return await AuthGET(req)
}

export const POST = async (req: Request) => {
  return await AuthPOST(req)
}
