import { auth } from "@/auth"

export default auth((req) => {
  // The logic for redirection is handled in authConfig.callbacks.authorized
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
