import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { eventSchema } from "@/lib/validation/schemas";
import { createAuditLog } from "@/lib/utils/audit";
import { createInternalNotification } from "@/lib/utils/notifications";
import { PERMISSIONS, hasPermission } from "@/lib/permissions/rbac";
import { EventStatus, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const categorySlug = searchParams.get("category") || undefined;
    const tagSlug = searchParams.get("tag") || undefined;
    const status = searchParams.get("status") as EventStatus | undefined;
    const year = searchParams.get("year");
    const isPublic = searchParams.get("isPublic") === "true";

    const whereClause: Prisma.EventWhereInput = {
      ...(isPublic ? { isVisible: true } : {}),
      ...(status ? { status } : {}),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      ...(tagSlug ? { tags: { some: { slug: tagSlug } } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { shortDescription: { contains: search, mode: "insensitive" } },
              { venue: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    if (year && !isNaN(Number(year))) {
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
      whereClause.startDate = {
        gte: startOfYear,
        lte: endOfYear,
      };
    }

    // Dynamic ordering:
    // If status is UPCOMING: nearest upcoming date first (asc)
    // If status is PAST: newest completed event first (desc)
    // If status is ONGOING: startDate desc
    let orderBy: Prisma.EventOrderByWithRelationInput = { startDate: "asc" };
    if (status === "PAST") {
      orderBy = { startDate: "desc" };
    } else if (status === "ONGOING") {
      orderBy = { startDate: "desc" };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      include: {
        category: true,
        tags: true,
        createdBy: {
          select: { id: true, name: true, email: true, accountId: true },
        },
        eventLeader: {
          select: { id: true, name: true, email: true, accountId: true },
        },
        documents: true,
        winners: {
          orderBy: { displayOrder: "asc" },
        },
        images: true,
      },
      orderBy,
    });

    return NextResponse.json({ events });
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

    if (!hasPermission(user.role, PERMISSIONS.CREATE_EVENT)) {
      return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
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

    // Check slug uniqueness
    const existing = await prisma.event.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return NextResponse.json({ error: "An event with this slug already exists" }, { status: 409 });
    }

    const newEvent = await prisma.event.create({
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
        eventLeaderId: data.eventLeaderId || (user.role === "EVENT_LEADER" ? user.id : null),
        createdById: user.id,
        tags: {
          connect: data.tagIds.map((id) => ({ id })),
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });

    // Audit log
    await createAuditLog({
      userId: user.id,
      action: "EVENT_CREATED",
      entity: "Event",
      entityId: newEvent.id,
      description: `Created event "${newEvent.title}" (${newEvent.status})`,
      metadata: { slug: newEvent.slug },
    });

    // Internal notification
    await createInternalNotification({
      title: "New Event Created",
      message: `${user.name} created the event "${newEvent.title}".`,
      type: "EVENT",
      link: `/events/${newEvent.slug}`,
    });

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
