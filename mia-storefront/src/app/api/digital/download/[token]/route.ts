import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { digitalDownloads, digitalProducts } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: Request, context: { params: Promise<{ token: string }> }) {
    try {
        const { token } = await context.params;
        if (!token) return NextResponse.json({ error: "No download token provided" }, { status: 400 });

        // 1. Fetch the download record and associated product
        const [record] = await db
            .select({
                downloadId: digitalDownloads.id,
                downloadCount: digitalDownloads.downloadCount,
                maxDownloads: digitalDownloads.maxDownloads,
                expiresAt: digitalDownloads.expiresAt,
                fileUrl: digitalProducts.fileUrl,
                fileName: digitalProducts.fileName,
                status: digitalProducts.status,
            })
            .from(digitalDownloads)
            .innerJoin(digitalProducts, eq(digitalDownloads.productId, digitalProducts.id))
            .where(eq(digitalDownloads.token, token))
            .limit(1);

        if (!record) {
            return NextResponse.json({ error: "Invalid download link" }, { status: 404 });
        }

        // 2. Validate product status
        if (record.status !== "published") {
            return NextResponse.json({ error: "This product is no longer available for download" }, { status: 403 });
        }

        // 3. Validate Expiration Date
        if (record.expiresAt && new Date() > new Date(record.expiresAt)) {
            return NextResponse.json({ error: "This download link has expired" }, { status: 403 });
        }

        // 4. Validate Download Limit
        if (record.downloadCount >= record.maxDownloads) {
            return NextResponse.json({ error: "Download limit reached for this token" }, { status: 403 });
        }

        // 5. Check if file actually exists
        if (!record.fileUrl) {
            return NextResponse.json({ error: "No file attached to this product yet" }, { status: 404 });
        }

        // 6. Track the download (increment count, update lastDownloadedAt)
        await db
            .update(digitalDownloads)
            .set({
                downloadCount: sql`${digitalDownloads.downloadCount} + 1`,
                lastDownloadedAt: new Date(),
            })
            .where(eq(digitalDownloads.id, record.downloadId));

        // 7. Serve the file (Redirect to Cloudinary file URL)
        // By appending `fl_attachment` if possible via Cloudinary transformations,
        // it forces the browser to download rather than open in a new tab.
        // For standard URLs, we'll just redirect to the file for now.

        let targetUrl = record.fileUrl;

        // Minor cloudinary trick to force download instead of display in browser
        if (targetUrl.includes("res.cloudinary.com") && targetUrl.includes("/upload/")) {
            const fileNameEncoded = record.fileName ? encodeURIComponent(record.fileName) : "download";
            targetUrl = targetUrl.replace("/upload/", `/upload/fl_attachment:${fileNameEncoded}/`);
        }

        return NextResponse.redirect(targetUrl);
    } catch (err) {
        console.error("[Download Token Error]", err);
        return NextResponse.json({ error: "Failed to process download request" }, { status: 500 });
    }
}
