import React from "react";

export default function PublicPageLoading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-brand-100 border-t-brand-700 animate-spin" />
        <div className="absolute font-black text-brand-700 text-base">S</div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-semibold text-charcoal">Loading experience...</p>
        <p className="text-xs text-slate-400">Fetching latest events & media</p>
      </div>
    </div>
  );
}
