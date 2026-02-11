import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardClient } from "./DashboardClient"
import { checkOnboardingStatus } from "@/actions/onboarding"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  const { completed } = await checkOnboardingStatus()

  if (!completed) {
    redirect("/onboarding")
  }

  return <DashboardClient />
}
