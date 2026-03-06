import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DigitalDashboardClient } from "./DigitalDashboardClient";

export const metadata = {
    title: "Digital Products — Mia",
    description: "Manage and sell your digital products, ebooks, courses, and more.",
};

export default async function DigitalPage() {
    const session = await auth();
    if (!session) redirect("/auth/signin");

    return (
        <Suspense
            fallback={
                <div className="flex h-screen items-center justify-center bg-background">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading Digital Hub...</p>
                    </div>
                </div>
            }
        >
            <DigitalDashboardClient />
        </Suspense>
    );
}
