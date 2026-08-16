"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { STORAGE_BUCKETS } from "@/lib/storage/supabase";
import { Plus, Edit2, Trash2, Trophy, Star } from "lucide-react";

export interface WinnerManagementProps {
  winners: any[];
  events: any[];
}

export function WinnerManagementView({
  winners: initialWinners,
  events,
}: WinnerManagementProps) {
  const router = useRouter();
  const [winners, setWinners] = useState(initialWinners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWinner, setEditingWinner] = useState<any | null>(null);
  const [deleteWinnerId, setDeleteWinnerId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    eventId: events[0]?.id || "",
    name: "",
    position: "1st Place",
    photoUrl: "",
    description: "",
    isFeatured: false,
    displayOrder: 0,
  });

  const handleOpenCreate = () => {
    setEditingWinner(null);
    setFormData({
      eventId: events[0]?.id || "",
      name: "",
      position: "1st Place",
      photoUrl: "",
      description: "",
      isFeatured: false,
      displayOrder: 0,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w: any) => {
    setEditingWinner(w);
    setFormData({
      eventId: w.eventId,
      name: w.name,
      position: w.position,
      photoUrl: w.photoUrl || "",
      description: w.description || "",
      isFeatured: w.isFeatured,
      displayOrder: w.displayOrder,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      const endpoint = editingWinner ? `/api/winners/${editingWinner.id}` : "/api/winners";
      const method = editingWinner ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save winner");
      }

      if (editingWinner) {
        setWinners((prev) => prev.map((w) => (w.id === editingWinner.id ? data.winner : w)));
      } else {
        setWinners((prev) => [data.winner, ...prev]);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving winner";
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteWinnerId) return;
    try {
      const res = await fetch(`/api/winners/${deleteWinnerId}`, { method: "DELETE" });
      if (res.ok) {
        setWinners((prev) => prev.filter((w) => w.id !== deleteWinnerId));
        setDeleteWinnerId(null);
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
          <h2 className="text-xl font-bold text-charcoal">Winner & Podium Management</h2>
          <p className="text-xs text-slate-500">
            Publish event champions, runner-ups, and special recognition awards
          </p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Winner</span>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Winner / Team</th>
                <th className="px-4 py-3.5">Position</th>
                <th className="px-4 py-3.5">Associated Event</th>
                <th className="px-4 py-3.5">Featured</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {winners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No winners records added yet.
                  </td>
                </tr>
              ) : (
                winners.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                          {w.photoUrl ? (
                            <Image src={w.photoUrl} alt={w.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-600 bg-amber-50">
                              <Trophy className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-charcoal block">{w.name}</span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">
                            {w.description || "Podium finish"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide bg-amber-50 text-amber-900 border border-amber-200">
                        {w.position}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-600 font-semibold max-w-xs truncate">
                      {w.event?.title || "N/A"}
                    </td>

                    <td className="px-4 py-3">
                      {w.isFeatured ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Spotlight
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Normal</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(w)}
                          className="p-1.5 text-slate-400 hover:text-charcoal hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteWinnerId(w.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
        title={editingWinner ? "Edit Winner Record" : "Add Winner to Event"}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-danger-50 border border-danger-100 text-danger-700 text-xs font-medium rounded-lg">
              {formError}
            </div>
          )}

          <Select
            label="Event"
            required
            value={formData.eventId}
            onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
            options={events.map((e) => ({ value: e.id, label: e.title }))}
          />

          <Input
            label="Winner Name / Team Name"
            required
            placeholder="e.g. Team NullByte (Vikram Sen & Aditi Rao)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Podium Position"
            required
            placeholder="e.g. 1st Place (Champion), Runner Up, Special Mention"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          />

          <Textarea
            label="Project Description / Achievement Note"
            rows={2}
            placeholder="Solved all challenges with fastest time bonus..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <FileUpload
            bucket={STORAGE_BUCKETS.WINNERS}
            value={formData.photoUrl}
            onChange={(url) => setFormData({ ...formData, photoUrl: url || "" })}
            label="Winner Photo / Team Picture"
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeaturedWinner"
              checked={formData.isFeatured}
              onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="isFeaturedWinner" className="text-xs font-semibold text-charcoal">
              Feature on Homepage Hall of Fame
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
              Save Winner
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteWinnerId}
        onClose={() => setDeleteWinnerId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Winner"
        message="Are you sure you want to remove this winner record?"
        isDestructive
      />
    </div>
  );
}
