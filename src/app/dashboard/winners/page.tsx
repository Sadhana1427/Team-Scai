import React from "react";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { WinnerManagementView } from "@/components/dashboard/WinnerManagementView";

export const revalidate = 0;

export default async function DashboardWinnersPage() {
  await requireAuth();

  let winners: any[] = [];
  let events: any[] = [];

  try {
    const [fetchedWinners, fetchedEvents] = await Promise.all([
      prisma.winner.findMany({
        include: { event: true },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
      prisma.event.findMany({
        select: { id: true, title: true },
        orderBy: { title: "asc" },
      }),
    ]);
    winners = fetchedWinners;
    events = fetchedEvents;
  } catch (err) {
    console.warn("Failed fetching winners in dashboard:", err);
  }

  return <WinnerManagementView winners={winners} events={events} />;
}
