import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { uploadFileToSupabase, StorageBucket, STORAGE_BUCKETS, validateFile } from "@/lib/storage/supabase";
import { createAuditLog } from "@/lib/utils/audit";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as StorageBucket) || STORAGE_BUCKETS.IMAGES;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isDoc = bucket === STORAGE_BUCKETS.DOCUMENTS;
    const validation = validateFile(file, isDoc);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Generate safe unique filename
    const ext = file.name.split(".").pop() || (isDoc ? "pdf" : "jpg");
    const sanitizedExt = ext.replace(/[^a-zA-Z0-9]/g, "");
    const uniquePath = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${sanitizedExt}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Supabase Storage
    const { url, error } = await uploadFileToSupabase(bucket, uniquePath, buffer, file.type);

    if (error || !url) {
      return NextResponse.json({ error: error || "Upload failed" }, { status: 500 });
    }

    await createAuditLog({
      userId: user.id,
      action: "MEDIA_UPLOADED",
      entity: "Storage",
      description: `Uploaded file ${file.name} to bucket ${bucket}`,
      metadata: { bucket, size: file.size, path: uniquePath },
    });

    return NextResponse.json({
      success: true,
      url,
      path: uniquePath,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
