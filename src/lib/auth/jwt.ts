import { SignJWT, jwtVerify } from "jose";
import { UserSession } from "../permissions/rbac";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-team-scai-secret-2026-key";
const key = new TextEncoder().encode(JWT_SECRET);

export async function signToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}
