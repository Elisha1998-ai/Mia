import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import Resend from "next-auth/providers/resend"
import { users } from "@/lib/schema"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Resend({
      from: "onboarding@resend.dev", // Update this with your verified domain in production
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const email = credentials.email as string;
        const password = credentials.password as string;
        
        try {
          // Find user by email - only select needed columns for speed
          const user = await db.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email),
            columns: {
              id: true,
              email: true,
              password: true,
              emailVerified: true,
              name: true,
            }
          });

          // If user not found or doesn't have a password (e.g. social login user)
          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          }
          
          return null;
        } catch (error) {
          console.error("[AUTH] Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (session.user) {
        session.user.emailVerified = token.emailVerified as Date | null
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        const dbUser = await db.query.users.findFirst({
          where: (users, { eq }) => eq(users.id, user.id as string),
        });
        token.emailVerified = dbUser?.emailVerified;
      }
      return token;
    }
  },
})
