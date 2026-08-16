import React from "react";
import { prisma } from "@/lib/db/prisma";
import { requireRole } from "@/lib/auth/session";
import { CarouselManagementView } from "@/components/dashboard/CarouselManagementView";

export const revalidate = 0;

export default async function DashboardCarouselPage() {
  await requireRole(["SUPER_ADMIN", "EVENT_LEADER"]);

  let slides: any[] = [];
  try {
    const fetched = await prisma.carouselItem.findMany({
      orderBy: { displayOrder: "asc" },
    });
    slides = JSON.parse(JSON.stringify(fetched));
  } catch (err) {
    console.warn("Failed fetching carousel in dashboard:", err);
  }

  return <CarouselManagementView slides={slides} />;
}
