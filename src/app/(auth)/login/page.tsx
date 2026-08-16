"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, Info, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotAccountId, setForgotAccountId] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);
    setIsForgotLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          accountId: forgotAccountId,
          newPassword: forgotNewPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setForgotSuccess(data.message || "Password reset successful! You can now log in.");
      setTimeout(() => {
        setIsForgotModalOpen(false);
        setForgotSuccess(null);
        setForgotEmail("");
        setForgotAccountId("");
        setForgotNewPassword("");
      }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error resetting password";
      setForgotError(msg);
    } finally {
      setIsForgotLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed. Check your credentials.");
      }

      // Successful login - hard navigation to load fresh session
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top back button */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Portal</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-700 text-white font-black text-2xl shadow-sm mb-2">
            S
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Team & Management Login
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Sign in with your organization-issued team credentials
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-white border-slate-200 shadow-card">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3.5 bg-danger-50 border border-danger-100 rounded-xl flex items-start gap-2.5 text-danger-700 text-xs font-medium rounded-lg animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Official Email"
                type="email"
                required
                placeholder="admin@teamscai.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                size="lg"
                isLoading={loading}
                className="w-full justify-center text-sm font-bold bg-brand-700 hover:bg-brand-800 shadow-sm"
              >
                Sign In to Team Portal
              </Button>
            </form>

            {/* Forgot / Reset Password Action */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  setForgotError(null);
                  setForgotSuccess(null);
                  setIsForgotModalOpen(true);
                }}
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 hover:underline"
              >
                Forgot / Reset Password?
              </button>
            </div>

            {/* No Public Signup Notice */}
            <div className="pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
              <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>
                <strong>No Public Signup:</strong> Accounts are created and assigned by the Super Admin. If you need team credentials, contact your faculty/lead organizer.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forgot / Reset Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Your Account Password"
        maxWidth="md"
      >
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            Enter your official email and assigned Account ID (e.g. <code>LEAD-001</code>, <code>MGMT-001</code>, or <code>EVT-0001</code>) to verify and set a new password.
          </p>

          {forgotSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{forgotSuccess}</span>
            </div>
          )}

          {forgotError && (
            <div className="p-3 bg-danger-50 border border-danger-100 text-danger-700 text-xs font-medium rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-danger-600 shrink-0" />
              <span>{forgotError}</span>
            </div>
          )}

          <Input
            label="Official Email"
            type="email"
            required
            placeholder="e.g. leader-bhumika@teamscai.com"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />

          <Input
            label="Account ID"
            required
            placeholder="e.g. LEAD-001, MGMT-001, EVT-0001"
            value={forgotAccountId}
            onChange={(e) => setForgotAccountId(e.target.value)}
          />

          <Input
            label="New Password"
            type="password"
            required
            placeholder="••••••••"
            value={forgotNewPassword}
            onChange={(e) => setForgotNewPassword(e.target.value)}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsForgotModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" isLoading={isForgotLoading}>
              Reset Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
