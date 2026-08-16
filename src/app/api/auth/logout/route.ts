import { NextResponse } from "next/server";
import { clearAuthCookie, getCurrentUser } from "@/lib/auth/session";
import { createAuditLog } from "@/lib/utils/audit";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (user) {
      await createAuditLog({
        userId: user.id,
        action: "USER_LOGOUT",
        entity: "User",
        entityId: user.id,
        description: `User ${user.name} logged out`,
      });
    }
    await clearAuthCookie();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
