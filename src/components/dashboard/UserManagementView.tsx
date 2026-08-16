"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { UserPlus, Edit2, Shield, KeyRound, Check, X, ShieldAlert } from "lucide-react";

export interface UserManagementProps {
  users: any[];
}

export function UserManagementView({ users: initialUsers }: UserManagementProps) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "MANAGEMENT",
    isActive: true,
  });

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "MANAGEMENT",
      isActive: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: any) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      password: "", // blank unless resetting
      role: u.role,
      isActive: u.isActive,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      const endpoint = editingUser ? `/api/users/${editingUser.id}` : "/api/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save user account");
      }

      if (editingUser) {
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? data.user : u)));
      } else {
        setUsers((prev) => [data.user, ...prev]);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving user";
      setFormError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (user: any) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isActive: !user.isActive } : u))
        );
        router.refresh();
      }
    } catch {
      // Error
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "brand";
      case "EVENT_LEADER":
        return "accent";
      case "MANAGEMENT":
        return "neutral";
      case "SOCIAL_MEDIA":
        return "warning";
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-charcoal">User Account Management</h2>
          <p className="text-xs text-slate-500">
            Create team credentials, assign permissions, and generate human-readable account IDs
          </p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-2">
          <UserPlus className="w-4 h-4" />
          <span>New Account</span>
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Account ID</th>
                <th className="px-4 py-3.5">User Name & Email</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Created</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-brand-800 px-2 py-1 bg-brand-50 rounded border border-brand-200">
                      {u.accountId}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-bold text-charcoal">{u.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                  </td>

                  <td className="px-4 py-3">
                    <Badge variant={getRoleVariant(u.role)} size="sm">
                      {u.role.replace("_", " ")}
                    </Badge>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                        u.isActive
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {u.isActive ? "Active (Enabled)" : "Disabled"}
                    </button>
                  </td>

                  <td className="px-4 py-3 text-slate-400 text-[11px]">
                    {formatDate(u.createdAt)}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleOpenEdit(u)}
                      className="p-1.5 text-slate-400 hover:text-charcoal hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Account / Reset Password"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? `Edit Account (${editingUser.accountId})` : "Create Management Account"}
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
            placeholder="e.g. Aanya Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Official Email"
            type="email"
            required
            placeholder="name@teamscai.org"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <Input
            label={editingUser ? "Reset Password (Leave blank to keep unchanged)" : "Account Password"}
            type="password"
            required={!editingUser}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <Select
            label="Role & Permissions"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            options={[
              { value: "SUPER_ADMIN", label: "SUPER_ADMIN (Full system access & logs)" },
              { value: "EVENT_LEADER", label: "EVENT_LEADER (Assigned events & winners)" },
              { value: "MANAGEMENT", label: "MANAGEMENT (Event schedules & venues)" },
              { value: "SOCIAL_MEDIA", label: "SOCIAL_MEDIA (Photo gallery & bulk uploads)" },
            ]}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActiveUser"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="isActiveUser" className="text-xs font-semibold text-charcoal">
              Account Enabled (Can log in to portal)
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
              {editingUser ? "Update Account" : "Create Account"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
