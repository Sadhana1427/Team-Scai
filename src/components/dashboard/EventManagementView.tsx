"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { STORAGE_BUCKETS } from "@/lib/storage/supabase";
import { formatDate } from "@/lib/utils";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Calendar,
  MapPin,
  Clock,
  Eye,
  Check,
} from "lucide-react";
import { UserSession } from "@/lib/permissions/rbac";

export interface EventManagementProps {
  events: any[];
  categories: any[];
  tags: any[];
  coordinators: any[];
  currentUser: UserSession;
}

export function EventManagementView({
  events: initialEvents,
  categories,
  tags,
  coordinators,
  currentUser,
}: EventManagementProps) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    posterUrl: "",
    categoryId: categories[0]?.id || "",
    tagIds: [] as string[],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    startTime: "10:00 AM",
    endTime: "05:00 PM",
    venue: "",
    registrationUrl: "",
    registrationDeadline: "",
    status: "UPCOMING",
    isFeatured: false,
    isVisible: true,
    eventLeaderId: currentUser.id,
  });

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      posterUrl: "",
      categoryId: categories[0]?.id || "",
      tagIds: [],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      startTime: "10:00 AM",
      endTime: "05:00 PM",
      venue: "",
      registrationUrl: "",
      registrationDeadline: "",
      status: "UPCOMING",
      isFeatured: false,
      isVisible: true,
      eventLeaderId: currentUser.id,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: any) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title,
      slug: evt.slug,
      shortDescription: evt.shortDescription,
      fullDescription: evt.fullDescription,
      posterUrl: evt.posterUrl || "",
      categoryId: evt.categoryId,
      tagIds: evt.tags ? evt.tags.map((t: any) => t.id) : [],
      startDate: new Date(evt.startDate).toISOString().split("T")[0],
      endDate: new Date(evt.endDate).toISOString().split("T")[0],
      startTime: evt.startTime,
      endTime: evt.endTime,
      venue: evt.venue,
      registrationUrl: evt.registrationUrl || "",
      registrationDeadline: evt.registrationDeadline
        ? new Date(evt.registrationDeadline).toISOString().split("T")[0]
        : "",
      status: evt.status,
      isFeatured: evt.isFeatured,
      isVisible: evt.isVisible,
      eventLeaderId: evt.eventLeaderId || currentUser.id,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !editingEvent ? generateSlug(val) : prev.slug,
    }));
  };

  const handleStatusChange = async (eventId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, status: newStatus } : e))
        );
        router.refresh();
      }
    } catch {
      // Error handling
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      const endpoint = editingEvent ? `/api/events/${editingEvent.id}` : "/api/events";
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save event");
      }

      setIsModalOpen(false);
      router.refresh();
      // Update local state
      if (editingEvent) {
        setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? data.event : e)));
      } else {
        setEvents((prev) => [data.event, ...prev]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving event";
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteEventId) return;
    try {
      const res = await fetch(`/api/events/${deleteEventId}`, { method: "DELETE" });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== deleteEventId));
        setDeleteEventId(null);
        router.refresh();
      }
    } catch {
      // Error
    }
  };

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      search === "" ||
      evt.title.toLowerCase().includes(search.toLowerCase()) ||
      evt.venue.toLowerCase().includes(search.toLowerCase());

    const matchesCat = filterCategory === "ALL" || evt.categoryId === filterCategory;
    const matchesStatus = filterStatus === "ALL" || evt.status === filterStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal">Event Management</h2>
          <p className="text-xs text-slate-500">
            Create, update schedules, assign leaders, and manage statuses
          </p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>New Event</span>
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-300 text-xs text-charcoal focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-charcoal"
          >
            <option value="ALL">All Statuses</option>
            <option value="ONGOING">Ongoing</option>
            <option value="UPCOMING">Upcoming</option>
            <option value="PAST">Past</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-9 px-2.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-charcoal"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Table (Responsive) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Event Title</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Dates & Venue</th>
                <th className="px-4 py-3.5">Status (Instant)</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No events found.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <div className="font-bold text-charcoal line-clamp-1">{evt.title}</div>
                      <span className="text-[11px] text-slate-400 font-mono">/events/{evt.slug}</span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {evt.category?.name || "General"}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      <div>{formatDate(evt.startDate)}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {evt.venue}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={evt.status}
                        onChange={(e) => handleStatusChange(evt.id, e.target.value)}
                        className={`h-7 px-2 text-[11px] font-bold rounded-lg border focus:ring-1 ${
                          evt.status === "ONGOING"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : evt.status === "UPCOMING"
                            ? "bg-brand-50 text-brand-800 border-brand-300"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <option value="UPCOMING">Upcoming</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="PAST">Past</option>
                      </select>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/events/${evt.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-brand-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View public page"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleOpenEdit(evt)}
                          className="p-1.5 text-slate-400 hover:text-charcoal hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {currentUser.role === "SUPER_ADMIN" && (
                          <button
                            onClick={() => setDeleteEventId(evt.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Edit Event Information" : "Create New Event"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-danger-50 border border-danger-100 text-danger-700 text-xs font-medium rounded-lg">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Event Title"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. SCAI HackSummit 2026"
            />

            <Input
              label="Slug (URL Path)"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. scai-hacksummit-2026"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />

            <Select
              label="Initial Status"
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: "UPCOMING", label: "Upcoming" },
                { value: "ONGOING", label: "Ongoing" },
                { value: "PAST", label: "Past" },
              ]}
            />
          </div>

          <Textarea
            label="Short Description (Listing preview)"
            required
            rows={2}
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="A punchy 1-2 sentence overview for cards and meta descriptions..."
          />

          <Textarea
            label="Full Description (Editorial page)"
            required
            rows={6}
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            placeholder="Comprehensive description, rules, track details, speaker bio..."
          />

          {/* Dates & Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Start Time"
              required
              placeholder="e.g. 10:00 AM"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
            <Input
              label="End Time"
              required
              placeholder="e.g. 05:00 PM"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            />
            <Input
              label="Venue / Room"
              required
              placeholder="e.g. Main Auditorium"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            />
          </div>

          {/* Registration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Registration URL (External Link)"
              placeholder="https://forms.gle/..."
              value={formData.registrationUrl}
              onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
            />
            <Input
              label="Registration Deadline (Optional)"
              type="date"
              value={formData.registrationDeadline}
              onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
            />
          </div>

          {/* File Upload for Poster */}
          <FileUpload
            bucket={STORAGE_BUCKETS.POSTERS}
            value={formData.posterUrl}
            onChange={(url) => setFormData({ ...formData, posterUrl: url || "" })}
            label="Event Banner / Poster"
            hint="Recommended: 16:9 ratio high-resolution image"
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
              {editingEvent ? "Save Changes" : "Create Event"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteEventId}
        onClose={() => setDeleteEventId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        message="Are you sure you want to permanently delete this event? This action will remove all associated documents and gallery links."
        isDestructive
      />
    </div>
  );
}
