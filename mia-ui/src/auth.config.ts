import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Resend({
    //   from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    // }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.email) {
          // For dev purposes, we use the email as the ID if no user exists yet.
          // The onboarding process will eventually create a proper user record.
          return { 
            id: credentials.email as string,
            name: `${credentials.firstName} ${credentials.lastName}`.trim() || "User", 
            email: credentials.email as string,
            firstName: credentials.firstName as string,
            lastName: credentials.lastName as string,
          }
        }
        return null
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-email",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
      const isPublicRoute = ["/", "/auth", "/auth/signin", "/auth/verify-email", "/logo", "/wist", "/cushion"].includes(nextUrl.pathname) || nextUrl.pathname.startsWith("/store")
      const isAuthRoute = nextUrl.pathname.startsWith("/auth")

      if (isApiAuthRoute) return true

      if (isAuthRoute) {
        if (isLoggedIn) {
          // If logged in and on auth page, redirect to dashboard
          return Response.redirect(new URL("/dashboard", nextUrl))
        }
        return true
      }

      if (!isLoggedIn && !isPublicRoute) {
        return false // Redirect to login
      }

      return true
    },
  },
} satisfies NextAuthConfig
