import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { teamMemberSchema } from "@/lib/validation/schemas";
import { PERMISSIONS, hasPermission } from "@/lib/permissions/rbac";
import { createAuditLog } from "@/lib/utils/audit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const activeOnly = searchParams.get("activeOnly") === "true";

    const members = await prisma.teamMember.findMany({
      where: {
        ...(activeOnly ? { isActive: true } : {}),
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      include: {
        category: true,
      },
      orderBy: [{ category: { displayOrder: "asc" } }, { displayOrder: "asc" }],
    });

    const categories = await prisma.teamCategory.findMany({
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({ members, categories });
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

    if (!hasPermission(user.role, PERMISSIONS.MANAGE_TEAM)) {
      return NextResponse.json({ error: "Forbidden: Super Admin only" }, { status: 403 });
    }

    const body = await req.json();
    const result = teamMemberSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
    }

    const member = await prisma.teamMember.create({
      data: result.data,
      include: { category: true },
    });

    await createAuditLog({
      userId: user.id,
      action: "TEAM_MEMBER_ADDED",
      entity: "TeamMember",
      entityId: member.id,
      description: `Added team member "${member.name}" (${member.designation})`,
    });

    return NextResponse.json({ member }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
