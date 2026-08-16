import React from "react";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/session";
import { TeamManagementView } from "@/components/dashboard/TeamManagementView";

export const revalidate = 0;

export default async function DashboardTeamPage() {
  await requireRole(["SUPER_ADMIN", "EVENT_LEADER"]);

  let members: any[] = [];
  let categories: any[] = [];

  try {
    const [fetchedMembers, fetchedCategories] = await Promise.all([
      prisma.teamMember.findMany({
        include: { category: true },
        orderBy: [{ category: { displayOrder: "asc" } }, { displayOrder: "asc" }],
      }),
      prisma.teamCategory.findMany({
        orderBy: { displayOrder: "asc" },
      }),
    ]);
    members = JSON.parse(JSON.stringify(fetchedMembers));
    categories = JSON.parse(JSON.stringify(fetchedCategories));
  } catch (err) {
    console.warn("Failed fetching team in dashboard:", err);
  }

  return <TeamManagementView members={members} categories={categories} />;
}
