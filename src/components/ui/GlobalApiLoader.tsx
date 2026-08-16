"use client";

import React, { useEffect, useState } from "react";

export function GlobalApiLoader() {
  const [activeRequests, setActiveRequests] = useState(0);

  useEffect(() => {
    // Intercept native fetch to automatically detect any API hits
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      setActiveRequests((prev) => prev + 1);
      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        setActiveRequests((prev) => Math.max(0, prev - 1));
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  if (activeRequests === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none flex flex-col justify-between animate-fadeIn"
      aria-live="polite"
      aria-label="Loading content"
    >
      {/* Top indeterminate animated progress bar */}
      <div className="h-1 w-full bg-brand-100 overflow-hidden relative">
        <div className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-amber-500 w-1/3 animate-indeterminate" />
      </div>

      {/* Center floating status indicator */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-slate-900/85 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-dropdown flex items-center gap-3 border border-white/10 animate-scaleUp pointer-events-auto">
          <div className="w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin shrink-0" />
          <span className="text-xs font-semibold tracking-wide">
            Loading data...
          </span>
        </div>
      </div>

      <div className="h-1" />
    </div>
  );
}
