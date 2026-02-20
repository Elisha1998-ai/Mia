"use server"

import { signIn, signOut } from "@/auth"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  
  try {
    await signIn("credentials", { 
      email, 
      firstName, 
      lastName, 
      redirectTo: "/dashboard" 
    })
  } catch (error) {
    if ((error as any).type === "CredentialsSignin") {
      return { error: "Invalid credentials." }
    }
    throw error
  }
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" })
}

export async function logout() {
  await signOut({ redirectTo: "/auth/signin" })
}
