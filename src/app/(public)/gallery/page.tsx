import React from "react";
import { prisma } from "@/lib/db/prisma";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryPhoto } from "@/components/gallery/LightboxModal";

export const revalidate = 60;

export default async function GalleryPage() {
  let photos: GalleryPhoto[] = [];

  try {
    const fetched = await prisma.galleryImage.findMany({
      include: {
        event: {
          select: { title: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    photos = fetched as unknown as GalleryPhoto[];
  } catch (err) {
    console.warn("Failed fetching gallery images:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
          Visual Memories
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-charcoal tracking-tight">
          Photo Gallery
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Relive our flagship hackathons, technical bootcamps, podium ceremonies, and community meetups through the lens.
        </p>
      </div>

      <GalleryGrid initialPhotos={photos} />
    </div>
  );
}
