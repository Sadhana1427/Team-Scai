import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { teamMemberSchema } from "@/lib/validation/schemas";
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

    if (!hasPermission(user.role, PERMISSIONS.MANAGE_TEAM)) {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const body = await req.json();
    const result = teamMemberSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: result.data,
      include: { category: true },
    });

    await createAuditLog({
      userId: user.id,
      action: "TEAM_MEMBER_UPDATED",
      entity: "TeamMember",
      entityId: id,
      description: `Updated team member "${updated.name}" (${updated.designation})`,
    });

    return NextResponse.json({ member: updated });
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

    if (!hasPermission(user.role, PERMISSIONS.MANAGE_TEAM)) {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const member = await prisma.teamMember.findUnique({ where: { id } });
    if (!member) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    await prisma.teamMember.delete({ where: { id } });

    await createAuditLog({
      userId: user.id,
      action: "TEAM_MEMBER_DELETED",
      entity: "TeamMember",
      entityId: id,
      description: `Deleted team member "${member.name}"`,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
