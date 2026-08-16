import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { eventSchema } from "@/lib/validation/schemas";
import { createAuditLog } from "@/lib/utils/audit";
import { createInternalNotification } from "@/lib/utils/notifications";
import { canManageEvent, PERMISSIONS, hasPermission } from "@/lib/permissions/rbac";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        tags: true,
        createdBy: {
          select: { id: true, name: true, email: true, accountId: true },
        },
        eventLeader: {
          select: { id: true, name: true, email: true, accountId: true },
        },
        documents: {
          include: {
            uploadedBy: {
              select: { name: true },
            },
          },
        },
        winners: {
          orderBy: { displayOrder: "asc" },
        },
        images: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!canManageEvent(user, event)) {
      return NextResponse.json({ error: "Forbidden: Not assigned to this event" }, { status: 403 });
    }

    const body = await req.json();
    const result = eventSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check slug collision if slug changed
    if (data.slug !== event.slug) {
      const slugExists = await prisma.event.findUnique({ where: { slug: data.slug } });
      if (slugExists) {
        return NextResponse.json({ error: "This slug is already in use" }, { status: 409 });
      }
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        posterUrl: data.posterUrl || null,
        categoryId: data.categoryId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        startTime: data.startTime,
        endTime: data.endTime,
        venue: data.venue,
        registrationUrl: data.registrationUrl || null,
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
        status: data.status,
        isFeatured: data.isFeatured,
        isVisible: data.isVisible,
        eventLeaderId: data.eventLeaderId || event.eventLeaderId,
        tags: {
          set: data.tagIds.map((tid) => ({ id: tid })),
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });

    await createAuditLog({
      userId: user.id,
      action: "EVENT_UPDATED",
      entity: "Event",
      entityId: id,
      description: `Updated event "${updated.title}"`,
      metadata: { status: updated.status },
    });

    return NextResponse.json({ event: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(user.role, PERMISSIONS.DELETE_EVENT)) {
      return NextResponse.json({ error: "Forbidden: Super Admin required" }, { status: 403 });
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.event.delete({ where: { id } });

    await createAuditLog({
      userId: user.id,
      action: "EVENT_DELETED",
      entity: "Event",
      entityId: id,
      description: `Deleted event "${event.title}"`,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
