"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";

export function EventShareButtons({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out ${title} on Team SCAI!`,
          url,
        });
      } catch {
        // Ignored share cancellation
      }
    } else {
      handleCopy();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Check out ${title}: ${url}`
  )}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="text-xs gap-1.5"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Copied Link</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy Link</span>
          </>
        )}
      </Button>

      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1.5 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>WhatsApp</span>
        </Button>
      </a>

      {typeof navigator !== "undefined" && "share" in navigator && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="text-xs gap-1.5"
        >
          <Share2 className="w-3.5 h-3.5 text-brand-600" />
          <span>Share</span>
        </Button>
      )}
    </div>
  );
}
