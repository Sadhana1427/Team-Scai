"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut, ShieldCheck, KeyRound, Check, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { UserSession } from "@/lib/permissions/rbac";

export interface TopbarProps {
  user: UserSession;
  onOpenSidebar: () => void;
}

export function Topbar({ user, onOpenSidebar }: TopbarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      setIsLoggingOut(false);
      window.location.href = "/login";
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsSavingPassword(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password.");
      }

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess(null);
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error changing password";
      setPasswordError(msg);
    } finally {
      setIsSavingPassword(false);
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
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Toggle & Welcome */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 text-slate-600 hover:text-charcoal hover:bg-slate-100 rounded-lg"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-sm sm:text-base font-bold text-charcoal flex items-center gap-2">
              <span>Welcome, {user.name}</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Team SCAI Management Workspace
            </p>
          </div>
        </div>

        {/* Right: ID, Role Badge, Change Password, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Account ID Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>{user.accountId}</span>
          </div>

          {/* Role Badge */}
          <Badge variant={getRoleVariant(user.role)} size="sm">
            {user.role.replace("_", " ")}
          </Badge>

          {/* Reset / Change Password Button (Available to ALL users) */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPasswordError(null);
              setPasswordSuccess(null);
              setIsPasswordModalOpen(true);
            }}
            className="h-8 px-2.5 sm:px-3 text-xs gap-1.5 text-slate-600 hover:text-brand-700 hover:border-brand-300 hover:bg-brand-50"
            title="Change Account Password"
          >
            <KeyRound className="w-3.5 h-3.5 text-brand-600" />
            <span className="hidden sm:inline">Reset Password</span>
          </Button>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            isLoading={isLoggingOut}
            className="h-8 px-2.5 sm:px-3 text-xs gap-1.5 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Change Password Modal for All Users */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Your Account Password"
        maxWidth="md"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 bg-danger-50 border border-danger-100 text-danger-700 text-xs font-medium rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-danger-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            Account: <strong>{user.name}</strong> ({user.accountId}) • {user.email}
          </div>

          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <Input
            label="New Password (min 6 characters)"
            type="password"
            required
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            label="Confirm New Password"
            type="password"
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isSavingPassword}>
              Update Password
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
