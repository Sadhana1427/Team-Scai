import React from "react";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { EventManagementView } from "@/components/dashboard/EventManagementView";

export const revalidate = 0;

export default async function DashboardEventsPage() {
  const currentUser = await requireAuth();

  let events: any[] = [];
  let categories: any[] = [];
  let tags: any[] = [];
  let coordinators: any[] = [];

  try {
    const [evts, cats, tgs, users] = await Promise.all([
      prisma.event.findMany({
        include: {
          category: true,
          tags: true,
          eventLeader: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.eventCategory.findMany({ orderBy: { name: "asc" } }),
      prisma.eventTag.findMany({ orderBy: { name: "asc" } }),
      prisma.user.findMany({
        where: { isActive: true },
        select: { id: true, name: true, email: true, accountId: true, role: true },
      }),
    ]);

    events = evts;
    categories = cats;
    tags = tgs;
    coordinators = users;
  } catch (err) {
    console.warn("Failed fetching events in dashboard:", err);
  }

  return (
    <EventManagementView
      events={events}
      categories={categories}
      tags={tags}
      coordinators={coordinators}
      currentUser={currentUser}
    />
  );
}
