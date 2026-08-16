import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { canManageEvent, PERMISSIONS, hasPermission } from "@/lib/permissions/rbac";
import { createAuditLog } from "@/lib/utils/audit";
import { createInternalNotification } from "@/lib/utils/notifications";
import { EventStatus } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (!canManageEvent(user, event) && !hasPermission(user.role, PERMISSIONS.CHANGE_EVENT_STATUS)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();
    if (!["UPCOMING", "ONGOING", "PAST"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: { status: status as EventStatus },
    });

    await createAuditLog({
      userId: user.id,
      action: "EVENT_STATUS_CHANGED",
      entity: "Event",
      entityId: id,
      description: `Status changed from ${event.status} to ${status} for "${event.title}"`,
      metadata: { previousStatus: event.status, newStatus: status },
    });

    await createInternalNotification({
      title: "Event Status Updated",
      message: `Event "${event.title}" is now marked as ${status}.`,
      type: "EVENT",
      link: `/events/${event.slug}`,
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
