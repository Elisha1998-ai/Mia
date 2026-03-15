import type { NextAuthConfig } from "next-auth"
// Providers are intentionally omitted here and added in auth.ts to keep this config edge-compatible

export const authConfig = {
  providers: [], // Providers are defined in auth.ts for node-compatible adapter support
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-email",
  },
  callbacks: {
    async authorized({ auth, request }) {
      const { nextUrl, headers } = request;
      const isLoggedIn = !!auth?.user;

      // Determine if this is a storefront (subdomain)
      const hostname = headers.get("host") || "";
      const currentHost = hostname.replace(`:${nextUrl.port}`, "");
      const isLocal = currentHost.includes("localhost") || currentHost.includes("127.0.0.1");
      const baseDomain = isLocal ? "localhost" : "bloume.shop";
      const isStorefront = currentHost.endsWith(`.${baseDomain}`) && currentHost !== `www.${baseDomain}`;

      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
      // All paths on a seller's storefront are public to buyers
      const isPublicRoute = isStorefront || ["/", "/auth", "/auth/signin", "/auth/verify-email", "/logo", "/widgets"].includes(nextUrl.pathname);
      const isAuthRoute = nextUrl.pathname.startsWith("/auth");

      if (isApiAuthRoute) return true;

      if (isAuthRoute) {
        if (isLoggedIn) {
          // If logged in and on auth page, redirect to dashboard
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      if (!isLoggedIn && !isPublicRoute) {
        return false; // Redirect to login
      }

      // If logged in but email not verified, block dashboard access
      // Note: Standard NextAuth 5 session doesn't always have emailVerified in the 'auth' object 
      // in 'authorized' callback easily unless using JWT strategy and specifically adding it.
      // For now, we'll rely on the 'authorize' check in the Credentials provider.

      return true;
    },
  },
} satisfies NextAuthConfig
