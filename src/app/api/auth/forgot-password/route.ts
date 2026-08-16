import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { createAuditLog } from "@/lib/utils/audit";

export async function POST(req: NextRequest) {
  try {
    const { email, accountId, newPassword } = await req.json();

    if (!email || !accountId || !newPassword) {
      return NextResponse.json(
        { error: "Email, Account ID, and New Password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        accountId: accountId.trim(),
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found matching this Email and Account ID combination." },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "This account has been disabled. Please contact Super Admin." },
        { status: 403 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await createAuditLog({
      userId: user.id,
      action: "PASSWORD_RESET_SELF",
      entity: "User",
      entityId: user.id,
      description: `User ${user.name} (${user.accountId}) reset their password via verification flow.`,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset successful! You can now log in with your new password.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error resetting password";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
