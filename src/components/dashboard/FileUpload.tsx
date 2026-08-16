"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { StorageBucket, validateFile } from "@/lib/storage/supabase";

export interface FileUploadProps {
  bucket: StorageBucket;
  isDocument?: boolean;
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
  error?: string;
}

export function FileUpload({
  bucket,
  isDocument = false,
  value,
  onChange,
  label = "Upload File",
  hint,
  error,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const validation = validateFile(file, isDocument);
    if (!validation.valid) {
      setUploadError(validation.error || "Invalid file");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      // Create FormData to send to our Next.js API storage route (safe server-side upload)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);

      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to upload file");
      }

      setPreviewUrl(data.url);
      onChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-charcoal">{label}</label>
      )}

      {previewUrl ? (
        <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            {!isDocument ? (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="p-3 bg-brand-50 text-brand-700 rounded-lg shrink-0">
                <FileText className="w-6 h-6" />
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-charcoal truncate">File Uploaded</p>
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-brand-700 hover:underline truncate block"
              >
                View / Download
              </a>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-red-600 hover:bg-red-50 p-2 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-brand-500 bg-white hover:bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={isDocument ? ".pdf,.doc,.docx,.zip" : "image/jpeg,image/png,image/webp,image/gif"}
            className="hidden"
          />
          <div className="p-3 bg-brand-50 text-brand-700 rounded-full mb-2">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-charcoal">
            {isUploading ? "Uploading to storage..." : "Click to select or drop file"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {isDocument
              ? "PDF, DOCX, ZIP up to 25MB"
              : "PNG, JPG, WEBP up to 5MB"}
          </p>
        </div>
      )}

      {hint && !uploadError && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}

      {(uploadError || error) && (
        <p className="text-xs font-medium text-danger-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError || error}</span>
        </p>
      )}
    </div>
  );
}
