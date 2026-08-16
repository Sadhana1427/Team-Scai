import React from "react";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/session";
import { UserManagementView } from "@/components/dashboard/UserManagementView";

export const revalidate = 0;

export default async function DashboardUsersPage() {
  await requireRole(["SUPER_ADMIN"]);

  let users: any[] = [];
  try {
    users = await prisma.user.findMany({
      select: {
        id: true,
        accountId: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { accountId: "asc" },
    });
  } catch (err) {
    console.warn("Failed fetching users in dashboard:", err);
  }

  return <UserManagementView users={users} />;
}
