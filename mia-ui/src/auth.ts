import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      // If we have a user email, always try to ensure token.sub is the database ID
      const email = user?.email || token.email;
      
      if (email) {
        try {
          const [existingUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);
          if (existingUser) {
            token.sub = existingUser.id;
          }
        } catch (error) {
          console.error("JWT Callback Error:", error);
        }
      }
      return token;
    }
  },
})
