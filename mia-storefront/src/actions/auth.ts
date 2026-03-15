"use server"

import { signIn, signOut } from "@/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Please provide both email and password." }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard"
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." }
        default:
          return { error: "Something went wrong." }
      }
    }
    // Re-throw the error so Next.js can handle the redirect
    throw error
  }
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password || !name) {
    return { error: "Please fill in all fields." }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." }
  }

  try {
    // 1. Check existence first
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
      columns: { id: true }
    });

    if (existingUser) {
      return { error: "User already exists with this email." }
    }

    // 2. Hash password (CPU intensive)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user (auto-verified)
    await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
      emailVerified: new Date(),
    });
  } catch (error: any) {
    console.error("[REGISTER_ERROR]", error);
    return { error: `Failed to create account: ${error.message || 'Unknown error'}` }
  }

  // 4. Directly sign in (Moved outside try-catch to allow Next.js redirect to work)
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/dashboard",
  });

  return { success: "Account created successfully." }
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" })
}

export async function logout() {
  await signOut({ redirectTo: "/auth/signin" })
}
