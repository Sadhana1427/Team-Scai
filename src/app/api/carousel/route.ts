import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { carouselItemSchema } from "@/lib/validation/schemas";
import { PERMISSIONS, hasPermission } from "@/lib/permissions/rbac";
import { createAuditLog } from "@/lib/utils/audit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    const slides = await prisma.carouselItem.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ slides });
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

    if (!hasPermission(user.role, PERMISSIONS.MANAGE_CAROUSEL)) {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const body = await req.json();
    const result = carouselItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
    }

    const slide = await prisma.carouselItem.create({
      data: result.data,
    });

    await createAuditLog({
      userId: user.id,
      action: "CAROUSEL_CREATED",
      entity: "CarouselItem",
      entityId: slide.id,
      description: `Created carousel slide "${slide.heading}"`,
    });

    return NextResponse.json({ slide }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
