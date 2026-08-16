import { prisma } from "../db/prisma";
import { Role } from "../permissions/rbac";

export interface CreateNotificationParams {
  title: string;
  message: string;
  type?: "EVENT" | "USER" | "MEDIA" | "SYSTEM";
  link?: string | null;
  targetUserId?: string | null;
  targetRole?: Role | null;
}

export async function createInternalNotification(params: CreateNotificationParams) {
  try {
    await prisma.notification.create({
      data: {
        title: params.title,
        message: params.message,
        type: params.type || "SYSTEM",
        link: params.link || null,
        targetUserId: params.targetUserId || null,
        targetRole: params.targetRole || null,
      },
    });
  } catch (error) {
    console.error("Failed to create internal notification:", error);
  }
}
