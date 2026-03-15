import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DigitalDashboardClient } from "./DigitalDashboardClient";

export const metadata = {
    title: "Digital Products — Mia",
    description: "Manage and sell your digital products, ebooks, courses, and more.",
};

export default async function DigitalPage() {
    redirect("/dashboard");
}
