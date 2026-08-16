"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { STORAGE_BUCKETS } from "@/lib/storage/supabase";
import { Upload, Trash2, Plus, Star, Check } from "lucide-react";
import { UserSession } from "@/lib/permissions/rbac";

export interface GalleryManagementProps {
  photos: any[];
  events: any[];
  currentUser: UserSession;
}

export function GalleryManagementView({
  photos: initialPhotos,
  events,
  currentUser,
}: GalleryManagementProps) {
  const router = useRouter();
  const [photos, setPhotos] = useState(initialPhotos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    thumbnailUrl: "",
    eventId: "",
    category: "EVENTS",
    year: new Date().getFullYear(),
    isFeatured: false,
  });

  const handleOpenUpload = () => {
    setFormData({
      title: "",
      url: "",
      thumbnailUrl: "",
      eventId: events[0]?.id || "",
      category: "EVENTS",
      year: new Date().getFullYear(),
      isFeatured: false,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.url) {
      setFormError("Please upload an image first");
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          eventId: formData.eventId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to add photo");
      }

      setPhotos((prev) => [data.photo, ...prev]);
      setIsModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading";
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletePhotoId) return;
    try {
      const res = await fetch(`/api/gallery/${deletePhotoId}`, { method: "DELETE" });
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== deletePhotoId));
        setDeletePhotoId(null);
        router.refresh();
      }
    } catch {
      // Error
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Gallery Media Library</h2>
          <p className="text-xs text-slate-500">
            Upload event photos, tag categories, and curate featured highlights
          </p>
        </div>
        <Button onClick={handleOpenUpload} size="sm" className="gap-2">
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {photos.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
            No gallery images uploaded yet. Click &quot;Upload Image&quot; to begin.
          </div>
        ) : (
          photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-subtle hover:shadow-card transition-all"
            >
              <Image
                src={photo.thumbnailUrl || photo.url}
                alt={photo.title || "Gallery image"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover"
              />

              {/* Overlay controls */}
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 uppercase">
                    {photo.category}
                  </span>
                  {photo.isFeatured && (
                    <span className="p-1 rounded bg-amber-500 text-white" title="Featured">
                      <Star className="w-3 h-3 fill-current" />
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold truncate">
                    {photo.title || (photo.event ? photo.event.title : `Photo (${photo.year})`)}
                  </p>
                  <div className="flex items-center justify-between pt-1 border-t border-white/20">
                    <span className="text-[10px] text-slate-300">{photo.year}</span>
                    <button
                      onClick={() => setDeletePhotoId(photo.id)}
                      className="p-1 text-red-300 hover:text-red-100 transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload Image to Gallery"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-danger-50 border border-danger-100 text-danger-700 text-xs font-medium rounded-lg">
              {formError}
            </div>
          )}

          <FileUpload
            bucket={STORAGE_BUCKETS.IMAGES}
            value={formData.url}
            onChange={(url) => setFormData({ ...formData, url: url || "" })}
            label="Select Photo"
            hint="PNG, JPG, WEBP up to 5MB"
          />

          <Input
            label="Caption / Title"
            placeholder="e.g. HackSummit 2026 Keynote"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: "EVENTS", label: "Events" },
                { value: "WINNERS", label: "Winners" },
                { value: "TEAM", label: "Team" },
              ]}
            />

            <Input
              label="Year"
              type="number"
              required
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
            />
          </div>

          <Select
            label="Associated Event (Optional)"
            placeholder="None / General"
            value={formData.eventId}
            onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
            options={events.map((e) => ({ value: e.id, label: e.title }))}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="isFeatured" className="text-xs font-semibold text-charcoal">
              Feature on Homepage & Spotlight
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSaving}>
              Save to Gallery
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deletePhotoId}
        onClose={() => setDeletePhotoId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Photo"
        message="Are you sure you want to remove this photo from the gallery?"
        isDestructive
      />
    </div>
  );
}
