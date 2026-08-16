import React from "react";
import { prisma } from "@/lib/db/prisma";
import { requireAuth } from "@/lib/auth/session";
import { GalleryManagementView } from "@/components/dashboard/GalleryManagementView";

export const revalidate = 0;

export default async function DashboardGalleryPage() {
  const currentUser = await requireAuth();

  let photos: any[] = [];
  let events: any[] = [];

  try {
    const [fetchedPhotos, fetchedEvents] = await Promise.all([
      prisma.galleryImage.findMany({
        include: { event: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.event.findMany({
        select: { id: true, title: true },
        orderBy: { title: "asc" },
      }),
    ]);
    photos = JSON.parse(JSON.stringify(fetchedPhotos));
    events = JSON.parse(JSON.stringify(fetchedEvents));
  } catch (err) {
    console.warn("Failed fetching gallery in dashboard:", err);
  }

  return (
    <GalleryManagementView
      photos={photos}
      events={events}
      currentUser={currentUser}
    />
  );
}
