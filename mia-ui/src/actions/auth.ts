"use server"

import { signIn, signOut } from "@/auth"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  // Workaround: Use credentials to bypass failing Resend adapter
  await signIn("credentials", { email, redirectTo: "/dashboard" })
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" })
}

export async function logout() {
  await signOut({ redirectTo: "/auth/signin" })
}
