import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, signToken } from "./jwt";
import { UserSession, Role, PERMISSIONS, hasPermission } from "../permissions/rbac";

export const AUTH_COOKIE_NAME = "team_scai_session";

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function setAuthCookie(user: UserSession): Promise<void> {
  const token = await signToken(user);
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function requireAuth(): Promise<UserSession> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(allowedRoles: readonly Role[]): Promise<UserSession> {
  const user = await requireAuth();
  if (!hasPermission(user.role, allowedRoles)) {
    redirect("/dashboard");
  }
  return user;
}
