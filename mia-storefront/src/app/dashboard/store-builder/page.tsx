import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardClient } from "../DashboardClient"
import { Suspense } from "react"

export default async function StoreBuilderPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading Store Builder...</p>
        </div>
      </div>
    }>
      <DashboardClient defaultView="store-builder" />
    </Suspense>
  )
}
