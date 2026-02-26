import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

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

    const hasServerCreds =
      !!process.env.CLOUDINARY_CLOUD_NAME &&
      !!process.env.CLOUDINARY_API_KEY &&
      !!process.env.CLOUDINARY_API_SECRET;

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

    const publicCloudName =
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!publicCloudName || !uploadPreset) {
      return NextResponse.json(
        { error: "Cloudinary server credentials are not configured" },
        { status: 500 }
      );
    }

    formData.append("upload_preset", uploadPreset);
    const cloudinaryResp = await fetch(
      `https://api.cloudinary.com/v1_1/${publicCloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (!cloudinaryResp.ok) {
      let message = "Cloudinary unsigned upload failed";
      try {
        const errJson = await cloudinaryResp.json();
        message = errJson?.error?.message || errJson?.message || message;
      } catch {
        const errText = await cloudinaryResp.text();
        message = errText || message;
      }
      return NextResponse.json({ error: message }, { status: 500 });
    }
    const cloudJson = await cloudinaryResp.json();
    return NextResponse.json({ secure_url: cloudJson.secure_url }, { status: 200 });

  } catch (err: unknown) {
    let message = "Cloudinary upload failed";
    if (typeof err === "object" && err && "message" in err) {
      const m = (err as { message?: string }).message;
      if (m) message = m;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
