"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GalleryPhoto, LightboxModal } from "./LightboxModal";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { Image as ImageIcon, ZoomIn } from "lucide-react";

export function GalleryGrid({ initialPhotos }: { initialPhotos: GalleryPhoto[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  // Extract unique years
  const years = Array.from(new Set(initialPhotos.map((p) => p.year))).sort((a, b) => b - a);

  // Filtered photos
  const filteredPhotos = initialPhotos.filter((photo) => {
    const matchCategory = selectedCategory === "ALL" || photo.category === selectedCategory;
    const matchYear = selectedYear === "ALL" || photo.year.toString() === selectedYear;
    return matchCategory && matchYear;
  });

  return (
    <div className="space-y-8">
      {/* Category & Year Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-subtle">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "EVENTS", "WINNERS", "TEAM"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedCategory === cat
                  ? "bg-brand-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Year Filter */}
        {years.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="h-8 px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-charcoal focus:ring-1 focus:ring-brand-500"
            >
              <option value="ALL">All Years</option>
              {years.map((yr) => (
                <option key={yr} value={yr.toString()}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grid */}
      {filteredPhotos.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No photos in this category"
          description="Try switching the category or year filter above."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-subtle hover:shadow-card-hover transition-all"
            >
              <Image
                src={photo.thumbnailUrl || photo.url}
                alt={photo.title || "Team SCAI photo"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Hover overlay with zoom icon and title */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                <div className="self-end p-1.5 rounded-full bg-white/30 text-white backdrop-blur-sm">
                  <ZoomIn className="w-4 h-4" />
                </div>
                <div>
                  <Badge variant="brand" size="sm" className="mb-1">
                    {photo.category}
                  </Badge>
                  <p className="text-white text-xs font-semibold line-clamp-1">
                    {photo.title || (photo.event ? photo.event.title : `Photo ${photo.year}`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        photo={activePhoto}
        photos={filteredPhotos}
        onClose={() => setActivePhoto(null)}
        onSelectPhoto={(p) => setActivePhoto(p)}
      />
    </div>
  );
}
