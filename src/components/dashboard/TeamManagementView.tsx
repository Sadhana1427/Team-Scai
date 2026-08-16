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
import { Plus, Edit2, Trash2, User, Check, X } from "lucide-react";

export interface TeamManagementProps {
  members: any[];
  categories: any[];
}

export function TeamManagementView({
  members: initialMembers,
  categories,
}: TeamManagementProps) {
  const router = useRouter();
  const [members, setMembers] = useState(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    photoUrl: "",
    designation: "",
    categoryId: categories[0]?.id || "",
    description: "",
    email: "",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    displayOrder: 0,
    isActive: true,
  });

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      name: "",
      photoUrl: "",
      designation: "",
      categoryId: categories[0]?.id || "",
      description: "",
      email: "",
      linkedinUrl: "",
      githubUrl: "",
      twitterUrl: "",
      displayOrder: 0,
      isActive: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: any) => {
    setEditingMember(m);
    setFormData({
      name: m.name,
      photoUrl: m.photoUrl || "",
      designation: m.designation,
      categoryId: m.categoryId,
      description: m.description || "",
      email: m.email || "",
      linkedinUrl: m.linkedinUrl || "",
      githubUrl: m.githubUrl || "",
      twitterUrl: m.twitterUrl || "",
      displayOrder: m.displayOrder,
      isActive: m.isActive,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      const endpoint = editingMember ? `/api/team/${editingMember.id}` : "/api/team";
      const method = editingMember ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save team member");
      }

      if (editingMember) {
        setMembers((prev) => prev.map((m) => (m.id === editingMember.id ? data.member : m)));
      } else {
        setMembers((prev) => [...prev, data.member]);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving team member";
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteMemberId) return;
    try {
      const res = await fetch(`/api/team/${deleteMemberId}`, { method: "DELETE" });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== deleteMemberId));
        setDeleteMemberId(null);
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
          <h2 className="text-xl font-bold text-charcoal">Organizing Team Directory</h2>
          <p className="text-xs text-slate-500">
            Manage committee members, leadership designations, and departments
          </p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Member Name</th>
                <th className="px-4 py-3.5">Designation</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No team members added yet.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                          {m.photoUrl ? (
                            <Image src={m.photoUrl} alt={m.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <User className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-charcoal">{m.name}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-brand-700">
                      {m.designation}
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {m.category?.name || "General"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {m.isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 text-slate-400 hover:text-charcoal hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteMemberId(m.id)}
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? "Edit Team Member" : "Add Team Member"}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-danger-50 border border-danger-100 text-danger-700 text-xs font-medium rounded-lg">
              {formError}
            </div>
          )}

          <Input
            label="Full Name"
            required
            placeholder="e.g. Maya Chen"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Designation"
              required
              placeholder="e.g. Lead Organizer"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />

            <Select
              label="Department / Category"
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </div>

          <Textarea
            label="Bio / Description (Optional)"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email"
              type="email"
              placeholder="name@teamscai.org"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <Input
              label="LinkedIn URL"
              placeholder="https://linkedin.com/in/..."
              value={formData.linkedinUrl}
              onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            />
          </div>

          <FileUpload
            bucket={STORAGE_BUCKETS.TEAM}
            value={formData.photoUrl}
            onChange={(url) => setFormData({ ...formData, photoUrl: url || "" })}
            label="Profile Picture / Avatar"
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActiveMember"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="isActiveMember" className="text-xs font-semibold text-charcoal">
              Active (Visible on public team page)
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
              Save Member
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteMemberId}
        onClose={() => setDeleteMemberId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Team Member"
        message="Are you sure you want to remove this member profile from the directory?"
        isDestructive
      />
    </div>
  );
}
