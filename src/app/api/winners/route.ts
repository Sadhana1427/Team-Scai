import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getCurrentUser } from "@/lib/auth/session";
import { winnerSchema } from "@/lib/validation/schemas";
import { PERMISSIONS, hasPermission } from "@/lib/permissions/rbac";
import { createAuditLog } from "@/lib/utils/audit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const featured = searchParams.get("featured") === "true";

    const winners = await prisma.winner.findMany({
      where: {
        ...(eventId ? { eventId } : {}),
        ...(featured ? { isFeatured: true } : {}),
      },
      include: {
        event: {
          select: { id: true, title: true, slug: true, status: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ winners });
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

    if (!hasPermission(user.role, PERMISSIONS.MANAGE_WINNERS)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = winnerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 });
    }

    const newWinner = await prisma.winner.create({
      data: result.data,
      include: { event: true },
    });

    await createAuditLog({
      userId: user.id,
      action: "WINNER_CREATED",
      entity: "Winner",
      entityId: newWinner.id,
      description: `Added winner "${newWinner.name}" (${newWinner.position}) for event "${newWinner.event.title}"`,
    });

    return NextResponse.json({ winner: newWinner }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
