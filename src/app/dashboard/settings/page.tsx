import React from "react";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/session";
import { SiteSettingsView } from "@/components/dashboard/SiteSettingsView";

export const revalidate = 0;

export default async function DashboardSettingsPage() {
  await requireRole(["SUPER_ADMIN", "EVENT_LEADER"]);

  let settings = null;
  try {
    const fetched = await prisma.siteSetting.findUnique({
      where: { id: "default" },
    });
    if (fetched) {
      settings = JSON.parse(JSON.stringify(fetched));
    }
  } catch (err) {
    console.warn("Failed fetching site settings:", err);
  }

  return <SiteSettingsView initialSettings={settings} />;
}
