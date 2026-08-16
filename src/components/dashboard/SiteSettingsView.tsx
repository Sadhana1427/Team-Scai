"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Check, Settings, Save } from "lucide-react";

export function SiteSettingsView({ initialSettings }: { initialSettings: any }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    websiteName: initialSettings?.websiteName || "Team SCAI",
    orgName: initialSettings?.orgName || "Student Community for AI & Innovation",
    contactEmail: initialSettings?.contactEmail || "contact@teamscai.org",
    contactPhone: initialSettings?.contactPhone || "",
    instagramUrl: initialSettings?.instagramUrl || "",
    linkedinUrl: initialSettings?.linkedinUrl || "",
    githubUrl: initialSettings?.githubUrl || "",
    twitterUrl: initialSettings?.twitterUrl || "",
    youtubeUrl: initialSettings?.youtubeUrl || "",
    address: initialSettings?.address || "",
    aboutShort: initialSettings?.aboutShort || "",
    aboutFull: initialSettings?.aboutFull || "",
    footerText: initialSettings?.footerText || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed";
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-700" />
          <h2 className="text-xl font-bold text-charcoal">Global Site & Organization Settings</h2>
        </div>
        <p className="text-xs text-slate-500">
          Control organization branding, official contact email, social channels, and public footer text
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Site settings updated successfully across public website!</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-danger-50 border border-danger-100 text-danger-700 text-xs font-medium rounded-lg">
            {error}
          </div>
        )}

        {/* Brand Information */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Organization Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Website Display Name"
                required
                value={formData.websiteName}
                onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
              />
              <Input
                label="Full Organization Name"
                required
                value={formData.orgName}
                onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              />
            </div>

            <Textarea
              label="Short Mission / Bio (Homepage & Footer)"
              rows={2}
              value={formData.aboutShort}
              onChange={(e) => setFormData({ ...formData, aboutShort: e.target.value })}
            />

            <Textarea
              label="Full Description (About Page)"
              rows={4}
              value={formData.aboutFull}
              onChange={(e) => setFormData({ ...formData, aboutFull: e.target.value })}
            />
          </CardContent>
        </Card>

        {/* Official Contact & Directory */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Official Contact & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Contact Email"
                type="email"
                required
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
              <Input
                label="Helpline Phone / Number"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>

            <Input
              label="Campus Address / Headquarters"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </CardContent>
        </Card>

        {/* Social Profiles */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Social Media Profiles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Instagram URL"
                placeholder="https://instagram.com/..."
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              />
              <Input
                label="LinkedIn URL"
                placeholder="https://linkedin.com/company/..."
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="GitHub URL"
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
              <Input
                label="Twitter / X URL"
                placeholder="https://twitter.com/..."
                value={formData.twitterUrl}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
              />
              <Input
                label="YouTube URL"
                placeholder="https://youtube.com/@..."
                value={formData.youtubeUrl}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Legal & Footer */}
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-base">Footer Notice</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              label="Footer Copyright Text"
              value={formData.footerText}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="md" isLoading={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
