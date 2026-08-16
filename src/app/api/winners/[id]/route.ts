import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { winnerSchema } from "@/lib/validation/schemas";
import { PERMISSIONS, hasPermission } from "@/lib/permissions/rbac";
import { createAuditLog } from "@/lib/utils/audit";

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

    if (!hasPermission(user.role, PERMISSIONS.MANAGE_WINNERS)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = winnerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
    }

    const updated = await prisma.winner.update({
      where: { id },
      data: result.data,
      include: { event: true },
    });

    await createAuditLog({
      userId: user.id,
      action: "WINNER_UPDATED",
      entity: "Winner",
      entityId: id,
      description: `Updated winner "${updated.name}" (${updated.position})`,
    });

    return NextResponse.json({ winner: updated });
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

    if (!hasPermission(user.role, PERMISSIONS.MANAGE_WINNERS)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const winner = await prisma.winner.findUnique({ where: { id } });
    if (!winner) {
      return NextResponse.json({ error: "Winner record not found" }, { status: 404 });
    }

    await prisma.winner.delete({ where: { id } });

    await createAuditLog({
      userId: user.id,
      action: "WINNER_DELETED",
      entity: "Winner",
      entityId: id,
      description: `Deleted winner "${winner.name}"`,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
