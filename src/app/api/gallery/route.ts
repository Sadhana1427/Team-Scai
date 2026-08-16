import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { galleryImageSchema } from "@/lib/validation/schemas";
import { PERMISSIONS, hasPermission } from "@/lib/permissions/rbac";
import { createAuditLog } from "@/lib/utils/audit";
import { createInternalNotification } from "@/lib/utils/notifications";
import { GalleryCategory } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as GalleryCategory | undefined;
    const year = searchParams.get("year");
    const eventId = searchParams.get("eventId");
    const featured = searchParams.get("featured") === "true";

    const photos = await prisma.galleryImage.findMany({
      where: {
        ...(category && category !== ("ALL" as unknown as GalleryCategory) ? { category } : {}),
        ...(year && year !== "ALL" ? { year: Number(year) } : {}),
        ...(eventId ? { eventId } : {}),
        ...(featured ? { isFeatured: true } : {}),
      },
      include: {
        event: {
          select: { id: true, title: true, slug: true },
        },
        uploadedBy: {
          select: { id: true, name: true, accountId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ photos });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user.role, PERMISSIONS.UPLOAD_GALLERY)) {
      return NextResponse.json({ error: "Forbidden: Social Media or Admin only" }, { status: 403 });
    }

    const body = await req.json();

    // Check if bulk upload
    if (Array.isArray(body)) {
      const createdList = [];
      for (const item of body) {
        const result = galleryImageSchema.safeParse(item);
        if (result.success) {
          const photo = await prisma.galleryImage.create({
            data: {
              ...result.data,
              uploadedById: user.id,
            },
          });
          createdList.push(photo);
        }
      }

      await createAuditLog({
        userId: user.id,
        action: "GALLERY_BULK_UPLOAD",
        entity: "GalleryImage",
        description: `Bulk uploaded ${createdList.length} gallery images`,
      });

      await createInternalNotification({
        title: "New Gallery Images",
        message: `${user.name} uploaded ${createdList.length} photos to the gallery.`,
        type: "MEDIA",
        link: "/gallery",
      });

      return NextResponse.json({ success: true, count: createdList.length, photos: createdList }, { status: 201 });
    }

    // Single photo upload
    const result = galleryImageSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Validation error", details: result.error.format() }, { status: 400 });
    }

    const newPhoto = await prisma.galleryImage.create({
      data: {
        ...result.data,
        uploadedById: user.id,
      },
    });

    await createAuditLog({
      userId: user.id,
      action: "GALLERY_UPLOAD",
      entity: "GalleryImage",
      entityId: newPhoto.id,
      description: `Uploaded photo "${newPhoto.title || 'Untitled'}" (${newPhoto.category})`,
    });

    return NextResponse.json({ photo: newPhoto }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
