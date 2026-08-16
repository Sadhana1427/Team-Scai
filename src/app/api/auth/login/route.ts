import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { setAuthCookie } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/schemas";
import { createAuditLog } from "@/lib/utils/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email or password format", details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Your account is disabled. Please contact Super Admin." },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Prepare session
    const sessionUser = {
      id: user.id,
      accountId: user.accountId,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
    };

    // Set cookie
    await setAuthCookie(sessionUser);

    // Audit log
    await createAuditLog({
      userId: user.id,
      action: "USER_LOGIN",
      entity: "User",
      entityId: user.id,
      description: `User ${user.name} (${user.accountId}) logged into management portal`,
    });

    return NextResponse.json({
      success: true,
      user: sessionUser,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal error";
    console.error("Login route error:", errorMsg);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
