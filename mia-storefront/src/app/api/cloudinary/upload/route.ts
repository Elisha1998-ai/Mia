import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── FALLBACK: LOCAL STORAGE FOR DEVELOPMENT ──────────────────
    // If Cloudinary keys are missing, save locally to public/uploads
    const hasServerCreds =
      !!process.env.CLOUDINARY_CLOUD_NAME &&
      !!process.env.CLOUDINARY_API_KEY &&
      !!process.env.CLOUDINARY_API_SECRET;

    if (!hasServerCreds) {
      try {
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });
        
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const filename = `${timestamp}-${safeName}`;
        const filepath = join(uploadDir, filename);
        
        await writeFile(filepath, buffer);
        
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        
        // Return a URL that the backend can access locally or the frontend can view
        const localUrl = `http://localhost:3000/uploads/${filename}`;
        
        return NextResponse.json({ 
          secure_url: localUrl,
          url: localUrl,
          base64: dataUrl 
        }, { status: 200 });
      } catch (localErr) {
        console.error("Local upload failed:", localErr);
        return NextResponse.json({ error: "Local upload failed" }, { status: 500 });
      }
    }

    // ── CLOUDINARY UPLOAD ────────────────────────────────────────
    if (hasServerCreds) {
      const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "mia-store" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          }
        );
        upload.end(buffer);
      });
      return NextResponse.json({ secure_url: uploadResult.secure_url }, { status: 200 });
    }

    return NextResponse.json(
        { error: "Cloudinary server credentials are not configured" },
        { status: 500 }
      );

  } catch (err: unknown) {
    let message = "Upload failed";
    if (typeof err === "object" && err && "message" in err) {
      const m = (err as { message?: string }).message;
      if (m) message = m;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
