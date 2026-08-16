"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { STORAGE_BUCKETS } from "@/lib/storage/supabase";
import { Plus, Edit2, Trash2, Sliders } from "lucide-react";

export interface CarouselManagementProps {
  slides: any[];
}

export function CarouselManagementView({ slides: initialSlides }: CarouselManagementProps) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any | null>(null);
  const [deleteSlideId, setDeleteSlideId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    imageUrl: "",
    ctaText: "Explore Upcoming Events",
    ctaLink: "/events",
    isActive: true,
    displayOrder: 1,
  });

  const handleOpenCreate = () => {
    setEditingSlide(null);
    setFormData({
      heading: "",
      description: "",
      imageUrl: "",
      ctaText: "Explore Events",
      ctaLink: "/events",
      isActive: true,
      displayOrder: slides.length + 1,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: any) => {
    setEditingSlide(s);
    setFormData({
      heading: s.heading,
      description: s.description,
      imageUrl: s.imageUrl,
      ctaText: s.ctaText || "",
      ctaLink: s.ctaLink || "",
      isActive: s.isActive,
      displayOrder: s.displayOrder,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      setFormError("Please upload a hero banner image");
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const endpoint = editingSlide ? `/api/carousel/${editingSlide.id}` : "/api/carousel";
      const method = editingSlide ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save slide");
      }

      if (editingSlide) {
        setSlides((prev) => prev.map((s) => (s.id === editingSlide.id ? data.slide : s)));
      } else {
        setSlides((prev) => [...prev, data.slide]);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving slide";
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteSlideId) return;
    try {
      const res = await fetch(`/api/carousel/${deleteSlideId}`, { method: "DELETE" });
      if (res.ok) {
        setSlides((prev) => prev.filter((s) => s.id !== deleteSlideId));
        setDeleteSlideId(null);
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
          <h2 className="text-xl font-bold text-charcoal">Homepage Hero Carousel</h2>
          <p className="text-xs text-slate-500">
            Customize banner slides, headline typography, and action links
          </p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>New Slide</span>
        </Button>
      </div>

      {/* Grid of Slide Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slides.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
            No carousel slides configured. Click &quot;New Slide&quot; to create one.
          </div>
        ) : (
          slides.map((slide) => (
            <div
              key={slide.id}
              className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-subtle flex flex-col justify-between"
            >
              {/* Media Preview */}
              <div className="relative aspect-[16/9] w-full bg-slate-900">
                <Image
                  src={slide.imageUrl}
                  alt={slide.heading}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/60 p-5 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">
                    Order #{slide.displayOrder} • {slide.isActive ? "Active" : "Disabled"}
                  </span>
                  <h3 className="text-base font-bold text-white line-clamp-1">
                    {slide.heading}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-2 mt-0.5">
                    {slide.description}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 bg-slate-50 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-slate-500 truncate max-w-[200px]">
                  CTA: <strong>{slide.ctaText || "None"}</strong> ({slide.ctaLink || "—"})
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(slide)}
                    className="p-1.5 text-slate-500 hover:text-charcoal hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteSlideId(slide.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSlide ? "Edit Carousel Slide" : "Create Carousel Slide"}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-danger-50 border border-danger-100 text-danger-700 text-xs font-medium rounded-lg">
              {formError}
            </div>
          )}

          <Input
            label="Heading / Tagline"
            required
            placeholder="e.g. Innovate. Build. Accelerate."
            value={formData.heading}
            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
          />

          <Textarea
            label="Slide Description"
            required
            rows={3}
            placeholder="Supporting sentence explaining the focus..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="CTA Button Text"
              placeholder="e.g. View Hackathon"
              value={formData.ctaText}
              onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
            />

            <Input
              label="CTA Target Link"
              placeholder="e.g. /events/hackathon"
              value={formData.ctaLink}
              onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Display Order"
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
            />

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="isActiveSlide"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="isActiveSlide" className="text-xs font-semibold text-charcoal">
                Active in Carousel
              </label>
            </div>
          </div>

          <FileUpload
            bucket={STORAGE_BUCKETS.CAROUSEL}
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url || "" })}
            label="Slide Background Banner (16:9)"
          />

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
              Save Slide
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteSlideId}
        onClose={() => setDeleteSlideId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Carousel Slide"
        message="Are you sure you want to remove this slide from the homepage carousel?"
        isDestructive
      />
    </div>
  );
}
